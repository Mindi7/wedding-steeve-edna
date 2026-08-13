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
  { hex: "#5A3A28", label: "Chocolat" },
  { hex: "#8C4A2B", label: "Rouille" },
  { hex: "#C4622D", label: "Terracotta" },
  { hex: "#A6907E", label: "Taupe" },
  { hex: "#EDE3D3", label: "Ivoire" },
];

type Status = "idle" | "sending" | "sent" | "error";

type PersonMenu = {
  name: string;
  entree: string;
  plat: string;
  accompagnement: string;
};

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
    <div className="flex items-end justify-center gap-1.5 sm:gap-2">
      {[
        { v: t.d, l: "Jours" },
        { v: t.h, l: "Heures" },
        { v: t.m, l: "Min" },
        { v: t.s, l: "Sec" },
      ].flatMap(({ v, l }, i, arr) => {
        const box = (
          <div key={l} className="bg-blush-lt border border-blush px-4 py-3 min-w-[62px] text-center">
            <span className="font-serif text-2xl font-light text-choco leading-none block">{v}</span>
            <span className="font-sans text-[0.45rem] tracking-[.25em] uppercase text-taupe mt-1 block">{l}</span>
          </div>
        );
        return i < arr.length - 1
          ? [box, <span key={`d-${i}`} className="font-serif text-lg text-blush mb-4 opacity-70">·</span>]
          : [box];
      })}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-[0.62rem] tracking-[.4em] uppercase text-rose text-center mb-3">
      {children}
    </p>
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
    <div className="border border-blush bg-ivory/60 p-5 text-left">
      <p className="font-sans text-[0.6rem] tracking-[.2em] uppercase text-rose-dk mb-3">{title}</p>
      <div className="grid gap-3">
        <div>
          <p className="font-sans text-[0.55rem] tracking-[.15em] uppercase text-taupe mb-1.5">Entrée</p>
          {ENTREE_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-start gap-2 font-serif text-sm text-choco mb-1 cursor-pointer">
              <input
                type="radio"
                name={`entree-${title}`}
                checked={person.entree === opt}
                onChange={() => onChange({ ...person, entree: opt })}
                className="mt-1 accent-rose"
              />
              {opt}
            </label>
          ))}
        </div>
        <div>
          <p className="font-sans text-[0.55rem] tracking-[.15em] uppercase text-taupe mb-1.5">Plat de résistance</p>
          {PLAT_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-start gap-2 font-serif text-sm text-choco mb-1 cursor-pointer">
              <input
                type="radio"
                name={`plat-${title}`}
                checked={person.plat === opt}
                onChange={() => onChange({ ...person, plat: opt })}
                className="mt-1 accent-rose"
              />
              {opt}
            </label>
          ))}
        </div>
        <div>
          <p className="font-sans text-[0.55rem] tracking-[.15em] uppercase text-taupe mb-1.5">Accompagnement</p>
          {ACCOMPAGNEMENT_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-start gap-2 font-serif text-sm text-choco mb-1 cursor-pointer">
              <input
                type="radio"
                name={`acc-${title}`}
                checked={person.accompagnement === opt}
                onChange={() => onChange({ ...person, accompagnement: opt })}
                className="mt-1 accent-rose"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function FloralWreath() {
  return (
    <svg viewBox="0 0 320 90" className="w-56 sm:w-64 mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 70 C 60 20, 140 10, 160 10 C 180 10, 260 20, 300 70" stroke="#8C9A7A" strokeWidth="1.5" opacity="0.6" fill="none" />
      {/* left cluster */}
      <circle cx="30" cy="62" r="10" fill="#C4622D" opacity="0.9" />
      <circle cx="46" cy="50" r="8" fill="#E8C4B4" />
      <circle cx="60" cy="60" r="7" fill="#A0604A" opacity="0.85" />
      <circle cx="40" cy="72" r="6" fill="#F5E2D8" />
      <ellipse cx="65" cy="42" rx="9" ry="4" fill="#8C9A7A" opacity="0.7" transform="rotate(-20 65 42)" />
      <ellipse cx="24" cy="46" rx="8" ry="3.5" fill="#8C9A7A" opacity="0.7" transform="rotate(30 24 46)" />
      {/* right cluster */}
      <circle cx="290" cy="62" r="10" fill="#C4622D" opacity="0.9" />
      <circle cx="274" cy="50" r="8" fill="#E8C4B4" />
      <circle cx="260" cy="60" r="7" fill="#A0604A" opacity="0.85" />
      <circle cx="280" cy="72" r="6" fill="#F5E2D8" />
      <ellipse cx="255" cy="42" rx="9" ry="4" fill="#8C9A7A" opacity="0.7" transform="rotate(20 255 42)" />
      <ellipse cx="296" cy="46" rx="8" ry="3.5" fill="#8C9A7A" opacity="0.7" transform="rotate(-30 296 46)" />
    </svg>
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
    <main className="bg-ivory">
      {/* HERO */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-choco py-10 px-4">
        <Image
          src="/photos/couple-hero.jpg"
          alt="Steeve et Edna"
          fill
          priority
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 w-full max-w-sm bg-ivory/95 backdrop-blur-sm px-8 py-10 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
          <FloralWreath />
          <p className="font-sans text-[0.55rem] tracking-[.35em] uppercase text-rose-dk mt-3 mb-1">
            En présence de leurs familles
          </p>
          <h1 className="font-script text-terra leading-none my-2 flex items-center justify-center gap-2" style={{ fontSize: "clamp(2.6rem,9vw,3.4rem)" }}>
            Grand <span className="text-rose">♥</span> Oui
          </h1>
          <p className="font-serif tracking-[.15em] text-choco text-lg mt-4">
            STEEVE <span className="italic text-rose-dk">&amp;</span> EDNA
          </p>
          <p className="font-sans text-[0.55rem] tracking-[.25em] uppercase text-taupe mt-3 leading-relaxed">
            vous invitent
            <br />à la célébration de leur mariage
          </p>
          <p className="font-sans text-[0.6rem] tracking-[.3em] uppercase text-rose-dk mt-5">Août</p>
          <p className="font-serif text-2xl text-choco mt-1">
            Samedi 29 <span className="text-terra">2026</span> · à 10h30
          </p>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 bg-terra text-ivory font-sans text-[0.65rem] tracking-[.2em] uppercase px-6 py-2.5 hover:bg-rose-dk transition-all"
          >
            📍 Google Maps
          </a>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="py-16 px-6 text-center">
        <SectionLabel>Le compte à rebours</SectionLabel>
        <Countdown />
      </section>

      {/* DÉROULÉ DE LA JOURNÉE */}
      <section className="py-16 px-6 bg-blush-lt/40 text-center">
        <SectionLabel>Le déroulé de la journée</SectionLabel>
        <h2 className="font-script text-4xl text-rose-dk mb-10">29 Août 2026</h2>
        <div className="max-w-md mx-auto flex flex-col gap-8 text-left">
          {[
            { time: "10h30", title: "Cérémonie religieuse", desc: "À l'église" },
            { time: "—", title: "Séance photo", desc: "Réalisée après la cérémonie religieuse" },
            { time: "18h30", title: "Dîner de réception", desc: "" },
            { time: "22h00", title: "Soirée dansante", desc: "" },
          ].map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="font-serif text-lg text-terra w-16 shrink-0 text-right">{step.time}</div>
              <div className="border-l border-blush pl-4">
                <p className="font-serif text-lg text-choco">{step.title}</p>
                {step.desc && <p className="font-sans text-xs text-taupe mt-1">{step.desc}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DÉTAILS / DRESS CODE */}
      <section className="py-16 px-6 text-center">
        <SectionLabel>Détails</SectionLabel>
        <h2 className="font-script text-4xl text-rose-dk mb-6">Code vestimentaire</h2>
        <p className="font-serif italic text-taupe max-w-md mx-auto mb-8">
          Nous serions ravis de vous voir porter des tons terracotta, rouille, camel et ivoire,
          en écho à notre palette du jour.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          {PALETTE.map((c) => (
            <div key={c.hex} className="text-center">
              <div className="w-12 h-12 rounded-full border border-blush" style={{ backgroundColor: c.hex }} />
              <p className="font-sans text-[0.55rem] tracking-wide uppercase text-taupe mt-2">{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RSVP */}
      <section className="py-16 px-6 bg-blush-lt/40">
        <div className="max-w-lg mx-auto bg-ivory border border-blush px-6 sm:px-10 py-12 text-center">
          <SectionLabel>Répondez avec joie</SectionLabel>
          <h2 className="font-script text-4xl text-rose-dk mb-8">RSVP</h2>

          {status !== "sent" && (
            <>
              <label className="block text-left mb-6">
                <span className="font-sans text-[0.6rem] tracking-[.25em] uppercase text-rose mb-2 block">
                  Votre prénom
                </span>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full border border-blush bg-transparent px-4 py-3 font-serif text-choco text-lg focus:outline-none focus:border-rose"
                />
              </label>

              <p className="font-sans text-[0.62rem] tracking-[.3em] uppercase text-rose mb-4">
                Serez-vous des nôtres ?
              </p>
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
            {status === "error" && (
              <span className="text-rose-dk">Une erreur est survenue, merci de réessayer dans un instant.</span>
            )}
          </p>

          <p className="font-sans text-[0.65rem] tracking-[.2em] uppercase text-taupe mt-8">
            — {displayName.trim() || guest.name} —
          </p>
        </div>
      </section>
    </main>
  );
}
