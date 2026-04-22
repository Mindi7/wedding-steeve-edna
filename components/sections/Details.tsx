"use client";
import { useEffect, useRef } from "react";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("opacity-100","translate-y-0"); e.target.classList.remove("opacity-0","translate-y-10"); obs.unobserve(e.target); }});
    }, { threshold: 0.1 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const items = [
  { label:"Date",        val:"29 Août 2026",    sub:""                          },
  { label:"Lieu",        val:"Macouria",        sub:"Guyane Française"           },
  { label:"Dress Code",  val:"Libre",           sub:"Tenue de fête recommandée"  },
  { label:"RSVP avant",  val:"1er Juillet",     sub:"2026"                       },
];

export default function Details() {
  const leftRef  = useReveal();
  const rightRef = useReveal();
  return (
    <section id="details" className="bg-choco grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">
      <div ref={leftRef} className="opacity-0 translate-y-10 transition-all duration-700 p-16 md:p-24 flex flex-col justify-end border-b md:border-b-0 md:border-r border-white/[.07]">
        <span className="font-sans text-[0.55rem] tracking-[.5em] uppercase text-rose mb-6 block">Informations pratiques</span>
        <h2 className="font-script text-[clamp(3rem,6vw,5rem)] text-ivory leading-[1.1] mb-12">Le Jour J</h2>
        <div className="grid grid-cols-2 gap-px bg-white/[.07]">
          {items.map(it => (
            <div key={it.label} className="bg-choco p-8">
              <span className="font-sans text-[0.5rem] tracking-[.35em] uppercase text-rose mb-2.5 block">{it.label}</span>
              <div className="font-serif text-[1.5rem] font-light text-ivory leading-[1.2]">{it.val}</div>
              {it.sub && <p className="font-sans text-[0.72rem] font-light text-taupe mt-1.5 leading-[1.7]">{it.sub}</p>}
            </div>
          ))}
        </div>
      </div>
      <div ref={rightRef} className="opacity-0 translate-y-10 transition-all duration-700 delay-150 relative overflow-hidden p-16 md:p-24 flex items-end"
           style={{ background:"linear-gradient(160deg,#6A2E18 0%,#3D1A0A 100%)" }}>
        <svg className="absolute top-0 right-0 w-[70%] opacity-[.06] pointer-events-none" viewBox="0 0 400 500" fill="none">
          <path d="M200,480 Q120,380 100,280 Q80,180 140,100 Q180,50 200,80 Q220,50 260,100 Q320,180 300,280 Q280,380 200,480Z" stroke="white" strokeWidth="1.5"/>
          <ellipse cx="200" cy="280" rx="60" ry="30" fill="white" opacity=".3" transform="rotate(-20 200 280)"/>
          <circle cx="200" cy="160" r="10" fill="white" opacity=".4"/>
        </svg>
        <div className="relative z-10">
          <span className="font-sans text-[0.55rem] tracking-[.4em] uppercase text-taupe mb-6 block">Confirmez votre présence</span>
          <a href="#rsvp"
             className="inline-block px-14 py-5 border border-blush font-sans text-[0.6rem] font-light tracking-[.35em] uppercase text-blush relative overflow-hidden group">
            <span className="absolute inset-0 bg-blush translate-y-full group-hover:translate-y-0 transition-transform duration-400"/>
            <span className="relative z-10 group-hover:text-choco transition-colors duration-400">Répondre à l'invitation</span>
          </a>
        </div>
      </div>
    </section>
  );
}
