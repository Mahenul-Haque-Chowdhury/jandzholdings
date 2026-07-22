import Navbar from '@/components/Navbar';
import HeroCanvasSequence from '@/components/HeroCanvasSequence';
import About from '@/components/About';
import Stats3D from '@/components/Stats3D';
import Projects from '@/components/Projects';
import Beliefs from '@/components/Beliefs';
import TopLocations from '@/components/TopLocations';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import Animations from '@/components/Animations';
import Preloader from '@/components/Preloader';

export default function Home() {
  return (
    <>
      <Preloader />
      <Animations />
      <Navbar />
      <main className="main-wrapper">
        <HeroCanvasSequence />
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
