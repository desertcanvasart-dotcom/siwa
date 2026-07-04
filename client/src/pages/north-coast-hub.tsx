import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Arch } from "@/components/ui/Arch";
import { useReveal } from "@/components/home/useReveal";
import { useSiteContent, pickContent } from "@/lib/useSiteContent";
import { useActiveSlugs } from "@/lib/useActiveSlugs";
import vidaMarinaImage from "@assets/Vida Marina Resort Marassi _1758142322079.jpg";
import addressBeachImage from "@assets/Address beach Resort _1758144493080.jpg";
import casaCookImage from "@assets/Casa Cook North Coast _001_1758143858816.png";
import rixosImage from "@assets/Rixos Premium Alamein_1758143858817.png";
import jazAlmazaImage from "@assets/JAZ Almaza Beach-Resort_1758143858816.jpg";
import addressGolfImage from "@assets/Address Golf Resort_1758143858790.jpg";

/**
 * /north-coast — destination hub for Egypt's Mediterranean coast.
 *
 * Distinct from the Siwa hub in four ways (per spec):
 *   1. Hero uses coastal-blue gradient + wave texture + concentric circles
 *      (not navy + desert textile + arch).
 *   2. Every card says "Enquire" — reflects the Tab.travel payment-link flow.
 *   3. A dedicated "How booking works" coastal strip explains the 4-step flow.
 *   4. A Siwa crosslink sits near the bottom, pointing guests toward the
 *      two-destination journey.
 *
 * Section rhythm:
 *   Hero (coastal) → Intro (cream) → Different (white) → Accommodation (cream)
 *   → Booking strip (coastal) → Experiences (sand-light) → Transportation (white)
 *   → Practical (cream) → Siwa crosslink (sand-light) → Closing (navy)
 */

const hotels = [
  {
    slug: "vida-marina-resort-marassi",
    name: "Vida Marina Resort Marassi",
    type: "Resort · Marassi · Mediterranean front",
    desc: "Faces the Mediterranean directly. Clean lines, generous space, and a marina that earns the name.",
    price: "€210 / night",
    gradient: "bg-[linear-gradient(160deg,#2F6F8F_0%,#1a4a6a_100%)]",
    image: vidaMarinaImage,
  },
  {
    slug: "address-beach-resort-marassi",
    name: "Address Beach Resort Marassi",
    type: "Luxury Resort · Marassi · Beach",
    desc: "Refined and unhurried, positioned directly on the water. The coast at its most composed.",
    price: "€290 / night",
    gradient: "bg-[linear-gradient(160deg,#1a4a6a_0%,#0F2436_100%)]",
    image: addressBeachImage,
  },
  {
    slug: "casa-cook-north-coast",
    name: "Casa Cook North Coast",
    type: "Boutique Resort · North Coast",
    desc: "Bohemian in spirit, considered in execution. Designed for people who travel slowly and notice things.",
    price: "€195 / night",
    gradient: "bg-[linear-gradient(160deg,#235570_0%,#2F6F8F_100%)]",
    image: casaCookImage,
  },
  {
    slug: "rixos-premium-alamein",
    name: "Rixos Premium Alamein",
    type: "Premium Resort · El Alamein",
    desc: "All-inclusive done properly. Private beach, multiple restaurants, and a stretch of coast that feels genuinely expansive.",
    price: "€260 / night",
    gradient: "bg-[linear-gradient(160deg,#1a3a52_0%,#2F6F8F_100%)]",
    image: rixosImage,
  },
  {
    slug: "jaz-almaza-beach-resort",
    name: "Jaz Almaza Beach Resort",
    type: "Beach Resort · Almaza Bay",
    desc: "Almaza Bay's clearest water. A resort that keeps things simple and the beach genuinely beautiful.",
    price: "€175 / night",
    gradient: "bg-[linear-gradient(160deg,#1d5070_0%,#0F2436_100%)]",
    image: jazAlmazaImage,
  },
  {
    slug: "address-marassi-golf-resort",
    name: "Address Marassi Golf Resort",
    type: "Golf Resort · Marassi · Sea views",
    desc: "Eighteen holes, sea views, and the kind of morning that makes you extend your stay.",
    price: "€240 / night",
    gradient: "bg-[linear-gradient(160deg,#2F6F8F_0%,#1a3a52_100%)]",
    image: addressGolfImage,
  },
];

const experiences = [
  {
    slug: "private-yacht-sunset-ritual",
    num: "01",
    title: "Private yacht sunset ritual",
    desc: "An intimate escape into the Mediterranean at golden hour. The sea slows down, the light softens, and everything feels effortless.",
    meta: ["3 hours", "Sunset"],
  },
  {
    slug: "beach-club-experience",
    num: "02",
    title: "Beach club experience",
    desc: "A seamless day at one of the North Coast's most refined beach clubs — selected for atmosphere, not crowd.",
    meta: ["Day", "Flexible"],
  },
  {
    slug: "marassi-water-world-experience",
    num: "03",
    title: "Marassi water world",
    desc: "A vibrant day of energy and movement — slides, pools, and open-air moments balanced with comfort, space, and ease.",
    meta: ["Full day", "All ages"],
  },
  {
    slug: "signature-dinner-experience",
    num: "04",
    title: "Signature dinner experience",
    desc: "An intimate dining moment by the sea — curated in location, mood, and detail.",
    meta: ["3 hours", "Evening"],
  },
  {
    slug: "nightlife-experience",
    num: "05",
    title: "Nightlife experience",
    desc: "Curated evenings across the North Coast's most refined venues — music, atmosphere, and crowd in perfect balance.",
    meta: ["Night", "Flexible"],
  },
  {
    slug: "coastal-wellness-ritual",
    num: "06",
    title: "Coastal wellness ritual",
    desc: "A slow morning by the sea — breathwork, light movement, and a private massage to start the day.",
    meta: ["Half day", "Morning"],
  },
];

const contrasts = [
  {
    n: "I.",
    title: "Open water, not shared pools",
    desc: "Every property we list has direct or near-direct sea access. The Mediterranean, not a chlorinated approximation of it.",
  },
  {
    n: "II.",
    title: "Curated, not comprehensive",
    desc: "There are hundreds of resorts on the North Coast. We list the ones we'd actually recommend to someone we care about.",
  },
  {
    n: "III.",
    title: "September to June",
    desc: "The best version of the North Coast isn't summer. It's the shoulder seasons — warm water, cool evenings, and half the people.",
  },
];

const bookingSteps = [
  {
    n: "1",
    title: "Submit your request",
    text: "Tell us your dates, property preference, and number of guests. Takes two minutes.",
  },
  {
    n: "2",
    title: "We confirm availability",
    text: "Our team checks directly with the property and reviews your request within 24 hours.",
  },
  {
    n: "3",
    title: "Receive your payment link",
    text: "A secure payment link arrives via WhatsApp or email. Pay at your convenience.",
  },
  {
    n: "4",
    title: "Confirmation & welcome letter",
    text: "Full confirmation with everything you need — plus our recommendations for the coast.",
  },
];

const routes = [
  {
    slug: "cairo-north-coast",
    name: "Cairo → North Coast",
    detail: "~2.5 hours · Private vehicle · Desert Road or Coastal Road",
    type: "Private",
  },
  {
    slug: "alex-north-coast",
    name: "Alexandria → North Coast",
    detail: "~45 min – 1 hour · Private vehicle",
    type: "Private",
  },
  {
    slug: "cairo-alex-coast",
    name: "Cairo → Alexandria → Coast",
    detail: "~3.5 hours · Private vehicle · Full coastal approach",
    type: "Private",
  },
  {
    slug: "in-coast-transfers",
    name: "Between coastal properties",
    detail: "Marassi · Almaza Bay · El Alamein · Private vehicle",
    type: "Transfer",
  },
];

const practical = [
  {
    n: "I",
    title: "Best time to visit",
    desc: "April to June and September to November. Warm sea, manageable temperatures, and a fraction of the summer crowd. July and August are hot and heavily booked.",
  },
  {
    n: "II",
    title: "Getting there",
    desc: "No direct flights to the coast itself. Cairo International (2.5 hrs) and Borg El Arab Airport in Alexandria (45 min) are the main entry points. We arrange all transfers.",
  },
  {
    n: "III",
    title: "How long to stay",
    desc: "Three to five nights is ideal. Long enough to genuinely relax into the coast, short enough to leave wanting to return.",
  },
  {
    n: "IV",
    title: "Booking method",
    desc: "All North Coast accommodation is reservation-and-payment-link, not instant booking. Our team personally handles each request within 24 hours.",
  },
  {
    n: "V",
    title: "Currency & payment",
    desc: "Egyptian Pounds. All major resorts accept international cards. Payment for Soléi bookings is via secure link in EUR or USD.",
  },
  {
    n: "VI",
    title: "Combining with Siwa",
    desc: "Cairo sits between both destinations. Many guests do North Coast first, return to Cairo, then travel to Siwa. We design the full journey if you'd like.",
  },
];

/** Reusable wave-texture SVG background — distinct from the Siwa desert textile. */
const waveBg =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23FDFAF5' stroke-opacity='0.04' stroke-width='0.5'%3E%3Cpath d='M0 30 Q15 20 30 30 Q45 40 60 30'/%3E%3Cpath d='M0 45 Q15 35 30 45 Q45 55 60 45'/%3E%3Cpath d='M0 15 Q15 5 30 15 Q45 25 60 15'/%3E%3C/g%3E%3C/svg%3E\")";

const waveBgStrong =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23FDFAF5' stroke-opacity='0.06' stroke-width='0.5'%3E%3Cpath d='M0 30 Q15 20 30 30 Q45 40 60 30'/%3E%3Cpath d='M0 45 Q15 35 30 45 Q45 55 60 45'/%3E%3C/g%3E%3C/svg%3E\")";

export default function NorthCoastHub() {
  useReveal();
  const c = useSiteContent();

  // Hide drafted hotels / experiences using the live API slug sets.
  const liveHotels = useActiveSlugs("/api/hotels");
  const liveExperiences = useActiveSlugs("/api/experiences");
  const visibleHotels = liveHotels.loaded
    ? hotels.filter((h) => liveHotels.slugs.has(h.slug))
    : hotels;
  const visibleExperiences = liveExperiences.loaded
    ? experiences.filter((e) => liveExperiences.slugs.has(e.slug))
    : experiences;

  // Hero
  const heroEyebrow = pickContent(c, "nc_hub.hero.eyebrow", "Secondary destination");
  const heroTitle = pickContent(c, "nc_hub.hero.title", "The");
  const heroItalic = pickContent(c, "nc_hub.hero.italic", "Coast.");
  const heroLine2 = pickContent(c, "nc_hub.hero.line2", "Space. Sea. Silence.");
  const heroSub = pickContent(
    c,
    "nc_hub.hero.sub",
    "Egypt's quieter shore. Open Mediterranean, uncrowded stretches of sand, and resorts that understand the difference between service and intrusion.",
  );
  // Intro
  const introNum = pickContent(c, "nc_hub.intro.num", "02");
  const introLabel = pickContent(c, "nc_hub.intro.label", "The coast");
  const introTitle = pickContent(
    c,
    "nc_hub.intro.title",
    "Most people think of Egypt's North Coast as Sahel in August — crowded, loud, over-developed. That's one version.",
  );
  const introTitleItalic = pickContent(c, "nc_hub.intro.title_italic", "Soléi offers another.");
  const introP1 = pickContent(
    c,
    "nc_hub.intro.p1",
    "We've curated a selection of properties along the Mediterranean coast — resorts and boutique stays that were chosen because they understand what quiet luxury actually means. Not the loudest pool party. The most considered morning.",
  );
  const introP2 = pickContent(
    c,
    "nc_hub.intro.p2",
    "The North Coast is younger in our story than Siwa. It doesn't carry the same founding mythology. But it carries something else — openness, sea air, and a pace that Europeans who discover it tend to return to.",
  );
  // Different
  const diffEyebrow = pickContent(c, "nc_hub.different.eyebrow", "What to expect");
  const diffTitle = pickContent(c, "nc_hub.different.title", "Not the North Coast");
  const diffTitle2 = pickContent(c, "nc_hub.different.title_2", "most people");
  const diffItalic = pickContent(c, "nc_hub.different.italic", "know.");
  const diffBody = pickContent(
    c,
    "nc_hub.different.body",
    "The properties and experiences we offer here are chosen specifically because they sit apart from the mass-market coastal strip. Quieter. More considered. Further from the crowd.",
  );
  // Accommodation strip
  const accomEyebrow = pickContent(c, "nc_hub.accommodation.eyebrow", "Where you stay");
  const accomTitle = pickContent(c, "nc_hub.accommodation.title", "North Coast");
  const accomItalic = pickContent(c, "nc_hub.accommodation.italic", "accommodation");
  // Booking strip
  const bookingEyebrow = pickContent(c, "nc_hub.booking.eyebrow", "How booking works");
  const bookingTitle = pickContent(c, "nc_hub.booking.title", "North Coast reservations");
  const bookingTitle2 = pickContent(c, "nc_hub.booking.title_2", "are");
  const bookingItalic = pickContent(c, "nc_hub.booking.italic", "personally handled.");
  const bookingBody = pickContent(
    c,
    "nc_hub.booking.body",
    "Unlike our Siwa properties — which book directly online — North Coast reservations go through our team first. We confirm availability, match you to the right room, and send a secure payment link. It takes 24 hours, not 24 minutes. That's intentional.",
  );
  // Experiences strip
  const expEyebrow = pickContent(c, "nc_hub.experiences.eyebrow", "What you do");
  const expTitle = pickContent(c, "nc_hub.experiences.title", "North Coast");
  const expItalic = pickContent(c, "nc_hub.experiences.italic", "experiences");
  // Transport
  const trEyebrow = pickContent(c, "nc_hub.transport.eyebrow", "Getting here");
  const trTitle = pickContent(c, "nc_hub.transport.title", "Two hours from");
  const trItalic = pickContent(c, "nc_hub.transport.italic", "Cairo or Alexandria.");
  const trBody = pickContent(
    c,
    "nc_hub.transport.body",
    "The North Coast is Egypt's most accessible second destination. Cairo is two and a half hours by private vehicle. Alexandria is less than one. We arrange private transfers — nothing shared, nothing generic.",
  );
  const trCta = pickContent(c, "nc_hub.transport.cta", "View all routes");
  // Practical
  const pracEyebrow = pickContent(c, "nc_hub.practical.eyebrow", "Before you arrive");
  const pracTitle = pickContent(c, "nc_hub.practical.title", "Good to");
  const pracItalic = pickContent(c, "nc_hub.practical.italic", "know.");
  const pracCta = pickContent(c, "nc_hub.practical.cta", "Full travel guide →");
  // Siwa cross-link
  const xEyebrow = pickContent(c, "nc_hub.crosslink.eyebrow", "Also explore");
  const xTitle = pickContent(c, "nc_hub.crosslink.title", "Siwa");
  const xItalic = pickContent(c, "nc_hub.crosslink.italic", "Oasis.");
  const xBody = pickContent(
    c,
    "nc_hub.crosslink.body",
    "The other side of the Soléi story. Desert, salt lakes, and the place where this brand was born.",
  );
  const xCta = pickContent(c, "nc_hub.crosslink.cta", "Explore Siwa →");

  return (
    <>
      <SEO
        title="North Coast — Curated Mediterranean Resorts & Experiences | Soléi"
        description="Egypt's quieter shore. Curated resorts and boutique stays along the Mediterranean coast, plus private transportation from Cairo and Alexandria. Personally handled reservations."
        path="/north-coast"
      />
      <Nav />

      <main>
        {/* ── 1. Hero ─────────────────────────────────────────── */}
        <section className="relative min-h-screen bg-coastal overflow-hidden flex flex-col justify-end px-6 md:px-12 lg:px-20 pb-20 md:pb-24 pt-32">
          {/* Coastal gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(160deg, #0F2436 0%, #2F6F8F 60%, #1a5a7a 100%)",
            }}
          />
          {/* Wave texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: waveBg }}
          />

          {/* Concentric circles motif top-right */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "8%",
              right: "8%",
              width: "280px",
              height: "280px",
              border: "1px solid rgba(253,250,245,0.1)",
              borderRadius: "50%",
            }}
          >
            <div
              className="absolute rounded-full"
              style={{
                inset: "20px",
                border: "1px solid rgba(253,250,245,0.06)",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                inset: "50px",
                border: "1px solid rgba(184,154,91,0.2)",
              }}
            />
          </div>

          <div className="relative z-[2] max-w-[900px]">
            {/* Breadcrumb */}
            <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.28em] uppercase text-white/25 mb-10 animate-fade-up animation-delay-200">
              <Link href="/" className="text-white/25 hover:text-gold transition-colors">
                Soléi
              </Link>
              <span className="opacity-40">/</span>
              <span>North Coast</span>
            </p>

            <p className="flex items-center gap-4 text-[0.6rem] tracking-[0.42em] uppercase text-gold mb-6 animate-fade-up animation-delay-400">
              <span className="block w-7 h-px bg-gold opacity-50" />
              {heroEyebrow}
            </p>

            <h1
              className="font-display font-normal leading-[1.04] text-white mb-8 animate-fade-up animation-delay-600"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
            >
              {heroTitle} <em className="italic text-gold">{heroItalic}</em>
              <br />
              {heroLine2}
            </h1>

            <p className="text-[0.95rem] text-white/45 max-w-[52ch] leading-[1.95] mb-14 animate-fade-up animation-delay-800">
              {heroSub}
            </p>

            <div
              className="flex flex-wrap gap-[2px] animate-fade-up"
              style={{ animationDelay: "1.1s" }}
            >
              {[
                {
                  href: "/north-coast/accommodation",
                  label: "Accommodation",
                  active: true,
                },
                { href: "/north-coast/experiences", label: "Experiences" },
                { href: "/north-coast/transportation", label: "Transportation" },
              ].map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className={`text-[0.62rem] tracking-[0.18em] uppercase px-5 py-3
                    bg-white/[0.03] transition-colors
                    ${
                      p.active
                        ? "border border-gold text-gold"
                        : "border border-white/10 text-white/45 hover:border-gold hover:text-gold hover:bg-gold/[0.06]"
                    }`}
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </div>

          <div
            className="hidden md:flex absolute bottom-10 right-20 flex-col items-center gap-2.5 z-[5] animate-fade-up"
            style={{ animationDelay: "1.5s" }}
          >
            <div className="w-px h-14 bg-gradient-to-b from-gold/70 to-transparent animate-scroll-pulse" />
            <span className="text-[0.55rem] tracking-[0.3em] uppercase text-white/20 [writing-mode:vertical-rl]">
              Explore
            </span>
          </div>
        </section>

        {/* ── 2. Intro ───────────────────────────────────────── */}
        <section className="bg-cream px-6 md:px-12 lg:px-20 py-28 md:py-32">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-12 md:gap-32 items-start">
            <aside className="md:sticky md:top-[40vh]">
              <div
                className="reveal font-display font-normal text-sand leading-[1] select-none"
                style={{ fontSize: "clamp(4.5rem, 10vw, 7rem)", opacity: 0.6 }}
              >
                {introNum}
              </div>
              <p className="reveal reveal-d1 text-[0.62rem] tracking-[0.3em] uppercase text-coastal mt-2">
                {introLabel}
              </p>
            </aside>

            <div>
              <p
                className="reveal font-display font-normal text-navy leading-[1.45] mb-8"
                style={{ fontSize: "clamp(1.4rem, 2.8vw, 2.2rem)" }}
              >
                {introTitle}{" "}
                <em className="italic text-coastal">{introTitleItalic}</em>
              </p>
              <div className="reveal reveal-d1 w-10 h-px bg-gold/50 my-10" />
              <p className="reveal reveal-d1 text-[0.95rem] text-ink-soft leading-[1.95] mb-6">
                {introP1}
              </p>
              <p className="reveal reveal-d2 text-[0.95rem] text-ink-soft leading-[1.95]">
                {introP2}
              </p>
            </div>
          </div>
        </section>

        {/* ── 3. What makes it different ─────────────────────── */}
        <section className="bg-white px-6 md:px-12 lg:px-20 py-28 md:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-end mb-16">
              <div>
                <p className="reveal flex items-center gap-3 text-[0.62rem] tracking-[0.38em] uppercase text-gold mb-6">
                  <span className="block w-[22px] h-px bg-gold opacity-50" />
                  {diffEyebrow}
                </p>
                <h2
                  className="reveal font-display font-normal text-navy leading-[1.2]"
                  style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
                >
                  {diffTitle}
                  <br />
                  {diffTitle2} <em className="italic text-coastal">{diffItalic}</em>
                </h2>
              </div>
              <p className="reveal text-[0.9rem] text-ink-soft leading-[1.95]">
                {diffBody}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
              {contrasts.map((c, i) => (
                <div
                  key={c.n}
                  className={`reveal ${i === 0 ? "" : `reveal-d${i}`} border border-sand bg-white p-8 md:p-10 hover:border-gold hover:bg-cream transition-[border-color,background-color] duration-500`}
                >
                  <span className="font-display italic text-[0.82rem] text-coastal/70 mb-5 block">
                    {c.n}
                  </span>
                  <h3 className="font-display text-[1.2rem] font-normal leading-[1.3] text-navy mb-3">
                    {c.title}
                  </h3>
                  <p className="text-[0.84rem] text-ink-soft leading-[1.9]">
                    {c.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. Accommodation ───────────────────────────────── */}
        <section className="bg-cream px-6 md:px-12 lg:px-20 py-28 md:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
              <div className="reveal">
                <p className="flex items-center gap-3 text-[0.62rem] tracking-[0.38em] uppercase text-gold mb-4">
                  <span className="block w-[22px] h-px bg-gold opacity-50" />
                  {accomEyebrow}
                </p>
                <h2
                  className="font-display font-normal text-navy leading-[1.2]"
                  style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
                >
                  {accomTitle}{" "}
                  <em className="italic text-coastal">{accomItalic}</em>
                </h2>
              </div>
              <Link
                href="/north-coast/accommodation"
                className="reveal text-[0.6rem] tracking-[0.2em] uppercase text-navy opacity-35 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]">
              {visibleHotels.map((h, i) => (
                <Link
                  key={h.slug}
                  href={`/north-coast/accommodation/${h.slug}`}
                  className={`reveal ${i % 3 === 0 ? "" : `reveal-d${i % 3}`} bg-white border border-sand hover:border-gold transition-colors duration-300 block overflow-hidden`}
                >
                  <div className={`relative h-[200px] overflow-hidden ${h.gradient}`}>
                    {h.image && (
                      <img
                        src={h.image}
                        alt={h.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                    <div
                      className="absolute inset-0"
                      style={{ backgroundImage: waveBgStrong }}
                    />
                    <span className="absolute top-3 right-3 z-10 text-[0.52rem] tracking-[0.2em] uppercase text-white bg-coastal/75 backdrop-blur-sm px-3 py-1">
                      Enquire to book
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-[1.05rem] font-normal text-navy leading-[1.3] mb-1">
                      {h.name}
                    </h3>
                    <p className="text-[0.65rem] tracking-wider uppercase text-ink-soft/50 mb-3">
                      {h.type}
                    </p>
                    <p className="text-[0.8rem] text-ink-soft leading-[1.8] mb-4">
                      {h.desc}
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t border-sand-light">
                      <div>
                        <p className="text-[0.65rem] text-ink-soft/45">From</p>
                        <p className="font-display text-[1.05rem] text-navy">
                          {h.price}
                        </p>
                      </div>
                      <span className="text-[0.58rem] tracking-[0.15em] uppercase text-gold">
                        Enquire →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. How booking works (coastal strip) ───────────── */}
        <section className="relative bg-coastal px-6 md:px-12 lg:px-20 py-24 md:py-28 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: waveBg }}
          />
          <div className="relative z-[2] max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start">
            <div className="reveal">
              <p className="flex items-center gap-3 text-[0.62rem] tracking-[0.38em] uppercase text-gold mb-6">
                <span className="block w-[22px] h-px bg-gold opacity-50" />
                {bookingEyebrow}
              </p>
              <h2
                className="font-display font-normal text-white leading-[1.2] mb-5"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
              >
                {bookingTitle}
                <br />
                {bookingTitle2} <em className="italic text-gold">{bookingItalic}</em>
              </h2>
              <p className="text-[0.88rem] text-white/50 leading-[1.95]">
                {bookingBody}
              </p>
            </div>

            <ul className="reveal reveal-d1 list-none">
              {bookingSteps.map((s, i) => (
                <li
                  key={s.n}
                  className={`flex gap-5 items-start py-5 ${
                    i === bookingSteps.length - 1
                      ? ""
                      : "border-b border-white/10"
                  }`}
                >
                  <div className="w-7 h-7 rounded-full border border-gold/40 flex items-center justify-center flex-shrink-0 mt-[2px]">
                    <span className="font-display italic text-[0.75rem] text-gold">
                      {s.n}
                    </span>
                  </div>
                  <div className="text-[0.88rem] text-white/60 leading-[1.75]">
                    <strong className="block text-white font-normal mb-0.5">
                      {s.title}
                    </strong>
                    {s.text}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── 6. Experiences ─────────────────────────────────── */}
        <section className="bg-sand-light px-6 md:px-12 lg:px-20 py-28 md:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
              <div className="reveal">
                <p className="flex items-center gap-3 text-[0.62rem] tracking-[0.38em] uppercase text-gold mb-4">
                  <span className="block w-[22px] h-px bg-gold opacity-50" />
                  {expEyebrow}
                </p>
                <h2
                  className="font-display font-normal text-navy leading-[1.2]"
                  style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
                >
                  {expTitle}{" "}
                  <em className="italic text-coastal">{expItalic}</em>
                </h2>
              </div>
              <Link
                href="/north-coast/experiences"
                className="reveal text-[0.6rem] tracking-[0.2em] uppercase text-navy opacity-35 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]">
              {visibleExperiences.map((e, i) => (
                <Link
                  key={e.slug}
                  href={`/north-coast/experiences/${e.slug}`}
                  className={`reveal ${i % 3 === 0 ? "" : `reveal-d${i % 3}`} group bg-white border border-sand hover:border-gold hover:bg-cream transition-[border-color,background-color] duration-300 block p-8 md:p-9`}
                >
                  <p className="font-display italic text-[0.8rem] text-coastal/70 mb-6">
                    {e.num}
                  </p>
                  <h3 className="font-display text-[1.1rem] font-normal leading-[1.3] text-navy mb-2">
                    {e.title}
                  </h3>
                  <p className="text-[0.8rem] text-ink-soft leading-[1.85] mb-6">
                    {e.desc}
                  </p>
                  <div className="flex gap-4 text-[0.6rem] tracking-[0.15em] uppercase text-ink-soft/40 mb-5">
                    {e.meta.map((m) => (
                      <span key={m}>{m}</span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-2 group-hover:gap-3 text-[0.58rem] tracking-[0.2em] uppercase text-gold opacity-60 group-hover:opacity-100 transition-all duration-300">
                    Enquire →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. Transportation ──────────────────────────────── */}
        <section className="bg-white px-6 md:px-12 lg:px-20 py-28 md:py-32">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-28 items-start">
            <div className="reveal">
              <p className="flex items-center gap-3 text-[0.62rem] tracking-[0.38em] uppercase text-gold mb-6">
                <span className="block w-[22px] h-px bg-gold opacity-50" />
                {trEyebrow}
              </p>
              <h2
                className="font-display font-normal text-navy leading-[1.2] mb-5"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
              >
                {trTitle}
                <br />
                <em className="italic text-coastal">{trItalic}</em>
              </h2>
              <p className="text-[0.88rem] text-ink-soft leading-[1.95] mb-8">
                {trBody}
              </p>
              <Link
                href="/north-coast/transportation"
                className="inline-block text-[0.62rem] tracking-[0.2em] uppercase text-navy border border-sand px-8 py-3.5 hover:border-gold hover:text-gold transition-colors"
              >
                {trCta}
              </Link>
            </div>

            <div className="reveal reveal-d1 border-t border-sand">
              {routes.map((r) => (
                <Link
                  key={r.slug}
                  href={`/north-coast/transportation/${r.slug}`}
                  className="flex justify-between items-center py-5 border-b border-sand-light hover:opacity-60 transition-opacity gap-4"
                >
                  <div>
                    <p className="font-display text-[0.95rem] text-navy leading-tight">
                      {r.name}
                    </p>
                    <p className="text-[0.68rem] text-ink-soft/45 mt-1">
                      {r.detail}
                    </p>
                  </div>
                  <span className="text-[0.56rem] tracking-[0.2em] uppercase text-gold/65 flex-shrink-0">
                    {r.type} →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. Practical info ──────────────────────────────── */}
        <section className="bg-cream px-6 md:px-12 lg:px-20 py-28 md:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
              <div className="reveal">
                <p className="flex items-center gap-3 text-[0.62rem] tracking-[0.38em] uppercase text-gold mb-4">
                  <span className="block w-[22px] h-px bg-gold opacity-50" />
                  {pracEyebrow}
                </p>
                <h2
                  className="font-display font-normal text-navy leading-[1.2]"
                  style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
                >
                  {pracTitle} <em className="italic text-coastal">{pracItalic}</em>
                </h2>
              </div>
              <Link
                href="/north-coast-faq"
                className="reveal text-[0.6rem] tracking-[0.2em] uppercase text-navy opacity-35 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
              >
                {pracCta}
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]">
              {practical.map((p, i) => (
                <div
                  key={p.n}
                  className={`reveal ${i % 3 === 0 ? "" : `reveal-d${i % 3}`} bg-white border border-sand p-8 md:p-9`}
                >
                  <div className="w-9 h-9 border border-gold rounded-full flex items-center justify-center mb-5">
                    <span className="font-display italic text-[0.85rem] text-gold">
                      {p.n}
                    </span>
                  </div>
                  <h3 className="font-display text-[1.05rem] font-normal text-navy mb-2">
                    {p.title}
                  </h3>
                  <p className="text-[0.8rem] text-ink-soft leading-[1.85]">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 9. Siwa crosslink ──────────────────────────────── */}
        <section className="bg-sand-light px-6 md:px-12 lg:px-20 py-24 md:py-28">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-[3px]">
            {/* Big Siwa card */}
            <Link
              href="/siwa-oasis"
              className="reveal relative overflow-hidden bg-navy p-10 md:p-14 text-white hover:opacity-90 transition-opacity block"
            >
              <div className="absolute inset-0 textile-bg pointer-events-none" />
              <div className="relative z-[2]">
                <p className="flex items-center gap-2 text-[0.58rem] tracking-[0.3em] uppercase text-gold/70 mb-5">
                  <span className="block w-4 h-px bg-gold opacity-50" />
                  {xEyebrow}
                </p>
                <h3 className="font-display text-[1.6rem] md:text-[2.2rem] font-normal leading-[1.2] text-white mb-4">
                  {xTitle} <em className="italic text-gold">{xItalic}</em>
                </h3>
                <p className="text-[0.85rem] text-white/40 leading-[1.85] max-w-[36ch] mb-8">
                  {xBody}
                </p>
                <span className="inline-flex items-center gap-2 text-[0.6rem] tracking-[0.2em] uppercase text-gold">
                  {xCta}
                </span>
              </div>
            </Link>

            {/* Story card */}
            <Link
              href="/our-story"
              className="reveal reveal-d1 bg-white border border-sand p-8 md:p-10 flex flex-col justify-between hover:border-gold transition-colors"
            >
              <div>
                <p className="text-[0.58rem] tracking-[0.3em] uppercase text-gold/65 mb-4">
                  Who we are
                </p>
                <h3 className="font-display text-[1.2rem] md:text-[1.4rem] font-normal leading-[1.3] text-navy mb-4">
                  From Sea to <em className="italic text-coastal">Sands.</em>
                </h3>
                <p className="text-[0.82rem] text-ink-soft leading-[1.85] mb-7">
                  Why someone who grew up in Siwa Oasis came back to build a
                  travel brand — and why it started with the moments most
                  travelers never reach.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-[0.58rem] tracking-[0.2em] uppercase text-coastal">
                Read our story →
              </span>
            </Link>
          </div>
        </section>

        {/* ── 10. Closing ────────────────────────────────────── */}
        <section className="relative bg-navy px-6 md:px-12 lg:px-20 py-36 text-center overflow-hidden">
          <div className="absolute inset-0 textile-bg pointer-events-none" />
          <div className="relative z-[2] max-w-[680px] mx-auto">
            <div className="flex justify-center mb-12">
              <Arch className="w-14 h-auto" />
            </div>
            <h2
              className="reveal font-display font-normal text-white leading-[1.2] mb-6"
              style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)" }}
            >
              The coast is waiting.
              <br />
              <em className="italic text-gold">We'll take care of the rest.</em>
            </h2>
            <p className="reveal text-[0.88rem] text-white/40 leading-[1.95] mb-14">
              Tell us your dates, how many guests, and which property caught
              your eye. Our team will confirm availability and have everything
              ready within 24 hours.
            </p>
            <div className="reveal flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
              <Link
                href="/enquire"
                className="text-[0.65rem] tracking-[0.2em] uppercase text-navy bg-gold px-10 py-4 hover:bg-gold-light transition-colors"
              >
                Make a reservation
              </Link>
              <Link
                href="/north-coast/accommodation"
                className="text-[0.65rem] tracking-[0.2em] uppercase text-white border border-white/20 px-10 py-4 hover:border-gold hover:text-gold transition-colors"
              >
                View all properties
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
