"use client";
import { useEffect, useRef } from "react";

const moments = [
  { num:"01", year:"2018", title:"La rencontre",     text:"Tout a commencé par un sourire au détour d'une soirée. Ce soir-là, ni l'un ni l'autre ne savait que tout allait changer pour toujours.", note:"Le début de tout",    bg:"from-[#F0D8CC] to-[#E8C4B0]" },
  { num:"02", year:"2020", title:"Le premier voyage", text:"Ensemble pour la première fois loin de chez eux, ils ont découvert que voyager à deux, c'est voir le monde avec des yeux neufs.",            note:"L'aventure à deux",  bg:"from-[#D4E4D0] to-[#C8DABC]" },
  { num:"03", year:"2023", title:"La demande",        text:"Sous un ciel étoilé de Guyane, Steeve a posé la question qui allait sceller leur destin. Edna a dit oui, sans hésiter une seule seconde.", note:"Pour toujours",       bg:"from-[#EDD9C0] to-[#E0C8A8]" },
  { num:"04", year:"2026", title:"Le grand jour",     text:"Le 29 août, entourés de ceux qu'ils aiment, ils unissent leurs vies pour toujours à Macouria. Et vous faites partie de ce moment unique.", note:"Et vous y étiez",    bg:"from-[#F5E2D8] to-[#EDD0C0]" },
];

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

function Moment({ m, reverse }: { m: typeof moments[0]; reverse: boolean }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`opacity-0 translate-y-10 transition-all duration-700 grid grid-cols-1 md:grid-cols-2 min-h-[420px] border-b border-blush-lt ${reverse ? "md:[direction:rtl]" : ""}`}>
      {/* Image */}
      <div className={`relative bg-gradient-to-br ${m.bg} flex items-center justify-center min-h-[240px] ${reverse ? "md:[direction:ltr]" : ""}`}>
        <span className="font-sans text-[0.5rem] tracking-[.4em] uppercase text-taupe/60 z-10">Votre photo ici</span>
      </div>
      {/* Content */}
      <div className={`bg-ivory hover:bg-[#FDF8F4] transition-colors duration-500 p-14 md:p-20 flex flex-col justify-center ${reverse ? "md:[direction:ltr]" : ""}`}>
        <span className="font-script text-[5rem] text-blush leading-none -mb-2 block">{m.num}</span>
        <span className="font-sans text-[0.55rem] tracking-[.4em] uppercase text-rose mb-5 block">{m.year}</span>
        <h3 className="font-serif text-[2.4rem] font-light text-choco mb-5 leading-[1.15]">{m.title}</h3>
        <p className="font-sans text-[0.82rem] font-light text-taupe leading-[1.95] max-w-[340px]">{m.text}</p>
        <div className="flex items-center gap-3 mt-8">
          <span className="w-9 h-px bg-sage block"/>
          <span className="font-serif italic text-[0.85rem] text-sage">{m.note}</span>
        </div>
      </div>
    </div>
  );
}

export default function Story() {
  const bannerRef  = useReveal();
  const bannerRef2 = useReveal();
  const quoteRef   = useReveal();

  return (
    <section id="story" className="bg-ivory">

      {/* Banner */}
      <div className="bg-blush-lt grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] items-center py-24 px-8 md:px-0">
        <div ref={bannerRef} className="opacity-0 translate-y-10 transition-all duration-700 md:px-20 pb-10 md:pb-0">
          <span className="font-sans text-[0.55rem] tracking-[.55em] uppercase text-rose mb-5 block">Notre Histoire</span>
          <h2 className="font-script text-[clamp(3rem,6vw,5rem)] text-choco leading-[1.1]">
            Une belle histoire<br/>d'amour
          </h2>
        </div>
        <div className="hidden md:block w-px bg-blush h-32 self-center"/>
        <div ref={bannerRef2} className="opacity-0 translate-y-10 transition-all duration-700 delay-150 md:px-20 pt-10 md:pt-0">
          <p className="font-serif italic text-[1.1rem] font-light text-taupe leading-[1.8] max-w-md">
            "Depuis leur première rencontre jusqu'à ce grand jour, laissez-vous porter par leur histoire — une histoire de ceux qui ont su reconnaître l'essentiel."
          </p>
        </div>
      </div>

      {/* Moments */}
      {moments.map((m, i) => <Moment key={i} m={m} reverse={i % 2 !== 0}/>)}

      {/* Quote */}
      <div ref={quoteRef} className="opacity-0 translate-y-10 transition-all duration-700 bg-rose py-28 px-8 text-center relative overflow-hidden">
        <span className="absolute top-[-10%] left-1/2 -translate-x-1/2 font-script text-[40vw] text-rose-dk opacity-[.07] leading-none pointer-events-none select-none">"</span>
        <div className="relative z-10">
          <p className="font-serif italic font-light text-ivory leading-[1.5] max-w-3xl mx-auto mb-7"
             style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)" }}>
            "L'amour ne se regarde pas l'un l'autre,<br/>il regarde ensemble dans la même direction."
          </p>
          <span className="font-sans text-[0.55rem] tracking-[.5em] uppercase text-ivory/55">Antoine de Saint-Exupéry</span>
        </div>
      </div>

    </section>
  );
}
