"use client";

import { useState } from "react";
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

export default function InvitationClient({ guest }: { guest: Guest }) {
  const [choice, setChoice] = useState<"yes" | "no" | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  async function handleChoice(value: "yes" | "no") {
    if (status === "sending") return;
    setChoice(value);
    setStatus("sending");

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: guest.name,
          reponse: value === "yes" ? "Oui, avec joie" : "Avec regret, non",
        },
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
            Edna
          </span>
          <span className="font-serif italic text-rose block my-1 text-2xl">&amp;</span>
          <span className="font-script block" style={{ fontSize: "clamp(3rem,9vw,4.2rem)" }}>
            Steeve
          </span>
        </h1>

        <p className="font-serif text-lg text-choco mt-6">Vendredi 29 Août 2026</p>
        <p className="font-sans text-[0.62rem] tracking-[.3em] uppercase text-rose mb-8">
          Macouria · Guyane Française
        </p>

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
            <p className="font-sans text-[0.62rem] tracking-[.3em] uppercase text-rose mb-5">
              Serez-vous des nôtres ?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleChoice("yes")}
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
                onClick={() => handleChoice("no")}
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
          </>
        )}

        <p className="font-sans text-xs text-sage mt-6 min-h-[16px]">
          {status === "sending" && "Envoi de votre réponse…"}
          {status === "sent" && choice === "yes" && "Merci, votre présence illuminera cette journée ✿"}
          {status === "sent" && choice === "no" && "Merci de nous avoir répondu, vous serez dans nos pensées"}
          {status === "error" && (
            <span className="text-rose-dk">
              Une erreur est survenue, merci de réessayer dans un instant.
            </span>
          )}
        </p>

        <p className="font-sans text-[0.65rem] tracking-[.2em] uppercase text-taupe mt-10">
          — {guest.name} —
        </p>
      </div>
    </main>
  );
}
