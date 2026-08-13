import { useEffect, useMemo, useState } from "react";
import { Link, useRoute, useLocation } from "wouter";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { useReveal } from "@/components/home/useReveal";
import { getHotelDetail, type HotelDetail } from "@/lib/hotel-data";
import { useHotelOverlay, useHotelOverlayQuery } from "@/lib/useHotelOverlay";
import { useHotelsBySlug } from "@/lib/useHotelsBySlug";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const siwaStubGradient =
  "bg-[linear-gradient(155deg,#1a3a52_0%,#0F2436_50%,#0a1e2e_100%)]";
const coastalStubGradient =
  "bg-[linear-gradient(155deg,#0F2436_0%,#2F6F8F_55%,#1a5a7a_100%)]";

/**
 * /siwa-oasis/accommodation/:slug + /north-coast/accommodation/:slug
 *
 * Unified detail template. The booking panel behaviour switches on
 * `hotel.destination`:
 *   • Siwa: navy panel, "Book directly", date picker + price calc, gold CTA
 *   • North Coast: coastal panel, "Make a reservation", 3-step explainer +
 *     enquiry form, coastal CTA
 *
 * Only the right column, sticky bar CTA, and note below the button change
 * by destination — content layout is identical.
 */
export default function HotelDetailPage() {
  useReveal();
  const [, setLocation] = useLocation();
  const [siwaMatch, siwaParams] = useRoute("/siwa-oasis/accommodation/:slug");
  const [ncMatch, ncParams] = useRoute("/north-coast/accommodation/:slug");

  const slug =
    (siwaMatch && siwaParams?.slug) ||
    (ncMatch && ncParams?.slug) ||
    "";

  const baseFromTs = useMemo(() => getHotelDetail(slug), [slug]);
  const { isLoading: overlayLoading, isFetched: overlayFetched } = useHotelOverlayQuery(slug);
  const overlay = useHotelOverlay(slug);
  const hotelsMap = useHotelsBySlug();

  // Lightbox state for the "View all photos" gallery.
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // If the slug isn't in the inline TS file but an overlay exists
  // (a hotel created via the admin wizard), synthesize a minimal
  // baseHotel from the overlay so the page can still render.
  const baseHotel = useMemo<HotelDetail | null>(() => {
    if (baseFromTs) return baseFromTs;
    if (!overlay) return null;
    const isNc = (overlay as any).destination === "north-coast";
    const stubGradient = isNc ? coastalStubGradient : siwaStubGradient;
    return {
      slug,
      destination: isNc ? "north-coast" : "siwa-oasis",
      name: overlay.name || slug,
      nameMain: overlay.name || slug,
      tagLine: overlay.blurb || "",
      heroTag: overlay.blurb || "",
      heroMeta: [],
      gradient: stubGradient,
      intro: overlay.description ? [overlay.description] : [],
      eyebrow: "The property",
      headline: overlay.name || slug,
      headlineItalic: "",
      facts: [],
      amenities: overlay.amenities || [],
      rooms: [],
      location: [],
      reviews: [],
      gallerySize: 0,
      related: [],
      basePrice: 0,
      // Same rule as the merge below: a price-looking string can't be
      // the label (the € amount is rendered separately).
      priceLabel:
        overlay.pricePerNight && !/\d/.test(overlay.pricePerNight)
          ? overlay.pricePerNight
          : overlay.pricePerNight
            ? "/ night"
            : "On request",
      breadcrumbLabel: overlay.name || slug,
    };
  }, [baseFromTs, overlay, slug]);

  // Merge the editable fields from the API on top of the rich TS-file
  // detail. If the API has no record, baseHotel is used unchanged.
  const hotel = useMemo<HotelDetail | null>(() => {
    if (!baseHotel) return null;
    if (!overlay) return baseHotel;
    const d = overlay.details ?? {};
    const nonEmpty = <T,>(v: T[] | undefined): T[] | undefined =>
      v && v.length > 0 ? v : undefined;

    // The displayed "from" price is dynamic, never a stale hardcoded
    // number: lowest room rate first (rooms are admin-edited in the
    // hotel wizard), then the admin's pricePerNight field, then the
    // inline TS fallback. Keeps the sticky bar consistent with the
    // room-rate table when the admin changes rates.
    const rooms = nonEmpty(d.rooms) ?? baseHotel.rooms;
    const roomPrices = rooms
      .map((r) => r.price)
      .filter((p): p is number => typeof p === "number" && p > 0);
    const overlayPrice = parseFloat(
      String(overlay.pricePerNight ?? "").replace(/[^\d.]/g, ""),
    );
    const basePrice =
      roomPrices.length > 0
        ? Math.min(...roomPrices)
        : Number.isFinite(overlayPrice) && overlayPrice > 0
          ? overlayPrice
          : baseHotel.basePrice;

    // Hero meta can carry a price string too ("From €145 / night") —
    // keep any € amount in it in sync with the dynamic price.
    const heroMeta = (nonEmpty(d.heroMeta) ?? baseHotel.heroMeta).map((m) =>
      basePrice > 0 ? m.replace(/€\s?\d+(?:[.,]\d+)?/, `€${basePrice}`) : m,
    );

    return {
      ...baseHotel,
      basePrice,
      name: overlay.name || baseHotel.name,
      tagLine: d.tagLine || overlay.blurb || baseHotel.tagLine,
      heroTag: d.heroTag || overlay.blurb || baseHotel.heroTag,
      heroMeta,
      eyebrow: d.eyebrow || baseHotel.eyebrow,
      headline: d.headline || baseHotel.headline,
      headlineItalic: d.headlineItalic || baseHotel.headlineItalic,
      intro: nonEmpty(d.intro) ?? baseHotel.intro,
      facts: nonEmpty(d.facts) ?? baseHotel.facts,
      rooms,
      location: nonEmpty(d.location) ?? baseHotel.location,
      reviews: nonEmpty(d.reviews) ?? baseHotel.reviews,
      amenities:
        overlay.amenities && overlay.amenities.length > 0
          ? overlay.amenities
          : baseHotel.amenities,
      // overlay.pricePerNight is a price string ("€145 / night") — only
      // usable as a label when it doesn't itself contain a number, or
      // the bar would read "€199 €145 / night".
      priceLabel:
        d.priceLabel ||
        (overlay.pricePerNight && !/\d/.test(overlay.pricePerNight)
          ? overlay.pricePerNight
          : baseHotel.priceLabel),
      coverImage: overlay.imageUrl || baseHotel.coverImage,
      gallery: nonEmpty(d.gallery) ?? baseHotel.gallery,
    };
  }, [baseHotel, overlay]);

  // Full ordered photo set for the lightbox: cover first, then the
  // gallery, plus any per-room photos — de-duplicated, blanks removed.
  const galleryImages = useMemo(() => {
    if (!hotel) return [] as string[];
    const all = [
      hotel.coverImage,
      ...(hotel.gallery ?? []),
      ...hotel.rooms.map((r) => r.image),
    ].filter((u): u is string => !!u && u.trim().length > 0);
    return Array.from(new Set(all));
  }, [hotel]);

  // Related "Other properties" cards. Prefer the explicit related slugs
  // from the TS file; when a hotel (e.g. one created in the dashboard)
  // has none, fall back to other live hotels in the same destination.
  // Each card's cover image comes from the /api/hotels overlay so newly
  // uploaded photos show up.
  const relatedCards = useMemo(() => {
    if (!hotel) return [] as Array<{ slug: string; name: string; tagLine: string; destination: string; basePrice: number; gradient: string; image?: string }>;
    const wantSiwa = hotel.destination === "siwa-oasis";
    const mkFromDetail = (r: HotelDetail) => ({
      slug: r.slug,
      name: r.name,
      tagLine: r.tagLine,
      destination: r.destination,
      basePrice: r.basePrice,
      gradient: r.gradient,
      image: hotelsMap.get(r.slug)?.imageUrl || r.coverImage,
    });

    let cards = hotel.related
      .map((s) => getHotelDetail(s))
      .filter((h): h is HotelDetail => !!h)
      .map(mkFromDetail);

    if (cards.length === 0) {
      // Fallback: sibling hotels from the API map, same destination,
      // excluding the current one.
      hotelsMap.forEach((o, s) => {
        if (cards.length >= 3) return;
        if (s === hotel.slug) return;
        const oIsSiwa = (o as any).destination !== "north-coast";
        if (oIsSiwa !== wantSiwa) return;
        const ts = getHotelDetail(s);
        cards.push({
          slug: s,
          name: o.name || ts?.name || s,
          tagLine: ts?.tagLine || o.blurb || "",
          destination: wantSiwa ? "siwa-oasis" : "north-coast",
          basePrice: ts?.basePrice ?? 0,
          gradient: ts?.gradient || (wantSiwa ? siwaStubGradient : coastalStubGradient),
          image: o.imageUrl || ts?.coverImage,
        });
      });
    }
    return cards.slice(0, 3);
  }, [hotel, hotelsMap]);

  // Redirect to the hub when the API returns no record (drafted or
  // missing). The API is the source of truth — if it 404s, the hotel
  // should disappear from the public site even when the inline TS
  // file still has it. Wait for the query to finish first so we don't
  // bounce mid-load.
  useEffect(() => {
    if (!slug) return;
    if (overlayLoading || !overlayFetched) return;
    if (overlay) return;
    const hub = ncMatch ? "/north-coast/accommodation" : "/siwa-oasis/accommodation";
    setLocation(hub);
  }, [slug, overlay, overlayLoading, overlayFetched, ncMatch, setLocation]);

  // Don't render anything while loading (avoid a flash of the inline
  // TS content for a drafted hotel before the redirect fires).
  if (overlayLoading || !overlayFetched) return null;
  if (!overlay) return null;
  if (!hotel) return null;

  const isSiwa = hotel.destination === "siwa-oasis";

  return (
    <>
      <SEO
        title={`${hotel.name} — ${isSiwa ? "Siwa Oasis" : "North Coast"} | Soléi`}
        description={`${hotel.tagLine}. ${hotel.intro[0].slice(0, 160)}`}
        path={`/${hotel.destination}/accommodation/${hotel.slug}`}
      />
      <Nav />

      <main>
        {/* ── HERO ────────────────────────────────────────────── */}
        <section
          className={`relative min-h-[90vh] overflow-hidden flex flex-col justify-end px-6 md:px-12 lg:px-20 pt-32 pb-20 ${hotel.gradient}`}
        >
          {/* Cover photo (admin "Card image"). Sits behind the texture +
              scrim so the existing overlay copy stays legible. */}
          {hotel.coverImage && (
            <img
              src={hotel.coverImage}
              alt={hotel.name}
              className="absolute inset-0 w-full h-full object-cover"
              // @ts-ignore — valid HTML attribute, React types lag behind
              fetchPriority="high"
            />
          )}
          {/* Texture + scrim */}
          <div className="absolute inset-0 textile-bg pointer-events-none" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(9,24,32,0.92) 0%, rgba(9,24,32,0.3) 50%, rgba(9,24,32,0.1) 100%)",
            }}
          />

          {/* Gallery button — only when there are photos to show. */}
          {galleryImages.length > 0 && (
            <button
              type="button"
              onClick={() => { setGalleryIndex(0); setGalleryOpen(true); }}
              className="absolute bottom-16 right-6 md:right-12 lg:right-20 z-[5] text-[0.6rem] tracking-[0.2em] uppercase text-white/70 bg-navy-deep/55 border border-white/15 px-5 py-2.5 backdrop-blur-md hover:text-gold hover:border-gold/40 transition-colors font-body"
            >
              View all photos → {galleryImages.length}
            </button>
          )}

          <div className="relative z-[2] max-w-[820px]">
            <p className="flex items-center gap-3 text-[0.56rem] tracking-[0.25em] uppercase text-white/25 mb-6 animate-fade-up animation-delay-200">
              <Link href="/" className="hover:text-gold transition-colors">
                Soléi
              </Link>
              <span className="opacity-35">/</span>
              <Link
                href={`/${hotel.destination}`}
                className="hover:text-gold transition-colors"
              >
                {isSiwa ? "Siwa Oasis" : "North Coast"}
              </Link>
              <span className="opacity-35">/</span>
              <Link
                href={`/${hotel.destination}/accommodation`}
                className="hover:text-gold transition-colors"
              >
                Accommodation
              </Link>
              <span className="opacity-35">/</span>
              <span>{hotel.breadcrumbLabel}</span>
            </p>

            <p className="inline-flex items-center gap-2 text-[0.56rem] tracking-[0.22em] uppercase text-gold mb-4 animate-fade-up animation-delay-400">
              <span className="block w-4 h-px bg-gold opacity-50" />
              {hotel.heroTag}
            </p>

            <h1
              className="font-display font-normal leading-[1.08] text-white mb-4 animate-fade-up animation-delay-600"
              style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)" }}
            >
              {hotel.nameMain}{" "}
              {hotel.nameItalic && (
                <em className="italic text-gold">{hotel.nameItalic}</em>
              )}
            </h1>

            <div className="flex items-center gap-6 flex-wrap animate-fade-up animation-delay-800">
              {hotel.heroMeta.map((item, i) => (
                <span
                  key={item}
                  className="flex items-center gap-2 text-[0.72rem] text-white/35 tracking-wide"
                >
                  {i > 0 && (
                    <span className="block w-1 h-1 rounded-full bg-gold opacity-50" />
                  )}
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── STICKY BOOKING BAR ─────────────────────────────── */}
        <div className="sticky top-[64px] z-[40] bg-white border-b border-sand shadow-[0_2px_20px_rgba(9,24,32,0.06)]">
          <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 min-h-[60px] py-2 md:py-0">
            <div className="font-display text-[1rem] text-navy">
              {hotel.name}
            </div>
            <div className="text-[0.82rem] text-ink-soft">
              {/* The amount is the lowest room rate, so say "From" —
                  otherwise the cheapest room reads as THE price. */}
              {hotel.rooms.length > 1 && (
                <span className="text-[0.68rem] text-ink-soft/60">From </span>
              )}
              <strong className="font-display text-[1.1rem] text-navy font-normal">
                €{hotel.basePrice}
              </strong>{" "}
              {hotel.priceLabel}
            </div>
            <a
              href="#booking-panel"
              className={`text-[0.62rem] tracking-[0.18em] uppercase px-5 py-2.5 whitespace-nowrap transition-colors ${
                isSiwa
                  ? "text-navy bg-gold hover:bg-gold-light"
                  : "text-coastal border border-coastal hover:bg-coastal hover:text-white"
              }`}
            >
              {isSiwa ? "Book now" : "Enquire to book"}
            </a>
          </div>
        </div>

        {/* ── BODY ────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-20 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16 items-start">
          {/* ── LEFT COLUMN ── */}
          <div>
            {/* Overview */}
            <BlockSection
              eyebrow={hotel.eyebrow}
              headline={hotel.headline}
              headlineItalic={hotel.headlineItalic}
            >
              {hotel.intro.map((p, i) => (
                <p
                  key={i}
                  className="text-[0.9rem] text-ink-soft leading-[1.95] mb-5 last:mb-0"
                >
                  {p}
                </p>
              ))}
            </BlockSection>

            {/* Quick facts */}
            <BlockSection eyebrow="At a glance">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]">
                {hotel.facts.map((f) => (
                  <div
                    key={f.label}
                    className="bg-white border border-sand px-5 py-4"
                  >
                    <p className="text-[0.56rem] tracking-[0.22em] uppercase text-ink-soft/50 mb-1">
                      {f.label}
                    </p>
                    <p className="font-display text-[0.95rem] text-navy leading-[1.3]">
                      {f.value}
                    </p>
                  </div>
                ))}
              </div>
            </BlockSection>

            {/* Amenities */}
            <BlockSection
              eyebrow="What's included"
              headline="Amenities &"
              headlineItalic="inclusions."
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                {hotel.amenities.map((a, i, arr) => {
                  const isLastRow = i >= arr.length - (arr.length % 2 || 2);
                  return (
                    <div
                      key={a}
                      className={`flex items-center gap-3 py-3 text-[0.82rem] text-ink-soft ${
                        isLastRow ? "" : "border-b border-sand-light"
                      }`}
                    >
                      <span className="w-[5px] h-[5px] rounded-full bg-gold opacity-60 flex-shrink-0" />
                      {a}
                    </div>
                  );
                })}
              </div>
            </BlockSection>

            {/* Rooms */}
            <BlockSection
              eyebrow="Room types"
              headline="Choose your"
              headlineItalic="room."
            >
              <div className="flex flex-col gap-[2px]">
                {hotel.rooms.map((room, i) => (
                  <div
                    key={room.name}
                    className="bg-white border border-sand grid grid-cols-1 md:grid-cols-[200px_1fr] overflow-hidden hover:border-gold transition-colors"
                  >
                    <div
                      className={`relative min-h-[140px] md:h-full ${
                        i === 0
                          ? "bg-[linear-gradient(135deg,#0F2436_0%,#1a3a52_100%)]"
                          : i === 1
                          ? "bg-[linear-gradient(135deg,#162d3e_0%,#1a3a52_100%)]"
                          : "bg-[linear-gradient(135deg,#1a3a52_0%,#0F2436_100%)]"
                      }`}
                    >
                      {/* Admin-uploaded room photo when present; the
                          gradient + pattern stays as the fallback (and
                          shows behind while the photo loads). */}
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B89A5B' fill-opacity='0.07'%3E%3Cpath d='M20 0L21 5L20 4L19 5ZM0 20L5 21L4 20L5 19ZM40 20L35 21L36 20L35 19ZM20 40L21 35L20 36L19 35Z'/%3E%3C/g%3E%3C/svg%3E\")",
                        }}
                      />
                      {room.image && room.image.trim().length > 0 && (
                        <img
                          src={room.image}
                          alt={room.name}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-5 md:p-6 flex flex-col justify-between">
                      <div>
                        <h4 className="font-display text-[1rem] text-navy leading-tight mb-0.5">
                          {room.name}
                        </h4>
                        <p className="text-[0.6rem] tracking-[0.12em] uppercase text-ink-soft/50 mb-2">
                          {room.type}
                        </p>
                        <p className="text-[0.78rem] text-ink-soft leading-[1.75] mb-3">
                          {room.desc}
                        </p>
                        <div className="flex gap-4 flex-wrap mb-4">
                          {[room.occupancy, room.beds, room.sqm].map((d) => (
                            <span
                              key={d}
                              className="text-[0.62rem] text-ink-soft/55 tracking-wide"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[0.58rem] text-ink-soft/45">
                            From
                          </p>
                          <p className="font-display text-[1rem] text-navy">
                            €{room.price} / night
                          </p>
                        </div>
                        <a
                          href="#booking-panel"
                          className={`text-[0.58rem] tracking-[0.15em] uppercase px-3 py-2 transition-colors ${
                            isSiwa
                              ? "text-navy bg-gold hover:bg-gold-light"
                              : "text-coastal border border-coastal hover:bg-coastal hover:text-white"
                          }`}
                        >
                          {isSiwa ? "Select" : "Enquire"}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </BlockSection>

            {/* Location */}
            <BlockSection
              eyebrow="Getting here"
              headline="Location &"
              headlineItalic="access."
            >
              <div className="relative h-[220px] bg-navy overflow-hidden flex items-center justify-center mb-6">
                <div className="absolute inset-0 textile-bg pointer-events-none" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gold/80 shadow-[0_0_0_4px_rgba(184,154,91,0.25)]" />
                <span className="relative z-[2] text-[0.6rem] tracking-[0.2em] uppercase text-white/25">
                  {hotel.facts.find((f) => f.label === "Location")?.value ??
                    hotel.name}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hotel.location.map((l) => (
                  <div
                    key={l.label}
                    className="text-[0.8rem] text-ink-soft leading-[1.7]"
                  >
                    <strong className="block text-[0.72rem] text-navy font-normal mb-0.5">
                      {l.label}
                    </strong>
                    {l.value}
                  </div>
                ))}
              </div>
              <Link
                href={`/${hotel.destination}/transportation`}
                className="inline-block mt-6 text-[0.62rem] tracking-[0.18em] uppercase text-coastal border-b border-coastal/30 pb-[3px] hover:text-navy hover:border-navy transition-colors"
              >
                View transportation options →
              </Link>
            </BlockSection>

            {/* Reviews */}
            <BlockSection
              eyebrow="Guest reflections"
              headline="What guests"
              headlineItalic="remember."
              last
            >
              <div className="flex flex-col">
                {hotel.reviews.map((r, i, arr) => (
                  <div
                    key={r.name}
                    className={`py-7 ${
                      i === arr.length - 1 ? "" : "border-b border-sand-light"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-display text-[0.95rem] text-navy leading-tight">
                          {r.name}
                        </p>
                        <p className="text-[0.65rem] text-ink-soft/50 mt-0.5">
                          {r.origin}
                        </p>
                      </div>
                      <div className="flex gap-[3px]">
                        {[0, 1, 2, 3, 4].map((n) => (
                          <span key={n} className="text-gold/70">
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-[0.82rem] italic text-ink-soft leading-[1.85]">
                      "{r.text}"
                    </p>
                  </div>
                ))}
              </div>
            </BlockSection>
          </div>

          {/* ── RIGHT COLUMN — BOOKING PANEL ── */}
          <aside id="booking-panel" className="lg:sticky lg:top-[140px]">
            {isSiwa ? (
              <SiwaBookingPanel hotel={hotel} />
            ) : (
              <NorthCoastBookingPanel hotel={hotel} />
            )}

            {/* Sidebar extras */}
            <SidebarCard
              title="Complete your stay with"
              titleItalic="experiences."
              desc={
                isSiwa
                  ? "Salt lake float, desert stargazing, oracle temple — added after booking, never required."
                  : "Sunset sailing, flamingo watching, El Alamein heritage — added after booking, never required."
              }
              href={`/${hotel.destination}/experiences`}
              linkLabel={
                isSiwa ? "Explore Siwa experiences" : "Explore coast experiences"
              }
            />

            {isSiwa && (
              <SidebarCard
                title="Need"
                titleItalic="transportation?"
                desc="Private transfer from Cairo (~8 hrs) or Marsa Matrouh (~3 hrs). Arranged as part of your booking."
                href="/siwa-oasis/transportation"
                linkLabel="View Siwa transport routes"
              />
            )}

            <SidebarCard
              title="Not sure this is"
              titleItalic="right for you?"
              desc={`Tell us what you're looking for and we'll recommend the best fit across all ${isSiwa ? "eight Siwa" : "eight North Coast"} properties.`}
              href="/enquire"
              linkLabel="Ask our team"
            />
          </aside>
        </section>

        {/* ── RELATED PROPERTIES ─────────────────────────────── */}
        {relatedCards.length > 0 && (
        <section className="bg-sand-light px-6 md:px-12 lg:px-20 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="reveal flex flex-col md:flex-row justify-between items-start md:items-end gap-3 mb-10">
              <h2
                className="font-display font-normal text-navy leading-[1.2]"
                style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)" }}
              >
                Other{" "}
                {isSiwa ? (
                  <>
                    Siwa <em className="italic text-coastal">properties</em>
                  </>
                ) : (
                  <>
                    coastal <em className="italic text-coastal">properties</em>
                  </>
                )}
              </h2>
              <Link
                href={`/${hotel.destination}/accommodation`}
                className="text-[0.6rem] tracking-[0.2em] uppercase text-navy opacity-35 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
              {relatedCards.map((r, i) => (
                <Link
                  key={r.slug}
                  href={`/${r.destination}/accommodation/${r.slug}`}
                  className={`reveal ${i > 0 ? `reveal-d${i}` : ""} group bg-white border border-sand hover:border-gold transition-colors block overflow-hidden`}
                >
                  <div className={`relative h-[160px] overflow-hidden ${r.gradient}`}>
                    {r.image ? (
                      <img
                        src={r.image}
                        alt={r.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B89A5B' fill-opacity='0.07'%3E%3Cpath d='M20 0L21 5L20 4L19 5ZM0 20L5 21L4 20L5 19ZM40 20L35 21L36 20L35 19ZM20 40L21 35L20 36L19 35Z'/%3E%3C/g%3E%3C/svg%3E\")",
                        }}
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-[0.95rem] text-navy leading-tight mb-1">
                      {r.name}
                    </h3>
                    <p className="text-[0.6rem] tracking-[0.1em] uppercase text-ink-soft/50 mb-3">
                      {r.tagLine}
                    </p>
                    {r.basePrice > 0 && (
                      <div className="flex items-baseline gap-1">
                        <span className="text-[0.6rem] text-ink-soft/45">
                          From
                        </span>
                        <span className="font-display text-[0.9rem] text-navy">
                          €{r.basePrice} / night
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* ── CLOSING ─────────────────────────────────────────── */}
        <section className="bg-cream px-6 md:px-12 lg:px-20 py-24 text-center">
          <div className="max-w-[580px] mx-auto">
            <p className="text-[0.6rem] tracking-[0.3em] uppercase text-gold mb-4 font-body">
              Your stay
            </p>
            <h2
              className="reveal font-display font-normal text-navy leading-[1.2] mb-5"
              style={{ fontSize: "clamp(1.7rem, 4vw, 2.8rem)" }}
            >
              Ready to book?
              <br />
              <em className="italic text-coastal">We'll take it from here.</em>
            </h2>
            <p className="reveal text-[0.88rem] text-ink-soft leading-[1.95] mb-10 font-body">
              Tell us your dates and what you're looking for — we'll confirm availability, arrange transportation, and coordinate any experiences you want to add.
            </p>
            <div className="reveal flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/enquire"
                className="btn-cta-primary text-[0.65rem] tracking-[0.2em] uppercase text-navy bg-gold px-10 py-4 hover:bg-gold-light font-body"
              >
                Begin your stay
              </Link>
              <Link
                href={`/${hotel.destination}/accommodation`}
                className="btn-cta-outline text-[0.65rem] tracking-[0.2em] uppercase text-navy border border-sand px-10 py-4 font-body"
              >
                View other properties
              </Link>
            </div>
          </div>
        </section>
      </main>

      {galleryOpen && (
        <GalleryLightbox
          images={galleryImages}
          index={galleryIndex}
          setIndex={setGalleryIndex}
          onClose={() => setGalleryOpen(false)}
          hotelName={hotel.name}
        />
      )}

      <Footer />
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
 *  Gallery lightbox — full-screen photo viewer for "View all photos"
 * ────────────────────────────────────────────────────────────── */

function GalleryLightbox({
  images,
  index,
  setIndex,
  onClose,
  hotelName,
}: {
  images: string[];
  index: number;
  setIndex: (i: number) => void;
  onClose: () => void;
  hotelName: string;
}) {
  const count = images.length;
  const go = (dir: number) => setIndex((index + dir + count) % count);

  // Keyboard nav + lock body scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") setIndex((index + 1) % count);
      else if (e.key === "ArrowLeft") setIndex((index - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, count, onClose, setIndex]);

  return (
    <div
      className="fixed inset-0 z-[600] flex flex-col bg-navy-deep/95 backdrop-blur-sm animate-fade-up"
      style={{ animationDuration: "0.25s" }}
      role="dialog"
      aria-modal="true"
      aria-label={`${hotelName} photo gallery`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-12 py-5 text-white/80">
        <p className="text-[0.58rem] tracking-[0.28em] uppercase font-body">
          {hotelName}
          <span className="text-white/35"> · {index + 1} / {count}</span>
        </p>
        <button
          type="button"
          onClick={onClose}
          className="text-white/60 hover:text-gold transition-colors p-1"
          aria-label="Close gallery"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Stage */}
      <div className="relative flex-1 flex items-center justify-center px-4 md:px-16 min-h-0">
        {count > 1 && (
          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute left-3 md:left-8 z-[2] text-white/55 hover:text-gold transition-colors p-2 bg-navy-deep/40 border border-white/10 backdrop-blur-md"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <img
          key={images[index]}
          src={images[index]}
          alt={`${hotelName} — photo ${index + 1}`}
          className="max-h-full max-w-full object-contain animate-fade-up"
          style={{ animationDuration: "0.3s" }}
        />

        {count > 1 && (
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute right-3 md:right-8 z-[2] text-white/55 hover:text-gold transition-colors p-2 bg-navy-deep/40 border border-white/10 backdrop-blur-md"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {count > 1 && (
        <div className="flex gap-[3px] overflow-x-auto px-6 md:px-12 py-4">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative flex-shrink-0 w-20 h-14 overflow-hidden border transition-opacity ${
                i === index
                  ? "border-gold opacity-100"
                  : "border-white/10 opacity-45 hover:opacity-80"
              }`}
              aria-label={`Photo ${i + 1}`}
            >
              <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
 *  Reusable content block
 * ────────────────────────────────────────────────────────────── */

function BlockSection({
  eyebrow,
  headline,
  headlineItalic,
  children,
  last,
}: {
  eyebrow: string;
  headline?: string;
  headlineItalic?: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`reveal ${last ? "" : "mb-16 pb-16 border-b border-sand-light"}`}
    >
      <p className="flex items-center gap-3 text-[0.58rem] tracking-[0.35em] uppercase text-gold mb-4">
        <span className="block w-[18px] h-px bg-gold opacity-50" />
        {eyebrow}
      </p>
      {(headline || headlineItalic) && (
        <h2 className="font-display text-[1.4rem] font-normal text-navy mb-6 leading-[1.25]">
          {headline}{" "}
          {headlineItalic && (
            <em className="italic text-coastal">{headlineItalic}</em>
          )}
        </h2>
      )}
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
 *  Booking panels
 * ────────────────────────────────────────────────────────────── */

function SiwaBookingPanel({ hotel }: { hotel: HotelDetail }) {
  const [roomIdx, setRoomIdx] = useState(0);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState("2 adults");

  const perNight = hotel.rooms[roomIdx]?.price ?? hotel.basePrice;
  const nights = useMemo(() => {
    if (!checkin || !checkout) return 0;
    const diff =
      (new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000;
    return diff > 0 ? Math.round(diff) : 0;
  }, [checkin, checkout]);

  const subtotal = nights * perNight;
  const taxes = Math.round(subtotal * 0.1);
  const total = subtotal + taxes;

  // Guided /plan flow — hotel pre-filled, then transport → experiences.
  const enquiryHref = useMemo(() => {
    const params = new URLSearchParams({
      type: "accommodation",
      destination: "siwa",
      property: hotel.slug,
    });
    if (checkin) params.set("checkin", checkin);
    if (checkout) params.set("checkout", checkout);
    if (guests) params.set("guests", guests);
    if (hotel.rooms[roomIdx]) params.set("room", hotel.rooms[roomIdx].name);
    return `/plan?${params.toString()}`;
  }, [hotel.slug, hotel.rooms, roomIdx, checkin, checkout, guests]);

  return (
    <div className="bg-white border border-sand">
      <div className="relative bg-navy p-6 overflow-hidden">
        <div className="absolute inset-0 textile-bg pointer-events-none" />
        <div className="relative z-[2]">
          <p className="text-[0.56rem] tracking-[0.28em] uppercase text-gold/75 mb-1">
            Book directly
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-[0.72rem] text-white/35">From</span>
            <span className="font-display text-[1.8rem] text-white font-normal">
              €{perNight}
            </span>
            <span className="text-[0.72rem] text-white/35">
              {hotel.priceLabel}
            </span>
          </div>
        </div>
      </div>
      <div className="p-5">
        <Field label="Room type">
          <select
            className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer"
            value={roomIdx}
            onChange={(e) => setRoomIdx(Number(e.target.value))}
          >
            {hotel.rooms.map((r, i) => (
              <option key={r.name} value={i}>
                {r.name} — €{r.price}/night
              </option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-[2px] mb-3">
          <Field label="Check-in">
            <input
              type="date"
              value={checkin}
              onChange={(e) => setCheckin(e.target.value)}
              className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none cursor-pointer"
            />
          </Field>
          <Field label="Check-out">
            <input
              type="date"
              value={checkout}
              onChange={(e) => setCheckout(e.target.value)}
              className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none cursor-pointer"
            />
          </Field>
        </div>
        <Field label="Guests">
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer"
          >
            <option>1 adult</option>
            <option>2 adults</option>
            <option>2 adults, 1 child</option>
            <option>2 adults, 2 children</option>
          </select>
        </Field>

        {nights > 0 && (
          <div className="border-t border-sand-light pt-3 mb-3">
            <div className="flex justify-between text-[0.78rem] text-ink-soft py-1">
              <span>
                {nights} night{nights === 1 ? "" : "s"} × €{perNight}
              </span>
              <span>€{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[0.78rem] text-ink-soft py-1">
              <span>Taxes & fees</span>
              <span>€{taxes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-baseline text-[0.88rem] text-navy border-t border-sand mt-2 pt-3">
              <span>Total</span>
              <strong className="font-display text-[1.1rem] font-normal">
                €{total.toLocaleString()}
              </strong>
            </div>
          </div>
        )}

        {hotel.tabTravelWidgetId ? (
          /* Tab.travel embedded widget — loaded by the script on the page.
             When present, this replaces the static Book button. The widget
             reads its configuration from the data attributes below. */
          <div
            className="mt-1"
            data-tabtravel-widget={hotel.tabTravelWidgetId}
            data-tabtravel-property={hotel.slug}
            data-tabtravel-checkin={checkin || undefined}
            data-tabtravel-checkout={checkout || undefined}
            data-tabtravel-guests={guests}
          />
        ) : (
          <a
            href={enquiryHref}
            className="block w-full text-[0.65rem] tracking-[0.2em] uppercase text-navy bg-gold py-4 text-center font-body font-medium hover:bg-gold-light transition-colors"
          >
            Book now
          </a>
        )}
        <p className="text-[0.7rem] text-ink-soft/55 text-center mt-3 leading-[1.6]">
          Free cancellation up to 7 days before arrival. Secure payment via
          our booking system.
        </p>
      </div>
    </div>
  );
}

function NorthCoastBookingPanel({ hotel }: { hotel: HotelDetail }) {
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [roomName, setRoomName] = useState(hotel.rooms[0]?.name ?? "");
  const [guests, setGuests] = useState("2 adults");

  const enquiryHref = useMemo(() => {
    const params = new URLSearchParams({
      type: "accommodation",
      destination: "north-coast",
      property: hotel.slug,
    });
    if (checkin) params.set("checkin", checkin);
    if (checkout) params.set("checkout", checkout);
    if (roomName) params.set("room", roomName);
    if (guests) params.set("guests", guests);
    return `/plan?${params.toString()}`;
  }, [hotel.slug, checkin, checkout, roomName, guests]);

  return (
    <div className="bg-white border border-sand">
      <div className="relative bg-coastal p-6 overflow-hidden">
        <div className="relative z-[2]">
          <p className="text-[0.56rem] tracking-[0.28em] uppercase text-gold/80 mb-1">
            Make a reservation
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-[0.72rem] text-white/45">From</span>
            <span className="font-display text-[1.6rem] text-white font-normal">
              €{hotel.basePrice}
            </span>
            <span className="text-[0.72rem] text-white/45">
              {hotel.priceLabel}
            </span>
          </div>
        </div>
      </div>
      <div className="p-5">
        <p className="text-[0.8rem] text-ink-soft leading-[1.75] mb-4 pb-4 border-b border-sand-light">
          North Coast properties are reserved through our team. Submit your
          request and we'll confirm availability and send a secure payment
          link within 24 hours.
        </p>

        <ul className="mb-4 pb-4 border-b border-sand-light list-none">
          {[
            {
              n: "1.",
              strong: "Submit your request",
              rest: " — dates, room type, guest count",
            },
            {
              n: "2.",
              strong: "We confirm availability",
              rest: " — directly with the property",
            },
            {
              n: "3.",
              strong: "Payment link sent",
              rest: " — via WhatsApp or email within 24 hrs",
            },
          ].map((s) => (
            <li key={s.n} className="flex gap-3 items-start py-1.5">
              <span className="font-display italic text-[0.78rem] text-gold/70 min-w-4 pt-px">
                {s.n}
              </span>
              <p className="text-[0.75rem] text-ink-soft leading-[1.65]">
                <strong className="text-navy font-normal">{s.strong}</strong>
                {s.rest}
              </p>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-[2px] mb-3">
          <Field label="Check-in">
            <input
              type="date"
              value={checkin}
              onChange={(e) => setCheckin(e.target.value)}
              className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none cursor-pointer"
            />
          </Field>
          <Field label="Check-out">
            <input
              type="date"
              value={checkout}
              onChange={(e) => setCheckout(e.target.value)}
              className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none cursor-pointer"
            />
          </Field>
        </div>

        <Field label="Room preference">
          <select
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer"
          >
            {hotel.rooms.map((r) => (
              <option key={r.name} value={r.name}>
                {r.name} — from €{r.price}/night
              </option>
            ))}
          </select>
        </Field>

        <Field label="Guests">
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer"
          >
            <option>1 adult</option>
            <option>2 adults</option>
            <option>2 adults, 1 child</option>
            <option>2 adults, 2 children</option>
          </select>
        </Field>

        <a
          href={enquiryHref}
          className="block w-full text-[0.65rem] tracking-[0.2em] uppercase text-white bg-coastal py-4 text-center font-body font-medium hover:bg-[#266080] transition-colors"
        >
          Send reservation request
        </a>
        <p className="text-[0.7rem] text-ink-soft/55 text-center mt-3 leading-[1.6]">
          We respond within 24 hours. No payment until we confirm availability.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <label className="block text-[0.56rem] tracking-[0.22em] uppercase text-ink-soft/55 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function SidebarCard({
  title,
  titleItalic,
  desc,
  href,
  linkLabel,
}: {
  title: string;
  titleItalic: string;
  desc: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="bg-white border border-sand p-5 mt-[2px]">
      <h3 className="font-display text-[0.95rem] text-navy leading-tight mb-2">
        {title} <em className="italic text-coastal">{titleItalic}</em>
      </h3>
      <p className="text-[0.78rem] text-ink-soft leading-[1.75] mb-3">
        {desc}
      </p>
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 text-[0.58rem] tracking-[0.18em] uppercase text-gold hover:gap-2.5 transition-all"
      >
        {linkLabel} →
      </Link>
    </div>
  );
}
