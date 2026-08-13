import { useMemo, useState } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { useReveal } from "@/components/home/useReveal";
import { useExperiencesBySlug } from "@/lib/useExperiencesBySlug";
import { Arch } from "@/components/ui/Arch";
import saltLakeFloatImg from "@assets/floating-in-spring_1753576589836.jpeg";
import sandSurfingImg from "@assets/sand-boarding_1753576015281.png";
import cleopatraSpringImg from "@assets/Cleopatra Spring Soak_1764123896008.JPG";
import breathworkImg from "@assets/Desert Breathwork Meditation_1764121642405.JPG";
import sleepingStarsImg from "@assets/sleeping-under-stars.jpg";
import horsebackImg from "@assets/2-horses_1754739000602.jpg";
import stargazingImg from "@assets/stargazing_1752963245806.jpg";
import oracleTempleImg from "@assets/Siwa Oracle Temple_1751926882739.jpg";
import sandBathImg from "@assets/Traditional Sand Bath Healing_1764121689995.JPG";
import fullSiwaDayImg from "@assets/hero-image_1753576015270.png";

/* ──────────────────────────────────────────────────────────────
 *  /siwa-oasis/experiences
 *
 *  Siwa Oasis experience archive. 10 curated experiences, featured
 *  card + 3-col grid, sticky category filter, philosophy strip,
 *  accommodation upsell, practical info, and closing CTA.
 * ────────────────────────────────────────────────────────────── */

type Category = "water" | "desert" | "heritage" | "wellness" | "overnight";

interface Experience {
  slug: string;
  num: string;
  title: string;
  titleItalic?: string;
  desc: string;
  timeTag: string;
  categoryTag: string;
  meta: string[];
  highlights?: string[];
  price: number;
  cats: Category[];
  gradient: string;
  image?: string;
  featured?: boolean;
  premium?: boolean;
}

const EXPERIENCES: Experience[] = [
  {
    slug: "salt-and-spring-escape",
    num: "01 · Signature experience",
    title: "Salt &",
    titleItalic: "Spring Escape",
    desc:
      "A simple ritual of floating and renewal — salt, water, and stillness. The hyper-saline lakes hold you weightless at the sky's reflection, and Cleopatra's spring closes the loop with cool, clear water carved into the rock. Two of Siwa's quietest moments, in one half-day.",
    timeTag: "Half day · 2–3 hours",
    categoryTag: "Water · Wellness",
    meta: [],
    highlights: [
      "Salt Lakes",
      "Cleopatra Spring",
    ],
    price: 60,
    cats: ["water", "wellness"],
    gradient:
      "bg-[linear-gradient(155deg,#1a3a52_0%,#0F2436_60%,#2a5a7a_100%)]",
    image: saltLakeFloatImg,
    featured: true,
  },
  {
    slug: "desert-sunset-experience",
    num: "02",
    title: "Desert Sunset Experience",
    desc:
      "A journey into the desert at golden hour — movement, silence, and sunset over endless dunes. A 4×4 across the Great Sand Sea, sandboarding down the largest dune your driver will choose for you, and tea at the highest point as the light gives out.",
    timeTag: "Sunset · 3–4 hours",
    categoryTag: "Desert",
    meta: ["3–4 hours", "Sunset", "All levels"],
    highlights: [
      "Desert Safari (4×4)",
      "Sandboarding",
      "Sunset tea",
    ],
    price: 80,
    cats: ["desert"],
    gradient:
      "bg-[linear-gradient(155deg,#0F2436_0%,#3a2a14_60%,#1a1a0a_100%)]",
    image: sandSurfingImg,
  },
  {
    slug: "desert-night-experience",
    num: "03",
    title: "Desert Night Experience",
    desc:
      "From sunset into the night — a complete desert experience ending under the stars. Safari, fire-cooked dinner in the open, a guide who reads the sky out loud, and a bed beneath a ceiling of stars. The sleep you remember for years because of what surrounded it.",
    timeTag: "Sunset → Morning",
    categoryTag: "Desert · Overnight",
    meta: ["Overnight", "Dinner included", "Private option"],
    highlights: [
      "Desert Safari",
      "Sunset tea",
      "Dinner in the desert",
      "Stargazing",
      "Overnight stay",
    ],
    price: 150,
    cats: ["desert", "overnight"],
    gradient:
      "bg-[linear-gradient(155deg,#050d18_0%,#0F2436_60%,#0a1828_100%)]",
    image: sleepingStarsImg,
  },
  {
    slug: "siwa-essential-experience",
    num: "04",
    title: "Siwa",
    titleItalic: "Essential Experience",
    desc:
      "A full day designed to capture the essence of Siwa — water, desert, and silence. A heritage walk through Shali at the right hour, the salt and spring ritual at midday, then the dunes for an afternoon that ends in tea at the top of the world.",
    timeTag: "Full day",
    categoryTag: "Heritage · Water · Desert",
    meta: ["Full day", "Guided", "Lunch optional"],
    highlights: [
      "Siwa Heritage Walk",
      "Salt & Spring Ritual",
      "Desert Safari & Sandboarding",
      "Sunset tea",
    ],
    price: 220,
    cats: ["water", "desert", "heritage"],
    gradient:
      "bg-[linear-gradient(155deg,#2a1a0a_0%,#0F2436_60%,#1a2a3a_100%)]",
    image: fullSiwaDayImg,
  },
  {
    slug: "solei-signature-siwa-journey",
    num: "05 · Signature",
    title: "Soléi",
    titleItalic: "Signature Siwa Journey",
    desc:
      "The complete Siwa experience — from history to desert, from water to night. Heritage in the morning, salt and spring at midday, the sand sea by afternoon, dinner under the stars, and the option to wake up out there if you want to. The whole oasis in one continuous arc.",
    timeTag: "Full day → Night",
    categoryTag: "Premium · Private",
    meta: ["Full day → Night", "Private", "Optional overnight"],
    highlights: [
      "Heritage Walk",
      "Salt & Spring Ritual",
      "Desert Safari",
      "Sunset tea",
      "Dinner under the stars",
      "Stargazing",
      "Optional overnight",
    ],
    price: 250,
    cats: ["desert", "heritage", "water", "wellness", "overnight"],
    gradient:
      "bg-[linear-gradient(155deg,#050a14_0%,#091820_60%,#0a1428_100%)]",
    image: stargazingImg,
    premium: true,
  },
  {
    slug: "wellness-and-sand-ritual",
    num: "06",
    title: "Wellness &",
    titleItalic: "Sand Ritual",
    desc:
      "A traditional Siwan healing experience combined with moments of rest and calm. Buried in warm sand at the right hour by a local healer whose family has practised this for generations, then tea, shade, and the option to extend into a private massage if the body asks for it.",
    timeTag: "Half day · 2–3 hours",
    categoryTag: "Wellness",
    meta: ["2–3 hours", "Local healer", "Optional extension"],
    highlights: [
      "Sand Bath Ritual",
      "Rest & tea",
      "Optional massage / extension",
    ],
    price: 70,
    cats: ["wellness"],
    gradient:
      "bg-[linear-gradient(155deg,#3a2a0a_0%,#2a1a08_60%,#0F2436_100%)]",
    image: sandBathImg,
  },
  {
    slug: "desert-stargazing",
    num: "07",
    title: "Desert Stargazing",
    desc:
      "No light pollution. No noise. Just you, the sand, and the clearest sky you have ever seen. A guide who knows the constellations and the myths behind them, a blanket, and two hours that reframe the scale of everything.",
    timeTag: "Night · 3 hours",
    categoryTag: "Desert · Night",
    meta: ["3 hours", "Night", "Telescope provided"],
    highlights: [
      "Guided by local astronomer",
      "Telescope provided",
      "Blankets & tea",
      "Drive to dark-sky site",
    ],
    price: 55,
    cats: ["desert", "overnight"],
    gradient:
      "bg-[linear-gradient(155deg,#050a14_0%,#091820_60%,#0a1428_100%)]",
    image: stargazingImg,
  },
];

const FILTERS: { label: string; value: "all" | Category }[] = [
  { label: "All", value: "all" },
  { label: "Water", value: "water" },
  { label: "Desert", value: "desert" },
  { label: "Heritage", value: "heritage" },
  { label: "Wellness", value: "wellness" },
  { label: "Overnight", value: "overnight" },
];

const MOMENTS = [
  {
    num: "I.",
    title: "The salt lakes at sunset",
    desc:
      "When the light softens and the water turns the colour of the sky. You stop being a tourist.",
    href: "/siwa-oasis/experiences/salt-and-spring-escape",
  },
  {
    num: "II.",
    title: "An evening without a schedule",
    desc:
      "Nothing planned, nothing guided. Something unexpected becomes the best part of the trip.",
    href: "/siwa-oasis/experiences/desert-night-experience",
  },
  {
    num: "III.",
    title: "The stillness of the oasis",
    desc:
      "Waking up in Siwa with nowhere to be. The particular quiet that belongs only to this place.",
    href: "/siwa-oasis/experiences/wellness-and-sand-ritual",
  },
];

const HOW_STEPS = [
  {
    n: "1.",
    strong: "Choose your experience & date",
    rest: "Live availability shown for each experience. Select the date that works for your stay.",
  },
  {
    n: "2.",
    strong: "Confirm group size",
    rest: "Most experiences run for groups of 2–8. Private options available on request for most listings.",
  },
  {
    n: "3.",
    strong: "Pay securely on site",
    rest: "Payment processed instantly. Confirmation sent to your email with full meeting point and timing details.",
  },
  {
    n: "4.",
    strong: "We handle the rest",
    rest: "Guide briefed, equipment arranged, logistics coordinated with your accommodation team where relevant.",
  },
];

const UPSELL_PROPS = [
  {
    slug: "adrere-amellal",
    name: "Adrere Amellal",
    type: "Eco Lodge · No electricity · Salt lake front",
    price: "From $320",
  },
  {
    slug: "taziry-ecolodge",
    name: "Taziry Ecolodge",
    type: "Boutique Eco Lodge · Salt lake views",
    price: "From $180",
  },
  {
    slug: "solei-old-town",
    name: "Soléi Old Town",
    type: "Heritage Stay · Soléi owned",
    price: "From $145",
  },
];

const PRACTICAL = [
  {
    numeral: "I",
    title: "When to book",
    desc: "Book experiences before arrival — not the morning of. The salt lake float at sunset and sleeping under the stars fill quickly, especially October to March.",
  },
  {
    numeral: "II",
    title: "Private options",
    desc: "All experiences listed for groups are available privately. Contact us before booking if you'd prefer a private session — pricing varies by group size.",
  },
  {
    numeral: "III",
    title: "What to wear",
    desc: "Light layers for evenings and early mornings. The desert temperature drops significantly after sunset. For water experiences, swimwear and a change of clothes.",
  },
  {
    numeral: "IV",
    title: "Cancellation",
    desc: "Free cancellation up to 48 hours before the scheduled experience. Cancellations within 48 hours are charged in full.",
  },
  {
    numeral: "V",
    title: "Group sizes",
    desc: "Most experiences run with a minimum of 2 and maximum of 8 guests. The premium full-day experience is private by default.",
  },
  {
    numeral: "VI",
    title: "After accommodation",
    desc: "Experiences are always the second step — never the first. Book your accommodation, then layer experiences on top. That's the journey we've designed.",
  },
];

export default function NewExperiencesArchive() {
  useReveal();
  const [cat, setCat] = useState<"all" | Category>("all");

  const overlays = useExperiencesBySlug();

  const overlayed = useMemo(
    () =>
      // Drop drafted experiences (absent from the active-only API map).
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
          categoryTag: o.category || e.categoryTag,
          price: o.pricePerPerson ? Number(o.pricePerPerson) : e.price,
          image: o.imageUrl || e.image,
        };
      }),
    [overlays],
  );

  const visible = useMemo(
    () =>
      overlayed.filter((e) => cat === "all" || e.cats.includes(cat)),
    [cat, overlayed],
  );
  const featured = visible.find((e) => e.featured);
  const rest = visible.filter((e) => !e.featured);

  return (
    <>
      <SEO
        title="Siwa Oasis Experiences — Soléi"
        description="Ten curated Siwa experiences — salt lake floats, desert stargazing, Cleopatra Spring, oracle temple, and more. Bookable directly."
        path="/siwa-oasis/experiences"
      />
      <Nav />

      <main>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-navy px-6 md:px-12 lg:px-20 pt-32 pb-20">
          <div className="absolute inset-0 textile-bg pointer-events-none" />
          <div
            className="absolute -top-[30%] -right-[5%] w-[55vw] h-[55vw] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse, rgba(47,111,143,0.12) 0%, transparent 65%)",
            }}
          />

          <div className="relative z-[2] max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-end">
            <div>
              <p className="flex items-center gap-3 text-[0.58rem] tracking-[0.28em] uppercase text-white/25 mb-6 animate-fade-up animation-delay-200">
                <Link href="/" className="hover:text-gold transition-colors">
                  Soléi
                </Link>
                <span className="opacity-40">/</span>
                <Link href="/siwa-oasis" className="hover:text-gold transition-colors">
                  Siwa Oasis
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
                Siwa <em className="italic text-gold">experiences.</em>
                <br />
                States of being.
              </h1>
            </div>

            <div className="animate-fade-up animation-delay-800 pb-2">
              <p className="text-[0.9rem] text-white/40 leading-[1.95] mb-8">
                These are not activities on a list. They are what happens when
                you stop trying to see everything and start letting a place find
                you. Every experience here has been chosen because it reveals
                something about Siwa that most visitors never discover.
              </p>
              <div className="flex gap-10 border-t border-gold/15 pt-6">
                {[
                  { num: "10", label: "Experiences" },
                  { num: "$35", label: "Starting from" },
                  { num: "½–2", label: "Days duration" },
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

        {/* ── PHILOSOPHY STRIP ─────────────────────────────────── */}
        <section className="bg-cream px-6 md:px-12 lg:px-20 py-16 md:py-20 border-b border-sand">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <p
              className="reveal font-display italic font-normal leading-[1.4] text-navy"
              style={{ fontSize: "clamp(1.4rem, 2.8vw, 2.2rem)" }}
            >
              "These aren't activities. They're states of being — available
              only to those who arrive without a tight schedule and leave
              without{" "}
              <em className="not-italic text-coastal">wanting to.</em>"
            </p>
            <div className="reveal reveal-d1">
              <div className="w-9 h-px bg-gold opacity-50 mb-5" />
              <p className="text-[0.88rem] text-ink-soft leading-[1.95]">
                Each experience below has been personally curated. We don't
                list everything Siwa offers — we list what we stand behind.
                Some require an early morning. Some require trust. All of them
                require a willingness to be somewhere rather than see it.
              </p>
            </div>
          </div>
        </section>

        {/* ── THREE MOMENTS ───────────────────────────────────── */}
        <section className="bg-white px-6 md:px-12 lg:px-20 py-20 md:py-24">
          <div className="max-w-5xl mx-auto">
            <p className="reveal flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-10">
              <span className="block w-[22px] h-px bg-gold opacity-50" />
              The moments that define a stay
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
              {MOMENTS.map((m, i) => (
                <Link
                  key={m.num}
                  href={m.href}
                  className={`reveal ${
                    i > 0 ? `reveal-d${i}` : ""
                  } bg-white border border-sand px-8 py-10 hover:border-gold hover:bg-cream transition-colors block`}
                >
                  <span className="block font-display italic text-[0.82rem] text-gold/70 mb-5">
                    {m.num}
                  </span>
                  <h3 className="font-display text-[1.2rem] font-normal leading-snug text-navy mb-2">
                    {m.title}
                  </h3>
                  <p className="text-[0.82rem] text-ink-soft leading-[1.85]">
                    {m.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── ALL EXPERIENCES ─────────────────────────────────── */}
        <section className="bg-cream px-6 md:px-12 lg:px-20 py-20 md:py-24">
          <div className="max-w-5xl mx-auto">
            {/* Featured */}
            {featured && <FeaturedCard exp={featured} />}

            {/* Grid */}
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
                How booking works
              </p>
              <h2
                className="font-display font-normal leading-[1.25] text-navy mb-4"
                style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)" }}
              >
                Experiences book{" "}
                <em className="italic text-coastal">directly</em> — no waiting.
              </h2>
              <p className="text-[0.88rem] text-ink-soft leading-[1.95]">
                All Siwa experiences are bookable directly on site. Select your
                experience, choose your date, confirm your group size, and pay.
                Instant confirmation. If you've already booked accommodation
                with us, we'll coordinate timing automatically — no need to
                cross-reference separately.
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
                Experiences are better when you're already{" "}
                <em className="italic text-gold">settled.</em>
              </h2>
              <p className="text-[0.88rem] text-white/40 leading-[1.95] mb-7">
                A salt lake float means more on your third evening than your
                first. The desert stargazing lands differently when you've had
                a day to find the oasis's rhythm. If you haven't booked
                accommodation yet — start there.
              </p>
              <Link
                href="/siwa-oasis/accommodation"
                className="inline-block text-[0.62rem] tracking-[0.2em] uppercase text-navy bg-gold px-8 py-3 hover:bg-gold-light transition-colors"
              >
                View Siwa accommodation
              </Link>
            </div>

            <div className="reveal reveal-d1 flex flex-col gap-[2px]">
              {UPSELL_PROPS.map((p) => (
                <Link
                  key={p.slug}
                  href={`/siwa-oasis/accommodation/${p.slug}`}
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
                href="/siwa-oasis/accommodation"
                className="border border-gold/10 px-6 py-5 flex items-center justify-between hover:bg-coastal/10 hover:border-gold/30 transition-colors"
              >
                <div>
                  <div className="font-display text-[0.95rem] text-white leading-tight">
                    View all 8 Siwa properties
                  </div>
                  <div className="text-[0.65rem] text-white/30 mt-0.5">
                    Including 3 Soléi-owned · From $95/night
                  </div>
                </div>
                <span className="font-display text-[0.9rem] text-gold flex-shrink-0 ml-4">
                  See all →
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── PRACTICAL INFO ──────────────────────────────────── */}
        <section className="bg-white px-6 md:px-12 lg:px-20 py-20 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="reveal mb-10">
              <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-4">
                <span className="block w-[22px] h-px bg-gold opacity-50" />
                Before you book
              </p>
              <h2
                className="font-display font-normal text-navy leading-[1.2]"
                style={{ fontSize: "clamp(1.4rem, 3vw, 2.4rem)" }}
              >
                Good to <em className="italic text-coastal">know.</em>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]">
              {PRACTICAL.map((item, i) => (
                <div
                  key={item.numeral}
                  className={`reveal ${
                    i % 3 === 1 ? "reveal-d1" : i % 3 === 2 ? "reveal-d2" : ""
                  } bg-cream border border-sand px-7 py-8`}
                >
                  <div className="w-8 h-8 rounded-full border border-gold flex items-center justify-center mb-4">
                    <span className="font-display italic text-[0.8rem] text-gold">
                      {item.numeral}
                    </span>
                  </div>
                  <h3 className="font-display text-[1rem] text-navy mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[0.8rem] text-ink-soft leading-[1.85]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
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
              Tell us how long you're staying, what you're drawn to, and what
              kind of energy you're bringing. We'll tell you which two or three
              experiences will make your time in Siwa feel complete.
            </p>
            <div className="reveal flex gap-4 justify-center flex-wrap">
              <Link
                href="/enquire"
                className="text-[0.65rem] tracking-[0.2em] uppercase text-navy bg-gold px-10 py-4 hover:bg-gold-light transition-colors"
              >
                Ask us
              </Link>
              <Link
                href="/siwa-oasis/accommodation"
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
 *  Featured experience card
 * ────────────────────────────────────────────────────────────── */

function FeaturedCard({ exp }: { exp: Experience }) {
  return (
    <Link
      href={`/siwa-oasis/experiences/${exp.slug}`}
      className="reveal grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-[2px] group"
    >
      <div
        className={`relative min-h-[260px] md:min-h-[380px] overflow-hidden ${exp.gradient}`}
      >
        {exp.image && (
          <img
            src={exp.image}
            alt={exp.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 textile-bg--strong pointer-events-none" />
        <span className="absolute bottom-4 left-4 text-[0.52rem] tracking-[0.2em] uppercase text-gold bg-navy-deep/75 px-3 py-1 backdrop-blur-md">
          {exp.timeTag}
        </span>
        <span className="absolute top-4 right-4 text-[0.5rem] tracking-[0.18em] uppercase text-white/65 bg-navy-deep/60 px-3 py-1 backdrop-blur-md">
          {exp.categoryTag}
        </span>
      </div>
      <div className="bg-white border border-sand p-8 md:p-10 flex flex-col justify-between group-hover:border-gold transition-colors">
        <div>
          <p className="font-display italic text-[0.78rem] text-gold/65 mb-3">
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
                per person
              </span>
            </div>
          </div>
          <span className="text-[0.62rem] tracking-[0.18em] uppercase text-navy bg-gold px-7 py-3 whitespace-nowrap group-hover:bg-gold-light transition-colors">
            Book this experience
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ──────────────────────────────────────────────────────────────
 *  Standard experience card
 * ────────────────────────────────────────────────────────────── */

function ExpCard({ exp, delayClass }: { exp: Experience; delayClass: string }) {
  return (
    <Link
      href={`/siwa-oasis/experiences/${exp.slug}`}
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
        <div className="absolute inset-0 textile-bg--strong pointer-events-none" />
        <span className="absolute bottom-4 left-4 text-[0.52rem] tracking-[0.2em] uppercase text-gold bg-navy-deep/75 px-3 py-1 backdrop-blur-md">
          {exp.timeTag}
        </span>
        <span className="absolute top-4 right-4 text-[0.5rem] tracking-[0.18em] uppercase text-white/65 bg-navy-deep/60 px-3 py-1 backdrop-blur-md">
          {exp.categoryTag}
        </span>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <p className="font-display italic text-[0.78rem] text-gold/65 mb-3">
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
          <span className="text-[0.58rem] tracking-[0.16em] uppercase text-navy bg-gold px-4 py-2 whitespace-nowrap group-hover:bg-gold-light transition-colors">
            Book →
          </span>
        </div>
      </div>
    </Link>
  );
}
