import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Arch } from "@/components/ui/Arch";

interface HubStubProps {
  title: string;
  subtitle?: string;
  path: string;
  backHref?: string;
  backLabel?: string;
}

/**
 * Branded placeholder used for destination hub / sub-pages that have not
 * been built yet. Renders Nav + Footer + a centered "coming soon" block
 * so crawlers and users land on a real 200 page rather than a blank
 * NotFound. Removed as each hub ships.
 */
export default function HubStub({
  title,
  subtitle,
  path,
  backHref = "/",
  backLabel = "Back to home",
}: HubStubProps) {
  return (
    <>
      <SEO
        title={`${title} — Soléi`}
        description={
          subtitle ??
          "This section is being prepared. Check back soon for curated content from Soléi."
        }
        path={path}
      />
      <Nav />
      <main className="min-h-screen bg-cream flex items-center justify-center px-6 py-32">
        <div className="max-w-lg text-center">
          <Arch className="w-14 h-auto mx-auto mb-8 opacity-70" />
          <p className="flex justify-center items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-6">
            <span className="block w-6 h-px bg-gold opacity-50" />
            In preparation
            <span className="block w-6 h-px bg-gold opacity-50" />
          </p>
          <h1
            className="font-display text-navy leading-[1.15] mb-6"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-[0.95rem] text-ink-soft leading-[1.9] mb-10">
              {subtitle}
            </p>
          )}
          <Link
            href={backHref}
            className="inline-block text-[0.65rem] tracking-[0.2em] uppercase text-navy bg-gold px-8 py-3 hover:bg-gold-light transition-colors"
          >
            {backLabel}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
