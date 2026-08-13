"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import type { GuestV2 } from "@/lib/guests-v2";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string;

const MAPS_URL =
  "https://www.google.com/maps/search/97355/@4.910319805145264,-52.458709716796875,17z?hl=fr";

const ENTREE_OPTIONS = [
  "Salade thaï accompagnée de crevettes tempura",
  "Salade thaï accompagnée de brochettes de poulet",
];
const PLAT_OPTIONS = ["Gratin de banane jaune dachine", "Riz djon-djon"];
const ACCOMPAGNEMENT_OPTIONS = ["Acoupa", "Fricassée de porc"];

const PALETTE = [
  { hex: "#C4622D", label: "Terracotta" },
  { hex: "#5E4E38", label: "Rouille" },
  { hex: "#C9A24B", label: "Doré" },
];

type Status = "idle" | "sending" | "sent" | "error";
type PersonMenu = { name: string; entree: string; plat: string; accompagnement: string };
function emptyMenu(name = ""): PersonMenu {
  return { name, entree: "", plat: "", accompagnement: "" };
}

function Countdown({ target, size = "lg" }: { target: string; size?: "lg" | "sm" }) {
  const [t, setT] = useState({ d: "--", h: "--", m: "--", s: "--" });
  useEffect(() => {
    const tick = () => {
      const diff = new Date(target).getTime() - Date.now();
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
  }, [target]);

  const big = size === "lg";
  return (
    <div className={`flex items-center justify-center ${big ? "gap-2 sm:gap-3" : "gap-1.5"}`}>
      {[t.d, t.h, t.m, t.s].map((v, i) => (
        <span key={i} className="flex items-center">
          <span
            className={`font-serif font-light ${big ? "text-4xl sm:text-5xl" : "text-2xl"} ${
              i === 3 ? "text-terra" : "text-ivory"
            }`}
          >
            {v}
          </span>
          {i < 3 && <span className={`font-serif text-ivory/60 mx-1 ${big ? "text-3xl" : "text-lg"}`}>:</span>}
        </span>
      ))}
    </div>
  );
}

function ScriptLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-script text-3xl text-choco/90 -mb-2 relative z-10">{children}</p>;
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
    <main className="bg-choco">
      {/* HERO */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden py-10 px-4">
        <Image src="/photos/couple-hero.jpg" alt="" fill priority className="object-cover opacity-60" />
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative z-10 w-full max-w-sm bg-ivory px-6 py-8 text-center shadow-2xl">
          <div className="relative">
            <img src="/photos/floral-top.png" alt="" className="absolute -top-8 -right-6 w-40 opacity-95" />
          </div>
          <p className="font-sans text-[0.52rem] tracking-[.3em] uppercase text-rose-dk mt-2 mb-3 relative z-10">
            En présence de leurs familles
          </p>
          <h1 className="relative font-script text-terra leading-none my-1 flex items-center justify-center" style={{ fontSize: "clamp(2.4rem,8vw,3rem)" }}>
            Grand
            <svg viewBox="0 0 60 60" className="w-9 h-9 mx-1 -mb-2 text-blush" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M30 52 C 8 36, 4 18, 18 10 C 26 5, 30 14, 30 20 C 30 14, 34 5, 42 10 C 56 18, 52 36, 30 52 Z" />
            </svg>
            Oui
          </h1>
          <p className="font-serif tracking-[.1em] text-choco mt-3 relative z-10">
            <span className="text-xl">STEEVE</span> <span className="italic text-rose-dk">et</span> <span className="text-xl">EDNA</span>
          </p>
          <p className="font-sans text-[0.5rem] tracking-[.2em] uppercase text-taupe mt-3 leading-relaxed relative z-10">
            vous invitent
            <br />à la célébration de leur mariage
          </p>
          <p className="font-serif text-[0.7rem] tracking-[.3em] uppercase text-choco mt-4 relative z-10">— Août —</p>
          <div className="flex items-center justify-center gap-4 mt-1 relative z-10">
            <span className="font-sans text-[0.6rem] tracking-[.15em] uppercase text-taupe border-t border-blush pt-1">Samedi</span>
            <span className="font-serif text-3xl text-choco">29</span>
            <span className="font-sans text-[0.6rem] tracking-[.15em] uppercase text-taupe border-t border-blush pt-1">à 10h30</span>
          </div>
          <p className="font-serif text-lg text-choco mt-1 relative z-10">2026</p>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-block mt-4 bg-terra text-ivory font-sans text-[0.62rem] tracking-[.15em] uppercase px-5 py-2.5 hover:bg-rose-dk transition-all"
          >
            📍 Google Maps
          </a>
          <div className="relative h-8">
            <img src="/photos/floral-bottom.png" alt="" className="absolute -bottom-4 -left-6 w-40 opacity-95" />
          </div>
        </div>
      </section>

      {/* MUSIQUE */}
      <section className="py-14 px-6 bg-ivory text-center">
        <p className="font-sans text-[0.6rem] tracking-[.3em] uppercase text-rose mb-4">Notre chanson</p>
        <div className="max-w-sm mx-auto aspect-video">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/videoseries?list=RDMM"
            title="You Know My Name - Tasha Cobbs Leonard"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="font-serif italic text-taupe text-sm mt-3">You Know My Name — Tasha Cobbs Leonard ft. Jimi Cravity</p>
      </section>

      {/* COMPTE À REBOURS */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <Image src="/photos/bg-countdown.jpg" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10">
          <ScriptLabel>le</ScriptLabel>
          <h2 className="font-serif text-2xl tracking-[.2em] uppercase text-ivory mt-1">Compte à rebours</h2>
          <p className="font-serif italic text-champagne/80 text-sm mb-8">jusqu&apos;au jour J a commencé…</p>
          <Countdown target="2026-08-29T10:30:00" />
          <div className="flex justify-center gap-8 mt-2 font-sans text-[0.55rem] tracking-[.2em] uppercase text-champagne/70">
            <span>Jours</span>
            <span>Heures</span>
            <span>Min</span>
            <span>Sec</span>
          </div>
        </div>
      </section>

      {/* LIEU DE RÉCEPTION */}
      <section className="relative py-16 px-6 text-center overflow-hidden">
        <Image src="/photos/bg-venue.jpg" alt="" fill className="object-cover opacity-25" />
        <div className="relative z-10">
          <ScriptLabel>le</ScriptLabel>
          <h2 className="font-serif text-2xl tracking-[.2em] uppercase text-choco mt-1 mb-1">Lieu de réception</h2>
          <p className="font-serif italic text-taupe text-sm mb-5">Détails du lieu à venir très prochainement</p>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-terra text-ivory font-sans text-[0.62rem] tracking-[.15em] uppercase px-5 py-2.5 hover:bg-rose-dk transition-all mb-8"
          >
            📍 Google Maps
          </a>
          <div className="max-w-xs mx-auto">
            <Image src="/photos/venue-aisle.jpg" alt="" width={400} height={500} className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* LA JOURNÉE */}
      <section className="relative py-16 px-6 overflow-hidden">
        <Image src="/photos/bg-journee.jpg" alt="" fill className="object-cover opacity-15" />
        <div className="relative z-10 text-center">
          <ScriptLabel>la</ScriptLabel>
          <h2 className="font-serif text-2xl tracking-[.2em] uppercase text-choco mt-1 mb-10">Journée</h2>
          <div className="max-w-xs mx-auto flex flex-col gap-8 text-left border-l border-blush pl-6">
            {[
              { time: "10h30", title: "Cérémonie religieuse" },
              { time: "—", title: "Séance photo", desc: "Après la cérémonie religieuse" },
              { time: "18h30", title: "Dîner de réception" },
              { time: "22h00", title: "Soirée dansante" },
            ].map((s, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-terra" />
                <p className="font-serif text-lg text-terra">{s.time}</p>
                <p className="font-sans text-sm tracking-wide uppercase text-choco">{s.title}</p>
                {s.desc && <p className="font-serif italic text-taupe text-xs mt-0.5">{s.desc}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DÉTAILS / DRESS CODE */}
      <section className="relative py-16 px-6 text-center overflow-hidden">
        <Image src="/photos/bg-details.jpg" alt="" fill className="object-cover opacity-15" />
        <div className="relative z-10">
          <ScriptLabel>les</ScriptLabel>
          <h2 className="font-serif text-2xl tracking-[.2em] uppercase text-choco mt-1 mb-8">Détails</h2>
          <div className="flex justify-center gap-3 mb-4">
            {PALETTE.map((c) => (
              <span key={c.hex} className="w-9 h-9 rounded-full border border-blush" style={{ backgroundColor: c.hex }} />
            ))}
          </div>
          <p className="font-serif text-xl text-terra mb-2">Dress code</p>
          <p className="font-serif italic text-taupe max-w-xs mx-auto text-sm leading-relaxed">
            Tenue semi-formelle et élégante. N&apos;hésitez pas à ajouter une touche d&apos;orange brûlé
            afin de vous accorder à notre thème.
          </p>
        </div>
      </section>

      {/* RSVP */}
      <section className="relative py-16 px-6 overflow-hidden">
        <Image src="/photos/bg-rsvp.jpg" alt="" fill className="object-cover opacity-10" />
        <div className="relative z-10 max-w-lg mx-auto bg-ivory border border-blush px-6 sm:px-10 py-12 text-center">
          <ScriptLabel>votre</ScriptLabel>
          <h2 className="font-serif text-3xl tracking-[.15em] uppercase text-terra mt-1 mb-1">Réponse</h2>
          <p className="font-serif italic text-taupe text-sm mb-8">Avant le 20 Août 2026</p>

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
                            className="w-full border border-blush bg-transparent px-4 py-2.5 font-serif text-choco focus:outline-none focus:border-rose"
                          />
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

      {/* CLÔTURE */}
      <section className="relative min-h-[70dvh] flex items-end justify-center overflow-hidden">
        <Image src="/photos/couple-hero.jpg" alt="Steeve et Edna" fill className="object-cover" />
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
