"use client";

import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import type { Guest } from "@/lib/guests";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string;

type Status = "idle" | "sending" | "sent" | "error";

function FloralCorner({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute w-16 h-16 pointer-events-none ${className}`}
    >
      <path d="M2 2C20 4 30 14 32 32" stroke="#C4622D" strokeWidth="1.2" opacity="0.5" />
      <circle cx="6" cy="6" r="3" fill="#A8B89A" opacity="0.6" />
      <circle cx="16" cy="10" r="2" fill="#E8C4B4" />
      <path d="M2 14 C 8 10, 12 16, 8 20" stroke="#A8B89A" strokeWidth="1" fill="none" opacity="0.5" />
    </svg>
  );
}

function Countdown() {
  const [t, setT] = useState({ d: "--", h: "--", m: "--", s: "--" });
  useEffect(() => {
    const tick = () => {
      const diff = new Date("2026-08-29T10:00:00").getTime() - Date.now();
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
    <div className="flex items-end justify-center gap-1 my-6">
      {[
        { v: t.d, l: "Jours" },
        { v: t.h, l: "Heures" },
        { v: t.m, l: "Min" },
        { v: t.s, l: "Sec" },
      ].flatMap(({ v, l }, i, arr) => {
        const box = (
          <div key={l} className="relative bg-blush-lt border border-blush px-3 py-2 min-w-[52px] text-center">
            <span className="font-serif text-xl font-light text-choco leading-none block">{v}</span>
            <span className="font-sans text-[0.4rem] tracking-[.25em] uppercase text-taupe mt-1 block">{l}</span>
          </div>
        );
        return i < arr.length - 1
          ? [box, <span key={`dot-${i}`} className="font-serif text-base text-blush mb-3 opacity-70">·</span>]
          : [box];
      })}
    </div>
  );
}

export default function InvitationClient({ guest }: { guest: Guest }) {
  const [displayName, setDisplayName] = useState(guest.name);
  const [choice, setChoice] = useState<"yes" | "no" | null>(null);
  const [companionCount, setCompanionCount] = useState(0);
  const [companionNames, setCompanionNames] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  function selectYes() {
    setChoice("yes");
    setStatus("idle");
  }

  function selectNo() {
    setChoice("no");
    setStatus("idle");
  }

  function updateCompanionCount(n: number) {
    setCompanionCount(n);
    setCompanionNames((prev) => {
      const next = [...prev];
      next.length = n;
      return next.fill("", prev.length).map((v, i) => prev[i] ?? "");
    });
  }

  async function handleSubmit() {
    if (!choice || status === "sending") return;
    setStatus("sending");

    const name = displayName.trim() || guest.name;
    let reponse = choice === "yes" ? "Oui, avec joie" : "Avec regret, non";

    if (choice === "yes" && companionCount > 0) {
      const names = companionNames.map((n) => n.trim()).filter(Boolean);
      reponse +=
        companionCount === 1
          ? ` — accompagné(e) de 1 personne : ${names[0] || "(nom non renseigné)"}`
          : ` — accompagné(e) de ${companionCount} personnes : ${names.length ? names.join(", ") : "(noms non renseignés)"}`;
    }

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        { from_name: name, reponse },
        { publicKey: PUBLIC_KEY }
      );
      setStatus("sent");
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-ivory flex items-center justify-center px-6 py-16">
      <div className="relative w-full max-w-lg bg-ivory border border-blush px-10 py-14 text-center shadow-[0_20px_60px_-20px_rgba(74,36,24,0.25)]">
        <FloralCorner className="top-3 left-3" />
        <FloralCorner className="top-3 right-3 scale-x-[-1]" />
        <FloralCorner className="bottom-3 left-3 scale-y-[-1]" />
        <FloralCorner className="bottom-3 right-3 scale-x-[-1] scale-y-[-1]" />

        <p className="font-sans text-[0.6rem] tracking-[.4em] uppercase text-rose mb-5">
          Ensemble pour la vie
        </p>

        <h1 className="leading-[.95] text-choco">
          <span className="font-script block" style={{ fontSize: "clamp(3rem,9vw,4.2rem)" }}>
            Steeve
          </span>
          <span className="font-serif italic text-rose block my-1 text-2xl">&amp;</span>
          <span className="font-script block" style={{ fontSize: "clamp(3rem,9vw,4.2rem)" }}>
            Edna
          </span>
        </h1>

        <p className="font-serif text-lg text-choco mt-6">Vendredi 29 Août 2026</p>
        <p className="font-sans text-[0.62rem] tracking-[.3em] uppercase text-rose mb-2">
          Macouria · Guyane Française
        </p>

        <Countdown />

        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="w-10 h-px bg-blush" />
          <span className="font-serif italic text-taupe text-sm">pour toujours</span>
          <span className="w-10 h-px bg-blush" />
        </div>

        <p className="font-serif italic font-light text-taupe text-lg mb-10 leading-relaxed">
          Avec tout notre amour, nous serions honorés
          <br />
          de vous compter parmi nous en ce jour si spécial.
        </p>

        {status !== "sent" && (
          <>
            <label className="block text-left mb-8">
              <span className="font-sans text-[0.6rem] tracking-[.25em] uppercase text-rose mb-2 block">
                Votre prénom
              </span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full border border-blush bg-transparent px-4 py-3 font-serif text-choco text-lg focus:outline-none focus:border-rose"
                placeholder="Votre prénom"
              />
            </label>

            <p className="font-sans text-[0.62rem] tracking-[.3em] uppercase text-rose mb-5">
              Serez-vous des nôtres ?
            </p>
            <div className="flex gap-3 justify-center mb-2">
              <button
                onClick={selectYes}
                disabled={status === "sending"}
                className={`flex-1 max-w-[170px] font-sans text-sm tracking-wide py-4 px-3 border transition-all duration-300 disabled:opacity-50 ${
                  choice === "yes"
                    ? "bg-rose text-ivory border-rose"
                    : "border-rose text-rose-dk hover:bg-rose hover:text-ivory"
                }`}
              >
                Oui, avec joie
              </button>
              <button
                onClick={selectNo}
                disabled={status === "sending"}
                className={`flex-1 max-w-[170px] font-sans text-sm tracking-wide py-4 px-3 border transition-all duration-300 disabled:opacity-50 ${
                  choice === "no"
                    ? "bg-taupe text-ivory border-taupe"
                    : "border-taupe text-taupe hover:bg-taupe hover:text-ivory"
                }`}
              >
                Avec regret, non
              </button>
            </div>

            {choice === "yes" && guest.maxCompanions > 0 && (
              <div className="text-left mt-8 border-t border-blush pt-6">
                <span className="font-sans text-[0.6rem] tracking-[.25em] uppercase text-rose mb-3 block">
                  Serez-vous accompagné(e) ? (max {guest.maxCompanions})
                </span>
                <div className="flex gap-2 mb-5">
                  {Array.from({ length: guest.maxCompanions + 1 }, (_, n) => n).map((n) => (
                    <button
                      key={n}
                      onClick={() => updateCompanionCount(n)}
                      className={`w-10 h-10 font-sans text-sm border transition-all ${
                        companionCount === n
                          ? "bg-rose text-ivory border-rose"
                          : "border-blush text-choco hover:border-rose"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                {companionCount > 0 && (
                  <div className="flex flex-col gap-3 mb-2">
                    {Array.from({ length: companionCount }, (_, i) => i).map((i) => (
                      <input
                        key={i}
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
                    ))}
                  </div>
                )}
              </div>
            )}

            {choice && (
              <button
                onClick={handleSubmit}
                disabled={status === "sending"}
                className="mt-8 w-full bg-choco text-ivory font-sans text-sm tracking-[.2em] uppercase py-4 hover:bg-rose-dk transition-all duration-300 disabled:opacity-50"
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
            <span className="text-rose-dk">
              Une erreur est survenue, merci de réessayer dans un instant.
            </span>
          )}
        </p>

        <p className="font-sans text-[0.65rem] tracking-[.2em] uppercase text-taupe mt-10">
          — {displayName.trim() || guest.name} —
        </p>
      </div>
    </main>
  );
}
