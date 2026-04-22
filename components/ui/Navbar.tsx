"use client";
import { useState, useEffect } from "react";

const links = [
  { label: "Notre Histoire", href: "#story"   },
  { label: "Le Jour J",      href: "#details" },
  { label: "RSVP",           href: "#rsvp"    },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-ivory/95 backdrop-blur-md border-b border-blush-lt py-4" : "py-7"}`}>
      <div className="max-w-7xl mx-auto px-16 flex items-center justify-between">
        <a href="#hero" className="font-script text-3xl text-choco">Steeve & Edna</a>
        <div className="hidden md:flex gap-12">
          {links.map(l => (
            <a key={l.href} href={l.href}
               className="font-sans text-[0.6rem] font-light tracking-[.25em] uppercase text-taupe hover:text-rose transition-colors duration-300">
              {l.label}
            </a>
          ))}
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden flex flex-col gap-1.5 p-2">
          <span className={`block w-6 h-px bg-choco transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`}/>
          <span className={`block w-6 h-px bg-choco transition-all duration-300 ${open ? "opacity-0" : ""}`}/>
          <span className={`block w-6 h-px bg-choco transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`}/>
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-ivory border-t border-blush-lt px-16 py-6 flex flex-col gap-5">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
               className="font-sans text-[0.6rem] font-light tracking-[.25em] uppercase text-taupe hover:text-rose transition-colors">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
