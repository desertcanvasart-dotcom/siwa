import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Arch } from "@/components/ui/Arch";
import { useReveal } from "@/components/home/useReveal";
import { useSiteContent, pickContent } from "@/lib/useSiteContent";
import { useActiveSlugs } from "@/lib/useActiveSlugs";

/**
 * /siwa-oasis — primary destination hub.
 *
 * Section rhythm (matches solei-siwa-hub.html reference):
 *   1. Hero (navy + textile + arch + coastal glow)
 *   2. Intro — cream, sticky "01" + founder-voice copy
 *   3. Moments — white, 3-col
 *   4. The Lodge — navy, 2-col with detail list
 *   5. Accommodation — cream, 6 Siwa hotels in 3×2 grid
 *   6. Experiences — sand-light, 6 experiences in 3×2 grid
 *   7. Transportation — white, 2-col with route list
 *   8. Practical info — cream, 6 items in 3×2 grid
 *   9. Closing — navy, Arch + 2 CTAs
 */

const hotels = [
  {
    slug: "adrere-amellal",
    name: "Adrere Amellal",
    type: "Eco Lodge · No electricity",
    desc: "Built from karsheef and palm wood. No electricity, no noise. Just the oasis as it has always been.",
    price: "$320 / night",
    image: "/attached_assets/adrerre-amelal_1751755031600.jpg",
    gradient: "bg-[linear-gradient(160deg,#1a3a52_0%,#0F2436_100%)]",
  },
  {
    slug: "taziry-ecolodge",
    name: "Taziry Ecolodge",
    type: "Boutique Lodge · Salt lake views",
    desc: "Mud-brick villas overlooking the salt lake. Quiet mornings, warm evenings, the stars at night.",
    price: "$180 / night",
    image: "/attached_assets/taziry-room-_1751754795479.jpg",
    gradient: "bg-[linear-gradient(160deg,#0F2436_0%,#0d3040_100%)]",
  },
  {
    slug: "solei-old-town",
    name: "Soléi Old Town",
    type: "Heritage Stay · Old City",
    desc: "Stone walls, cool interiors, a rooftop overlooking the shali fortress at dusk.",
    price: "$145 / night",
    image: "/attached_assets/Solei Ol town_1763854758397.png",
    gradient: "bg-[linear-gradient(160deg,#162d3e_0%,#1a3a52_100%)]",
  },
  {
    slug: "siwa-shali-resort",
    name: "Siwa Shali Resort",
    type: "Resort · Garden & Pool",
    desc: "A palm-shaded retreat with a pool and gardens, moments from the shali ruins.",
    price: "$110 / night",
    image: "/attached_assets/Siwa Shai resort_1763854758403.JPG",
    gradient: "bg-[linear-gradient(160deg,#1a3a52_0%,#0F2436_100%)]",
  },
  {
    slug: "ghaliet-ecolodge-spa",
    name: "Ghaliet Ecolodge & Spa",
    type: "Ecolodge · Spa · Salt Pool",
    desc: "Natural salt pool, traditional mud architecture, and a spa rooted in local healing traditions.",
    price: "$160 / night",
    image: "/attached_assets/Chalets_1753545430991.jpg",
    gradient: "bg-[linear-gradient(160deg,#1a3a52_0%,#0F2436_100%)]",
  },
  {
    slug: "talist-siwa",
    name: "Talist Siwa",
    type: "Boutique Hotel · Desert Edge",
    desc: "At the edge of the oasis where the date palms give way to open desert. Private and unhurried.",
    price: "$130 / night",
    image: "/attached_assets/Talist Hotel_1763854758402.JPG",
    gradient: "bg-[linear-gradient(160deg,#0F2436_0%,#0d3040_100%)]",
  },
];

const experiences = [
  {
    slug: "salt-and-spring-escape",
    num: "01",
    title: "Salt & Spring Escape",
    desc: "A simple ritual of floating and renewal — salt, water, and stillness. Salt lakes and Cleopatra Spring in one half-day.",
    meta: ["2–3 hours", "Half day"],
  },
  {
    slug: "desert-sunset-experience",
    num: "02",
    title: "Desert Sunset Experience",
    desc: "A journey into the desert at golden hour — 4×4 across the dunes, sandboarding, and sunset tea at the highest point.",
    meta: ["3–4 hours", "Sunset"],
  },
  {
    slug: "desert-night-experience",
    num: "03",
    title: "Desert Night Experience",
    desc: "From sunset into the night — safari, fire-cooked dinner, stargazing, and sleep beneath a ceiling of stars.",
    meta: ["Sunset → Morning", "Overnight"],
  },
  {
    slug: "siwa-essential-experience",
    num: "04",
    title: "Siwa Essential Experience",
    desc: "A full day designed to capture the essence of Siwa — heritage walk, salt and spring ritual, desert safari, sunset tea.",
    meta: ["Full day", "Guided"],
  },
  {
    slug: "solei-signature-siwa-journey",
    num: "05",
    title: "Soléi Signature Siwa Journey",
    desc: "The complete Siwa experience — heritage, water, desert, dinner under the stars, and an optional overnight in the sand.",
    meta: ["Full day → Night", "Premium"],
  },
  {
    slug: "wellness-and-sand-ritual",
    num: "06",
    title: "Wellness & Sand Ritual",
    desc: "A traditional Siwan healing — buried in warm sand by a local healer, then tea, shade, and an optional private massage.",
    meta: ["2–3 hours", "Wellness"],
  },
];

const routes = [
  {
    slug: "cairo-siwa",
    name: "Cairo → Siwa Oasis",
    detail: "~8 hours · Private 4×4 · Western Desert road",
    type: "Private",
  },
  {
    slug: "marsa-siwa",
    name: "Marsa Matrouh → Siwa",
    detail: "~3 hours · Private 4×4 · Sand road",
    type: "Private",
  },
  {
    slug: "alex-siwa",
    name: "Alexandria → Siwa",
    detail: "~6 hours · Private vehicle · Coastal then desert",
    type: "Private",
  },
  {
    slug: "desert-drives",
    name: "In-oasis desert drives",
    detail: "4×4 · Dunes, salt flats, spring pools, sunset spots",
    type: "Experience",
  },
];

const practical = [
  {
    n: "I",
    title: "Best time to visit",
    desc: "October to April. The desert heat is manageable, the light is extraordinary, and the oasis is at its most alive. Summer is hot and quiet.",
  },
  {
    n: "II",
    title: "Getting there",
    desc: "No direct flights. Cairo is the closest major airport (8 hrs by road). Marsa Matrouh has a domestic airport (3 hrs). We arrange all transfers.",
  },
  {
    n: "III",
    title: "How long to stay",
    desc: "Minimum three nights — Siwa needs time. Four to five nights lets you arrive, settle, and leave having actually been somewhere rather than just visited.",
  },
  {
    n: "IV",
    title: "What to bring",
    desc: "Light layers for evenings, sun protection, comfortable walking shoes. Internet is limited — that is not a warning, that is the point.",
  },
  {
    n: "V",
    title: "Currency & payment",
    desc: "Egyptian Pounds. Limited ATMs. We recommend bringing cash from Cairo. Card payment available at most Soléi properties.",
  },
  {
    n: "VI",
    title: "Respect & culture",
    desc: "Siwa has a distinct Berber culture and language. Dress modestly outside lodges, ask before photographing people, and travel slowly.",
  },
];

export default function SiwaOasis() {
  useReveal();
  const c = useSiteContent();

  // Hide drafted hotels / experiences. The public API only returns
  // active records; once it has loaded we keep only the inline items
  // whose slug is still published. Before it loads we show the inline
  // list (these are the canonical Siwa properties) to avoid an empty
  // flash, then it narrows to live ones.
  const liveHotels = useActiveSlugs("/api/hotels");
  const liveExperiences = useActiveSlugs("/api/experiences");
  const visibleHotels = liveHotels.loaded
    ? hotels.filter((h) => liveHotels.slugs.has(h.slug))
    : hotels;
  const visibleExperiences = liveExperiences.loaded
    ? experiences.filter((e) => liveExperiences.slugs.has(e.slug))
    : experiences;
  // Hero
  const heroEyebrow = pickContent(c, "siwa_hub.hero.eyebrow", "Primary destination");
  const heroTitle = pickContent(c, "siwa_hub.hero.title", "Siwa");
  const heroItalic = pickContent(c, "siwa_hub.hero.italic", "Oasis.");
  const heroLine2 = pickContent(c, "siwa_hub.hero.line2", "Feel it deeply.");
  const heroSub = pickContent(
    c,
    "siwa_hub.hero.sub",
    "The place that shaped this brand. Salt lakes that mirror the sky, desert evenings with no schedule, and a quality of silence that takes a day or two to settle into.",
  );
  // Intro
  const introNum = pickContent(c, "siwa_hub.intro.num", "01");
  const introLabel = pickContent(c, "siwa_hub.intro.label", "The founding place");
  const introTitle = pickContent(
    c,
    "siwa_hub.intro.title",
    "Siwa exists at the edge of the world, where the desert meets an oasis that has been inhabited for",
  );
  const introTitleItalic = pickContent(c, "siwa_hub.intro.title_italic", "thousands of years.");
  const introP1 = pickContent(
    c,
    "siwa_hub.intro.p1",
    "Our founder grew up here. He watched tourists pass through — guided by people who didn't know it the way he did, told the surface of the story while the true beauty stayed untouched.",
  );
  const introP1Link = pickContent(c, "siwa_hub.intro.p1_link", "Soléi was built to change that.");
  const introP2 = pickContent(
    c,
    "siwa_hub.intro.p2",
    "This is not a destination we recommend. It is a place we know — the hours when the light changes, the corners that stay quiet, the experiences that require trust and time to reach.",
  );
  // Moments
  const momentsEyebrow = pickContent(c, "siwa_hub.moments.eyebrow", "What awaits you");
  const momentsTitle = pickContent(c, "siwa_hub.moments.title", "The moments most");
  const momentsTitle2 = pickContent(c, "siwa_hub.moments.title_2", "travelers");
  const momentsItalic = pickContent(c, "siwa_hub.moments.italic", "never reach.");
  const momentsBody = pickContent(
    c,
    "siwa_hub.moments.body",
    "These aren't activities on a list. They're states of being — available only to those who arrive without a tight schedule and leave without wanting to.",
  );
  // Lodge
  const lodgeEyebrow = pickContent(c, "siwa_hub.lodge.eyebrow", "Where you sleep");
  const lodgeTitle = pickContent(c, "siwa_hub.lodge.title", "A Siwa that extends into");
  const lodgeItalic = pickContent(c, "siwa_hub.lodge.italic", "every room.");
  const lodgeP1 = pickContent(
    c,
    "siwa_hub.lodge.p1",
    "We built our eco-lodges in Siwa from the ground up. Stone and palm, warm light through small windows, the smell of the desert just outside.",
  );
  const lodgeP2 = pickContent(
    c,
    "siwa_hub.lodge.p2",
    "Beds you sink into. Courtyards that hold the evening cool. Spaces that feel handmade — because they are — with the kind of care that doesn't announce itself but settles around you quietly.",
  );
  const lodgeP3 = pickContent(c, "siwa_hub.lodge.p3", "This is not a hotel that happens to be in Siwa.");
  const lodgeCta = pickContent(c, "siwa_hub.lodge.cta", "View accommodation");
  // Accommodation strip
  const accomEyebrow = pickContent(c, "siwa_hub.accommodation.eyebrow", "Where you stay");
  const accomTitle = pickContent(c, "siwa_hub.accommodation.title", "Siwa");
  const accomItalic = pickContent(c, "siwa_hub.accommodation.italic", "accommodation");
  // Experiences strip
  const expEyebrow = pickContent(c, "siwa_hub.experiences.eyebrow", "What you do");
  const expTitle = pickContent(c, "siwa_hub.experiences.title", "Siwa");
  const expItalic = pickContent(c, "siwa_hub.experiences.italic", "experiences");
  // Transportation
  const trEyebrow = pickContent(c, "siwa_hub.transport.eyebrow", "Getting here");
  const trTitle = pickContent(c, "siwa_hub.transport.title", "Arrive the");
  const trItalic = pickContent(c, "siwa_hub.transport.italic", "right way.");
  const trBody = pickContent(
    c,
    "siwa_hub.transport.body",
    "The journey to Siwa is part of the experience. Eight hours through the Western Desert, or three hours from Marsa Matrouh across sand roads. We arrange private vehicles — nothing shared, nothing generic.",
  );
  const trCta = pickContent(c, "siwa_hub.transport.cta", "View all routes");

  return (
    <>
      <SEO
        title="Siwa Oasis — Experiences, Accommodation & Transportation | Soléi"
        description="The oasis that shaped Soléi. Curated accommodation, experiences, and private transportation across Siwa Oasis, Egypt. Salt lakes, desert evenings, and the moments most travelers never reach."
        path="/siwa-oasis"
      />
      <Nav />

      <main>
        {/* ── 1. Hero ─────────────────────────────────────────── */}
        <section className="relative min-h-screen bg-navy overflow-hidden flex flex-col justify-end px-6 md:px-12 lg:px-20 pb-20 md:pb-24 pt-32">
          {/* Textile pattern */}
          <div className="absolute inset-0 textile-bg pointer-events-none" />

          {/* Coastal-blue radial glow top-right */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "-20%",
              right: "-10%",
              width: "65vw",
              height: "65vw",
              background:
                "radial-gradient(ellipse, rgba(47,111,143,0.15) 0%, transparent 65%)",
            }}
          />

          {/* Arch motif top-center */}
          <div
            className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[220px] h-[220px] pointer-events-none"
            style={{
              border: "1px solid rgba(184,154,91,0.18)",
              borderBottom: "none",
              borderRadius: "50% 50% 0 0",
            }}
          >
            <div
              className="absolute top-[18px] left-[18px] right-[18px]"
              style={{
                height: "calc(100% - 18px)",
                border: "1px solid rgba(184,154,91,0.09)",
                borderBottom: "none",
                borderRadius: "50% 50% 0 0",
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
              <span>Siwa Oasis</span>
            </p>

            {/* Eyebrow */}
            <p className="flex items-center gap-4 text-[0.6rem] tracking-[0.42em] uppercase text-gold mb-6 animate-fade-up animation-delay-400">
              <span className="block w-7 h-px bg-gold opacity-50" />
              {heroEyebrow}
            </p>

            {/* Title */}
            <h1
              className="font-display font-normal leading-[1.04] text-white mb-8 animate-fade-up animation-delay-600"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
            >
              {heroTitle} <em className="italic text-gold">{heroItalic}</em>
              <br />
              {heroLine2}
            </h1>

            {/* Sub */}
            <p className="text-[0.95rem] text-white/40 max-w-[52ch] leading-[1.95] mb-14 animate-fade-up animation-delay-800">
              {heroSub}
            </p>

            {/* Category pills */}
            <div
              className="flex flex-wrap gap-[2px] animate-fade-up"
              style={{ animationDelay: "1.1s" }}
            >
              {[
                {
                  href: "/siwa-oasis/accommodation",
                  label: "Accommodation",
                  active: true,
                },
                { href: "/siwa-oasis/experiences", label: "Experiences" },
                { href: "/siwa-oasis/transportation", label: "Transportation" },
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

          {/* Scroll indicator */}
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
                {introP1}{" "}
                <Link
                  href="/our-story"
                  className="text-navy border-b border-sand pb-[2px] hover:text-gold hover:border-gold transition-colors"
                >
                  {introP1Link}
                </Link>
              </p>
              <p className="reveal reveal-d2 text-[0.95rem] text-ink-soft leading-[1.95]">
                {introP2}
              </p>
            </div>
          </div>
        </section>

        {/* ── 3. Moments ─────────────────────────────────────── */}
        <section className="bg-white px-6 md:px-12 lg:px-20 py-28 md:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-end mb-16">
              <div>
                <p className="reveal flex items-center gap-3 text-[0.62rem] tracking-[0.38em] uppercase text-gold mb-6">
                  <span className="block w-[22px] h-px bg-gold opacity-50" />
                  {momentsEyebrow}
                </p>
                <h2
                  className="reveal font-display font-normal text-navy leading-[1.2]"
                  style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
                >
                  {momentsTitle}
                  <br />
                  {momentsTitle2} <em className="italic text-coastal">{momentsItalic}</em>
                </h2>
              </div>
              <p className="reveal text-[0.9rem] text-ink-soft leading-[1.95]">
                {momentsBody}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
              {[
                {
                  n: "I.",
                  title: "The salt lakes at sunset",
                  body: "When the light softens and the water turns the colour of the sky. You stop being a tourist.",
                  href: "/siwa-oasis/experiences/salt-and-spring-escape",
                },
                {
                  n: "II.",
                  title: "An evening without a schedule",
                  body: "Nothing planned, nothing guided. Something unexpected becomes the best part of the trip.",
                  href: "/siwa-oasis/experiences/desert-night-experience",
                },
                {
                  n: "III.",
                  title: "The stillness of the oasis",
                  body: "Waking up in Siwa with nowhere to be. The particular quiet that belongs only to this place.",
                  href: "/siwa-oasis/experiences",
                },
              ].map((m, i) => (
                <Link
                  key={m.n}
                  href={m.href}
                  className={`reveal ${i === 0 ? "" : `reveal-d${i}`} group border border-sand p-8 md:p-10 bg-white hover:border-gold hover:bg-cream transition-[border-color,background-color] duration-500 block`}
                >
                  <span className="font-display italic text-[0.82rem] text-gold/70 mb-7 block">
                    {m.n}
                  </span>
                  <h3 className="font-display text-[1.35rem] font-normal leading-[1.3] text-navy mb-3">
                    {m.title}
                  </h3>
                  <p className="text-[0.84rem] text-ink-soft leading-[1.9] mb-6">
                    {m.body}
                  </p>
                  <span className="inline-flex items-center gap-2 group-hover:gap-3 text-[0.58rem] tracking-[0.2em] uppercase text-gold opacity-60 group-hover:opacity-100 transition-all duration-300">
                    Experience this →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. The Lodge ───────────────────────────────────── */}
        <section className="relative bg-navy px-6 md:px-12 lg:px-20 py-28 md:py-32 overflow-hidden">
          <div className="absolute inset-0 textile-bg pointer-events-none" />
          <div className="relative z-[2] max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-32 items-start">
            <div>
              <p className="reveal flex items-center gap-3 text-[0.62rem] tracking-[0.38em] uppercase text-gold mb-8">
                <span className="block w-[22px] h-px bg-gold opacity-50" />
                {lodgeEyebrow}
              </p>
              <h2
                className="reveal font-display font-normal text-white leading-[1.2] mb-8"
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
              >
                {lodgeTitle}{" "}
                <em className="italic text-gold">{lodgeItalic}</em>
              </h2>
              <p className="reveal text-[0.95rem] text-white/50 leading-[1.95] mb-6">
                {lodgeP1}
              </p>
              <p className="reveal reveal-d1 text-[0.95rem] text-white/50 leading-[1.95] mb-6">
                {lodgeP2}
              </p>
              <p className="reveal reveal-d2 text-[0.95rem] text-white/50 leading-[1.95] mb-8">
                {lodgeP3}
              </p>
              <Link
                href="/siwa-oasis/accommodation"
                className="reveal reveal-d2 inline-block text-[0.65rem] tracking-[0.2em] uppercase text-navy bg-gold px-8 py-3.5 hover:bg-gold-light transition-colors"
              >
                {lodgeCta}
              </Link>
            </div>

            <div className="md:border-l border-gold/20 md:pl-12">
              {[
                {
                  label: "Material",
                  text: "Local karsheef salt rock, palm wood, earthen walls",
                },
                {
                  label: "Atmosphere",
                  text: "Warm, unhurried — soft luxury that earns its quietness",
                },
                {
                  label: "Location",
                  text: "Siwa Oasis — within reach of the salt lakes and the open desert",
                },
                {
                  label: "Booking",
                  text: "Direct booking via the site — live availability",
                },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className={`reveal reveal-d${Math.min(i + 1, 3)} py-7 border-b border-white/[0.06] last:border-b-0 first:pt-0`}
                >
                  <p className="text-[0.58rem] tracking-[0.28em] uppercase text-gold/65 mb-2">
                    {item.label}
                  </p>
                  <p className="font-display text-[1rem] text-white/60 leading-[1.7]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. Accommodation ───────────────────────────────── */}
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
                  {accomTitle} <em className="italic text-coastal">{accomItalic}</em>
                </h2>
              </div>
              <Link
                href="/siwa-oasis/accommodation"
                className="reveal text-[0.6rem] tracking-[0.2em] uppercase text-navy opacity-35 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]">
              {visibleHotels.map((h, i) => (
                <Link
                  key={h.slug}
                  href={`/siwa-oasis/accommodation/${h.slug}`}
                  className={`reveal ${i % 3 === 0 ? "" : `reveal-d${i % 3}`} bg-white border border-sand hover:border-gold transition-colors duration-300 block group overflow-hidden`}
                >
                  <div className={`relative h-[200px] overflow-hidden ${h.gradient}`}>
                    <img
                      src={h.image}
                      alt={h.name}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-navy-deep/10 group-hover:bg-navy-deep/0 transition-colors duration-500" />
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
                        Book →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
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
                  {expTitle} <em className="italic text-coastal">{expItalic}</em>
                </h2>
              </div>
              <Link
                href="/siwa-oasis/experiences"
                className="reveal text-[0.6rem] tracking-[0.2em] uppercase text-navy opacity-35 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]">
              {visibleExperiences.map((e, i) => (
                <Link
                  key={e.slug}
                  href={`/siwa-oasis/experiences/${e.slug}`}
                  className={`reveal ${i % 3 === 0 ? "" : `reveal-d${i % 3}`} group bg-white border border-sand hover:border-gold hover:bg-cream transition-[border-color,background-color] duration-300 block p-8 md:p-9`}
                >
                  <p className="font-display italic text-[0.8rem] text-gold/60 mb-6">
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
                    Book this →
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
                {trTitle} <em className="italic text-coastal">{trItalic}</em>
              </h2>
              <p className="text-[0.88rem] text-ink-soft leading-[1.95] mb-8">
                {trBody}
              </p>
              <Link
                href="/siwa-oasis/transportation"
                className="inline-block text-[0.62rem] tracking-[0.2em] uppercase text-navy border border-sand px-8 py-3.5 hover:border-gold hover:text-gold transition-colors"
              >
                {trCta}
              </Link>
            </div>

            <div className="reveal reveal-d1 border-t border-sand">
              {routes.map((r) => (
                <Link
                  key={r.slug}
                  href="/siwa-oasis/transportation"
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
                  Before you arrive
                </p>
                <h2
                  className="font-display font-normal text-navy leading-[1.2]"
                  style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
                >
                  Good to <em className="italic text-coastal">know.</em>
                </h2>
              </div>
              <Link
                href="/siwa-faq"
                className="reveal text-[0.6rem] tracking-[0.2em] uppercase text-navy opacity-35 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
              >
                Full travel guide →
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

        {/* ── 9. Closing ─────────────────────────────────────── */}
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
              Come as you are.
              <br />
              <em className="italic text-gold">Siwa will do the rest.</em>
            </h2>
            <p className="reveal text-[0.88rem] text-white/40 leading-[1.95] mb-14">
              Every stay in Siwa begins with a conversation. Tell us when
              you're coming, how long you have, and what kind of stillness
              you're looking for. We'll handle everything else.
            </p>
            <div className="reveal flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
              <Link
                href="/enquire"
                className="text-[0.65rem] tracking-[0.2em] uppercase text-navy bg-gold px-10 py-4 hover:bg-gold-light transition-colors"
              >
                Begin your stay
              </Link>
              <Link
                href="/siwa-oasis/accommodation"
                className="text-[0.65rem] tracking-[0.2em] uppercase text-white border border-white/20 px-10 py-4 hover:border-gold hover:text-gold transition-colors"
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
