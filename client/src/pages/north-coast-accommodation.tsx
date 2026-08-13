import { useState, useMemo } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Arch } from "@/components/ui/Arch";
import { useReveal } from "@/components/home/useReveal";
import { useHotelsBySlug } from "@/lib/useHotelsBySlug";
import { resolvePrice, parseAmount } from "@/lib/price";
import addressBeachImage from "@assets/Address beach Resort _1758144493080.jpg";
import vidaMarinaImage from "@assets/Vida Marina Resort Marassi _1758142322079.jpg";
import addressGolfImage from "@assets/Address Golf Resort_1758143858790.jpg";
import casaCookImage from "@assets/Casa Cook North Coast _001_1758143858816.png";
import jazAlmazaImage from "@assets/JAZ Almaza Beach-Resort_1758143858816.jpg";
import gHotelImage from "@assets/The G Hotel Seashell_1758142922930.png";
import rixosImage from "@assets/Rixos Premium Alamein_1758143858817.png";
import alAlameinImage from "@assets/Al Alamein Hotel__1758143858816.png";

/**
 * /north-coast/accommodation — listing for all 8 Mediterranean properties.
 *
 * Hotel names, types, and descriptions are drawn from the live detail
 * pages (SEO copy in *.tsx) to match what already ships in the DB —
 * prompt copy was only used for flavor paragraphs where the detail pages
 * were sparse.
 *
 * Structure (matches solei-north-coast-accommodation.html reference):
 *   Hero (coastal) → Sticky filter bar → Enquiry notice strip (coastal)
 *   → Hotels grouped by location (Marassi / Almaza Bay / El Alamein)
 *   → How reservations work (sand-light)
 *   → NC ↔ Siwa comparison (navy)
 *   → Experience upsell (white)
 *   → Closing (cream)
 */

type Category = "luxury" | "boutique" | "marassi" | "almaza" | "alamein";

interface Hotel {
  slug: string;
  name: string;
  type: string;
  desc: string;
  highlights: string[];
  price: string;
  categories: Category[];
  gradient: string;
  image?: string;
  /** Top-left chip on the thumbnail. */
  topTag: { label: string; variant: "luxury" | "boutique" | "resort" };
  /** Top-right "Enquire" chip. */
  rightTag?: string;
  /** Featured layout: spans the full grid width as an editorial card. */
  featured?: boolean;
}

const marassi: Hotel[] = [
  {
    slug: "address-beach-resort-marassi",
    name: "Address Beach Resort Marassi",
    type: "Luxury Resort · Marassi · Direct beach access",
    desc: "A luxury beachfront property at Marassi offering rooms and suites with beach-to-lagoon views, world-class amenities, and direct Mediterranean access. Rooms face the sea. Evenings here are genuinely still.",
    highlights: [
      "Private beach",
      "Multiple pools",
      "Sea-facing rooms",
      "Fine dining",
      "Spa & wellness",
      "Kids club",
    ],
    price: "$290 / night",
    categories: ["luxury", "marassi"],
    gradient: "bg-[linear-gradient(155deg,#1a4a6a_0%,#0F2436_100%)]",
    image: addressBeachImage,
    topTag: { label: "Flagship Property", variant: "luxury" },
    rightTag: "Enquire to book",
    featured: true,
  },
  {
    slug: "vida-marina-resort-marassi",
    name: "Vida Marina Resort Marassi",
    type: "Luxury Resort · Marassi Marina · Mediterranean front",
    desc: "Upscale marina living — superior to suite accommodations with marina views, complimentary minibars, and access to the exclusive Marassi lifestyle. The most social of the Marassi properties; best for guests who want proximity to activity without being inside it.",
    highlights: [
      "Marina views",
      "Beach access",
      "Rooftop pool",
      "Water sports",
    ],
    price: "$210 / night",
    categories: ["luxury", "marassi"],
    gradient: "bg-[linear-gradient(155deg,#2F6F8F_0%,#1a4a6a_100%)]",
    image: vidaMarinaImage,
    topTag: { label: "Marina · Sea views", variant: "resort" },
    rightTag: "Enquire",
  },
  {
    slug: "address-marassi-golf-resort",
    name: "Address Marassi Golf Resort",
    type: "Golf Resort · Marassi · 18-hole course",
    desc: "A golf-focused resort at Marassi featuring championship course views, deluxe to suite accommodations, and premium golf amenities. Rooms overlook either the fairways or the sea. A quieter, more composed option suited to guests who want to play in the morning and rest properly in the afternoon.",
    highlights: [
      "18-hole golf course",
      "Sea view rooms",
      "Clubhouse dining",
      "Spa access",
    ],
    price: "$240 / night",
    categories: ["luxury", "marassi"],
    gradient: "bg-[linear-gradient(155deg,#2F6F8F_0%,#1a3a52_100%)]",
    image: addressGolfImage,
    topTag: { label: "Golf · Sea views", variant: "luxury" },
    rightTag: "Enquire",
  },
  {
    slug: "casa-cook-north-coast",
    name: "Casa Cook North Coast",
    type: "Boutique Resort · Design hotel · Beachfront",
    desc: "Minimalist beachfront luxury with Casa Cook's signature design — earthy tones, rattan, organic forms — that works unusually well against the Egyptian coastal landscape. For guests who travel slowly and notice the details most resorts overlook. Smaller, quieter, more considered.",
    highlights: [
      "Design-led rooms",
      "Beach club",
      "Yoga & wellness",
      "Adults-friendly",
    ],
    price: "$195 / night",
    categories: ["boutique", "marassi"],
    gradient: "bg-[linear-gradient(155deg,#235570_0%,#2F6F8F_100%)]",
    image: casaCookImage,
    topTag: { label: "Boutique · Design-led", variant: "boutique" },
    rightTag: "Enquire",
  },
];

const almaza: Hotel[] = [
  {
    slug: "jaz-almaza-beach-resort",
    name: "Jaz Almaza Beach Resort",
    type: "Beach Resort · Almaza Bay · All-inclusive option",
    desc: "On Almaza Bay's most praised stretch of beach — clear water, white sand, and a quality of light in the afternoons that photographers know about. Family-friendly with entertainment and all-inclusive available but not compulsory. Larger than Casa Cook but less frenetic than Marassi.",
    highlights: [
      "Private beach",
      "Crystal clear water",
      "Multiple restaurants",
      "Water sports centre",
    ],
    price: "$175 / night",
    categories: ["luxury", "almaza"],
    gradient: "bg-[linear-gradient(155deg,#1d5070_0%,#0F2436_100%)]",
    image: jazAlmazaImage,
    topTag: { label: "Almaza Bay · Beach", variant: "resort" },
    rightTag: "Enquire",
  },
  {
    slug: "the-g-hotel-seashell",
    name: "The G Hotel Seashell",
    type: "Boutique Hotel · Almaza Bay · Intimate",
    desc: "A boutique beachfront resort with villa options up to five bedrooms and direct white-sand beach access. One of Almaza Bay's smaller, more intimate options — fewer rooms, more attention per guest, without the crowds of the larger resort complexes.",
    highlights: [
      "5-bedroom villas",
      "Beach access",
      "Personalised service",
      "Quiet location",
    ],
    price: "$185 / night",
    categories: ["boutique", "almaza"],
    gradient: "bg-[linear-gradient(155deg,#163a52_0%,#2F6F8F_100%)]",
    image: gHotelImage,
    topTag: { label: "Boutique · Almaza Bay", variant: "boutique" },
    rightTag: "Enquire",
  },
];

const alamein: Hotel[] = [
  {
    slug: "rixos-premium-alamein",
    name: "Rixos Premium Alamein",
    type: "Premium Resort · El Alamein · Ultra all-inclusive",
    desc: "Premium all-inclusive done at its most comprehensive — private beach, multiple restaurants and bars, entertainment, spa, and a genuinely expansive stretch of Mediterranean coast. Particularly suited to families or guests who want everything on site. The largest and most self-contained property in our portfolio.",
    highlights: [
      "Ultra all-inclusive",
      "Private beach",
      "5 restaurants",
      "Premium spa",
      "Kids waterpark",
    ],
    price: "$260 / night",
    categories: ["luxury", "alamein"],
    gradient: "bg-[linear-gradient(155deg,#1a3a52_0%,#2F6F8F_100%)]",
    image: rixosImage,
    topTag: { label: "Premium · All-inclusive", variant: "luxury" },
    rightTag: "Enquire",
  },
  {
    slug: "al-alamein-hotel",
    name: "Al Alamein Hotel",
    type: "Heritage Hotel · El Alamein · Sea front",
    desc: "A beachfront resort at historic Al Alamein offering superior to family rooms with beach access and proximity to the WWII Museum. Older, quieter, and carrying a faded grandeur that suits the historical weight of this stretch of coast. Best for travellers who want to understand this part of Egypt more fully.",
    highlights: [
      "Sea front position",
      "Heritage character",
      "Near WWII museum",
      "Quiet location",
    ],
    price: "$175 / night",
    categories: ["boutique", "alamein"],
    gradient: "bg-[linear-gradient(155deg,#0F2436_0%,#3d8aad_100%)]",
    image: alAlameinImage,
    topTag: { label: "Heritage · Coastal", variant: "boutique" },
    rightTag: "Enquire",
  },
];

const allHotels = [...marassi, ...almaza, ...alamein];

const filters = [
  { id: "all", label: "All" },
  { id: "luxury", label: "Luxury" },
  { id: "boutique", label: "Boutique" },
  { id: "marassi", label: "Marassi" },
  { id: "almaza", label: "Almaza Bay" },
  { id: "alamein", label: "El Alamein" },
] as const;

type FilterId = (typeof filters)[number]["id"];

const topTagClass = {
  luxury: "text-gold bg-navy-deep/75",
  boutique: "text-white/75 bg-navy-deep/65",
  resort: "text-[#b8d4e6] bg-navy-deep/65",
} as const;

const howSteps = [
  {
    n: "1.",
    title: "Tell us what you need",
    text: "Property preference, dates, number of guests, any special requests. The enquiry form takes two minutes.",
  },
  {
    n: "2.",
    title: "We confirm with the property",
    text: "Our team contacts the hotel directly and checks your exact room type — not just availability in general.",
  },
  {
    n: "3.",
    title: "Receive your payment link",
    text: "A secure Tab.travel payment link arrives via WhatsApp or email within 24 hours. Pay in USD.",
  },
  {
    n: "4.",
    title: "Full confirmation & welcome letter",
    text: "Everything you need for arrival, plus our personal recommendations for the coast — not a generic list.",
  },
];

const upsellMoments = [
  {
    slug: "private-yacht-sunset-ritual",
    title: "Private yacht sunset ritual",
    detail: "Sunset · 3 hours · From $120pp",
  },
  {
    slug: "signature-dinner-experience",
    title: "Signature dinner experience",
    detail: "Evening · 3 hours · From $140pp",
  },
  {
    slug: "coastal-wellness-ritual",
    title: "Coastal wellness ritual",
    detail: "Morning · Half day · From $130pp",
  },
  {
    slug: "beach-club-experience",
    title: "Beach club experience",
    detail: "Day · Flexible · From $75pp",
  },
];

interface LocationGroup {
  id: Category;
  title: string;
  titleTail: string;
  desc: string;
  hotels: Hotel[];
}

const groups: LocationGroup[] = [
  {
    id: "marassi",
    title: "Marassi",
    titleTail: "— the flagship development",
    desc: "Egypt's most celebrated coastal resort community. Four properties, direct Mediterranean frontage, and a marina that sets the tone.",
    hotels: marassi,
  },
  {
    id: "almaza",
    title: "Almaza Bay",
    titleTail: "— Egypt's clearest water",
    desc: "Further east along the coast. Less developed, quieter, and widely regarded as home to the North Coast's most beautiful sea.",
    hotels: almaza,
  },
  {
    id: "alamein",
    title: "El Alamein",
    titleTail: "— history meets the coast",
    desc: "Where WWII history meets the Mediterranean. A quieter, more serious stretch of coast — ideal for those combining heritage visits with coastal rest.",
    hotels: alamein,
  },
];

export default function NorthCoastAccommodation() {
  useReveal();
  const [active, setActive] = useState<FilterId>("all");

  const overlays = useHotelsBySlug();

  const filteredGroups = useMemo(() => {
    const inlineSlugs = new Set(allHotels.map((h) => h.slug));
    const baseGroups = groups
      .map((g) => ({
        ...g,
        hotels: g.hotels
          // Drop any inline hotel that the API no longer returns
          // (drafted in the dashboard). The API is the source of truth.
          .filter((h) => overlays.has(h.slug))
          .filter(
            (h) =>
              active === "all" || h.categories.includes(active as Category),
          )
          .map((h): Hotel => {
            const o = overlays.get(h.slug)!;
            return {
              ...h,
              name: o.name || h.name,
              desc: o.blurb || h.desc,
              // Shared resolver — pins USD, strips a baked-in "From",
              // prefers the lowest room rate.
              price:
                resolvePrice({
                  pricePerNight: o.pricePerNight,
                  rooms: o.details?.rooms,
                  fallbackAmount: parseAmount(h.price),
                }).display || h.price,
              image: o.imageUrl || h.image,
            };
          }),
      }))
      .filter((g) => g.hotels.length > 0);

    const extras: Hotel[] = [];
    overlays.forEach((o, slug) => {
      if (!slug || inlineSlugs.has(slug)) return;
      if ((o as any).destination !== "north-coast") return;
      const cat = ((o as any).category as Category) || "luxury";
      const extraCats: Category[] = [cat];
      if (cat !== "luxury" && cat !== "boutique") extraCats.push("luxury");
      if (active !== "all" && !extraCats.includes(active as Category)) return;
      extras.push({
        slug,
        name: o.name || slug,
        type: "Partner Property · North Coast",
        desc: o.blurb || o.description || "",
        highlights: o.amenities || [],
        price:
          resolvePrice({
            pricePerNight: o.pricePerNight,
            rooms: o.details?.rooms,
          }).display || "On request",
        categories: extraCats,
        gradient: "bg-[linear-gradient(155deg,#1a4a6a_0%,#0F2436_100%)]",
        image: o.imageUrl,
        topTag: { label: "Partner property", variant: "resort" },
        rightTag: "Enquire",
      });
    });

    if (extras.length) {
      baseGroups.push({
        id: "marassi" as Category,
        title: "More",
        titleTail: "— additional properties",
        desc: "Recently added partner hotels along the North Coast.",
        hotels: extras,
      });
    }

    return baseGroups;
  }, [active, overlays]);

  const shownCount = filteredGroups.reduce(
    (sum, g) => sum + g.hotels.length,
    0,
  );

  return (
    <>
      <SEO
        title="North Coast Accommodation — 8 Curated Mediterranean Resorts | Soléi"
        description="Eight curated North Coast properties across Marassi, Almaza Bay, and El Alamein. Personally visited, personally endorsed. Enquiry-based reservations confirmed within 24 hours."
        path="/north-coast/accommodation"
      />
      <Nav />

      <main>
        {/* ── 1. Hero ─────────────────────────────────────────── */}
        <section className="relative bg-coastal overflow-hidden px-6 md:px-12 lg:px-20 pt-40 pb-20">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(155deg,#0F2436 0%,#2F6F8F 55%,#1a5a7a 100%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23FDFAF5' stroke-opacity='0.04' stroke-width='0.5'%3E%3Cpath d='M0 30 Q15 20 30 30 Q45 40 60 30'/%3E%3Cpath d='M0 45 Q15 35 30 45 Q45 55 60 45'/%3E%3Cpath d='M0 15 Q15 5 30 15 Q45 25 60 15'/%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
          <div className="relative z-[2] max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-24 items-end">
            <div>
              <p className="flex items-center gap-3 text-[0.58rem] tracking-[0.28em] uppercase text-white/25 mb-8 animate-fade-up animation-delay-200">
                <Link href="/" className="hover:text-gold transition-colors">
                  Soléi
                </Link>
                <span className="opacity-40">/</span>
                <Link
                  href="/north-coast"
                  className="hover:text-gold transition-colors"
                >
                  North Coast
                </Link>
                <span className="opacity-40">/</span>
                <span>Accommodation</span>
              </p>
              <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-6 animate-fade-up animation-delay-400">
                <span className="block w-[22px] h-px bg-gold opacity-50" />
                Where you stay
              </p>
              <h1
                className="font-display font-normal leading-[1.1] text-white animate-fade-up animation-delay-600"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)" }}
              >
                North Coast{" "}
                <em className="italic text-gold">accommodation.</em>
                <br />
                Eight properties. One shore.
              </h1>
            </div>

            <div
              className="pb-2 animate-fade-up"
              style={{ animationDelay: "0.7s" }}
            >
              <p className="text-[0.9rem] text-white/45 leading-[1.95] mb-8">
                Resorts and boutique stays along Egypt's Mediterranean coast —
                chosen because they understand the difference between a view
                and an experience. Every property here has been personally
                visited and personally endorsed.
              </p>
              <div className="flex gap-10 border-t border-white/15 pt-5">
                {[
                  { num: "8", label: "Properties" },
                  { num: "3", label: "Locations" },
                  { num: "$175", label: "Starting from" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-[2rem] font-normal text-gold leading-none">
                      {s.num}
                    </div>
                    <div className="text-[0.6rem] tracking-[0.18em] uppercase text-white/30 mt-1">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Sticky filter bar ────────────────────────────── */}
        <div className="sticky top-[64px] z-[40] bg-white/95 backdrop-blur-md border-b border-sand">
          <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row justify-between md:items-center gap-2 py-1">
            <div className="flex overflow-x-auto -mx-1">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActive(f.id)}
                  className={`px-4 md:px-5 py-4 text-[0.62rem] tracking-[0.18em] uppercase font-body whitespace-nowrap border-b-2 -mb-px transition-all duration-300
                    ${
                      active === f.id
                        ? "text-navy opacity-100 border-gold"
                        : "text-ink opacity-40 border-transparent hover:opacity-70"
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="text-[0.62rem] text-ink-soft pb-3 md:pb-0">
              Showing{" "}
              <span className="text-navy font-medium">{shownCount}</span>{" "}
              {shownCount === 1 ? "property" : "properties"}
            </div>
          </div>
        </div>

        {/* ── 3. Enquiry notice strip ────────────────────────── */}
        <section className="relative bg-coastal px-6 md:px-12 lg:px-20 py-6 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23FDFAF5' stroke-opacity='0.04' stroke-width='0.5'%3E%3Cpath d='M0 30 Q15 20 30 30 Q45 40 60 30'/%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
          <div className="relative z-[2] max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="text-[0.82rem] text-white/60 leading-[1.7]">
              <strong className="block font-display text-[0.95rem] text-white font-normal mb-0.5">
                North Coast reservations are personally handled by our team.
              </strong>
              Submit your dates and property preference — we'll confirm
              availability and send a secure payment link within 24 hours.
            </div>
            <Link
              href="/enquire"
              className="text-[0.6rem] tracking-[0.2em] uppercase text-navy bg-gold px-6 py-3 hover:bg-gold-light transition-colors whitespace-nowrap flex-shrink-0"
            >
              Make a reservation
            </Link>
          </div>
        </section>

        {/* ── 4. Hotels, grouped by location ─────────────────── */}
        <section className="bg-cream px-6 md:px-12 lg:px-20 pt-16 pb-24">
          <div className="max-w-5xl mx-auto">
            {filteredGroups.length === 0 ? (
              <div className="py-24 text-center">
                <p className="font-display italic text-[1.2rem] text-ink-soft">
                  No properties match this filter.
                </p>
                <button
                  onClick={() => setActive("all")}
                  className="mt-6 text-[0.62rem] tracking-[0.2em] uppercase text-gold hover:text-navy transition-colors"
                >
                  Show all properties →
                </button>
              </div>
            ) : (
              filteredGroups.map((g, gi) => (
                <div key={g.id}>
                  <div
                    className={`reveal flex flex-col md:flex-row justify-between items-start md:items-end gap-3 pb-5 mb-6 ${
                      gi === 0
                        ? "border-none pt-0"
                        : "border-t border-sand pt-12 mt-10"
                    }`}
                  >
                    <div>
                      <h2
                        className="font-display font-normal text-navy leading-[1.25]"
                        style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.8rem)" }}
                      >
                        {g.title}{" "}
                        <em className="italic text-coastal">{g.titleTail}</em>
                      </h2>
                      <p className="text-[0.8rem] text-ink-soft mt-1 max-w-[70ch]">
                        {g.desc}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]">
                    {g.hotels.map((h, i) =>
                      h.featured ? (
                        <FeaturedCard key={h.slug} hotel={h} delay={i} />
                      ) : (
                        <StandardCard
                          key={h.slug}
                          hotel={h}
                          delay={i % 3}
                        />
                      ),
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ── 5. How reservations work ───────────────────────── */}
        <section className="bg-sand-light px-6 md:px-12 lg:px-20 py-20 md:py-24">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-24 items-start">
            <div className="reveal">
              <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-6">
                <span className="block w-[22px] h-px bg-gold opacity-50" />
                How reservations work
              </p>
              <h2
                className="font-display font-normal text-navy leading-[1.25] mb-5"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
              >
                North Coast bookings are
                <br />
                <em className="italic text-coastal">personally handled.</em>
              </h2>
              <p className="text-[0.88rem] text-ink-soft leading-[1.95]">
                Unlike Siwa — where everything books directly on site — North
                Coast accommodation goes through our team first. We confirm
                availability with the property, match you to the right room
                type, and send a secure payment link. It takes up to 24 hours.
                That's a deliberate choice: North Coast properties are partner
                hotels, not our own, and we want to make sure what we send you
                is exactly right before asking you to pay for it.
              </p>
            </div>
            <ul className="reveal reveal-d1 list-none border-t border-sand">
              {howSteps.map((s, i) => (
                <li
                  key={s.n}
                  className={`flex gap-4 items-start py-4 ${
                    i === howSteps.length - 1
                      ? ""
                      : "border-b border-sand-light"
                  }`}
                >
                  <span className="font-display italic text-[0.9rem] text-gold/70 min-w-[20px] pt-[1px]">
                    {s.n}
                  </span>
                  <div className="text-[0.84rem] text-ink-soft leading-[1.75]">
                    <strong className="block text-navy font-normal mb-0.5">
                      {s.title}
                    </strong>
                    {s.text}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── 6. Siwa comparison ─────────────────────────────── */}
        <section className="relative bg-navy px-6 md:px-12 lg:px-20 py-20 md:py-24 overflow-hidden">
          <div className="absolute inset-0 textile-bg pointer-events-none" />
          <div className="relative z-[2] max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-[2px]">
            {/* North Coast (current) */}
            <div className="reveal border border-gold/15 p-8 md:p-10">
              <p className="flex items-center gap-2 text-[0.58rem] tracking-[0.3em] uppercase text-gold/65 mb-4">
                <span className="block w-3.5 h-px bg-gold opacity-50" />
                You are here
              </p>
              <h3 className="font-display text-[1.6rem] font-normal text-white leading-[1.2] mb-3">
                North <em className="italic text-gold">Coast</em>
              </h3>
              <p className="text-[0.84rem] text-white/40 leading-[1.85] mb-6">
                Sea, space, and a Mediterranean pace. Partner properties,
                personally curated. Enquiry-based booking handled by our team.
              </p>
              <ul className="list-none border-t border-white/[0.06]">
                {[
                  ["Booking method", "Enquiry → payment link"],
                  ["Response time", "Within 24 hours"],
                  ["Properties", "8 curated partner hotels"],
                  ["From Cairo", "~2.5 hours"],
                  ["Best season", "April–June, Sept–Nov"],
                ].map(([k, v]) => (
                  <li
                    key={k}
                    className="flex justify-between py-3 border-b border-white/[0.05] text-[0.8rem] last:border-b-0"
                  >
                    <span className="text-white/30">{k}</span>
                    <span className="text-white/65 text-right">{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Siwa (link) */}
            <Link
              href="/siwa-oasis/accommodation"
              className="reveal reveal-d1 bg-white/[0.04] border border-gold/15 p-8 md:p-10 hover:bg-coastal/10 transition-colors block group"
            >
              <p className="flex items-center gap-2 text-[0.58rem] tracking-[0.3em] uppercase text-gold/65 mb-4">
                <span className="block w-3.5 h-px bg-gold opacity-50" />
                Also explore
              </p>
              <h3 className="font-display text-[1.6rem] font-normal text-white leading-[1.2] mb-3">
                Siwa <em className="italic text-gold">Oasis</em>
              </h3>
              <p className="text-[0.84rem] text-white/40 leading-[1.85] mb-6">
                Desert, salt lakes, and the place this brand was built around.
                Our own eco-lodges. Books directly on site — no waiting.
              </p>
              <ul className="list-none border-t border-white/[0.06] mb-6">
                {[
                  ["Booking method", "Direct — live availability"],
                  ["Confirmation", "Instant"],
                  ["Properties", "8 incl. 2 Soléi-owned"],
                  ["From Cairo", "~8 hours"],
                  ["Best season", "Oct–April"],
                ].map(([k, v]) => (
                  <li
                    key={k}
                    className="flex justify-between py-3 border-b border-white/[0.05] text-[0.8rem] last:border-b-0"
                  >
                    <span className="text-white/30">{k}</span>
                    <span className="text-white/65 text-right">{v}</span>
                  </li>
                ))}
              </ul>
              <span className="inline-flex items-center gap-2 group-hover:gap-3 text-[0.6rem] tracking-[0.2em] uppercase text-gold opacity-70 group-hover:opacity-100 transition-all duration-300">
                View Siwa accommodation →
              </span>
            </Link>
          </div>
        </section>

        {/* ── 7. Experience upsell ───────────────────────────── */}
        <section className="bg-white px-6 md:px-12 lg:px-20 py-24 md:py-28">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 md:gap-24 items-center">
            <div className="reveal">
              <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-5">
                <span className="block w-[22px] h-px bg-gold opacity-50" />
                Complete your stay
              </p>
              <h2
                className="font-display font-normal text-navy leading-[1.2] mb-5"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
              >
                Don't just sleep on
                <br />
                the <em className="italic text-coastal">coast.</em>
              </h2>
              <p className="text-[0.88rem] text-ink-soft leading-[1.95] mb-8">
                The North Coast has more to offer than its resorts. Flamingos
                behind the lagoons, WWII battlefields thirty minutes from
                Marassi, open-water swims at dawn, private sunset sailing.
                Once your accommodation is confirmed, we'll invite you to add
                to your time here.
              </p>
              <Link
                href="/north-coast/experiences"
                className="inline-block text-[0.62rem] tracking-[0.2em] uppercase text-navy border border-sand px-8 py-3.5 hover:border-gold hover:text-gold transition-colors"
              >
                Explore experiences
              </Link>
            </div>

            <div className="reveal reveal-d1 flex flex-col gap-[2px]">
              {upsellMoments.map((m) => (
                <Link
                  key={m.slug}
                  href={`/north-coast/experiences/${m.slug}`}
                  className="flex items-center justify-between gap-4 px-7 py-5 bg-white border border-sand hover:border-gold hover:bg-cream transition-colors"
                >
                  <div>
                    <div className="font-display text-[1rem] text-navy leading-tight">
                      {m.title}
                    </div>
                    <div className="text-[0.68rem] text-ink-soft/50 mt-1">
                      {m.detail}
                    </div>
                  </div>
                  <span className="text-[0.58rem] tracking-[0.18em] uppercase text-gold/65 flex-shrink-0">
                    Add →
                  </span>
                </Link>
              ))}
              <Link
                href="/north-coast/experiences"
                className="flex items-center justify-between gap-4 px-7 py-5 bg-white border border-sand hover:border-gold hover:bg-cream transition-colors"
              >
                <div>
                  <div className="font-display text-[1rem] text-navy leading-tight">
                    View all North Coast experiences
                  </div>
                  <div className="text-[0.68rem] text-ink-soft/50 mt-1">
                    6 curated experiences available
                  </div>
                </div>
                <span className="text-[0.58rem] tracking-[0.18em] uppercase text-gold/65 flex-shrink-0">
                  See all →
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── 8. Closing ─────────────────────────────────────── */}
        <section className="bg-cream px-6 md:px-12 lg:px-20 py-24 md:py-28 text-center">
          <div className="max-w-[640px] mx-auto">
            <div className="flex justify-center mb-10">
              <Arch className="w-14 h-auto" />
            </div>
            <h2
              className="reveal font-display font-normal text-navy leading-[1.2] mb-5"
              style={{ fontSize: "clamp(1.7rem, 4vw, 3rem)" }}
            >
              Not sure which property
              <br />
              is <em className="italic text-coastal">right for you?</em>
            </h2>
            <p className="reveal text-[0.88rem] text-ink-soft leading-[1.95] mb-10">
              Tell us a little about how you travel — whether you want the
              heart of Marassi, the quiet of Almaza Bay, or the character of
              El Alamein — and we'll match you to the right fit before you
              commit to anything.
            </p>
            <div className="reveal flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
              <Link
                href="/enquire"
                className="text-[0.65rem] tracking-[0.2em] uppercase text-navy bg-gold px-10 py-4 hover:bg-gold-light transition-colors"
              >
                Ask us
              </Link>
              <Link
                href="/north-coast/experiences"
                className="text-[0.65rem] tracking-[0.2em] uppercase text-navy border border-sand px-10 py-4 hover:border-gold hover:text-gold transition-colors"
              >
                North Coast experiences
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
 * Card components
 * ────────────────────────────────────────────────────────────── */

const waveTex =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23FDFAF5' stroke-opacity='0.05' stroke-width='0.5'%3E%3Cpath d='M0 30 Q15 20 30 30 Q45 40 60 30'/%3E%3Cpath d='M0 45 Q15 35 30 45 Q45 55 60 45'/%3E%3C/g%3E%3C/svg%3E\")";

function Tag({
  label,
  variant,
  position,
}: {
  label: string;
  variant: "luxury" | "boutique" | "resort" | "enquire";
  position: "left" | "right";
}) {
  const cls =
    variant === "enquire"
      ? "text-white/75 bg-coastal/80"
      : topTagClass[variant];
  return (
    <span
      className={`absolute top-3 ${position === "left" ? "left-3" : "right-3"} text-[0.52rem] tracking-[0.2em] uppercase px-3 py-1 backdrop-blur-sm ${cls}`}
    >
      {label}
    </span>
  );
}

function FeaturedCard({ hotel, delay }: { hotel: Hotel; delay: number }) {
  return (
    <Link
      href={`/north-coast/accommodation/${hotel.slug}`}
      className={`reveal ${delay > 0 ? `reveal-d${delay}` : ""} col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 bg-white border border-sand hover:border-gold transition-colors duration-300 overflow-hidden group`}
    >
      <div className={`relative min-h-[260px] md:min-h-[300px] overflow-hidden ${hotel.gradient}`}>
        {hotel.image && (
          <img
            src={hotel.image}
            alt={hotel.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0" style={{ backgroundImage: waveTex }} />
        <Tag
          label={hotel.topTag.label}
          variant={hotel.topTag.variant}
          position="left"
        />
        {hotel.rightTag && (
          <Tag label={hotel.rightTag} variant="enquire" position="right" />
        )}
      </div>
      <div className="p-8 md:p-9 flex flex-col justify-between">
        <div>
          <h3 className="font-display text-[1.4rem] font-normal text-navy leading-[1.25] mb-1">
            {hotel.name}
          </h3>
          <p className="text-[0.62rem] tracking-wider uppercase text-ink-soft/50 mb-4">
            {hotel.type}
          </p>
          <p className="text-[0.88rem] text-ink-soft leading-[1.9] mb-5">
            {hotel.desc}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-5">
            {hotel.highlights.map((h) => (
              <span
                key={h}
                className="text-[0.58rem] tracking-[0.12em] uppercase text-ink-soft/55 border border-sand-light px-2.5 py-1"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-sand-light">
          <div>
            <div className="text-[0.62rem] text-ink-soft/45">From</div>
            <div className="font-display text-[1.1rem] text-navy">
              {hotel.price}
            </div>
          </div>
          <span className="text-[0.6rem] tracking-[0.16em] uppercase text-navy bg-gold px-4 py-2 group-hover:bg-gold-light transition-colors">
            Enquire to book
          </span>
        </div>
      </div>
    </Link>
  );
}

function StandardCard({ hotel, delay }: { hotel: Hotel; delay: number }) {
  return (
    <Link
      href={`/north-coast/accommodation/${hotel.slug}`}
      className={`reveal ${delay > 0 ? `reveal-d${delay}` : ""} group bg-white border border-sand hover:border-gold transition-colors duration-300 block overflow-hidden`}
    >
      <div className={`relative h-[220px] overflow-hidden ${hotel.gradient}`}>
        {hotel.image && (
          <img
            src={hotel.image}
            alt={hotel.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0" style={{ backgroundImage: waveTex }} />
        <Tag
          label={hotel.topTag.label}
          variant={hotel.topTag.variant}
          position="left"
        />
        {hotel.rightTag && (
          <Tag label={hotel.rightTag} variant="enquire" position="right" />
        )}
      </div>
      <div className="p-7">
        <h3 className="font-display text-[1.15rem] font-normal text-navy leading-[1.3] mb-1">
          {hotel.name}
        </h3>
        <p className="text-[0.62rem] tracking-wider uppercase text-ink-soft/50 mb-4">
          {hotel.type}
        </p>
        <p className="text-[0.82rem] text-ink-soft leading-[1.85] mb-4">
          {hotel.desc}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {hotel.highlights.map((h) => (
            <span
              key={h}
              className="text-[0.58rem] tracking-[0.12em] uppercase text-ink-soft/55 border border-sand-light px-2.5 py-1"
            >
              {h}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-sand-light">
          <div>
            <div className="text-[0.62rem] text-ink-soft/45">From</div>
            <div className="font-display text-[1.05rem] text-navy">
              {hotel.price}
            </div>
          </div>
          <span className="text-[0.6rem] tracking-[0.16em] uppercase text-coastal border border-coastal px-4 py-2 group-hover:bg-coastal group-hover:text-white transition-colors">
            Enquire →
          </span>
        </div>
      </div>
    </Link>
  );
}
