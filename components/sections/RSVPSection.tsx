"use client";
import { useEffect, useRef } from "react";

function useReveal(delay="") {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { setTimeout(() => { e.target.classList.add("opacity-100","translate-y-0"); e.target.classList.remove("opacity-0","translate-y-10"); }, delay ? parseInt(delay) : 0); obs.unobserve(e.target); }});
    }, { threshold: 0.1 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

export default function RSVPSection() {
  const r1 = useReveal(); const r2 = useReveal("150"); const r3 = useReveal("300"); const r4 = useReveal("450");
  return (
    <section id="rsvp" className="bg-blush-lt py-36 px-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-script text-[32vw] text-blush opacity-30 pointer-events-none select-none leading-none whitespace-nowrap">Oui</span>
      <div ref={r1} className="opacity-0 translate-y-10 transition-all duration-700 relative z-10">
        <span className="font-sans text-[0.55rem] tracking-[.5em] uppercase text-rose mb-5 block">Réponse souhaitée avant le 1er juillet 2026</span>
      </div>
      <div ref={r2} className="opacity-0 translate-y-10 transition-all duration-700 relative z-10">
        <h2 className="font-script text-choco mb-4" style={{ fontSize:"clamp(3.5rem,8vw,7rem)" }}>Serez-vous parmi nous ?</h2>
      </div>
      <div ref={r3} className="opacity-0 translate-y-10 transition-all duration-700 relative z-10">
        <p className="font-serif italic font-light text-taupe text-xl mb-14">Votre présence est le plus beau des cadeaux</p>
      </div>
      <div ref={r4} className="opacity-0 translate-y-10 transition-all duration-700 relative z-10">
        <a href="#" className="inline-block px-16 py-5 bg-rose text-ivory font-sans text-[0.62rem] font-light tracking-[.35em] uppercase transition-all duration-300 hover:bg-rose-dk hover:-translate-y-1 shadow-[0_20px_60px_rgba(160,96,74,.25)] hover:shadow-[0_28px_70px_rgba(160,96,74,.35)]">
          Je confirme ma présence
        </a>
      </div>
    </section>
  );
}
