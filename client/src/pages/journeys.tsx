import { useMemo } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { useReveal } from "@/components/home/useReveal";

/**
 * /journeys
 *
 * Public index for the Soléi Curated Journeys — multi-night packages
 * stored in the experiences table with category = "Curated Journey".
 * Grouped into North Coast / Siwa / Signature (combo) sections.
 */

interface Journey {
  id: number;
  slug: string;
  title: string;
  destination: "siwa" | "north-coast" | null;
  category: string;
  duration: string;
  summary: string;
  pricePerPerson: string;
  imageUrl: string | null;
}

const GRADIENTS = {
  "north-coast": "bg-[linear-gradient(155deg,#2F6F8F_0%,#1a4a6a_100%)]",
  siwa: "bg-[linear-gradient(155deg,#1a3a52_0%,#0F2436_100%)]",
  signature: "bg-[linear-gradient(155deg,#3a2a1a_0%,#0F2436_100%)]",
};

export default function JourneysPage() {
  useReveal();

  const { data: experiences = [], isLoading } = useQuery<Journey[]>({
    queryKey: ["/api/experiences"],
    queryFn: async () => {
      const res = await fetch("/api/experiences");
      if (!res.ok) return [];
      const json = await res.json();
      return Array.isArray(json) ? json : [];
    },
    staleTime: 60_000,
  });

  const journeys = useMemo(
    () => experiences.filter((e) => e.category === "Curated Journey"),
    [experiences],
  );

  const ncJourneys = journeys.filter((j) => j.destination === "north-coast");
  const siwaJourneys = journeys.filter((j) => j.destination === "siwa");
  const signatureJourneys = journeys.filter((j) => j.destination === null);

  return (
    <>
      <SEO
        title="Soléi Curated Journeys — From Sea to Sands"
        description="Multi-night curated journeys across Siwa Oasis and Egypt's North Coast. Seven packages designed around accommodation, experiences, and the rhythm of each destination."
        path="/journeys"
      />
      <Nav darkHero />

      <main>
        {/* ── HERO ──────────────────────────────────────────── */}
        <section className="relative bg-navy text-cream overflow-hidden min-h-[60vh] flex items-end">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(155deg,#0F2436 0%,#1a3a52 55%,#2a1a14 100%)",
            }}
          />
          <div className="absolute inset-0 textile-bg pointer-events-none" />
          <div className="relative max-w-5xl mx-auto w-full px-6 md:px-12 lg:px-20 pt-32 pb-16 md:pt-40 md:pb-20">
            <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-6">
              <span className="block w-[22px] h-px bg-gold opacity-60" />
              Curated Journeys
            </p>
            <h1
              className="font-display font-normal text-white leading-[1.08] mb-8"
              style={{ fontSize: "clamp(2.4rem, 6vw, 4.8rem)" }}
            >
              From <em className="italic text-gold">sea</em> to{" "}
              <em className="italic text-gold">sands.</em>
            </h1>
            <p className="text-[0.95rem] text-white/55 max-w-[58ch] leading-[1.9]">
              Seven multi-night journeys designed end-to-end — accommodation,
              experiences, transfers, and the small details that turn a trip
              into something you remember properly.
            </p>
          </div>
        </section>

        {/* ── BODY ──────────────────────────────────────────── */}
        <section className="bg-cream px-6 md:px-12 lg:px-20 py-20 md:py-24">
          <div className="max-w-5xl mx-auto space-y-20">
            {isLoading && (
              <p className="text-[0.78rem] text-ink-soft/55 tracking-[0.22em] uppercase text-center py-20">
                Loading journeys…
              </p>
            )}

            {!isLoading && journeys.length === 0 && (
              <p className="text-[0.78rem] text-ink-soft/55 tracking-[0.22em] uppercase text-center py-20">
                No journeys available right now. Check back soon.
              </p>
            )}

            {signatureJourneys.length > 0 && (
              <JourneyGroup
                eyebrow="Signature · Coast + Siwa"
                title="From the Sea to the Sands"
                description="The combined arc — the most popular Soléi itineraries that take you across both destinations."
                items={signatureJourneys}
                gradientKey="signature"
              />
            )}

            {ncJourneys.length > 0 && (
              <JourneyGroup
                eyebrow="North Coast"
                title="Mediterranean stays"
                description="Coastal-only journeys built around the rhythm of the sea."
                items={ncJourneys}
                gradientKey="north-coast"
              />
            )}

            {siwaJourneys.length > 0 && (
              <JourneyGroup
                eyebrow="Siwa Oasis"
                title="Desert + oasis journeys"
                description="Siwa-only journeys built around the desert, salt lakes, and the quiet pace of the oasis."
                items={siwaJourneys}
                gradientKey="siwa"
              />
            )}
          </div>
        </section>

        {/* ── CLOSING ───────────────────────────────────────── */}
        <section className="bg-navy text-cream px-6 md:px-12 lg:px-20 py-20 md:py-24 text-center">
          <div className="max-w-2xl mx-auto">
            <h2
              className="font-display font-normal leading-[1.2] mb-5"
              style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.6rem)" }}
            >
              Not sure which fits you?{" "}
              <em className="italic text-gold">Ask us.</em>
            </h2>
            <p className="text-[0.9rem] text-cream/55 leading-[1.9] mb-8">
              Every journey is fully bookable as-is or fully adjustable. Tell
              us how you travel and we'll match you to the right shape.
            </p>
            <Link
              href="/enquire?type=experience"
              className="inline-block text-[0.62rem] tracking-[0.22em] uppercase text-navy bg-gold px-8 py-4 hover:bg-gold-light transition-colors"
            >
              Plan your journey
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function JourneyGroup({
  eyebrow,
  title,
  description,
  items,
  gradientKey,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: Journey[];
  gradientKey: keyof typeof GRADIENTS;
}) {
  return (
    <div>
      <div className="reveal pb-6 mb-8 border-b border-sand">
        <p className="text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-3">
          {eyebrow}
        </p>
        <h2
          className="font-display font-normal text-navy leading-[1.2] mb-2"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
        >
          {title}
        </h2>
        <p className="text-[0.88rem] text-ink-soft leading-[1.85] max-w-[64ch]">
          {description}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
        {items.map((j) => (
          <JourneyCard key={j.slug} journey={j} gradientKey={gradientKey} />
        ))}
      </div>
    </div>
  );
}

function JourneyCard({
  journey,
  gradientKey,
}: {
  journey: Journey;
  gradientKey: keyof typeof GRADIENTS;
}) {
  return (
    <Link
      href={`/journeys/${journey.slug}`}
      className="reveal group bg-white border border-sand hover:border-gold transition-colors duration-300 block overflow-hidden"
    >
      <div className={`relative h-[240px] overflow-hidden ${GRADIENTS[gradientKey]}`}>
        {journey.imageUrl && (
          <img
            src={journey.imageUrl}
            alt={journey.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <span className="absolute top-4 left-4 text-[0.54rem] tracking-[0.2em] uppercase text-gold bg-navy-deep/75 backdrop-blur-sm px-3 py-1">
          {journey.duration}
        </span>
      </div>
      <div className="p-7">
        <h3 className="font-display text-[1.3rem] font-normal text-navy leading-[1.25] mb-2">
          {journey.title}
        </h3>
        <p className="text-[0.86rem] text-ink-soft leading-[1.85] mb-5">
          {journey.summary}
        </p>
        <div className="flex justify-between items-center pt-4 border-t border-sand-light">
          <div>
            <p className="text-[0.62rem] text-ink-soft/55">From</p>
            <p className="font-display text-[1.05rem] text-navy">
              €{Number(journey.pricePerPerson).toFixed(0)} pp
            </p>
          </div>
          <span className="text-[0.6rem] tracking-[0.18em] uppercase text-gold group-hover:underline">
            Request stay →
          </span>
        </div>
      </div>
    </Link>
  );
}
