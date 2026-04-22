"use client";
import { useEffect, useState } from "react";

function FloralTL() {
  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M20,280 Q80,200 60,120 Q40,60 100,20" stroke="#C4846A" strokeWidth="1.2" opacity=".4"/>
      <ellipse cx="60" cy="120" rx="28" ry="14" fill="#E8C4B4" opacity=".5" transform="rotate(-30 60 120)"/>
      <ellipse cx="80" cy="80" rx="22" ry="11" fill="#D4E4D0" opacity=".55" transform="rotate(20 80 80)"/>
      <ellipse cx="100" cy="50" rx="18" ry="9" fill="#E8C4B4" opacity=".45" transform="rotate(-10 100 50)"/>
      <circle cx="60" cy="120" r="4" fill="#C4846A" opacity=".5"/>
      <path d="M40,180 Q90,160 80,120" stroke="#A8B89A" strokeWidth="1" opacity=".5"/>
      <ellipse cx="62" cy="150" rx="16" ry="8" fill="#D4E4D0" opacity=".5" transform="rotate(40 62 150)"/>
      <path d="M20,240 Q60,220 55,190" stroke="#C4846A" strokeWidth=".8" opacity=".35"/>
      <ellipse cx="37" cy="215" rx="12" ry="6" fill="#EDD9C0" opacity=".5" transform="rotate(-20 37 215)"/>
      <circle cx="80" cy="80" r="3" fill="#A8B89A" opacity=".5"/>
      <circle cx="100" cy="50" r="2.5" fill="#C4846A" opacity=".45"/>
    </svg>
  );
}

function FloralBR() {
  return (
    <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M20,280 Q80,200 60,120 Q40,60 100,20" stroke="#A8B89A" strokeWidth="1.2" opacity=".4"/>
      <ellipse cx="60" cy="120" rx="24" ry="12" fill="#D4E4D0" opacity=".5" transform="rotate(-25 60 120)"/>
      <ellipse cx="80" cy="75" rx="20" ry="10" fill="#E8C4B4" opacity=".5" transform="rotate(15 80 75)"/>
      <circle cx="60" cy="120" r="3.5" fill="#A8B89A" opacity=".5"/>
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
        d: String(Math.floor(diff / 86400000)).padStart(2,"0"),
        h: String(Math.floor(diff % 86400000 / 3600000)).padStart(2,"0"),
        m: String(Math.floor(diff % 3600000 / 60000)).padStart(2,"0"),
        s: String(Math.floor(diff % 60000 / 1000)).padStart(2,"0"),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-end justify-center gap-1 mt-10">
      {[{ v: t.d, l: "Jours" }, { v: t.h, l: "Heures" }, { v: t.m, l: "Min" }, { v: t.s, l: "Sec" }].map(({ v, l }, i) => (
        <>
          <div key={l} className="relative bg-blush-lt border border-blush px-5 py-3.5 min-w-[68px] text-center">
            <div className="absolute inset-[-3px] border border-blush opacity-40 pointer-events-none" />
            <span className="font-serif text-[2.2rem] font-light text-choco leading-none block">{v}</span>
            <span className="font-sans text-[0.45rem] tracking-[.3em] uppercase text-taupe mt-1.5 block">{l}</span>
          </div>
          {i < 3 && <span key={`dot-${i}`} className="font-serif text-[1.6rem] text-blush mb-4 opacity-70">·</span>}
        </>
      ))}
    </div>
  );
}

export default function Hero() {
  useEffect(() => {
    const cur  = document.getElementById("cur");
    const curR = document.getElementById("curR");
    if (!cur || !curR) return;
    let mx = 0, my = 0, rx = 0, ry = 0;
    const move = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + "px"; cur.style.top = my + "px";
    };
    const anim = () => {
      rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
      curR.style.left = rx + "px"; curR.style.top = ry + "px";
      requestAnimationFrame(anim);
    };
    document.addEventListener("mousemove", move);
    anim();
    return () => document.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      {/* Custom cursor */}
      <div id="cur"  className="fixed w-1.5 h-1.5 bg-rose rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 top-0 left-0"/>
      <div id="curR" className="fixed w-7 h-7 border border-rose rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 top-0 left-0 opacity-50"/>

      <section id="hero" className="min-h-screen bg-ivory flex items-center justify-center relative overflow-hidden">

        {/* Glow circle */}
        <div className="absolute w-[72vw] h-[72vw] max-w-[900px] max-h-[900px] rounded-full top-1/2 left-1/2 animate-breathe pointer-events-none"
             style={{ background: "radial-gradient(circle at 40% 40%, #F5E2D8 0%, #EDD9C0 60%, transparent 100%)" }}/>

        {/* Botanicals */}
        <div className="absolute top-[-20px] left-[-20px] w-[320px] opacity-55 animate-float1 pointer-events-none"><FloralTL/></div>
        <div className="absolute top-[-10px] right-[-10px] w-[280px] opacity-55 animate-float2 pointer-events-none scale-x-[-1]"><FloralTL/></div>
        <div className="absolute bottom-[-20px] left-[-10px] w-[240px] opacity-50 animate-float3 pointer-events-none"><FloralBR/></div>
        <div className="absolute bottom-[-10px] right-[-20px] w-[260px] opacity-50 animate-float1 pointer-events-none scale-x-[-1] scale-y-[-1]"><FloralBR/></div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 py-20">

          <p className="animate-fade-up-1 font-sans text-[0.58rem] font-light tracking-[.55em] uppercase text-taupe mb-5 flex items-center justify-center gap-4">
            <span className="w-8 h-px bg-blush inline-block"/>
            Vous êtes invités au mariage de
            <span className="w-8 h-px bg-blush inline-block"/>
          </p>

          <div className="animate-fade-up-2">
            <span className="font-script block leading-[.95] text-choco" style={{ fontSize: "clamp(5rem,14vw,11rem)" }}>Steeve</span>
            <span className="font-serif italic block text-rose font-light my-1 tracking-widest" style={{ fontSize: "clamp(1.8rem,4vw,3.2rem)" }}>&amp;</span>
            <span className="font-script block leading-[.95] text-choco" style={{ fontSize: "clamp(5rem,14vw,11rem)" }}>Edna</span>
          </div>

          <div className="animate-fade-up-3 flex items-center justify-center gap-3 my-8">
            <span className="w-14 h-px bg-blush"/>
            <span className="font-serif italic text-rose font-light text-sm tracking-[.2em]">pour toujours</span>
            <span className="w-14 h-px bg-blush"/>
          </div>

          <span className="animate-fade-up-4 font-serif text-lg font-light text-taupe tracking-[.25em] block mb-1">
            Vendredi 29 Août 2026
          </span>
          <span className="animate-fade-up-5 font-sans text-[0.6rem] font-light tracking-[.4em] uppercase text-rose block">
            Macouria · Guyane Française
          </span>

          <div className="animate-fade-up-6"><Countdown/></div>

          <a href="#rsvp"
             className="animate-fade-up-7 inline-block mt-12 px-14 py-4 bg-rose text-ivory font-sans text-[0.6rem] font-light tracking-[.35em] uppercase relative overflow-hidden group">
            <span className="absolute inset-0 bg-rose-dk translate-y-full group-hover:translate-y-0 transition-transform duration-300"/>
            <span className="relative z-10">Je confirme ma présence</span>
          </a>
        </div>

        {/* Scroll */}
        <div className="animate-fade-in-scroll absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5">
          <div className="w-px h-14 animate-scroll-pulse" style={{ background: "linear-gradient(to bottom, #C4846A, transparent)" }}/>
          <p className="font-sans text-[0.5rem] tracking-[.4em] uppercase text-taupe">Défiler</p>
        </div>

      </section>
    </>
  );
}
