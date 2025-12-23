import About from "../components/About";
import ElectraPillars from "../components/Pillars";
import Events from "../components/Events";
import SponsorsSection from "../components/Sponsors";
import AlumniSection from "../components/Alumni";
import Hero from "../components/Hero";

export default function Page() {
  return (
    <main>
      <Hero />
      <About />
      <Events />
      <ElectraPillars />
      <SponsorsSection />
      <AlumniSection />
    </main>
  );
}
