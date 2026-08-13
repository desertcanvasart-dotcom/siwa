import { useEffect, useMemo } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { useReveal } from "@/components/home/useReveal";
import type { TourDetail } from "@shared/tour-detail";

/**
 * /siwa-oasis/experiences/:slug + /north-coast/experiences/:slug
 *
 * Tour detail page for the 13 curated bundled tours. Fetches the
 * record from /api/experiences/by-slug and renders a unified layout
 * built around the TourDetail shape (overview, includes, excludes,
 * itinerary, FAQs). When the API has no row for the slug we redirect
 * back to the relevant experiences index.
 */

interface ApiTour {
  id: number;
  slug: string;
  title: string;
  destination: "siwa" | "north-coast" | null;
  category: string;
  duration: string;
  pricePerPerson: string;
  maxGuests: number;
  summary: string;
  description: string;
  imageUrl: string | null;
  details: TourDetail | null;
}

export default function TourDetailPage() {
  useReveal();
  const [, setLocation] = useLocation();
  const [siwaMatch, siwaParams] = useRoute("/siwa-oasis/experiences/:slug");
  const [ncMatch, ncParams] = useRoute("/north-coast/experiences/:slug");
  const [journeyMatch, journeyParams] = useRoute("/journeys/:slug");
  const slug =
    (siwaMatch && siwaParams?.slug) ||
    (ncMatch && ncParams?.slug) ||
    (journeyMatch && journeyParams?.slug) ||
    "";

  const { data: tour, isLoading, isError } = useQuery<ApiTour | null>({
    queryKey: ["/api/experiences/by-slug", slug],
    queryFn: async () => {
      if (!slug) return null;
      const res = await fetch(`/api/experiences/by-slug/${slug}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Failed to load tour (${res.status})`);
      const json = await res.json();
      return json && typeof json === "object" ? json : null;
    },
    enabled: !!slug,
    retry: 1,
    staleTime: 60_000,
  });

  // Only redirect on a confirmed 404, never while loading or on a
  // transient network error.
  useEffect(() => {
    if (!isLoading && !isError && tour === null && slug) {
      const fallback = journeyMatch
        ? "/journeys"
        : ncMatch
        ? "/north-coast/experiences"
        : "/siwa-oasis/experiences";
      setLocation(fallback);
    }
  }, [isLoading, isError, tour, slug, ncMatch, journeyMatch, setLocation]);

  const isJourney = journeyMatch || tour?.category === "Curated Journey";
  const dest = tour?.destination ?? (ncMatch ? "north-coast" : "siwa");
  const isNC = dest === "north-coast";
  const destLabel = isJourney ? "Journeys" : isNC ? "North Coast" : "Siwa Oasis";
  const destHub = isJourney ? "/journeys" : isNC ? "/north-coast" : "/siwa-oasis";
  // Curated journeys live at /journeys/:slug; everything else at
  // /<destination>/experiences/:slug.
  const indexHref = isJourney ? "/journeys" : `${destHub}/experiences`;
  const detailHref = isJourney
    ? `/journeys/${tour?.slug ?? ""}`
    : `${destHub}/experiences/${tour?.slug ?? ""}`;

  const details = useMemo<TourDetail>(() => tour?.details ?? {}, [tour]);
  const overview = details.overview ?? (tour?.description ? [tour.description] : []);

  if (isLoading || tour === undefined) {
    return (
      <>
        <Nav />
        <div className="min-h-[60vh] flex items-center justify-center bg-cream text-ink-soft/55 font-body">
          Loading…
        </div>
        <Footer />
      </>
    );
  }
  if (isError) {
    return (
      <>
        <Nav />
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-cream text-center font-body px-6">
          <p className="text-[0.6rem] tracking-[0.3em] uppercase text-gold mb-3">Tour unavailable</p>
          <p className="text-[0.95rem] text-ink-soft mb-6 max-w-md">
            We couldn't load this tour. Please try again in a moment.
          </p>
          <Link
            href={indexHref}
            className="text-[0.6rem] tracking-[0.22em] uppercase text-navy bg-gold px-6 py-3 hover:bg-gold-light transition-colors"
          >
            Back to all tours
          </Link>
        </div>
        <Footer />
      </>
    );
  }
  if (!tour) return null;

  // Journeys are multi-night, private by definition, and may span both
  // regions — so they enquire as a journey, and only pass a destination
  // when the record actually has one (tour.destination is null for the
  // cross-destination journeys).
  const enquireHref = isJourney
    ? `/enquire?type=experience&journey=${tour.slug}` +
      (tour.destination === "siwa" || tour.destination === "north-coast"
        ? `&destination=${tour.destination}`
        : "")
    : `/enquire?type=experience&destination=${dest === "siwa" ? "siwa" : "north-coast"}&exp=${tour.slug}`;
  const pricePerPerson = Number(tour.pricePerPerson || "0");

  return (
    <>
      <SEO
        title={`${tour.title} — ${destLabel} | Soléi`}
        description={`${tour.duration}. ${tour.summary.slice(0, 160)}`}
        path={detailHref}
      />
      <Nav />

      <main className="bg-cream">
        {/* ── HERO ────────────────────────────────────── */}
        <section className="relative bg-navy overflow-hidden">
          <div className="absolute inset-0">
            {tour.imageUrl ? (
              <img
                src={tour.imageUrl}
                alt={tour.title}
                className="absolute inset-0 w-full h-full object-cover opacity-55"
              />
            ) : null}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(9,24,32,0.95) 0%, rgba(9,24,32,0.55) 55%, rgba(9,24,32,0.3) 100%)",
              }}
            />
          </div>

          <div className="relative max-w-6xl mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-16 md:pb-24">
            <Link
              href={indexHref}
              className="text-[0.6rem] tracking-[0.22em] uppercase text-gold/80 hover:text-gold transition-colors font-body inline-flex items-center gap-2"
            >
              ← {isJourney ? "All journeys" : `${destLabel} experiences`}
            </Link>

            <p className="mt-8 flex items-center gap-3 text-[0.6rem] tracking-[0.3em] uppercase text-gold">
              <span className="block w-6 h-px bg-gold opacity-60" />
              {tour.category}
            </p>
            <h1
              className="reveal font-display font-normal text-white leading-[1.1] mt-4 max-w-3xl"
              style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)" }}
            >
              {tour.title}
            </h1>
            <p className="mt-6 text-[0.95rem] md:text-[1rem] text-white/65 leading-[1.85] max-w-2xl font-body">
              {tour.summary}
            </p>

            <div className="mt-10 flex flex-wrap items-end gap-x-10 gap-y-4">
              <div>
                <p className="text-[0.55rem] tracking-[0.22em] uppercase text-white/45 mb-1">Duration</p>
                <p className="font-display text-[1rem] text-white">{tour.duration}</p>
              </div>
              <div>
                <p className="text-[0.55rem] tracking-[0.22em] uppercase text-white/45 mb-1">Max guests</p>
                <p className="font-display text-[1rem] text-white">{tour.maxGuests}</p>
              </div>
              <div>
                <p className="text-[0.55rem] tracking-[0.22em] uppercase text-white/45 mb-1">From</p>
                <p className="font-display text-[1.3rem] text-gold">
                  €{pricePerPerson}
                  <span className="text-white/45 text-[0.85rem] font-body ml-1">/ guest</span>
                </p>
              </div>
              <Link
                href={enquireHref}
                className="ml-auto bg-gold text-navy px-7 py-3 text-[0.62rem] tracking-[0.22em] uppercase font-body hover:bg-gold-light transition-colors"
              >
                {isJourney ? "Request this journey" : "Request this experience"} →
              </Link>
            </div>
          </div>
        </section>

        {/* ── BODY GRID ─────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
          <div>
            {/* Overview */}
            {overview.length > 0 && (
              <div className="reveal mb-14">
                <p className="text-[0.55rem] tracking-[0.3em] uppercase text-gold mb-3">Overview</p>
                <h2 className="font-display text-[1.5rem] text-navy mb-6">
                  About this <em className="italic text-coastal">experience</em>
                </h2>
                {overview.map((p, i) => (
                  <p key={i} className="text-[0.92rem] text-ink-soft leading-[1.95] mb-4 font-body">
                    {p}
                  </p>
                ))}
              </div>
            )}

            {/* Includes / Excludes */}
            {(details.includes?.length || details.excludes?.length) && (
              <div className="reveal mb-14 grid grid-cols-1 md:grid-cols-2 gap-8">
                {details.includes && details.includes.length > 0 && (
                  <div>
                    <p className="text-[0.55rem] tracking-[0.3em] uppercase text-gold mb-3">
                      What's included
                    </p>
                    <ul className="space-y-2.5">
                      {details.includes.map((item, i) => (
                        <li key={i} className="flex gap-3 text-[0.88rem] text-ink-soft font-body leading-[1.7]">
                          <span className="text-gold flex-shrink-0 mt-0.5">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {details.excludes && details.excludes.length > 0 && (
                  <div>
                    <p className="text-[0.55rem] tracking-[0.3em] uppercase text-ink-soft/55 mb-3">
                      Not included
                    </p>
                    <ul className="space-y-2.5">
                      {details.excludes.map((item, i) => (
                        <li key={i} className="flex gap-3 text-[0.88rem] text-ink-soft/65 font-body leading-[1.7]">
                          <span className="text-ink-soft/45 flex-shrink-0 mt-0.5">×</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Itinerary */}
            {details.itinerary && details.itinerary.length > 0 && (
              <div className="reveal mb-14">
                <p className="text-[0.55rem] tracking-[0.3em] uppercase text-gold mb-3">Itinerary</p>
                <h2 className="font-display text-[1.5rem] text-navy mb-8">
                  How the <em className="italic text-coastal">experience</em> unfolds
                </h2>
                <ol className="border-l border-sand pl-6 space-y-7">
                  {details.itinerary.map((step, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 bg-gold rounded-full" />
                      <p className="text-[0.6rem] tracking-[0.22em] uppercase text-gold mb-1.5 font-body">
                        {step.time}
                      </p>
                      <h3 className="font-display text-[1.05rem] text-navy mb-1.5">{step.title}</h3>
                      <p className="text-[0.86rem] text-ink-soft leading-[1.85] font-body">{step.body}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* What to bring */}
            {details.whatToBring && details.whatToBring.length > 0 && (
              <div className="reveal mb-14">
                <p className="text-[0.55rem] tracking-[0.3em] uppercase text-gold mb-3">What to bring</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
                  {details.whatToBring.map((item, i) => (
                    <li key={i} className="flex gap-3 text-[0.88rem] text-ink-soft font-body leading-[1.7]">
                      <span className="text-gold flex-shrink-0">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* FAQs */}
            {details.faqs && details.faqs.length > 0 && (
              <div className="reveal mb-14">
                <p className="text-[0.55rem] tracking-[0.3em] uppercase text-gold mb-3">FAQs</p>
                <h2 className="font-display text-[1.5rem] text-navy mb-8">
                  Things <em className="italic text-coastal">guests ask</em>
                </h2>
                <div className="space-y-6">
                  {details.faqs.map((f, i) => (
                    <div key={i} className="border-l-2 border-sand pl-5">
                      <p className="font-display text-[1rem] text-navy mb-2">{f.q}</p>
                      <p className="text-[0.86rem] text-ink-soft leading-[1.85] font-body">{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {details.reviews && details.reviews.length > 0 && (
              <div className="reveal mb-14">
                <p className="text-[0.55rem] tracking-[0.3em] uppercase text-gold mb-3">Recent guests</p>
                <div className="space-y-8">
                  {details.reviews.map((r, i) => (
                    <div key={i}>
                      <p className="text-[0.92rem] text-ink-soft italic leading-[1.85] font-body mb-2">
                        “{r.text}”
                      </p>
                      <p className="text-[0.6rem] tracking-[0.22em] uppercase text-ink-soft/55">
                        {r.name} · {r.origin}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky side card */}
          <aside className="lg:sticky lg:top-24 self-start">
            <div className="bg-white border border-sand p-7">
              <p className="text-[0.55rem] tracking-[0.3em] uppercase text-gold mb-1">From</p>
              <p className="font-display text-[1.6rem] text-navy">
                €{pricePerPerson}
                <span className="text-ink-soft/55 text-[0.78rem] font-body ml-2">per guest</span>
              </p>

              <dl className="mt-6 space-y-3 text-[0.84rem]">
                <div className="flex justify-between gap-4 border-t border-sand-light pt-3">
                  <dt className="text-ink-soft/65 font-body">Duration</dt>
                  <dd className="text-navy font-display text-right">{tour.duration}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-sand-light pt-3">
                  <dt className="text-ink-soft/65 font-body">Max guests</dt>
                  <dd className="text-navy font-display">{tour.maxGuests}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-sand-light pt-3">
                  <dt className="text-ink-soft/65 font-body">Category</dt>
                  <dd className="text-navy font-display text-right">{tour.category}</dd>
                </div>
                {/* Admin-defined custom fields, same row style */}
                {(details.facts ?? [])
                  .filter((f) => f.label?.trim() && f.value?.trim())
                  .map((f) => (
                    <div key={f.label} className="flex justify-between gap-4 border-t border-sand-light pt-3">
                      <dt className="text-ink-soft/65 font-body">{f.label}</dt>
                      <dd className="text-navy font-display text-right">{f.value}</dd>
                    </div>
                  ))}
              </dl>

              <Link
                href={enquireHref}
                className="mt-6 block text-center bg-gold text-navy py-3 text-[0.62rem] tracking-[0.22em] uppercase font-body hover:bg-gold-light transition-colors"
              >
                {isJourney ? "Request this journey" : "Request this experience"}
              </Link>

              {(details.meetingPoint || details.cancellationPolicy) && (
                <div className="mt-6 pt-6 border-t border-sand-light space-y-3">
                  {details.meetingPoint && (
                    <div>
                      <p className="text-[0.55rem] tracking-[0.22em] uppercase text-ink-soft/55 mb-1">
                        Meeting point
                      </p>
                      <p className="text-[0.78rem] text-ink-soft leading-[1.7] font-body">
                        {details.meetingPoint}
                      </p>
                    </div>
                  )}
                  {details.cancellationPolicy && (
                    <div>
                      <p className="text-[0.55rem] tracking-[0.22em] uppercase text-ink-soft/55 mb-1">
                        Cancellation
                      </p>
                      <p className="text-[0.78rem] text-ink-soft leading-[1.7] font-body">
                        {details.cancellationPolicy}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}
