"use client";
import { useEffect, useState } from "react";

function Countdown() {
  const weddingDate = new Date("2026-08-29T00:00:00");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = weddingDate.getTime() - now.getTime();
      if (diff <= 0) { clearInterval(timer); return; }
      setTimeLeft({
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-6 justify-center mt-8">
      {[
        { value: timeLeft.days,    label: "Jours" },
        { value: timeLeft.hours,   label: "Heures" },
        { value: timeLeft.minutes, label: "Minutes" },
        { value: timeLeft.seconds, label: "Secondes" },
      ].map(({ value, label }) => (
        <div key={label} className="flex flex-col items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-terra rounded-sm flex items-center justify-center">
            <span className="text-creme font-serif text-2xl md:text-3xl font-light">
              {String(value).padStart(2, "0")}
            </span>
          </div>
          <span className="text-taupe text-xs tracking-widest mt-2 uppercase font-sans">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  return (
    <section id="hero" className="min-h-screen bg-creme flex flex-col items-center justify-center px-6 relative overflow-hidden">

      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full border border-terra" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full border border-terra" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-terra" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">

        <p className="text-terra tracking-[0.4em] text-xs uppercase font-sans mb-6">
          Vous êtes invités au mariage de
        </p>

        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-12 bg-terra opacity-40" />
          <div className="w-1.5 h-1.5 rounded-full bg-terra opacity-60" />
          <div className="h-px w-12 bg-terra opacity-40" />
        </div>

        <h1 className="font-serif text-6xl md:text-8xl font-light text-chocolat tracking-wide mb-2">
          Steeve
        </h1>
        <p className="font-serif text-2xl md:text-3xl text-terra font-light italic mb-2">
          &amp;
        </p>
        <h1 className="font-serif text-6xl md:text-8xl font-light text-chocolat tracking-wide mb-8">
          Edna
        </h1>

        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="h-px w-16 bg-creme-dark" />
          <p className="font-sans text-sm tracking-[0.3em] text-taupe uppercase">
            29 Août 2026
          </p>
          <div className="h-px w-16 bg-creme-dark" />
        </div>
        <p className="font-sans text-xs tracking-[0.25em] text-taupe uppercase mb-10">
          Macouria · Guyane Française
        </p>

        <Countdown />

        <div className="mt-12">
          <a href="#rsvp" className="inline-block bg-terra text-creme font-sans text-sm tracking-[0.3em] uppercase px-10 py-4 hover:bg-chocolat transition-colors duration-300">
            Je confirme ma présence
          </a>
        </div>

        <div className="mt-16 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-8 bg-taupe animate-pulse" />
          <span className="text-taupe text-xs tracking-widest font-sans">Découvrir</span>
        </div>

      </div>
    </section>
  );
}
