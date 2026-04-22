import Navbar      from "@/components/ui/Navbar";
import Hero        from "@/components/sections/Hero";
import Story       from "@/components/sections/Story";
import Details     from "@/components/sections/Details";
import RSVPSection from "@/components/sections/RSVPSection";

export default function Home() {
  return (
    <main>
      <Navbar/>
      <Hero/>
      <Story/>
      <Details/>
      <RSVPSection/>
      <footer className="bg-choco px-20 py-12 flex items-center justify-between">
        <span className="font-script text-ivory text-3xl">Steeve & Edna</span>
        <span className="font-serif italic text-rose text-xl">♡</span>
        <span className="font-sans text-[0.55rem] tracking-[.4em] uppercase text-taupe">29 Août 2026 · Macouria, Guyane</span>
      </footer>
    </main>
  );
}
