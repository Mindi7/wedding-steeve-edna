"use client";

import Image from "next/image";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import type { GuestV2 } from "@/lib/guests-v2";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string;
// URL du Google Apps Script (voir /docs/suivi-rsvp.md pour la mise en place)
const SHEET_WEBHOOK_URL = process.env.NEXT_PUBLIC_SHEET_WEBHOOK_URL as string | undefined;

const CHURCH_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("Rue de la Cotonnière, 97351 La Persévérance");

const VENUE_MAPS_URL =
  "https://www.google.com/maps/search/97355/@4.910319805145264,-52.458709716796875,17z?hl=fr";

// Date limite réelle pour répondre au RSVP (les menus doivent être figés pour le traiteur)
const RSVP_DEADLINE = new Date("2026-08-16T15:00:00");

const ENTREE_OPTIONS = [
  "Salade thaï accompagnée de crevettes tempura",
  "Salade thaï accompagnée de brochettes de poulet",
];
const PLAT_OPTIONS = ["Gratin de banane jaune dachine", "Riz djon-djon"];
const ACCOMPAGNEMENT_OPTIONS = ["Acoupa", "Fricassée de porc"];

type Status = "idle" | "sending" | "sent" | "error";
type PersonMenu = { name: string; entree: string; plat: string; accompagnement: string };
function emptyMenu(name = ""): PersonMenu {
  return { name, entree: "", plat: "", accompagnement: "" };
}
function isMenuComplete(m: PersonMenu): boolean {
  return Boolean(m.entree && m.plat && m.accompagnement);
}

function Countdown() {
  const [t, setT] = useState({ d: "--", h: "--", m: "--", s: "--" });
  useEffect(() => {
    const tick = () => {
      const diff = new Date("2026-08-29T10:30:00").getTime() - Date.now();
      if (diff < 0) return;
      setT({
        d: String(Math.floor(diff / 86400000)).padStart(2, "0"),
        h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0"),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {[t.d, t.h, t.m, t.s].map((v, i) => (
        <span key={i} className="flex items-center">
          <span className={`font-serif font-light text-3xl sm:text-4xl ${i === 3 ? "text-terra" : "text-ivory"}`}>
            {v}
          </span>
          {i < 3 && <span className="font-serif text-ivory/50 mx-1 text-2xl">:</span>}
        </span>
      ))}
    </div>
  );
}

function PersonMenuForm({
  person,
  onChange,
  title,
}: {
  person: PersonMenu;
  onChange: (p: PersonMenu) => void;
  title: string;
}) {
  return (
    <div className="border border-blush bg-ivory p-5 text-left">
      <p className="font-sans text-[0.6rem] tracking-[.2em] uppercase text-rose-dk mb-3">{title}</p>
      <div className="grid gap-3">
        {[
          { label: "Entrée", opts: ENTREE_OPTIONS, key: "entree" as const },
          { label: "Plat de résistance", opts: PLAT_OPTIONS, key: "plat" as const },
          { label: "Accompagnement", opts: ACCOMPAGNEMENT_OPTIONS, key: "accompagnement" as const },
        ].map(({ label, opts, key }) => (
          <div key={key}>
            <p className="font-sans text-[0.55rem] tracking-[.15em] uppercase text-taupe mb-1.5">{label}</p>
            {opts.map((opt) => (
              <label key={opt} className="flex items-start gap-2 font-serif text-sm text-choco mb-1 cursor-pointer">
                <input
                  type="radio"
                  name={`${key}-${title}`}
                  checked={person[key] === opt}
                  onChange={() => onChange({ ...person, [key]: opt })}
                  className="mt-1 accent-rose"
                />
                {opt}
              </label>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const TIMELINE = [
  { time: "10:30", title: "Cérémonie religieuse", icon: "/canva/icon-church.png" },
  { time: "12:00", title: "Séance photo", icon: "/canva/icon-camera.png" },
  { time: "18:30", title: "Dîner de réception", icon: "/canva/icon-plate.png" },
  { time: "22:00", title: "Soirée dansante", icon: "/canva/icon-speaker.png" },
];

const RevealContext = createContext(false);

function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <RevealContext.Provider value={visible}>{children}</RevealContext.Provider>
    </div>
  );
}

// Anime un élément individuel avec un délai — plusieurs Stagger dans une même
// section apparaissent donc l'un après l'autre, comme un diaporama Canva.
function Stagger({ delay = 0, children }: { delay?: number; children: React.ReactNode }) {
  const visible = useContext(RevealContext);
  return (
    <div
      className="transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(22px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function MariageClient({ guest }: { guest: GuestV2 }) {
  const [displayName, setDisplayName] = useState(guest.name);
  const [choice, setChoice] = useState<"yes" | "no" | null>(null);
  const [companionCount, setCompanionCount] = useState(guest.companions.length);
  const [companionNames, setCompanionNames] = useState<string[]>(guest.companions);
  const [ownMenu, setOwnMenu] = useState<PersonMenu>(emptyMenu());
  const [companionMenus, setCompanionMenus] = useState<PersonMenu[]>(
    guest.companions.map((n) => emptyMenu(n))
  );
  const [status, setStatus] = useState<Status>("idle");

  // Tant que "Oui" est choisi, il faut que le menu de l'invité ET de chaque accompagnant
  // soit entièrement rempli (entrée + plat + accompagnement) avant de pouvoir confirmer.
  const menusComplete =
    choice === "no" ||
    (choice === "yes" &&
      isMenuComplete(ownMenu) &&
      companionMenus.slice(0, companionCount).every(isMenuComplete));

  function updateCompanionCount(n: number) {
    setCompanionCount(n);
    setCompanionNames((prev) => {
      const next = [...prev];
      next.length = n;
      return next.fill("", prev.length).map((v, i) => prev[i] ?? "");
    });
    setCompanionMenus((prev) => {
      const next = [...prev];
      next.length = n;
      return next.fill(emptyMenu(), prev.length).map((v, i) => prev[i] ?? emptyMenu());
    });
  }

  async function handleSubmit() {
    if (!choice || !menusComplete || status === "sending") return;
    setStatus("sending");
    const name = displayName.trim() || guest.name;

    let reponse: string;

    if (choice === "no") {
      reponse = "Avec regret, non";
    } else {
      const menuBlock = (m: PersonMenu, label: string) =>
        `${label} :\n` +
        `   • Entrée : ${m.entree || "(non choisi)"}\n` +
        `   • Plat : ${m.plat || "(non choisi)"}\n` +
        `   • Accompagnement : ${m.accompagnement || "(non choisi)"}`;

      const lines: string[] = ["Oui, avec joie", ""];

      if (companionCount > 0) {
        const names = companionNames.map((n) => n.trim()).filter(Boolean);
        lines.push(
          companionCount === 1
            ? `Accompagné(e) de 1 personne : ${names[0] || "(nom non renseigné)"}`
            : `Accompagné(e) de ${companionCount} personnes : ${names.length ? names.join(", ") : "(noms non renseignés)"}`
        );
        lines.push("");
      }

      lines.push("— MENUS —", "");
      lines.push(menuBlock(ownMenu, name));

      companionMenus.forEach((m, i) => {
        const companionName = companionNames[i]?.trim() || `Accompagnant ${i + 1}`;
        lines.push("");
        lines.push(menuBlock(m, companionName));
      });

      reponse = lines.join("\n");
    }

    // Envoie une ligne par personne (invité + chaque accompagnant) vers le Google Sheet de suivi.
    // Ne bloque jamais l'envoi de l'email si le Sheet n'est pas configuré ou indisponible.
    if (SHEET_WEBHOOK_URL) {
      try {
        const rows =
          choice === "no"
            ? [{ nom: name, role: "Invité", reponse: "Non", entree: "", plat: "", accompagnement: "" }]
            : [
                {
                  nom: name,
                  role: "Invité",
                  reponse: "Oui",
                  entree: ownMenu.entree,
                  plat: ownMenu.plat,
                  accompagnement: ownMenu.accompagnement,
                },
                ...companionMenus.map((m, i) => ({
                  nom: companionNames[i]?.trim() || `Accompagnant ${i + 1}`,
                  role: `Accompagnant de ${name}`,
                  reponse: "Oui",
                  entree: m.entree,
                  plat: m.plat,
                  accompagnement: m.accompagnement,
                })),
              ];
        await fetch(SHEET_WEBHOOK_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({ rows }),
        });
      } catch (err) {
        console.error("Erreur envoi Google Sheet:", err);
      }
    }

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, { from_name: name, reponse }, { publicKey: PUBLIC_KEY });
      setStatus("sent");
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  }

  return (
    <main className="bg-ivory">
      {/* HERO — image Canva d'origine (bouton stylé) + zone cliquable + nom de l'église à côté */}
      <Reveal>
      <section className="relative w-full max-w-sm mx-auto bg-ivory aspect-[386/813]">
        <Image src="/canva/hero-v3.png" alt="Steeve et Edna" fill className="object-contain" priority />
        <a
          href={CHURCH_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Google Maps — Église ICC"
          className="absolute left-[12%] w-[52%] h-[4.7%]"
          style={{ top: "80.3%" }}
        />
        <div className="absolute" style={{ top: "75.5%", left: "12%" }}>
          <Stagger delay={200}>
            <span className="block bg-ivory/90 px-2 py-1 font-sans text-[0.65rem] tracking-[.1em] uppercase text-terra font-semibold shadow-sm">
              Église ICC
            </span>
          </Stagger>
        </div>
      </section>
      </Reveal>

      {/* MUSIQUE — vidéo uniquement, sans le label "Notre chanson" */}
      <Reveal>
      <section className="w-full max-w-sm mx-auto bg-ivory px-6 py-10 text-center">
        <Stagger delay={0}>
          <div className="aspect-video overflow-hidden shadow-lg">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/t7owFiihXgg?autoplay=1&playsinline=1"
              title="You Know My Name - Tasha Cobbs Leonard"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Stagger>
        <Stagger delay={250}>
          <p className="font-serif italic text-taupe text-sm mt-4">You Know My Name</p>
        </Stagger>
        <Stagger delay={400}>
          <p className="font-sans text-[0.6rem] tracking-[.15em] uppercase text-taupe/70 mt-1">Tasha Cobbs Leonard ft. Jimi Cravity</p>
        </Stagger>
      </section>
      </Reveal>

      {/* COMPTE À REBOURS — même largeur de carte que les autres sections */}
      <Reveal>
      <section className="relative w-full max-w-sm mx-auto min-h-[85vh] overflow-hidden">
        <Image src="/canva/countdown-bg.jpg" alt="" fill sizes="384px" className="object-cover object-[center_30%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/70" />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-6 py-16 text-center">
          <Stagger delay={0}>
            <p className="font-script text-4xl text-ivory leading-none">le</p>
          </Stagger>
          <Stagger delay={200}>
            <h2 className="font-serif text-xl tracking-[.25em] uppercase text-ivory mt-4">Compte à rebours</h2>
          </Stagger>
          <Stagger delay={400}>
            <p className="font-serif italic text-champagne text-sm mt-2 mb-10">jusqu&apos;au jour J a commencé…</p>
          </Stagger>
          <Stagger delay={600}>
            <Countdown />
          </Stagger>
          <Stagger delay={800}>
            <div className="flex justify-center gap-10 mt-3 font-sans text-[0.6rem] tracking-[.25em] uppercase text-champagne">
              <span>Jours</span>
              <span>Heures</span>
              <span>Min</span>
              <span>Sec</span>
            </div>
          </Stagger>
        </div>
      </section>
      </Reveal>

      {/* LIEU DE RÉCEPTION — image Canva exacte + bouton Google Maps cliquable */}
      <Reveal>
      <section className="relative w-full max-w-sm mx-auto bg-ivory">
        <Image src="/canva/venue.png" alt="Le lieu de réception" width={386} height={857} className="w-full h-auto" />
        <a
          href={VENUE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Google Maps"
          className="absolute left-1/2 -translate-x-1/2 w-[45%] h-[4%]"
          style={{ top: "29%" }}
        />
      </section>
      </Reveal>

      {/* LA JOURNÉE — titre + icônes du Canva, horaires réels et corrects */}
      <Reveal>
      <section className="w-full max-w-sm mx-auto bg-ivory px-6 py-16">
        <Stagger delay={0}>
          <div className="max-w-[200px] mx-auto mb-10">
            <Image src="/canva/journee-title.png" alt="La journée" width={372} height={185} className="w-full h-auto" />
          </div>
        </Stagger>
        <div className="max-w-[260px] mx-auto flex flex-col gap-8 border-l border-blush pl-6">
          {TIMELINE.map((step, i) => (
            <Stagger key={i} delay={250 + i * 180}>
              <div className="flex items-center gap-4">
                <Image src={step.icon} alt="" width={40} height={40} className="w-9 h-9 shrink-0 -ml-[3.1rem]" />
                <div>
                  <p className="font-serif text-lg text-terra">{step.time}</p>
                  <p className="font-sans text-sm tracking-wide uppercase text-choco">{step.title}</p>
                </div>
              </div>
            </Stagger>
          ))}
        </div>
      </section>
      </Reveal>

      {/* DÉTAILS / DRESS CODE — image Canva exacte */}
      <Reveal>
      <section className="w-full max-w-sm mx-auto bg-ivory">
        <Image src="/canva/details.png" alt="Détails et dress code" width={386} height={835} className="w-full h-auto" />
      </section>
      </Reveal>

      {/* RSVP — en-tête Canva exact, puis vrai formulaire fonctionnel */}
      <Reveal>
      <section className="bg-ivory">
        <div className="w-full max-w-sm mx-auto">
          <Image src="/canva/rsvp-header.png" alt="Votre réponse" width={386} height={741} className="w-full h-auto" />
        </div>

        <div className="max-w-sm mx-auto bg-ivory border border-blush px-6 py-10 text-center -mt-2">
          {new Date() > RSVP_DEADLINE ? (
            <p className="font-serif italic text-taupe text-lg py-6">
              Les réponses sont maintenant closes.
              <br />
              Merci à toutes celles et ceux qui ont déjà répondu — à très bientôt pour le grand jour ✿
            </p>
          ) : status !== "sent" && (
            <>
              <label className="block text-left mb-6">
                <span className="font-sans text-[0.6rem] tracking-[.25em] uppercase text-rose mb-2 block">Votre prénom</span>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full border border-blush bg-transparent px-4 py-3 font-serif text-choco text-lg focus:outline-none focus:border-rose"
                />
              </label>

              <p className="font-sans text-[0.62rem] tracking-[.3em] uppercase text-rose mb-4">Serez-vous des nôtres ?</p>
              <div className="flex gap-2 sm:gap-3 justify-center mb-2">
                <button
                  onClick={() => setChoice("yes")}
                  disabled={status === "sending"}
                  className={`flex-1 min-w-0 max-w-[170px] font-sans text-xs sm:text-sm tracking-wide py-4 px-2 sm:px-3 border transition-all disabled:opacity-50 ${
                    choice === "yes" ? "bg-rose text-ivory border-rose" : "border-rose text-rose-dk hover:bg-rose hover:text-ivory"
                  }`}
                >
                  Oui, avec joie
                </button>
                <button
                  onClick={() => setChoice("no")}
                  disabled={status === "sending"}
                  className={`flex-1 min-w-0 max-w-[170px] font-sans text-xs sm:text-sm tracking-wide py-4 px-2 sm:px-3 border transition-all disabled:opacity-50 ${
                    choice === "no" ? "bg-taupe text-ivory border-taupe" : "border-taupe text-taupe hover:bg-taupe hover:text-ivory"
                  }`}
                >
                  Avec regret, non
                </button>
              </div>

              {choice === "yes" && (
                <div className="mt-8 flex flex-col gap-5">
                  <PersonMenuForm person={ownMenu} onChange={setOwnMenu} title={`Votre menu (${displayName || guest.name})`} />

                  {guest.maxCompanions > 0 && (
                    <div className="text-left border-t border-blush pt-6">
                      <span className="font-sans text-[0.6rem] tracking-[.25em] uppercase text-rose mb-3 block">
                        Accompagné(e) ? (max {guest.maxCompanions})
                      </span>
                      <div className="flex gap-2 mb-5">
                        {Array.from({ length: guest.maxCompanions + 1 }, (_, n) => n).map((n) => (
                          <button
                            key={n}
                            onClick={() => updateCompanionCount(n)}
                            className={`w-10 h-10 font-sans text-sm border transition-all ${
                              companionCount === n ? "bg-rose text-ivory border-rose" : "border-blush text-choco hover:border-rose"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                      {Array.from({ length: companionCount }, (_, i) => i).map((i) => (
                        <div key={i} className="flex flex-col gap-3 mb-5">
                          <label className="block">
                            <span className="font-sans text-[0.55rem] tracking-[.15em] uppercase text-taupe mb-1.5 block">
                              Nom de l&apos;accompagnant {i + 1} <span className="text-rose">(modifiable)</span>
                            </span>
                            <div className="relative">
                              <input
                                type="text"
                                value={companionNames[i] ?? ""}
                                onChange={(e) =>
                                  setCompanionNames((prev) => {
                                    const next = [...prev];
                                    next[i] = e.target.value;
                                    return next;
                                  })
                                }
                                placeholder={`Nom de l'accompagnant ${i + 1}`}
                                className="w-full border border-blush bg-blush-lt/40 px-4 py-2.5 pr-10 font-serif text-choco focus:outline-none focus:border-rose focus:bg-ivory"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-rose text-sm pointer-events-none">✎</span>
                            </div>
                          </label>
                          <PersonMenuForm
                            person={companionMenus[i] ?? emptyMenu()}
                            onChange={(p) =>
                              setCompanionMenus((prev) => {
                                const next = [...prev];
                                next[i] = p;
                                return next;
                              })
                            }
                            title={companionNames[i]?.trim() || `Accompagnant ${i + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {choice && (
                <>
                  {!menusComplete && (
                    <p className="font-sans text-[0.65rem] text-rose-dk mt-6">
                      Merci de choisir l&apos;entrée, le plat et l&apos;accompagnement pour chaque personne avant de confirmer.
                    </p>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={status === "sending" || !menusComplete}
                    className="mt-4 w-full bg-choco text-ivory font-sans text-sm tracking-[.2em] uppercase py-4 hover:bg-rose-dk transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? "Envoi en cours…" : "Confirmer ma réponse"}
                  </button>
                </>
              )}
            </>
          )}

          <p className="font-sans text-xs text-sage mt-6 min-h-[16px]">
            {status === "sent" && choice === "yes" && "Merci, votre présence illuminera cette journée ✿"}
            {status === "sent" && choice === "no" && "Merci de nous avoir répondu, vous serez dans nos pensées"}
            {status === "error" && <span className="text-rose-dk">Une erreur est survenue, merci de réessayer dans un instant.</span>}
          </p>
          <p className="font-sans text-[0.65rem] tracking-[.2em] uppercase text-taupe mt-8">— {displayName.trim() || guest.name} —</p>
        </div>
      </section>
      </Reveal>

      {/* CLÔTURE — vraie photo du couple + texte "Avec amour" */}
      <Reveal>
      <section className="relative min-h-[70dvh] flex items-end justify-center overflow-hidden">
        <Image src="/canva/closing-real.jpg" alt="Steeve et Edna" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="relative z-10 text-center pb-14">
          <Stagger delay={200}>
            <p className="font-serif italic text-champagne text-lg">Avec amour</p>
          </Stagger>
          <Stagger delay={450}>
            <p className="font-script text-ivory" style={{ fontSize: "clamp(2.4rem,7vw,3.2rem)" }}>
              Steeve &amp; Edna
            </p>
          </Stagger>
        </div>
      </section>
      </Reveal>
    </main>
  );
}
