/**
 * Internal preview-only page — renders new Soléi global Nav + Footer
 * over a simple cream canvas so we can validate styling.
 * Remove this file after the migration is complete.
 */
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Arch } from "@/components/ui/Arch";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function PreviewLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      {/* Fake hero so Nav starts transparent */}
      <section className="relative h-[60vh] bg-navy flex items-center justify-center text-white">
        <div className="text-center">
          <Eyebrow light>Preview</Eyebrow>
          <h1 className="font-display text-5xl text-white">New Global Chrome</h1>
          <Arch className="w-14 h-auto mx-auto mt-6 opacity-70" />
        </div>
      </section>

      <main className="flex-1 bg-cream py-24 px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <Eyebrow>Scrolled Nav State</Eyebrow>
          <h2 className="font-display text-4xl text-navy">
            Scroll down to see the nav transition.
          </h2>
          <p className="text-ink leading-relaxed">
            This page only exists to preview the Soléi Nav + Footer components.
            It will be removed once the real pages adopt the global layout.
          </p>
          <div className="h-[60vh]" />
          <h3 className="font-display italic text-2xl text-navy-mid">
            Arch & Eyebrow primitives:
          </h3>
          <div className="flex items-end gap-8">
            <Arch className="w-20 h-auto" />
            <Eyebrow>Curated Stays</Eyebrow>
          </div>
          <div className="h-[40vh]" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
