"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import type { GuestV2 } from "@/lib/guests-v2";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string;

const CHURCH_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("Rue de la Cotonnière, 97351 La Persévérance");

const VENUE_MAPS_URL =
  "https://www.google.com/maps/search/97355/@4.910319805145264,-52.458709716796875,17z?hl=fr";

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
    if (!choice || status === "sending") return;
    setStatus("sending");
    const name = displayName.trim() || guest.name;
    let reponse = choice === "yes" ? "Oui, avec joie" : "Avec regret, non";

    if (choice === "yes") {
      const menuLine = (m: PersonMenu, label: string) =>
        `${label} — Entrée: ${m.entree || "?"} | Plat: ${m.plat || "?"} | Accompagnement: ${m.accompagnement || "?"}`;
      reponse += `\n${menuLine(ownMenu, name)}`;
      if (companionCount > 0) {
        const names = companionNames.map((n) => n.trim()).filter(Boolean);
        reponse +=
          companionCount === 1
            ? `\nAccompagné(e) de 1 personne : ${names[0] || "(nom non renseigné)"}`
            : `\nAccompagné(e) de ${companionCount} personnes : ${names.length ? names.join(", ") : "(noms non renseignés)"}`;
        companionMenus.forEach((m, i) => {
          reponse += `\n${menuLine(m, names[i] || `Accompagnant ${i + 1}`)}`;
        });
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
      {/* HERO — image Canva exacte + bouton Google Maps cliquable par-dessus + adresse église visible */}
      <section className="relative w-full max-w-sm mx-auto bg-ivory">
        <Image src="/canva/hero.png" alt="Steeve et Edna" width={386} height={813} className="w-full h-auto" priority />
        <a
          href={CHURCH_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Google Maps"
          className="absolute left-1/2 -translate-x-1/2 w-[55%] h-[4.5%]"
          style={{ top: "78.5%" }}
        />
        <p className="text-center pt-3 pb-4 px-6">
          <span className="block font-serif text-base font-semibold text-terra">Église ICC</span>
          <span className="block font-sans text-[0.6rem] tracking-[.1em] text-taupe mt-1">
            Cérémonie religieuse — Rue de la Cotonnière, 97351 La Persévérance
          </span>
        </p>
      </section>

      {/* MUSIQUE — présentée en carte, cohérente avec le reste */}
      <section className="w-full max-w-sm mx-auto bg-ivory px-6 py-10 text-center border-x border-blush">
        <p className="font-sans text-[0.6rem] tracking-[.3em] uppercase text-rose mb-4">Notre chanson</p>
        <div className="aspect-video overflow-hidden shadow-lg">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/t7owFiihXgg"
            title="You Know My Name - Tasha Cobbs Leonard"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="font-serif italic text-taupe text-sm mt-4">You Know My Name</p>
        <p className="font-sans text-[0.6rem] tracking-[.15em] uppercase text-taupe/70 mt-1">Tasha Cobbs Leonard ft. Jimi Cravity</p>
      </section>

      {/* COMPTE À REBOURS — même largeur de carte que les autres sections */}
      <section className="relative w-full max-w-sm mx-auto overflow-hidden">
        <Image src="/canva/countdown-bg.jpg" alt="" width={386} height={577} className="w-full h-[577px] object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <p className="font-script text-3xl text-ivory/90 -mb-1">le</p>
          <h2 className="font-serif text-2xl tracking-[.2em] uppercase text-ivory mt-1">Compte à rebours</h2>
          <p className="font-serif italic text-champagne/80 text-sm mb-8">jusqu&apos;au jour J a commencé…</p>
          <Countdown />
          <div className="flex justify-center gap-8 mt-2 font-sans text-[0.55rem] tracking-[.2em] uppercase text-champagne/70">
            <span>Jours</span>
            <span>Heures</span>
            <span>Min</span>
            <span>Sec</span>
          </div>
        </div>
      </section>

      {/* LIEU DE RÉCEPTION — image Canva exacte + bouton Google Maps cliquable */}
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

      {/* LA JOURNÉE — titre + icônes du Canva, horaires réels et corrects */}
      <section className="py-16 px-6 bg-ivory">
        <div className="max-w-[200px] mx-auto mb-10">
          <Image src="/canva/journee-title.png" alt="La journée" width={372} height={185} className="w-full h-auto" />
        </div>
        <div className="max-w-xs mx-auto flex flex-col gap-8 border-l border-blush pl-6">
          {TIMELINE.map((step, i) => (
            <div key={i} className="flex items-center gap-4">
              <Image src={step.icon} alt="" width={40} height={40} className="w-9 h-9 shrink-0 -ml-[3.1rem]" />
              <div>
                <p className="font-serif text-lg text-terra">{step.time}</p>
                <p className="font-sans text-sm tracking-wide uppercase text-choco">{step.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DÉTAILS / DRESS CODE — image Canva exacte */}
      <section className="w-full max-w-sm mx-auto bg-ivory">
        <Image src="/canva/details.png" alt="Détails et dress code" width={386} height={835} className="w-full h-auto" />
      </section>

      {/* RSVP — en-tête Canva exact, puis vrai formulaire fonctionnel */}
      <section className="bg-ivory">
        <div className="w-full max-w-sm mx-auto">
          <Image src="/canva/rsvp-header.png" alt="Votre réponse" width={386} height={741} className="w-full h-auto" />
        </div>

        <div className="max-w-lg mx-auto bg-ivory border border-blush px-6 sm:px-10 py-10 text-center -mt-2">
          {status !== "sent" && (
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
                <button
                  onClick={handleSubmit}
                  disabled={status === "sending"}
                  className="mt-8 w-full bg-choco text-ivory font-sans text-sm tracking-[.2em] uppercase py-4 hover:bg-rose-dk transition-all disabled:opacity-50"
                >
                  {status === "sending" ? "Envoi en cours…" : "Confirmer ma réponse"}
                </button>
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

      {/* CLÔTURE — vraie photo du couple + texte "Avec amour" */}
      <section className="relative min-h-[70dvh] flex items-end justify-center overflow-hidden">
        <Image src="/canva/closing-real.jpg" alt="Steeve et Edna" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="relative z-10 text-center pb-14">
          <p className="font-serif italic text-champagne text-lg">Avec amour</p>
          <p className="font-script text-ivory" style={{ fontSize: "clamp(2.4rem,7vw,3.2rem)" }}>
            Steeve &amp; Edna
          </p>
        </div>
      </section>
    </main>
  );
}
