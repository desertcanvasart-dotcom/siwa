import { useMemo, useState } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { useReveal } from "@/components/home/useReveal";
import { useExperiencesBySlug } from "@/lib/useExperiencesBySlug";
import { Arch } from "@/components/ui/Arch";
import yachtSunsetImg from "@assets/Pristine Beaches_1764585387661.jpg";
import beachClubImg from "@assets/water sports_1758262774773.jpg";
import waterWorldImg from "@assets/Water Sports_1764585780831.jpg";
import signatureDinnerImg from "@assets/candlelit-dinner-outdoor_1752959631145.jpg";
import nightlifeImg from "@assets/candlelit-dinner-indoor_1752959631119.jpg";
import wellnessImg from "@assets/morning-arond-the-pool_1752958525770.jpg";

/* ──────────────────────────────────────────────────────────────
 *  /north-coast/experiences
 *
 *  Coastal-blue archive. Every experience routes to /enquire
 *  rather than booking directly — the enquiry-based model is
 *  a deliberate contrast with Siwa.
 * ────────────────────────────────────────────────────────────── */

type Category = "water" | "leisure" | "dining" | "nightlife" | "wellness";

interface Experience {
  slug: string;
  enquirySlug: string;
  num: string;
  title: string;
  titleItalic?: string;
  desc: string;
  timeTag: string;
  catTag: string;
  meta: string[];
  highlights?: string[];
  price: number;
  priceSuffix?: string;
  cats: Category[];
  gradient: string;
  image?: string;
  featured?: boolean;
}

const SAIL_TEXTURE = "bg-[url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23FDFAF5' stroke-opacity='0.06' stroke-width='0.5'%3E%3Cpath d='M0 30 Q15 20 30 30 Q45 40 60 30'/%3E%3Cpath d='M0 45 Q15 35 30 45 Q45 55 60 45'/%3E%3C/g%3E%3C/svg%3E\")]";

const EXPERIENCES: Experience[] = [
  {
    slug: "private-yacht-sunset-ritual",
    enquirySlug: "yacht-sunset-nc",
    num: "01 · Hero experience",
    title: "Private Yacht",
    titleItalic: "Sunset Ritual",
    desc: "An intimate escape into the Mediterranean at golden hour. The sea slows down, the light softens, and everything feels effortless — a private vessel, the coast in the distance, and a few hours where the day finally breathes out.",
    timeTag: "Sunset · 3 hours",
    catTag: "Water · Private",
    meta: [],
    highlights: [
      "Private yacht",
      "Captain & crew",
      "Sunset timing",
      "Light refreshments",
    ],
    price: 120,
    priceSuffix: "per person",
    cats: ["water"],
    gradient: "bg-[linear-gradient(155deg,#2F6F8F_0%,#1a4a6a_100%)]",
    image: yachtSunsetImg,
    featured: true,
  },
  {
    slug: "beach-club-experience",
    enquirySlug: "beach-club-nc",
    num: "02",
    title: "Beach Club Experience",
    desc: "A seamless day at one of the North Coast's most refined beach clubs — selected for atmosphere, not crowd. Reserved seating, considered service, and the kind of slow afternoon that defines a coastal day done well.",
    timeTag: "Day · Flexible",
    catTag: "Leisure",
    meta: ["Full or half day", "Daytime", "Reservations included"],
    highlights: [
      "Reserved seating",
      "Beach club access",
      "Optional add-ons",
    ],
    price: 75,
    priceSuffix: "per person",
    cats: ["leisure"],
    gradient: "bg-[linear-gradient(155deg,#1a4060_0%,#0F2436_60%,#2a5a6a_100%)]",
    image: beachClubImg,
  },
  {
    slug: "marassi-water-world-experience",
    enquirySlug: "water-world-nc",
    num: "03",
    title: "Marassi",
    titleItalic: "Water World Experience",
    desc: "A vibrant day of energy and movement on the North Coast — where water, design, and atmosphere come together in a more playful side of the sea. For those seeking a lighter, more dynamic experience, Water World offers a curated escape into slides, pools, and open-air moments — balanced with comfort, space, and ease.",
    timeTag: "Full day",
    catTag: "Active · Leisure",
    meta: ["Full day", "All ages", "Family-friendly"],
    highlights: [
      "Full-day access to Marassi Water World",
      "Slides, pools & lazy river",
      "Poolside lounging areas",
      "Food & beverage available",
    ],
    price: 90,
    priceSuffix: "per person",
    cats: ["leisure", "water"],
    gradient: "bg-[linear-gradient(155deg,#1a5a7a_0%,#2F6F8F_100%)]",
    image: waterWorldImg,
  },
  {
    slug: "signature-dinner-experience",
    enquirySlug: "signature-dinner-nc",
    num: "04",
    title: "Signature Dinner",
    titleItalic: "Experience",
    desc: "An intimate dining moment by the sea — curated in location, mood, and detail. Whether it's a quiet table for two on the sand or a full private setup beneath the stars, the evening is shaped around how you want it to feel.",
    timeTag: "Evening · 3 hours",
    catTag: "Dining · Private",
    meta: ["Evening", "Reservations or private setup", "Curated menu"],
    highlights: [
      "Reserved or private setup",
      "Curated menu",
      "Optional styling",
    ],
    price: 140,
    priceSuffix: "per person",
    cats: ["dining"],
    gradient: "bg-[linear-gradient(155deg,#2a1a0a_0%,#0F2436_60%,#1a3a4a_100%)]",
    image: signatureDinnerImg,
  },
  {
    slug: "nightlife-experience",
    enquirySlug: "nightlife-nc",
    num: "05",
    title: "Nightlife Experience",
    desc: "Curated evenings across the North Coast's most refined venues — where music, atmosphere, and crowd come together in perfect balance. We handle the table, the access, and the route between, so the night feels handled before it begins.",
    timeTag: "Night · Flexible",
    catTag: "Nightlife · Private",
    meta: ["Night", "Reservations included", "Optional chauffeur"],
    highlights: [
      "Table reservations",
      "Venue access",
      "Optional chauffeur service",
    ],
    price: 110,
    priceSuffix: "per person",
    cats: ["nightlife"],
    gradient: "bg-[linear-gradient(155deg,#0a1828_0%,#1a3a52_60%,#0F2436_100%)]",
    image: nightlifeImg,
  },
  {
    slug: "coastal-wellness-ritual",
    enquirySlug: "wellness-nc",
    num: "06",
    title: "Coastal",
    titleItalic: "Wellness Ritual",
    desc: "A slow morning by the sea — designed to relax the body and clear the mind. Breathwork into movement into massage, with refreshments and time to do nothing afterwards. The quietest way to start a day on the coast.",
    timeTag: "Morning · Half day",
    catTag: "Wellness",
    meta: ["Half day", "Morning", "Spa or private setup"],
    highlights: [
      "Breathwork & light movement",
      "60-min private massage",
      "Tea, juice & light refreshments",
      "Spa or private setup",
    ],
    price: 130,
    priceSuffix: "per person",
    cats: ["wellness"],
    gradient: "bg-[linear-gradient(155deg,#3d8aad_0%,#1a4060_100%)]",
    image: wellnessImg,
  },
];

const FILTERS: { label: string; value: "all" | Category }[] = [
  { label: "All", value: "all" },
  { label: "Water", value: "water" },
  { label: "Leisure", value: "leisure" },
  { label: "Dining", value: "dining" },
  { label: "Nightlife", value: "nightlife" },
  { label: "Wellness", value: "wellness" },
];

const DIFFERENT = [
  {
    numeral: "I.",
    title: "Off-resort by design",
    desc: "Every experience listed here takes you outside the resort perimeter — not far, not dramatically, but far enough that the quality of what you see changes entirely.",
  },
  {
    numeral: "II.",
    title: "Enquiry-based, personally arranged",
    desc: "Unlike Siwa, where experiences book directly, all North Coast experiences go through our team. We confirm availability, match guides, and brief you personally before each one.",
  },
  {
    numeral: "III.",
    title: "Shoulder season is the right season",
    desc: "April–June and September–November. The sea is warm, the lagoons are full, the flamingos are present, and the coast is a fraction of its summer density.",
  },
];

const HOW_STEPS = [
  {
    n: "1.",
    strong: "Submit your enquiry",
    rest: "Experience name, preferred date, number of guests. The form at the bottom of this page takes two minutes.",
  },
  {
    n: "2.",
    strong: "We confirm with the guide",
    rest: "Our team checks availability directly and selects the right guide for your group size and pace.",
  },
  {
    n: "3.",
    strong: "Payment link sent",
    rest: "Secure payment via WhatsApp or email within 24 hours. No payment until confirmed.",
  },
  {
    n: "4.",
    strong: "Full briefing before the experience",
    rest: "Meeting point, timing, what to bring, and any specific notes — sent in advance so you can prepare properly.",
  },
];

const UPSELL_PROPS = [
  {
    slug: "address-beach-resort-marassi",
    name: "Address Beach Resort Marassi",
    type: "Luxury Resort · Marassi · Beach front",
    price: "From $290",
  },
  {
    slug: "casa-cook-north-coast",
    name: "Casa Cook North Coast",
    type: "Boutique Resort · Design-led",
    price: "From $195",
  },
  {
    slug: "jaz-almaza-beach-resort",
    name: "Jaz Almaza Beach Resort",
    type: "Beach Resort · Almaza Bay",
    price: "From $175",
  },
];

/* Inline SVG data URL for the coastal wave texture — used on hero + cards */
const WAVE_TEX_BG =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23FDFAF5' stroke-opacity='0.06' stroke-width='0.5'%3E%3Cpath d='M0 30 Q15 20 30 30 Q45 40 60 30'/%3E%3Cpath d='M0 45 Q15 35 30 45 Q45 55 60 45'/%3E%3C/g%3E%3C/svg%3E\")";

const WAVE_TEX_HERO =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23FDFAF5' stroke-opacity='0.04' stroke-width='0.5'%3E%3Cpath d='M0 30 Q15 20 30 30 Q45 40 60 30'/%3E%3Cpath d='M0 45 Q15 35 30 45 Q45 55 60 45'/%3E%3Cpath d='M0 15 Q15 5 30 15 Q45 25 60 15'/%3E%3C/g%3E%3C/svg%3E\")";

export default function NorthCoastExperiencesPage() {
  useReveal();
  const [cat, setCat] = useState<"all" | Category>("all");

  const overlays = useExperiencesBySlug();

  const overlayed = useMemo(
    () =>
      // Only keep experiences the API still publishes — drafted ones
      // are absent from the overlay map and drop out here. Until the
      // map loads (size 0) we show the inline list to avoid an empty flash.
      EXPERIENCES.filter((e) => overlays.size === 0 || overlays.has(e.slug)).map((e) => {
        const o = overlays.get(e.slug);
        if (!o) return e;
        return {
          ...e,
          title: o.title ? o.title.split(" ")[0] : e.title,
          titleItalic:
            o.title && o.title.includes(" ")
              ? o.title.substring(o.title.indexOf(" ") + 1)
              : e.titleItalic,
          desc: o.summary || o.description || e.desc,
          timeTag: o.duration || e.timeTag,
          catTag: o.category || e.catTag,
          price: o.pricePerPerson ? Number(o.pricePerPerson) : e.price,
          image: o.imageUrl || e.image,
        };
      }),
    [overlays],
  );

  const visible = useMemo(
    () => overlayed.filter((e) => cat === "all" || e.cats.includes(cat)),
    [cat, overlayed],
  );
  const featured = visible.find((e) => e.featured);
  const rest = visible.filter((e) => !e.featured);

  return (
    <>
      <SEO
        title="North Coast Experiences — Soléi"
        description="Six curated North Coast experiences — private sunset sailing, flamingo watching, El Alamein heritage, and more. Personally arranged by our team."
        path="/north-coast/experiences"
      />
      <Nav />

      <main>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-coastal px-6 md:px-12 lg:px-20 pt-32 pb-20">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(155deg, #0F2436 0%, #2F6F8F 55%, #1a5a7a 100%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: WAVE_TEX_HERO }}
          />

          <div className="relative z-[2] max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-end">
            <div>
              <p className="flex items-center gap-3 text-[0.58rem] tracking-[0.28em] uppercase text-white/25 mb-6 animate-fade-up animation-delay-200">
                <Link href="/" className="hover:text-gold transition-colors">
                  Soléi
                </Link>
                <span className="opacity-40">/</span>
                <Link href="/north-coast" className="hover:text-gold transition-colors">
                  North Coast
                </Link>
                <span className="opacity-40">/</span>
                <span>Experiences</span>
              </p>

              <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-5 animate-fade-up animation-delay-400">
                <span className="block w-[22px] h-px bg-gold opacity-50" />
                What you do
              </p>

              <h1
                className="font-display font-normal leading-[1.1] text-white animate-fade-up animation-delay-600"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)" }}
              >
                North Coast <em className="italic text-gold">experiences.</em>
                <br />
                Beyond the resort.
              </h1>
            </div>

            <div className="animate-fade-up animation-delay-800 pb-2">
              <p className="text-[0.9rem] text-white/40 leading-[1.95] mb-8">
                The North Coast has more to offer than its pools and beaches.
                Flamingos in the lagoons behind the resorts, WWII history
                thirty minutes from Marassi, open-water swims at dawn. We know
                what most guests miss — and we'll help you find it.
              </p>
              <div className="flex gap-10 border-t border-white/10 pt-6">
                {[
                  { num: "6", label: "Experiences" },
                  { num: "$30", label: "Starting from" },
                  { num: "24h", label: "Response time" },
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

        {/* ── FILTER BAR ──────────────────────────────────────── */}
        <div className="sticky top-[64px] z-[40] bg-white border-b border-sand">
          <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4">
            <div className="flex overflow-x-auto -mx-2 md:mx-0">
              {FILTERS.map((f) => {
                const active = cat === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setCat(f.value)}
                    className={`px-5 py-4 text-[0.62rem] tracking-[0.18em] uppercase font-body whitespace-nowrap border-b-2 transition-colors -mb-px ${
                      active
                        ? "text-navy border-gold"
                        : "text-ink/40 border-transparent hover:text-ink"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
            <div className="text-[0.62rem] text-ink-soft tracking-wide py-2 md:py-0">
              Showing <span className="text-navy font-medium">{visible.length}</span> experiences
            </div>
          </div>
        </div>

        {/* ── ENQUIRY NOTICE ──────────────────────────────────── */}
        <div className="relative overflow-hidden bg-coastal px-6 md:px-12 lg:px-20 py-6">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: WAVE_TEX_HERO }}
          />
          <div className="relative z-[2] max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-10">
            <div className="text-[0.82rem] text-white/60 leading-[1.7]">
              <strong className="block font-display text-[0.95rem] text-white font-normal mb-1">
                All North Coast experiences are arranged by our team.
              </strong>
              Enquire below — we confirm availability and send details within
              24 hours.
            </div>
            <Link
              href="/enquire"
              className="text-[0.6rem] tracking-[0.2em] uppercase text-navy bg-gold px-6 py-2.5 whitespace-nowrap flex-shrink-0 hover:bg-gold-light transition-colors"
            >
              Make an enquiry
            </Link>
          </div>
        </div>

        {/* ── PHILOSOPHY ──────────────────────────────────────── */}
        <section className="bg-cream px-6 md:px-12 lg:px-20 py-16 md:py-20 border-b border-sand">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <p
              className="reveal font-display italic font-normal leading-[1.45] text-navy"
              style={{ fontSize: "clamp(1.3rem, 2.5vw, 2rem)" }}
            >
              "Most guests who come to the North Coast never leave the resort
              perimeter. The ones who do are the ones who remember{" "}
              <em className="not-italic text-coastal">the trip.</em>"
            </p>
            <div className="reveal reveal-d1">
              <div className="w-9 h-px bg-gold opacity-50 mb-5" />
              <p className="text-[0.88rem] text-ink-soft leading-[1.95]">
                We don't offer the kind of experiences that appear on every
                coastal tourism list. What we offer is access to the parts of
                the North Coast that reward patience and a guide who knows
                where to go. Flamingo lagoons that are a fifteen-minute drive
                from your resort. A battlefield that most people fly home
                without having visited. A fishing spot with no name on any
                map.
              </p>
            </div>
          </div>
        </section>

        {/* ── WHAT MAKES NC DIFFERENT ─────────────────────────── */}
        <section className="bg-white px-6 md:px-12 lg:px-20 py-16 md:py-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]">
            {DIFFERENT.map((d, i) => (
              <div
                key={d.numeral}
                className={`reveal ${i === 1 ? "reveal-d1" : i === 2 ? "reveal-d2" : ""} border border-sand px-7 py-8 hover:border-gold hover:bg-cream transition-colors`}
              >
                <p className="font-display italic text-[0.8rem] text-coastal/70 mb-4">
                  {d.numeral}
                </p>
                <h3 className="font-display text-[1.1rem] font-normal text-navy mb-2">
                  {d.title}
                </h3>
                <p className="text-[0.82rem] text-ink-soft leading-[1.85]">
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── EXPERIENCES ─────────────────────────────────────── */}
        <section className="bg-cream px-6 md:px-12 lg:px-20 py-20 md:py-24">
          <div className="max-w-5xl mx-auto">
            {featured && <FeaturedCard exp={featured} />}

            {rest.length > 0 && (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]"
                style={{ marginTop: "2px" }}
              >
                {rest.map((exp, i) => (
                  <ExpCard
                    key={exp.slug}
                    exp={exp}
                    delayClass={i % 3 === 1 ? "reveal-d1" : i % 3 === 2 ? "reveal-d2" : ""}
                  />
                ))}
              </div>
            )}

            {visible.length === 0 && (
              <p className="text-center text-ink-soft py-12">
                No experiences match this filter.
              </p>
            )}
          </div>
        </section>

        {/* ── HOW IT WORKS ────────────────────────────────────── */}
        <section className="bg-sand-light px-6 md:px-12 lg:px-20 py-20 md:py-28">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">
            <div className="reveal">
              <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-5">
                <span className="block w-[22px] h-px bg-gold opacity-50" />
                How it works
              </p>
              <h2
                className="font-display font-normal text-navy leading-[1.25] mb-4"
                style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)" }}
              >
                North Coast experiences
                <br />
                are <em className="italic text-coastal">personally arranged.</em>
              </h2>
              <p className="text-[0.88rem] text-ink-soft leading-[1.95]">
                Unlike Siwa — where experiences book directly on site — all
                North Coast experiences go through our team. Guides are
                local, logistics are confirmed manually, and we brief you
                before each experience. It takes 24 hours, not 24 seconds.
                That's the difference.
              </p>
            </div>
            <ul className="reveal reveal-d1 border-t border-sand list-none">
              {HOW_STEPS.map((s, i) => (
                <li
                  key={s.n}
                  className={`flex gap-4 items-start py-4 ${
                    i === HOW_STEPS.length - 1 ? "" : "border-b border-sand-light"
                  }`}
                >
                  <span className="font-display italic text-[0.9rem] text-gold/70 min-w-5 pt-0.5">
                    {s.n}
                  </span>
                  <div className="text-[0.84rem] text-ink-soft leading-[1.75]">
                    <strong className="block text-navy font-normal mb-0.5">
                      {s.strong}
                    </strong>
                    {s.rest}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── ACCOMMODATION UPSELL ────────────────────────────── */}
        <section className="relative overflow-hidden bg-navy px-6 md:px-12 lg:px-20 py-20 md:py-24">
          <div className="absolute inset-0 textile-bg pointer-events-none" />
          <div className="relative z-[2] max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-10 md:gap-20 items-center">
            <div className="reveal">
              <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-4">
                <span className="block w-[22px] h-px bg-gold opacity-50" />
                Before the experience
              </p>
              <h2
                className="font-display font-normal leading-[1.2] text-white mb-4"
                style={{ fontSize: "clamp(1.4rem, 3vw, 2.4rem)" }}
              >
                Experiences work better when you're already{" "}
                <em className="italic text-gold">settled.</em>
              </h2>
              <p className="text-[0.88rem] text-white/40 leading-[1.95] mb-7">
                A flamingo morning lands differently when you're not rushing
                from an airport. A sunset sail is more peaceful when you've
                had a day to find the coast's rhythm. If you haven't booked
                accommodation yet — start there.
              </p>
              <Link
                href="/north-coast/accommodation"
                className="inline-block text-[0.62rem] tracking-[0.2em] uppercase text-navy bg-gold px-8 py-3 hover:bg-gold-light transition-colors"
              >
                View North Coast accommodation
              </Link>
            </div>

            <div className="reveal reveal-d1 flex flex-col gap-[2px]">
              {UPSELL_PROPS.map((p) => (
                <Link
                  key={p.slug}
                  href={`/north-coast/accommodation/${p.slug}`}
                  className="border border-gold/10 px-6 py-5 flex items-center justify-between hover:bg-coastal/10 hover:border-gold/30 transition-colors"
                >
                  <div>
                    <div className="font-display text-[0.95rem] text-white leading-tight">
                      {p.name}
                    </div>
                    <div className="text-[0.65rem] text-white/30 mt-0.5">
                      {p.type}
                    </div>
                  </div>
                  <span className="font-display text-[0.9rem] text-gold flex-shrink-0 ml-4">
                    {p.price}
                  </span>
                </Link>
              ))}
              <Link
                href="/north-coast/accommodation"
                className="border border-gold/10 px-6 py-5 flex items-center justify-between hover:bg-coastal/10 hover:border-gold/30 transition-colors"
              >
                <div>
                  <div className="font-display text-[0.95rem] text-white leading-tight">
                    View all 7 North Coast properties
                  </div>
                  <div className="text-[0.65rem] text-white/30 mt-0.5">
                    Marassi · Almaza Bay · El Alamein · From $175/night
                  </div>
                </div>
                <span className="font-display text-[0.9rem] text-gold flex-shrink-0 ml-4">
                  See all →
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── CROSSLINKS ──────────────────────────────────────── */}
        <section className="bg-white px-6 md:px-12 lg:px-20 py-16 md:py-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-[2px]">
            <Link
              href="/siwa-oasis/experiences"
              className="bg-navy p-10 block hover:opacity-80 transition-opacity group"
            >
              <p className="flex items-center gap-2 text-[0.58rem] tracking-[0.3em] uppercase text-gold/70 mb-4">
                <span className="block w-[14px] h-px bg-gold opacity-50" />
                Also explore
              </p>
              <h3 className="font-display text-[1.6rem] font-normal text-white leading-[1.2] mb-3">
                Siwa <em className="italic text-gold">experiences.</em>
              </h3>
              <p className="text-[0.84rem] text-white/40 leading-[1.85] mb-6">
                Ten curated experiences in the oasis — salt lake floats,
                desert stargazing, oracle temples. Most book directly on site.
              </p>
              <span className="flex items-center gap-2 text-[0.6rem] tracking-[0.2em] uppercase text-gold/70 group-hover:gap-3 transition-all">
                View Siwa experiences →
              </span>
            </Link>
            <Link
              href="/our-story"
              className="bg-sand-light border border-sand p-10 block hover:opacity-80 transition-opacity group"
            >
              <p className="flex items-center gap-2 text-[0.58rem] tracking-[0.3em] uppercase text-gold/70 mb-4">
                <span className="block w-[14px] h-px bg-gold opacity-50" />
                Why Soléi
              </p>
              <h3 className="font-display text-[1.6rem] font-normal text-navy leading-[1.2] mb-3">
                From Sea to <em className="italic text-coastal">Sands.</em>
              </h3>
              <p className="text-[0.84rem] text-ink-soft leading-[1.85] mb-6">
                Why someone who grew up in Siwa Oasis came back to build a
                travel brand — and what "the conditions for you to feel it"
                actually means in practice.
              </p>
              <span className="flex items-center gap-2 text-[0.6rem] tracking-[0.2em] uppercase text-coastal group-hover:gap-3 transition-all">
                Read our story →
              </span>
            </Link>
          </div>
        </section>

        {/* ── CLOSING ─────────────────────────────────────────── */}
        <section className="bg-cream px-6 md:px-12 lg:px-20 py-24 md:py-28 text-center">
          <div className="max-w-xl mx-auto">
            <div className="flex justify-center mb-10">
              <Arch className="w-14" />
            </div>
            <h2
              className="reveal font-display font-normal leading-[1.2] text-navy mb-5"
              style={{ fontSize: "clamp(1.7rem, 4vw, 3rem)" }}
            >
              Not sure which
              <br />
              experience is{" "}
              <em className="italic text-coastal">right for you?</em>
            </h2>
            <p className="reveal text-[0.88rem] text-ink-soft leading-[1.95] mb-10">
              Tell us how long you're staying, what you enjoy, and whether
              you're travelling as a couple, a family, or a group. We'll
              suggest the two or three experiences that will make your time
              on the coast feel complete.
            </p>
            <div className="reveal flex gap-4 justify-center flex-wrap">
              <Link
                href="/enquire"
                className="text-[0.65rem] tracking-[0.2em] uppercase text-navy bg-gold px-10 py-4 hover:bg-gold-light transition-colors"
              >
                Ask us
              </Link>
              <Link
                href="/north-coast/accommodation"
                className="text-[0.65rem] tracking-[0.2em] uppercase text-navy border border-sand px-10 py-4 hover:border-gold hover:text-gold transition-colors"
              >
                View accommodation
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
 *  Featured card (Private Sunset Sailing)
 * ────────────────────────────────────────────────────────────── */

function FeaturedCard({ exp }: { exp: Experience }) {
  return (
    <Link
      href={`/north-coast/experiences/${exp.slug}`}
      className="reveal grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-[2px] group"
    >
      <div
        className={`relative min-h-[240px] md:min-h-[360px] overflow-hidden ${exp.gradient}`}
      >
        {exp.image && (
          <img
            src={exp.image}
            alt={exp.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: WAVE_TEX_BG }}
        />
        <span className="absolute top-4 left-4 text-[0.5rem] tracking-[0.18em] uppercase text-[#B8D4E6]/90 bg-coastal/75 px-3 py-1 backdrop-blur-md">
          Enquire to book
        </span>
        <span className="absolute top-4 right-4 text-[0.5rem] tracking-[0.18em] uppercase text-white/65 bg-navy-deep/60 px-3 py-1 backdrop-blur-md">
          {exp.catTag}
        </span>
        <span className="absolute bottom-4 left-4 text-[0.52rem] tracking-[0.2em] uppercase text-gold bg-navy-deep/75 px-3 py-1 backdrop-blur-md">
          {exp.timeTag}
        </span>
      </div>
      <div className="bg-white border border-sand p-8 md:p-10 flex flex-col justify-between group-hover:border-gold transition-colors">
        <div>
          <p className="font-display italic text-[0.78rem] text-coastal/65 mb-3">
            {exp.num}
          </p>
          <h3
            className="font-display font-normal leading-[1.2] text-navy mb-4"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
          >
            {exp.title}{" "}
            {exp.titleItalic && (
              <em className="italic text-coastal">{exp.titleItalic}</em>
            )}
          </h3>
          <p className="text-[0.9rem] text-ink-soft leading-[1.95] mb-6">
            {exp.desc}
          </p>
          {exp.highlights && (
            <div className="flex flex-wrap gap-2 mb-6">
              {exp.highlights.map((h) => (
                <span
                  key={h}
                  className="text-[0.58rem] tracking-[0.1em] uppercase text-ink-soft/55 border border-sand-light px-2.5 py-1"
                >
                  {h}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-between items-center pt-6 border-t border-sand">
          <div>
            <div className="text-[0.62rem] text-ink-soft/45">From</div>
            <div className="font-display text-[1.3rem] text-navy">
              ${exp.price}{" "}
              <span className="font-body text-[0.8rem] text-ink-soft font-light">
                {exp.priceSuffix ?? "per person"}
              </span>
            </div>
          </div>
          <span className="text-[0.62rem] tracking-[0.18em] uppercase text-white bg-coastal px-7 py-3 whitespace-nowrap group-hover:bg-[#266080] transition-colors">
            Enquire to book
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ──────────────────────────────────────────────────────────────
 *  Standard card
 * ────────────────────────────────────────────────────────────── */

function ExpCard({
  exp,
  delayClass,
}: {
  exp: Experience;
  delayClass: string;
}) {
  return (
    <Link
      href={`/north-coast/experiences/${exp.slug}`}
      className={`reveal ${delayClass} bg-white border border-sand flex flex-col hover:border-gold hover:bg-cream transition-colors overflow-hidden group`}
    >
      <div className={`relative h-[200px] overflow-hidden ${exp.gradient}`}>
        {exp.image && (
          <img
            src={exp.image}
            alt={exp.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: WAVE_TEX_BG }}
        />
        <span className="absolute top-4 left-4 text-[0.5rem] tracking-[0.18em] uppercase text-[#B8D4E6]/90 bg-coastal/75 px-3 py-1 backdrop-blur-md">
          Enquire
        </span>
        <span className="absolute top-4 right-4 text-[0.5rem] tracking-[0.18em] uppercase text-white/65 bg-navy-deep/60 px-3 py-1 backdrop-blur-md">
          {exp.catTag}
        </span>
        <span className="absolute bottom-4 left-4 text-[0.52rem] tracking-[0.2em] uppercase text-gold bg-navy-deep/75 px-3 py-1 backdrop-blur-md">
          {exp.timeTag}
        </span>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <p className="font-display italic text-[0.78rem] text-coastal/65 mb-3">
          {exp.num}
        </p>
        <h3 className="font-display text-[1.1rem] font-normal leading-snug text-navy mb-3">
          {exp.title}
          {exp.titleItalic && (
            <>
              {" "}
              <em className="italic text-coastal">{exp.titleItalic}</em>
            </>
          )}
        </h3>
        <p className="text-[0.82rem] text-ink-soft leading-[1.85] mb-4 flex-1">
          {exp.desc}
        </p>
        <div className="flex gap-4 flex-wrap mb-4">
          {exp.meta.map((m, i) => (
            <span
              key={m}
              className="flex items-center gap-1.5 text-[0.6rem] tracking-wide uppercase text-ink-soft/50"
            >
              {i > 0 && (
                <span className="block w-[3px] h-[3px] rounded-full bg-gold opacity-50" />
              )}
              {m}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-sand-light mt-auto">
          <div>
            <div className="text-[0.62rem] text-ink-soft/45">From</div>
            <div className="font-display text-[1.05rem] text-navy">
              ${exp.price} pp
            </div>
          </div>
          <span className="text-[0.58rem] tracking-[0.16em] uppercase text-white bg-coastal px-4 py-2 whitespace-nowrap group-hover:bg-[#266080] transition-colors">
            Enquire →
          </span>
        </div>
      </div>
    </Link>
  );
}
