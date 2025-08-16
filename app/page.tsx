import Hero from "./components/Hero";
import { NavbarDemo } from "./components/Navbar";
import { FeaturesSectionDemo } from "./components/ui/bentoGrid";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div>
      <NavbarDemo />
      <Hero></Hero>
      <div id="features-section">
        <FeaturesSectionDemo />
      </div>
      <Footer></Footer>
    </div>
  );
}
