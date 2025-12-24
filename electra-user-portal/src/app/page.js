import About from "../components/Home/About";
import ElectraPillars from "../components/Home/Pillars";
import Events from "../components/Home/Events";
import SponsorsSection from "../components/Home/Sponsors";
import AlumniSection from "../components/Home/Alumni";
import Hero from "../components/Home/Hero";

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
