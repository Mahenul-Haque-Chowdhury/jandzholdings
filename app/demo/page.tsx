import Navbar from '@/components/Navbar';
import HeroCanvasSequenceDemo from '@/components/HeroCanvasSequenceDemo';
import About from '@/components/About';
import Stats3D from '@/components/Stats3D';
import Projects from '@/components/Projects';
import Beliefs from '@/components/Beliefs';
import TopLocations from '@/components/TopLocations';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import Animations from '@/components/Animations';
import Preloader from '@/components/Preloader';

export default function DemoHome() {
  return (
    <>
      <Preloader />
      <Animations />
      <Navbar />
      <main className="main-wrapper">
        <HeroCanvasSequenceDemo />
        <About />
        <Stats3D />
        <Projects />
        <Beliefs />
        <TopLocations />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
