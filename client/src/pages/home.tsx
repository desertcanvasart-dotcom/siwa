import { SEO } from "@/components/seo";
import { organizationSchema } from "@/lib/seo-data";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { IntroStrip } from "@/components/home/IntroStrip";
import { Destinations } from "@/components/home/Destinations";
import { Moments } from "@/components/home/Moments";
import { Philosophy } from "@/components/home/Philosophy";
import { AccommodationGrid } from "@/components/home/AccommodationGrid";
import { Transportation } from "@/components/home/Transportation";
import { Journal } from "@/components/home/Journal";
import { ClosingCTA } from "@/components/home/ClosingCTA";
import { useReveal } from "@/components/home/useReveal";

/**
 * Soléi Homepage — v3.
 *
 * Section rhythm (light = ~75%, dark used as punctuation):
 *   Hero (navy + video) → Intro (cream) → Destinations (cream) →
 *   Moments (white)     → Philosophy (sand-light) → Accommodation (cream) →
 *   Transportation (navy) → Journal (sand-light) → Closing CTA (navy) → Footer.
 */
export default function Home() {
  useReveal();

  return (
    <>
      <SEO
        title="Soléi — From Sea to Sands"
        description="Curated accommodation, experiences, and private transportation across Siwa Oasis and Egypt's North Coast. The moments most travelers never reach."
        path="/"
        jsonLd={organizationSchema()}
      />
      <Nav />
      <main>
        <HeroSection />
        <IntroStrip />
        <Destinations />
        <Moments />
        <Philosophy />
        <AccommodationGrid />
        <Transportation />
        <Journal />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
