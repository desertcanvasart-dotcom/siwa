import { useState, useMemo } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Arch } from "@/components/ui/Arch";
import { useReveal } from "@/components/home/useReveal";
import { useHotelsBySlug } from "@/lib/useHotelsBySlug";
import adrereAmellalImage from "@assets/adrerre-amelal_1751755031600.jpg";
import taziryImage from "@assets/taziry-room-.jpg";
import ghalietImage from "@assets/galit-lodge-siwa_1751833109925.jpg";
import talistImage from "@assets/talist-siwa_pooljpg.jpg";
import siwaShaliImage from "@assets/siwa-shali-resort-.jpg";
import azadImage from "@assets/azad-siwa-hotel_1751832908544.jpg";
import soleiOldTownImage from "@assets/solei-old-town-heritage.png";
import soleiRoyalImage from "@assets/soliel-royal_1751757316304.png";
import soleiDesertRetreatImage from "@assets/Solei Desart Retret_1763854758404.png";
import soleiSaltCavesImage from "@assets/Solei Salt Caves_1763854758400.png";

/* ──────────────────────────────────────────────────────────────
 * Types
 * ────────────────────────────────────────────────────────────── */

type Category = "solei" | "eco" | "boutique" | "resort";

interface SoleiHotel {
  slug: string;
  name: string;         // plain string for display
  nameItalic: string;   // italic part after "Soléi "
  type: string;
  fromPrice: string;    // e.g. "€145"
  priceNote: string;    // e.g. "/ night"
  highlights: string[];
  gradient: string;     // Tailwind bg class
  image?: string;
}

interface PartnerHotel {
  slug: string;
  name: string;
  type: string;
  desc: string;
  highlights: string[];
  price: string;
  categories: Category[];
  gradient: string;
  image?: string;
  tag: { label: string; variant: "eco" | "rated" };
}

/* ──────────────────────────────────────────────────────────────
 * Data
 * ────────────────────────────────────────────────────────────── */

const soleiCollection: SoleiHotel[] = [
  {
    slug: "solei-old-town",
    name: "Soléi Old Town",
    nameItalic: "Old Town",
    type: "Heritage Stay · Ancient Medina · Shali Views",
    fromPrice: "€145",
    priceNote: "/ night",
    highlights: ["Old City", "Shali fortress views", "Heritage rooms", "Rooftop terrace"],
    gradient: "bg-[linear-gradient(155deg,#1e3a52_0%,#0F2436_45%,#0e2030_100%)]",
    image: soleiOldTownImage,
  },
  {
    slug: "solei-royal",
    name: "Soléi Royal",
    nameItalic: "Royal",
    type: "Premium Stay · Desert Edge · Private Garden",
    fromPrice: "€195",
    priceNote: "/ night",
    highlights: ["Private salt pool", "Walled garden", "Desert edge", "Full board available"],
    gradient: "bg-[linear-gradient(155deg,#0F2436_0%,#152a3c_45%,#1a3850_100%)]",
    image: soleiRoyalImage,
  },
  {
    slug: "solei-desert-retreat",
    name: "Soléi Desert Retreat",
    nameItalic: "Desert Retreat",
    type: "Desert Lodge · Salt Flats · Completely Remote",
    fromPrice: "€240",
    priceNote: "/ night · full board",
    highlights: ["3 rooms only", "Great Sand Sea", "No light pollution", "Fire-cooked meals", "Star-gazing deck"],
    gradient: "bg-[linear-gradient(155deg,#0a1e2e_0%,#1a3a52_45%,#0F2436_100%)]",
    image: soleiDesertRetreatImage,
  },
  {
    slug: "solei-salt-caves",
    name: "Soléi Salt Caves",
    nameItalic: "Salt Caves",
    type: "Wellness Retreat · Natural Caves · Ancient Healing",
    fromPrice: "€175",
    priceNote: "/ night",
    highlights: ["Cave rooms", "Salt air therapy", "Ancient microclimate", "Guided cave walks"],
    gradient: "bg-[linear-gradient(155deg,#162030_0%,#0a1828_45%,#1a2e40_100%)]",
    image: soleiSaltCavesImage,
  },
];

const partnerProperties: PartnerHotel[] = [
  {
    slug: "adrere-amellal",
    name: "Adrere Amellal",
    type: "Eco Lodge · White Mountain · Lake views",
    desc: "Egypt's most celebrated eco-lodge. Built entirely from karsheef salt rock and palm wood into the white mountain at the edge of the salt lake. No electricity, no internet, no noise — just the oasis in its most elemental form. Oil lamps at night. The silence is the point.",
    highlights: ["No electricity", "Oil lamp lighting", "Salt lake front", "Organic farm"],
    price: "€320 / night",
    categories: ["eco"],
    gradient: "bg-[linear-gradient(155deg,#1a3a52_0%,#0F2436_60%,#0a1e2e_100%)]",
    image: adrereAmellalImage,
    tag: { label: "Eco · No electricity", variant: "eco" },
  },
  {
    slug: "taziry-ecolodge",
    name: "Taziry Ecolodge",
    type: "Boutique Eco Lodge · Salt lake views · Pool",
    desc: "Mud-brick villas arranged around a courtyard garden, with uninterrupted views of Siwa's salt lakes. A salt water pool, organic meals, and the kind of unhurried service that earns its reputation quietly. More accessible than Adrere Amellal, no less considered.",
    highlights: ["Salt water pool", "Lake views", "Organic kitchen", "Mud-brick villas"],
    price: "€180 / night",
    categories: ["eco", "boutique"],
    gradient: "bg-[linear-gradient(155deg,#0F2436_0%,#1a4060_60%,#1a3a52_100%)]",
    image: taziryImage,
    tag: { label: "Eco Lodge", variant: "eco" },
  },
  {
    slug: "ghaliet-ecolodge-spa",
    name: "Ghaliet Ecolodge & Spa",
    type: "Eco Lodge · Spa · Natural salt pool",
    desc: "Traditional Siwan mud architecture with a spa grounded in local healing knowledge — salt baths, sand treatments, herbal wraps. A natural salt pool filled from the oasis's own springs. The only lodge in Siwa where rest feels like an active choice rather than a default.",
    highlights: ["Natural salt pool", "Traditional spa", "Sand treatments", "Healing rituals"],
    price: "€160 / night",
    categories: ["eco", "boutique"],
    gradient: "bg-[linear-gradient(155deg,#152a3c_0%,#1a3a52_60%,#0F2436_100%)]",
    image: ghalietImage,
    tag: { label: "Eco · Spa", variant: "eco" },
  },
  {
    slug: "talist-siwa",
    name: "Talist Siwa",
    type: "Boutique Hotel · Desert edge · Infinity pool",
    desc: "On the quiet side of the oasis where the palms thin out and the desert begins. An infinity pool that appears to pour directly into the sand sea. Rooms are generous, calm, and thoughtfully designed — not traditional Siwan architecture, but respectful of it.",
    highlights: ["Infinity pool", "Desert panorama", "Spacious rooms", "Restaurant on site"],
    price: "€130 / night",
    categories: ["boutique"],
    gradient: "bg-[linear-gradient(155deg,#1a3850_0%,#0F2436_60%,#162a3c_100%)]",
    image: talistImage,
    tag: { label: "Boutique", variant: "rated" },
  },
  {
    slug: "siwa-shali-resort",
    name: "Siwa Shali Resort",
    type: "Resort · Old City · Garden · Pool",
    desc: "A palm-shaded resort set between the old city walls and the date orchards, with a pool and gardens that feel genuinely lush. Rooms are comfortable and well-maintained. The best choice for families or those who want reliable amenities alongside the oasis experience.",
    highlights: ["Swimming pool", "Palm gardens", "Old city location", "Family friendly"],
    price: "€110 / night",
    categories: ["resort"],
    gradient: "bg-[linear-gradient(155deg,#162d3e_0%,#1a3a52_60%,#0F2436_100%)]",
    image: siwaShaliImage,
    tag: { label: "Resort", variant: "rated" },
  },
  {
    slug: "azad-siwa-hotel",
    name: "Azad Siwa Hotel",
    type: "Boutique Hotel · Central Siwa · Rooftop",
    desc: "A quietly considered boutique hotel in the centre of Siwa town. Rooftop views across the oasis, locally sourced meals, and a team that takes pride in knowing the area well. The most central option on this list — useful if you plan to spend time in the medina on foot.",
    highlights: ["Rooftop restaurant", "Central location", "Local cuisine", "Walking access"],
    price: "€95 / night",
    categories: ["boutique"],
    gradient: "bg-[linear-gradient(155deg,#1a3a52_0%,#1e3a50_60%,#0F2436_100%)]",
    image: azadImage,
    tag: { label: "Boutique", variant: "rated" },
  },
];

const upsellMoments = [
  { slug: "salt-and-spring-escape",        title: "Salt & Spring Escape",          detail: "Half day · 2–3 hours · From €60pp" },
  { slug: "desert-sunset-experience",      title: "Desert Sunset Experience",      detail: "Sunset · 3–4 hours · From €80pp" },
  { slug: "desert-night-experience",       title: "Desert Night Experience",       detail: "Sunset → Morning · From €150pp" },
  { slug: "solei-signature-siwa-journey",  title: "Soléi Signature Siwa Journey",  detail: "Full day → Night · From €250pp" },
];

const bookingSteps = [
  { n: "1.", title: "Choose your property & dates",    text: "Select from the listings above. Each property page shows live availability." },
  { n: "2.", title: "Select room type",                text: "Room types, occupancy, and inclusions shown clearly — no hidden extras." },
  { n: "3.", title: "Pay securely on site",            text: "Payment processed via our booking system. Instant confirmation sent to your email." },
  { n: "4.", title: "Add experiences & transportation",text: "After confirming accommodation, you'll be invited to add Siwa experiences and arrange your transfer — nothing required, everything available." },
];

const TEXTILE = "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B89A5B' fill-opacity='0.06'%3E%3Cpath d='M20 0L21 5L20 4L19 5ZM0 20L5 21L4 20L5 19ZM40 20L35 21L36 20L35 19ZM20 40L21 35L20 36L19 35Z'/%3E%3C/g%3E%3C/svg%3E\")";

const filters = [
  { id: "all",      label: "All" },
  { id: "solei",    label: "Soléi Collection" },
  { id: "eco",      label: "Eco Lodges" },
  { id: "boutique", label: "Boutique" },
  { id: "resort",   label: "Resorts" },
] as const;
type FilterId = (typeof filters)[number]["id"];

/* ──────────────────────────────────────────────────────────────
 * Page
 * ────────────────────────────────────────────────────────────── */

export default function SiwaOasisAccommodation() {
  useReveal();
  const [active, setActive] = useState<FilterId>("all");

  const showCollection = active === "all" || active === "solei" || active === "eco" || active === "boutique";
  const showPartners   = active !== "solei";

  const overlays = useHotelsBySlug();

  // Only show Soléi-owned hotels that the API actually returns
  // (i.e. active in the DB). Drafted ones disappear from the listing.
  const filteredSolei = useMemo(() => {
    const live = soleiCollection.filter((h) => overlays.has(h.slug));
    if (active === "all" || active === "solei") return live;
    if (active === "eco") return live.filter((h) => h.slug.includes("retreat"));
    if (active === "boutique") return live.filter((h) => !h.slug.includes("retreat"));
    return [];
  }, [active, overlays]);

  // Card list = every Siwa hotel from the API, with the inline
  // partnerProperties entry used as a styling default (gradient,
  // image, categories) when one exists. Newly-created hotels still
  // appear even when no inline default exists.
  const filteredPartners = useMemo(() => {
    const inlineBySlug = new Map(partnerProperties.map((h) => [h.slug, h]));
    const seen = new Set<string>();
    const cards: PartnerHotel[] = [];

    // Iterate API hotels first so the order reflects DB sorting
    const apiSlugs: string[] = [];
    overlays.forEach((overlay, slug) => {
      if (slug && (overlay as any).destination !== "north-coast") {
        apiSlugs.push(slug);
      }
    });

    for (const slug of apiSlugs) {
      const overlay = overlays.get(slug);
      const inline = inlineBySlug.get(slug);
      // Skip Soléi properties — they're rendered by the Soléi block
      if (slug.startsWith("solei-")) continue;
      seen.add(slug);
      const merged: PartnerHotel = inline
        ? {
            ...inline,
            name: overlay?.name || inline.name,
            desc: overlay?.blurb || inline.desc,
            price: overlay?.pricePerNight || inline.price,
            image: overlay?.imageUrl || inline.image,
          }
        : {
            slug,
            name: overlay?.name || "Untitled hotel",
            type: "Hotel",
            desc: overlay?.blurb || overlay?.description || "",
            highlights: Array.isArray(overlay?.amenities) ? overlay!.amenities! : [],
            price: overlay?.pricePerNight || "On request",
            categories: ["eco"],
            gradient: "bg-[linear-gradient(155deg,#1a3a52_0%,#0F2436_60%,#2a5a7a_100%)]",
            image: overlay?.imageUrl,
            tag: { label: "Hotel", variant: "rated" },
          };
      cards.push(merged);
    }

    // Apply the category filter
    return cards.filter(
      (h) => active === "all" || h.categories.includes(active as Category),
    );
  }, [active, overlays]);

  const filteredSoleiOverlayed = useMemo(
    () =>
      filteredSolei.map((h) => {
        const o = overlays.get(h.slug);
        if (!o) return h;
        return {
          ...h,
          name: o.name || h.name,
          fromPrice: o.pricePerNight ? o.pricePerNight.split(" / ")[0] : h.fromPrice,
          image: o.imageUrl || h.image,
        };
      }),
    [filteredSolei, overlays]
  );

  const shownCount = (active === "solei" ? 0 : filteredPartners.length) + filteredSolei.length;

  return (
    <>
      <SEO
        title="Siwa Accommodation — 10 Curated Properties | Soléi"
        description="Ten curated Siwa properties — four Soléi-owned stays, world-famous eco-lodges, boutique retreats, and classic resorts. Direct booking with live availability."
        path="/siwa-oasis/accommodation"
      />
      <Nav />

      <main>

        {/* ── 1. Hero ─────────────────────────────────────────── */}
        <section className="relative bg-navy overflow-hidden px-6 md:px-12 lg:px-20 pt-40 pb-20">
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: TEXTILE, opacity: 0.7 }} />
          <div
            className="absolute pointer-events-none"
            style={{ top: "-30%", right: "-5%", width: "55vw", height: "55vw",
              background: "radial-gradient(ellipse, rgba(47,111,143,0.12) 0%, transparent 65%)" }}
          />
          <div className="relative z-[2] max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-24 items-end">
            <div>
              <p className="flex items-center gap-3 text-[0.58rem] tracking-[0.28em] uppercase text-white/22 mb-8 font-body animate-fade-up animation-delay-200">
                <Link href="/" className="hover:text-gold transition-colors">Soléi</Link>
                <span className="opacity-40">/</span>
                <Link href="/siwa-oasis" className="hover:text-gold transition-colors">Siwa Oasis</Link>
                <span className="opacity-40">/</span>
                <span>Accommodation</span>
              </p>
              <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-6 font-body animate-fade-up animation-delay-400">
                <span className="block w-[22px] h-px bg-gold opacity-50" />
                Where you sleep
              </p>
              <h1
                className="font-display font-normal leading-[1.1] text-white animate-fade-up animation-delay-600"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)" }}
              >
                Siwa <em className="italic text-gold">accommodation.</em>
                <br />
                Ten properties. One oasis.
              </h1>
            </div>

            <div className="pb-2 animate-fade-up" style={{ animationDelay: "0.7s" }}>
              <p className="text-[0.9rem] text-white/45 leading-[1.95] mb-8 font-body">
                From our own four properties — designed, operated, and answered for by us — to six partner lodges personally visited and chosen because they understand what it means to be somewhere, not just to stay somewhere.
              </p>
              <div className="flex gap-10 border-t border-gold/15 pt-5">
                {[
                  { num: "10",  label: "Properties" },
                  { num: "4",   label: "Soléi owned" },
                  { num: "€95", label: "Starting from" },
                ].map(s => (
                  <div key={s.label}>
                    <div className="font-display text-[2rem] font-normal text-gold leading-none">{s.num}</div>
                    <div className="text-[0.6rem] tracking-[0.18em] uppercase text-white/30 mt-1 font-body">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Filter bar ───────────────────────────────────── */}
        <div className="sticky top-[64px] z-[40] border-b border-sand" style={{ background: "rgba(253,250,245,0.96)", backdropFilter: "blur(16px)" }}>
          <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 flex justify-between items-center">
            <div className="flex overflow-x-auto -mx-1">
              {filters.map(f => (
                <button
                  key={f.id}
                  onClick={() => setActive(f.id)}
                  className={`px-4 md:px-5 py-[1.1rem] text-[0.62rem] tracking-[0.18em] uppercase font-body whitespace-nowrap border-b-2 -mb-px transition-all duration-300
                    ${active === f.id ? "text-navy opacity-100 border-gold" : "text-ink opacity-40 border-transparent hover:opacity-70"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="text-[0.62rem] text-ink-soft font-body flex-shrink-0 pl-4">
              Showing <span className="text-navy font-medium">{shownCount}</span> properties
            </div>
          </div>
        </div>

        {/* ── 3. Soléi Collection — dark navy module ──────────── */}
        {showCollection && filteredSolei.length > 0 && (
          <section className="relative overflow-hidden" style={{ backgroundColor: "#091820" }}>
            {/* Background textile */}
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: TEXTILE, opacity: 0.6 }} />

            {/* Section header */}
            <div className="reveal relative z-[2] max-w-5xl mx-auto px-6 md:px-12 lg:px-20 pt-20 pb-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-end">
              <div>
                <p className="flex items-center gap-3 text-[0.58rem] tracking-[0.38em] uppercase text-gold/85 mb-5 font-body">
                  <span className="block w-[22px] h-px bg-gold opacity-60" />
                  The Soléi Collection
                </p>
                <h2
                  className="font-display font-normal text-white leading-[1.15]"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
                >
                  Four properties.
                  <br />
                  <em className="italic text-gold">All ours.</em>
                </h2>
              </div>
              <div>
                <p className="text-[0.88rem] text-white/45 leading-[1.95] mb-5 font-body">
                  Designed, operated, and answered for directly by our team. Not recommendations — these are the places we built from the ground up and know from the inside. If something isn't right, you reach us and we fix it.
                </p>
                <div className="border-t border-gold/15 pt-4 flex flex-col gap-1.5">
                  {[
                    "Every detail chosen by us — architecture, menu, service, guides",
                    "Direct booking — live availability, instant confirmation",
                    "Full accountability — Soléi is responsible for your stay, end to end",
                  ].map(line => (
                    <div key={line} className="flex items-center gap-2.5 text-[0.78rem] text-white/35 font-body">
                      <span className="w-1 h-1 rounded-full bg-gold opacity-50 flex-shrink-0" />
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cards grid */}
            <div className="relative z-[2] px-6 md:px-12 lg:px-20 pb-20 flex flex-col gap-[3px]">
              {/* Top row — equal halves */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
                {filteredSoleiOverlayed.slice(0, 2).map((h, i) => (
                  <CollectionCard key={h.slug} hotel={h} height="h-[280px] md:h-[420px]" delay={i} />
                ))}
              </div>
              {/* Bottom row — asymmetric (only when all 4 shown) */}
              {filteredSolei.length > 2 && (
                <div className="grid grid-cols-1 md:grid-cols-[1.25fr_1fr] gap-[3px]">
                  {filteredSoleiOverlayed.slice(2, 4).map((h, i) => (
                    <CollectionCard key={h.slug} hotel={h} height="h-[280px] md:h-[360px]" delay={i} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── 4. Section divider → partner properties ─────────── */}
        {showPartners && filteredPartners.length > 0 && (
          <>
            <div className="bg-cream px-6 md:px-12 lg:px-20 pt-16">
              <div className="max-w-5xl mx-auto reveal pb-6 border-b border-sand flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
                <div>
                  <h2
                    className="font-display font-normal text-navy leading-[1.2]"
                    style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
                  >
                    Curated <em className="italic text-coastal">partner properties</em>
                  </h2>
                  <p className="text-[0.8rem] text-ink-soft mt-1 font-body">
                    Handpicked. Personally visited. Every lodge below comes with our full endorsement.
                  </p>
                </div>
              </div>
            </div>

            {/* Partner grid */}
            <section className="bg-cream px-6 md:px-12 lg:px-20 pt-8 pb-24">
              <div className="max-w-5xl mx-auto">
                {filteredPartners.length === 0 && filteredSolei.length === 0 ? (
                  <div className="py-24 text-center">
                    <p className="font-display italic text-[1.2rem] text-ink-soft">No properties match this filter.</p>
                    <button onClick={() => setActive("all")} className="mt-6 text-[0.62rem] tracking-[0.2em] uppercase text-gold hover:text-navy transition-colors font-body">
                      Show all properties →
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]">
                    {filteredPartners.map((h, i) => (
                      <PartnerCard key={h.slug} hotel={h} delay={i % 3} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {/* empty state when no properties match */}
        {!showCollection && !showPartners && (
          <div className="bg-cream py-32 text-center px-6">
            <p className="font-display italic text-[1.2rem] text-ink-soft">No properties match this filter.</p>
            <button onClick={() => setActive("all")} className="mt-6 text-[0.62rem] tracking-[0.2em] uppercase text-gold hover:text-navy transition-colors font-body">
              Show all properties →
            </button>
          </div>
        )}

        {/* ── 5. Booking note ────────────────────────────────── */}
        <section className="px-6 md:px-12 lg:px-20 py-20 md:py-24" style={{ backgroundColor: "#EDE5D8" }}>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-24 items-start">
            <div className="reveal">
              <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-5 font-body">
                <span className="block w-[22px] h-px bg-gold opacity-50" />
                Direct booking
              </p>
              <h2
                className="font-display font-normal text-navy leading-[1.25] mb-5"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
              >
                All Siwa properties
                <br />
                book <em className="italic text-coastal">directly on site.</em>
              </h2>
              <p className="text-[0.88rem] text-ink-soft leading-[1.95] font-body">
                Unlike our North Coast properties — which go through a personal reservation process — all Siwa accommodation is bookable directly here via our integrated booking system. Select your dates, choose your room, and confirm in minutes. No waiting. No payment link to follow.
              </p>
            </div>
            <ul className="reveal reveal-d1 list-none border-t border-sand">
              {bookingSteps.map((s, i) => (
                <li key={s.n} className={`flex gap-4 items-start py-4 ${i < bookingSteps.length - 1 ? "border-b border-sand-light" : ""}`}>
                  <span className="font-display italic text-[0.9rem] text-gold/70 min-w-[20px] pt-[1px]">{s.n}</span>
                  <div className="text-[0.84rem] text-ink-soft leading-[1.75] font-body">
                    <strong className="block text-navy font-normal mb-0.5">{s.title}</strong>
                    {s.text}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── 6. Experience upsell ───────────────────────────── */}
        <section className="relative bg-navy px-6 md:px-12 lg:px-20 py-24 md:py-28 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: TEXTILE, opacity: 0.7 }} />
          <div className="relative z-[2] max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 md:gap-24 items-center">
            <div className="reveal">
              <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-5 font-body">
                <span className="block w-[22px] h-px bg-gold opacity-50" />
                Complete your stay
              </p>
              <h2
                className="font-display font-normal text-white leading-[1.2] mb-5"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
              >
                Don't just sleep in Siwa.
                <br />
                <em className="italic text-gold">Feel it.</em>
              </h2>
              <p className="text-[0.88rem] text-white/40 leading-[1.95] mb-8 font-body">
                Accommodation is the foundation. What happens around it is what you'll remember. Once your property is confirmed, we invite you — quietly — to add to your time in the oasis.
              </p>
              <Link
                href="/siwa-oasis/experiences"
                className="inline-block text-[0.62rem] tracking-[0.2em] uppercase text-navy bg-gold px-8 py-3.5 hover:bg-gold-light transition-colors font-body"
              >
                Explore experiences
              </Link>
            </div>

            <div className="reveal reveal-d1 flex flex-col gap-[2px]">
              {upsellMoments.map(m => (
                <Link
                  key={m.slug}
                  href={`/siwa-oasis/experiences/${m.slug}`}
                  className="flex items-center justify-between gap-4 px-7 py-5 border border-gold/12 hover:bg-coastal/[0.08] hover:border-gold/30 transition-colors"
                >
                  <div>
                    <div className="font-display text-[1rem] text-white leading-tight">{m.title}</div>
                    <div className="text-[0.68rem] text-white/30 mt-1 font-body">{m.detail}</div>
                  </div>
                  <span className="text-[0.58rem] tracking-[0.18em] uppercase text-gold/65 flex-shrink-0 font-body">Add →</span>
                </Link>
              ))}
              <Link
                href="/siwa-oasis/experiences"
                className="flex items-center justify-between gap-4 px-7 py-5 border border-gold/12 hover:bg-coastal/[0.08] hover:border-gold/30 transition-colors"
              >
                <div>
                  <div className="font-display text-[1rem] text-white leading-tight">View all Siwa experiences</div>
                  <div className="text-[0.68rem] text-white/30 mt-1 font-body">10 curated experiences available</div>
                </div>
                <span className="text-[0.58rem] tracking-[0.18em] uppercase text-gold/65 flex-shrink-0 font-body">See all →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── 7. Closing ─────────────────────────────────────── */}
        <section className="bg-cream px-6 md:px-12 lg:px-20 py-24 md:py-28 text-center">
          <div className="max-w-[640px] mx-auto">
            <div className="flex justify-center mb-10">
              <Arch className="w-14 h-auto" />
            </div>
            <h2
              className="reveal font-display font-normal text-navy leading-[1.2] mb-5"
              style={{ fontSize: "clamp(1.7rem, 4vw, 3rem)" }}
            >
              Not sure which
              <br />
              property is <em className="italic text-coastal">right for you?</em>
            </h2>
            <p className="reveal text-[0.88rem] text-ink-soft leading-[1.95] mb-10 font-body">
              Tell us a little about how you travel — how many nights, what you're looking for, whether you want total remoteness or something more connected — and we'll recommend the right fit.
            </p>
            <div className="reveal flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
              <Link href="/enquire" className="btn-cta-primary text-[0.65rem] tracking-[0.2em] uppercase text-navy bg-gold px-10 py-4 hover:bg-gold-light font-body">
                Ask us
              </Link>
              <Link href="/siwa-oasis/experiences" className="btn-cta-outline text-[0.65rem] tracking-[0.2em] uppercase text-navy border border-sand px-10 py-4 font-body">
                Siwa experiences
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
 * Card sub-components
 * ────────────────────────────────────────────────────────────── */

const OVERLAY_BASE =
  "linear-gradient(to top, rgba(9,24,32,0.96) 0%, rgba(9,24,32,0.65) 35%, rgba(9,24,32,0.15) 65%, rgba(9,24,32,0.05) 100%)";
const OVERLAY_HOVER =
  "linear-gradient(to top, rgba(9,24,32,0.98) 0%, rgba(9,24,32,0.75) 40%, rgba(9,24,32,0.25) 70%, rgba(9,24,32,0.08) 100%)";

function CollectionCard({
  hotel,
  height,
  delay,
}: {
  hotel: SoleiHotel;
  height: string;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/siwa-oasis/accommodation/${hotel.slug}`}
      className={`reveal ${delay > 0 ? `reveal-d${delay}` : ""} group relative block overflow-hidden`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`relative ${height} overflow-hidden ${hotel.gradient}`}>
        {hotel.image && (
          <img
            src={hotel.image}
            alt={hotel.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        )}
        {/* Textile texture */}
        <div className="absolute inset-0" style={{ backgroundImage: TEXTILE }} />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{ background: hovered ? OVERLAY_HOVER : OVERLAY_BASE }}
        />

        {/* Top-left badge */}
        <span
          className="absolute top-5 left-5 z-[3] text-[0.5rem] tracking-[0.25em] uppercase text-gold border border-gold/50 px-3 py-1 font-body"
          style={{ backdropFilter: "blur(8px)", background: "rgba(9,24,32,0.5)" }}
        >
          Soléi Collection · From {hotel.fromPrice}
        </span>

        {/* Content overlay */}
        <div className="absolute inset-0 z-[3] flex flex-col justify-end p-7 md:p-8">
          {/* Highlights — revealed on hover */}
          <div className={`flex gap-1.5 flex-wrap mb-4 transition-all duration-350 ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}>
            {hotel.highlights.map(h => (
              <span
                key={h}
                className="text-[0.54rem] tracking-[0.1em] uppercase text-white/55 border border-white/15 px-2.5 py-1 font-body"
                style={{ backdropFilter: "blur(4px)" }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Property name */}
          <div
            className={`font-display text-white mb-1.5 transition-transform duration-400 ${hovered ? "translate-y-0" : "translate-y-1"}`}
            style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", lineHeight: 1.15 }}
          >
            Soléi <em className="italic">{hotel.nameItalic}</em>
          </div>

          {/* Type — revealed on hover */}
          <div className={`text-[0.65rem] uppercase tracking-[0.1em] text-white/45 mb-5 font-body transition-all duration-400 ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1.5"}`}>
            {hotel.type}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t border-gold/20">
            <div>
              <div className="text-[0.6rem] uppercase tracking-[0.12em] text-white/40 font-body">From</div>
              <div className="font-display text-[1.3rem] text-gold leading-none">
                {hotel.fromPrice}{" "}
                <span className="font-body text-[0.72rem] text-white/40 font-light">{hotel.priceNote}</span>
              </div>
            </div>
            <span className={`text-[0.6rem] tracking-[0.18em] uppercase text-navy px-6 py-2.5 font-body transition-colors ${hovered ? "bg-gold-light" : "bg-gold"}`}>
              Book now
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function PartnerCard({ hotel, delay }: { hotel: PartnerHotel; delay: number }) {
  const tagCls = hotel.tag.variant === "eco"
    ? "text-[#a8d5b5] bg-navy-deep/75"
    : "text-white/65 bg-navy-deep/65";

  return (
    <Link
      href={`/siwa-oasis/accommodation/${hotel.slug}`}
      className={`reveal ${delay > 0 ? `reveal-d${delay}` : ""} group block bg-white border border-sand hover:border-gold transition-colors duration-300 overflow-hidden`}
    >
      <div className={`relative h-[200px] overflow-hidden ${hotel.gradient}`}>
        {hotel.image ? (
          <img
            src={hotel.image}
            alt={hotel.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0" style={{ backgroundImage: TEXTILE }} />
        )}
        <span className={`absolute top-4 left-4 z-10 text-[0.52rem] tracking-[0.2em] uppercase px-3 py-1 font-body ${tagCls}`} style={{ backdropFilter: "blur(8px)" }}>
          {hotel.tag.label}
        </span>
      </div>
      <div className="p-7">
        <h3 className="font-display text-[1.05rem] font-normal text-navy leading-[1.3] mb-1">{hotel.name}</h3>
        <p className="text-[0.6rem] tracking-wider uppercase text-ink-soft/55 mb-4 font-body">{hotel.type}</p>
        <p className="text-[0.8rem] text-ink-soft leading-[1.85] mb-4 font-body">{hotel.desc}</p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {hotel.highlights.map(h => (
            <span key={h} className="text-[0.56rem] tracking-[0.1em] uppercase text-ink-soft/55 border border-sand-light px-2.5 py-1 font-body">{h}</span>
          ))}
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-sand-light">
          <div>
            <div className="text-[0.6rem] text-ink-soft/50 font-body">From</div>
            <div className="font-display text-[1rem] text-navy">{hotel.price}</div>
          </div>
          <span className="text-[0.58rem] tracking-[0.16em] uppercase text-navy bg-gold px-4 py-2 group-hover:bg-gold-light transition-colors font-body">
            Book now
          </span>
        </div>
      </div>
    </Link>
  );
}
