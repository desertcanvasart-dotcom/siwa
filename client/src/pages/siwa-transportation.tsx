import { useState } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { useReveal } from "@/components/home/useReveal";
import { Arch } from "@/components/ui/Arch";

/* ──────────────────────────────────────────────────────────────
 *  /siwa-oasis/transportation
 *
 *  Private transportation hub for Siwa — routes in/out of the
 *  oasis, desert drives within it, the fleet, and an enquiry
 *  form. Everything enquiry-based; no automated booking.
 * ────────────────────────────────────────────────────────────── */

const PRINCIPLES = [
  "Private vehicles only — no shared transfers",
  "All drivers are vetted and known to us personally",
  "Routes selected for the journey, not just the destination",
  "Flexible timing — depart when you're ready",
];

interface RouteCard {
  num: string;
  from: string;
  to: string;
  desc: string;
  facts: { key: string; val: string }[];
  price: string;
}

const FEATURED_ROUTE: RouteCard = {
  num: "Route 01 · Signature",
  from: "Cairo",
  to: "Siwa Oasis",
  desc: "The defining journey. Eight hours through the Western Desert — past Alexandria, along the Mediterranean coast to Marsa Matrouh, then south into the sand. The road narrows as the landscape opens. By the time you arrive, you've understood why Siwa exists at the edge of everything. We choose vehicles and drivers who know this route intimately. Stops are yours to decide — we'll suggest where the light is best.",
  facts: [
    { key: "Duration", val: "~8 hours" },
    { key: "Road type", val: "Paved throughout — no off-road required" },
    { key: "Departure", val: "Early morning recommended (5–7am)" },
    { key: "Stops", val: "Flexible — Marsa Matrouh, rest stops as needed" },
    { key: "Vehicle", val: "Private SUV or 4×4 — air-conditioned" },
  ],
  price: "€180 per vehicle",
};

const ROUTES: RouteCard[] = [
  {
    num: "Route 02",
    from: "Marsa Matrouh",
    to: "Siwa",
    desc: "The shorter approach — three hours across sand roads as the landscape flattens into the oasis edge. A good option if you're flying into Marsa Matrouh's domestic airport or arriving from the coast.",
    facts: [
      { key: "Duration", val: "~3 hours" },
      { key: "Road type", val: "Mixed — paved & sand road" },
      { key: "Vehicle", val: "Private 4×4 recommended" },
    ],
    price: "€95 per vehicle",
  },
  {
    num: "Route 03",
    from: "Alexandria",
    to: "Siwa",
    desc: "Six hours via the coastal road and then inland. A scenic alternative to the Cairo departure — the Mediterranean is visible for much of the first half before the desert takes over completely.",
    facts: [
      { key: "Duration", val: "~6 hours" },
      { key: "Road type", val: "Coastal then paved desert" },
      { key: "Vehicle", val: "Private SUV — air-conditioned" },
    ],
    price: "€140 per vehicle",
  },
  {
    num: "Route 04",
    from: "Siwa",
    to: "Cairo (return)",
    desc: "The same road, a different direction. Leaving Siwa is always harder than arriving. We schedule returns for early morning so you have the desert to yourselves before the day begins.",
    facts: [
      { key: "Duration", val: "~8 hours" },
      { key: "Departure", val: "Early morning recommended" },
      { key: "Vehicle", val: "Private SUV or 4×4" },
    ],
    price: "€180 per vehicle",
  },
];

interface DriveCard {
  num: string;
  title: string;
  desc: string;
  includesLabel: string;
  includes: string;
  duration: string;
  price: string;
}

const DRIVES: DriveCard[] = [
  {
    num: "01",
    title: "Great Sand Sea Drive",
    desc: "Into the dunes of the Great Sand Sea — one of the largest continuous sand seas on earth. Experienced 4×4 guides, dune driving, and the particular silence of a landscape with no edges.",
    includesLabel: "Includes",
    includes: "Dune driving · Sand sea viewpoints · Sunset stop · Traditional tea",
    duration: "Half or full day · 4×4 · Private",
    price: "From €85",
  },
  {
    num: "02",
    title: "Salt Lakes & Springs Circuit",
    desc: "A loop through the oasis's natural water features — Siwa Lake, Birket Zeitoun, Cleopatra Spring, and the lesser-known springs most visitors miss entirely. A half day that covers the full range of Siwa's water landscape.",
    includesLabel: "Includes",
    includes: "Siwa Lake stop · Cleopatra Spring · Birket Zeitoun · Hidden springs",
    duration: "Half day · 4×4 · Private",
    price: "From €65",
  },
  {
    num: "03",
    title: "Ancient Sites Drive",
    desc: "The oracle temple, the Mountain of the Dead, the ruins of Aghurmi village, and the Shali fortress. Four sites, a full morning, and a guide who explains not just what they are but why they matter in sequence.",
    includesLabel: "Includes",
    includes: "Oracle Temple · Mountain of the Dead · Aghurmi · Shali fortress views",
    duration: "Full morning · Vehicle + guide · Private",
    price: "From €75",
  },
  {
    num: "04",
    title: "Sunrise Desert Drive",
    desc: "Departure before dawn, into the desert as the sky lightens. The dunes at sunrise are a different environment from sunset — cooler, quieter, and with a quality of light that photographers specifically request.",
    includesLabel: "Includes",
    includes: "Pre-dawn departure · Dune position for sunrise · Breakfast in the desert",
    duration: "3–4 hours · 4×4 · Private",
    price: "From €95",
  },
  {
    num: "05",
    title: "In-Oasis Transfers",
    desc: "Simple point-to-point transfers within Siwa — lodge to experiences, accommodation to restaurants, property to property. Reliable, private, and always on time.",
    includesLabel: "Covers",
    includes: "Lodge pickups · Experience drop-offs · Town centre · Airport",
    duration: "On demand · Private vehicle",
    price: "From €15",
  },
  {
    num: "06 · Bespoke",
    title: "Full Day — Your Route",
    desc: "A full day private vehicle with a Siwa guide. You decide the destinations, the pace, the stops. Suited to guests who want complete flexibility or who are returning to Siwa with specific places in mind.",
    includesLabel: "Includes",
    includes: "Full day vehicle · Local guide · Lunch arranged · No fixed itinerary",
    duration: "Full day · Private · Bespoke",
    price: "From €145",
  },
];

interface Vehicle {
  name: string;
  type: string;
  desc: string;
  specs: { key: string; val: string }[];
  gradient: string;
}

const VEHICLES: Vehicle[] = [
  {
    name: "Private SUV",
    type: "Long-distance · Paved routes",
    desc: "Air-conditioned, comfortable, and appropriate for the Cairo–Siwa road. Seats up to 4 passengers with luggage.",
    specs: [
      { key: "Passengers", val: "Up to 4" },
      { key: "Air conditioning", val: "Yes" },
      { key: "Best for", val: "Cairo · Alexandria · Marsa routes" },
    ],
    gradient: "bg-[linear-gradient(155deg,#0F2436_0%,#1a3a52_100%)]",
  },
  {
    name: "4×4 Desert Vehicle",
    type: "Off-road · Sand routes · Desert drives",
    desc: "Essential for dune driving and the Marsa Matrouh sand road. High-clearance, experienced desert drivers only.",
    specs: [
      { key: "Passengers", val: "Up to 5" },
      { key: "Terrain", val: "All terrain including dunes" },
      { key: "Best for", val: "Sand Sea · Desert drives · Marsa route" },
    ],
    gradient: "bg-[linear-gradient(155deg,#1a3040_0%,#0F2436_100%)]",
  },
  {
    name: "Private Minivan",
    type: "Groups · Long-distance",
    desc: "For larger groups travelling together. Same private standard — no shared vehicle arrangements at any size.",
    specs: [
      { key: "Passengers", val: "Up to 8" },
      { key: "Air conditioning", val: "Yes" },
      { key: "Best for", val: "Groups · Family travel · Long routes" },
    ],
    gradient: "bg-[linear-gradient(155deg,#1a3a52_0%,#0F2436_100%)]",
  },
];

const HOW_STEPS = [
  {
    n: "1.",
    strong: "Submit your request",
    rest: "Route, date, number of passengers, any specific requirements. The form below takes two minutes.",
  },
  {
    n: "2.",
    strong: "We confirm vehicle & driver",
    rest: "Our team matches you to the right vehicle and a driver who knows the route. We respond within 24 hours.",
  },
  {
    n: "3.",
    strong: "Payment link sent",
    rest: "Secure payment via WhatsApp or email. Pay in EUR or USD. No payment until vehicle is confirmed.",
  },
  {
    n: "4.",
    strong: "Full details before travel",
    rest: "Driver name, vehicle, pickup time, contact number, and any stop recommendations — all sent in advance.",
  },
];

const PRACTICAL = [
  {
    numeral: "I",
    title: "Best time to depart",
    desc: "For Cairo–Siwa, depart before 6am. You arrive before the afternoon heat, have time to settle, and don't lose a day to travel. Evening arrivals are fine but make the journey feel longer.",
  },
  {
    numeral: "II",
    title: "What to bring in the vehicle",
    desc: "More water than you think — minimum 2 litres per person for the Cairo route. Snacks for long journeys. A jacket — the air conditioning in shared taxis is unreliable; ours is not, but the desert morning can be cold.",
  },
  {
    numeral: "III",
    title: "Mobile signal on route",
    desc: "Signal is intermittent between Cairo and Siwa, particularly the last 80km. Download your music and any reading offline before departure. Our drivers carry emergency contact equipment.",
  },
  {
    numeral: "IV",
    title: "Currency & tolls",
    desc: "All transport fees are settled with us in advance. Drivers handle any road tolls. No need to carry cash specifically for transport — though Egyptian Pounds are useful for stop refreshments.",
  },
  {
    numeral: "V",
    title: "Luggage",
    desc: "Standard luggage for the vehicle type selected. For desert drives, a small daypack is sufficient — lodge storage handles the rest. If you have unusual luggage, mention it in the request.",
  },
  {
    numeral: "VI",
    title: "Combining with accommodation",
    desc: "If you've booked a Soléi property, we coordinate transport timing automatically with your check-in. No need to manage the two separately.",
  },
];

export default function SiwaTransportationPage() {
  useReveal();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <SEO
        title="Siwa Oasis Transportation — Soléi"
        description="Private transportation to and around Siwa Oasis. Cairo, Alexandria, and Marsa Matrouh routes, plus desert drives within the oasis. All private, by enquiry."
        path="/siwa-oasis/transportation"
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
                <span>Transportation</span>
              </p>

              <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-5 animate-fade-up animation-delay-400">
                <span className="block w-[22px] h-px bg-gold opacity-50" />
                Getting here & getting around
              </p>

              <h1
                className="font-display font-normal leading-[1.1] text-white animate-fade-up animation-delay-600"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)" }}
              >
                Private <em className="italic text-gold">transportation.</em>
                <br />
                Arrive the right way.
              </h1>
            </div>

            <div className="animate-fade-up animation-delay-800 pb-2">
              <p className="text-[0.9rem] text-white/40 leading-[1.95] mb-8">
                The journey to Siwa is part of the experience. Eight hours
                through the Western Desert from Cairo, or three hours across
                sand roads from Marsa Matrouh. We arrange every vehicle, every
                route, and every detail — nothing shared, nothing generic.
              </p>
              <div className="flex flex-col gap-[2px]">
                {PRINCIPLES.map((p) => (
                  <div
                    key={p}
                    className="flex items-center gap-3 px-5 py-3 border border-gold/10 text-[0.8rem] text-white/50"
                  >
                    <span className="w-[5px] h-[5px] rounded-full bg-gold opacity-60 flex-shrink-0" />
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── ROUTES TO SIWA ──────────────────────────────────── */}
        <section className="bg-cream px-6 md:px-12 lg:px-20 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <p className="reveal flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-10">
              <span className="block w-[22px] h-px bg-gold opacity-50" />
              Getting to Siwa
            </p>
            <h2
              className="reveal font-display font-normal text-navy leading-[1.2] mb-10"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.4rem)" }}
            >
              Routes <em className="italic text-coastal">into the oasis.</em>
            </h2>

            {/* Featured: Cairo → Siwa */}
            <a
              href="#enquiry-form"
              className="reveal grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-[2px] group"
            >
              <div className="relative bg-[linear-gradient(155deg,#0F2436_0%,#1a3040_60%,#0a1e2e_100%)] min-h-[220px] md:min-h-[320px] overflow-hidden flex flex-col justify-end p-6 md:p-8">
                <div className="absolute inset-0 textile-bg--strong pointer-events-none" />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(9,24,32,0.85) 0%, transparent 55%)",
                  }}
                />
                <div className="relative z-[2]">
                  <p className="text-[0.56rem] tracking-[0.28em] uppercase text-gold/80 mb-2">
                    Most requested route
                  </p>
                  <div className="font-display text-[1.8rem] font-normal text-white leading-tight">
                    {FEATURED_ROUTE.from}{" "}
                    <span className="text-gold/60 text-[0.8em] mx-1">→</span>{" "}
                    <em className="italic text-gold">{FEATURED_ROUTE.to}</em>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-sand p-8 md:p-10 flex flex-col justify-between group-hover:border-gold transition-colors">
                <div>
                  <p className="font-display italic text-[0.78rem] text-gold/65 mb-3">
                    {FEATURED_ROUTE.num}
                  </p>
                  <div className="font-display text-[1.5rem] font-normal text-navy leading-tight mb-3">
                    {FEATURED_ROUTE.from}{" "}
                    <em className="italic text-gold/80 mx-1">→</em>{" "}
                    {FEATURED_ROUTE.to}
                  </div>
                  <p className="text-[0.88rem] text-ink-soft leading-[1.95] mb-6">
                    {FEATURED_ROUTE.desc}
                  </p>
                  <div className="flex flex-col mb-2">
                    {FEATURED_ROUTE.facts.map((f, i, arr) => (
                      <div
                        key={f.key}
                        className={`flex justify-between items-center py-2 text-[0.78rem] ${
                          i === arr.length - 1 ? "" : "border-b border-sand-light"
                        }`}
                      >
                        <span className="text-ink-soft/60">{f.key}</span>
                        <span className="text-navy">{f.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-sand-light mt-6">
                  <div>
                    <div className="text-[0.62rem] text-ink-soft/45">From</div>
                    <div className="font-display text-[1.05rem] text-navy">
                      {FEATURED_ROUTE.price}
                    </div>
                  </div>
                  <span className="text-[0.58rem] tracking-[0.16em] uppercase text-navy bg-gold px-5 py-2.5 whitespace-nowrap group-hover:bg-gold-light transition-colors">
                    Book this route
                  </span>
                </div>
              </div>
            </a>

            {/* Other routes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]" style={{ marginTop: "2px" }}>
              {ROUTES.map((r, i) => (
                <a
                  key={r.num}
                  href="#enquiry-form"
                  className={`reveal ${i % 3 === 1 ? "reveal-d1" : i % 3 === 2 ? "reveal-d2" : ""} bg-white border border-sand p-7 flex flex-col hover:border-gold hover:bg-cream transition-colors group`}
                >
                  <p className="font-display italic text-[0.78rem] text-gold/65 mb-3">
                    {r.num}
                  </p>
                  <h3 className="font-display text-[1.2rem] font-normal text-navy leading-snug mb-2">
                    {r.from}{" "}
                    <em className="italic text-gold/70 mx-0.5">→</em> {r.to}
                  </h3>
                  <p className="text-[0.82rem] text-ink-soft leading-[1.85] mb-5 flex-1">
                    {r.desc}
                  </p>
                  <div className="flex flex-col mb-5">
                    {r.facts.map((f, j, arr) => (
                      <div
                        key={f.key}
                        className={`flex justify-between items-center py-2 text-[0.78rem] ${
                          j === arr.length - 1 ? "" : "border-b border-sand-light"
                        }`}
                      >
                        <span className="text-ink-soft/60">{f.key}</span>
                        <span className="text-navy">{f.val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-sand-light mt-auto">
                    <div>
                      <div className="text-[0.62rem] text-ink-soft/45">From</div>
                      <div className="font-display text-[1.05rem] text-navy">
                        {r.price}
                      </div>
                    </div>
                    <span className="text-[0.58rem] tracking-[0.16em] uppercase text-navy bg-gold px-4 py-2 whitespace-nowrap group-hover:bg-gold-light transition-colors">
                      Book →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── DESERT DRIVES ───────────────────────────────────── */}
        <section className="bg-white px-6 md:px-12 lg:px-20 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <p className="reveal flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-10">
              <span className="block w-[22px] h-px bg-gold opacity-50" />
              Within the oasis
            </p>
            <h2
              className="reveal font-display font-normal text-navy leading-[1.2] mb-5"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.4rem)" }}
            >
              Desert drives —{" "}
              <em className="italic text-coastal">Siwa explored.</em>
            </h2>
            <p className="reveal text-[0.88rem] text-ink-soft leading-[1.95] max-w-[60ch] mb-10">
              Once you're in Siwa, the oasis rewards exploration. These are
              not excursion packages — they're private drives to specific
              places, with guides who know what's worth stopping for and what
              isn't.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]">
              {DRIVES.map((d, i) => (
                <a
                  key={d.num}
                  href="#enquiry-form"
                  className={`reveal ${i % 3 === 1 ? "reveal-d1" : i % 3 === 2 ? "reveal-d2" : ""} border border-sand px-8 py-10 block hover:border-gold hover:bg-cream transition-colors`}
                >
                  <span className="block font-display italic text-[0.78rem] text-gold/65 mb-4">
                    {d.num}
                  </span>
                  <h3 className="font-display text-[1.15rem] font-normal text-navy leading-snug mb-3">
                    {d.title}
                  </h3>
                  <p className="text-[0.82rem] text-ink-soft leading-[1.85] mb-5">
                    {d.desc}
                  </p>
                  <div className="text-[0.7rem] text-ink-soft/55 leading-[1.8] mb-5">
                    <strong className="block text-navy font-normal mb-0.5 text-[0.65rem] tracking-[0.12em] uppercase">
                      {d.includesLabel}
                    </strong>
                    {d.includes}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-sand-light">
                    <div className="text-[0.68rem] text-ink-soft/50">
                      {d.duration}
                    </div>
                    <div className="font-display text-[0.95rem] text-navy">
                      {d.price}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── VEHICLES ────────────────────────────────────────── */}
        <section className="bg-sand-light px-6 md:px-12 lg:px-20 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-end mb-10">
              <div>
                <p className="reveal flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-5">
                  <span className="block w-[22px] h-px bg-gold opacity-50" />
                  Our fleet
                </p>
                <h2
                  className="reveal font-display font-normal text-navy leading-[1.2]"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2.4rem)" }}
                >
                  The right vehicle
                  <br />
                  for every <em className="italic text-coastal">route.</em>
                </h2>
              </div>
              <p className="reveal reveal-d1 text-[0.88rem] text-ink-soft leading-[1.95]">
                Every vehicle in our fleet is maintained to our own standard,
                not a rental company's. Drivers are selected for knowledge of
                the route as much as driving ability — for the Cairo–Siwa
                road, that distinction matters.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
              {VEHICLES.map((v, i) => (
                <div
                  key={v.name}
                  className={`reveal ${i % 3 === 1 ? "reveal-d1" : i % 3 === 2 ? "reveal-d2" : ""} bg-white border border-sand p-7`}
                >
                  <div className={`relative h-[120px] overflow-hidden mb-5 ${v.gradient}`}>
                    <div className="absolute inset-0 textile-bg--strong pointer-events-none" />
                  </div>
                  <h3 className="font-display text-[1.05rem] text-navy mb-1">
                    {v.name}
                  </h3>
                  <p className="text-[0.62rem] tracking-[0.1em] uppercase text-ink-soft/50 mb-3">
                    {v.type}
                  </p>
                  <p className="text-[0.8rem] text-ink-soft leading-[1.8] mb-4">
                    {v.desc}
                  </p>
                  <div className="border-t border-sand-light pt-3">
                    {v.specs.map((s, j, arr) => (
                      <div
                        key={s.key}
                        className={`flex justify-between py-1.5 text-[0.75rem] ${
                          j === arr.length - 1 ? "" : "border-b border-sand-light"
                        }`}
                      >
                        <span className="text-ink-soft/55">{s.key}</span>
                        <span className="text-navy">{s.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-navy px-6 md:px-12 lg:px-20 py-20 md:py-28">
          <div className="absolute inset-0 textile-bg pointer-events-none" />
          <div className="relative z-[2] max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">
            <div className="reveal">
              <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-5">
                <span className="block w-[22px] h-px bg-gold opacity-50" />
                How to book
              </p>
              <h2
                className="font-display font-normal leading-[1.25] text-white mb-5"
                style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)" }}
              >
                Transportation books
                <br />
                <em className="italic text-gold">by enquiry.</em>
              </h2>
              <p className="text-[0.88rem] text-white/40 leading-[1.95]">
                All transportation — whether a route to Siwa or a desert drive
                within it — is arranged through our team. We confirm the
                vehicle, the driver, and the timing before anything is
                confirmed. No automated booking for this one.
              </p>
            </div>
            <ul className="reveal reveal-d1 list-none border-t border-gold/15">
              {HOW_STEPS.map((s, i) => (
                <li
                  key={s.n}
                  className={`flex gap-4 items-start py-4 ${
                    i === HOW_STEPS.length - 1 ? "" : "border-b border-white/5"
                  }`}
                >
                  <span className="font-display italic text-[0.9rem] text-gold/70 min-w-5 pt-0.5">
                    {s.n}
                  </span>
                  <div className="text-[0.84rem] text-white/50 leading-[1.75]">
                    <strong className="block text-white font-normal mb-0.5">
                      {s.strong}
                    </strong>
                    {s.rest}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── PRACTICAL INFO ──────────────────────────────────── */}
        <section className="bg-cream px-6 md:px-12 lg:px-20 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <p className="reveal flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-5">
              <span className="block w-[22px] h-px bg-gold opacity-50" />
              Before you travel
            </p>
            <h2
              className="reveal font-display font-normal text-navy leading-[1.2] mb-10"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.4rem)" }}
            >
              Good to <em className="italic text-coastal">know.</em>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]">
              {PRACTICAL.map((item, i) => (
                <div
                  key={item.numeral}
                  className={`reveal ${i % 3 === 1 ? "reveal-d1" : i % 3 === 2 ? "reveal-d2" : ""} bg-white border border-sand px-7 py-8`}
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

        {/* ── ENQUIRY FORM ────────────────────────────────────── */}
        <section
          id="enquiry-form"
          className="bg-sand-light px-6 md:px-12 lg:px-20 py-20 md:py-28 scroll-mt-24"
        >
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">
            <div className="reveal">
              <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-5">
                <span className="block w-[22px] h-px bg-gold opacity-50" />
                Book transportation
              </p>
              <h2
                className="font-display font-normal text-navy leading-[1.25] mb-4"
                style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)" }}
              >
                Arrange your{" "}
                <em className="italic text-coastal">journey.</em>
              </h2>
              <p className="text-[0.88rem] text-ink-soft leading-[1.95] mb-6">
                Tell us where you're travelling from, when, and how many
                people. We'll confirm vehicle availability and send a secure
                payment link within 24 hours.
              </p>
              <div className="bg-white border border-sand px-5 py-4 text-[0.78rem] text-ink-soft/80 leading-[1.7]">
                All transportation is confirmed manually by our team before
                any payment is taken. No automated booking — every vehicle
                and driver is personally selected for your route.
              </div>
            </div>

            {submitted ? (
              <div className="bg-white border border-sand p-8">
                <h3 className="font-display text-[1.2rem] text-navy mb-3">
                  Request received.
                </h3>
                <p className="text-[0.85rem] text-ink-soft leading-[1.8] mb-6">
                  Thank you. Our team will confirm vehicle and driver within
                  24 hours and send a secure payment link via WhatsApp or
                  email.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-[0.58rem] tracking-[0.18em] uppercase text-gold hover:text-gold-light transition-colors"
                >
                  Submit another request →
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white border border-sand p-7"
              >
                <Field label="Route">
                  <select
                    required
                    defaultValue=""
                    className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Select your route
                    </option>
                    <optgroup label="Routes to Siwa">
                      <option>Cairo → Siwa Oasis (~8 hrs)</option>
                      <option>Marsa Matrouh → Siwa (~3 hrs)</option>
                      <option>Alexandria → Siwa (~6 hrs)</option>
                    </optgroup>
                    <optgroup label="Return from Siwa">
                      <option>Siwa → Cairo (~8 hrs)</option>
                      <option>Siwa → Marsa Matrouh (~3 hrs)</option>
                      <option>Siwa → Alexandria (~6 hrs)</option>
                    </optgroup>
                    <optgroup label="Desert drives within Siwa">
                      <option>Great Sand Sea Drive (half/full day)</option>
                      <option>Salt Lakes & Springs Circuit (half day)</option>
                      <option>Ancient Sites Drive (morning)</option>
                      <option>Sunrise Desert Drive</option>
                      <option>In-oasis transfer</option>
                      <option>Full day bespoke</option>
                    </optgroup>
                  </select>
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-3">
                  <Field label="Travel date">
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none cursor-pointer"
                    />
                  </Field>
                  <Field label="Departure time (approx.)">
                    <input
                      type="text"
                      placeholder="e.g. 6:00am"
                      className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-3">
                  <Field label="Passengers">
                    <select
                      defaultValue="2"
                      className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer"
                    >
                      <option>1 passenger</option>
                      <option>2 passengers</option>
                      <option>3 passengers</option>
                      <option>4 passengers</option>
                      <option>5–6 passengers</option>
                      <option>7–8 passengers</option>
                    </select>
                  </Field>
                  <Field label="Vehicle preference">
                    <select
                      defaultValue="Let Soléi decide"
                      className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer"
                    >
                      <option>Let Soléi decide</option>
                      <option>Private SUV</option>
                      <option>4×4 Desert Vehicle</option>
                      <option>Private Minivan</option>
                    </select>
                  </Field>
                </div>

                <Field label="Pickup location">
                  <input
                    type="text"
                    placeholder="Hotel name, address, or area"
                    className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none"
                  />
                </Field>

                <Field label="Any notes or special requests">
                  <textarea
                    rows={4}
                    placeholder="Stops along the way, luggage, accessibility needs, or anything else we should know…"
                    className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none resize-y"
                  />
                </Field>

                <button
                  type="submit"
                  className="block w-full mt-3 text-[0.65rem] tracking-[0.2em] uppercase text-navy bg-gold py-4 font-body font-medium hover:bg-gold-light transition-colors"
                >
                  Send transportation request
                </button>
                <p className="text-[0.68rem] text-ink-soft/50 text-center mt-3 leading-[1.6]">
                  We respond within 24 hours. No payment until vehicle and
                  driver are confirmed.
                </p>
              </form>
            )}
          </div>
        </section>

        {/* ── CLOSING ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-navy px-6 md:px-12 lg:px-20 py-24 md:py-32 text-center">
          <div className="absolute inset-0 textile-bg pointer-events-none" />
          <div className="relative z-[2] max-w-xl mx-auto">
            <div className="flex justify-center mb-10">
              <Arch className="w-14" />
            </div>
            <h2
              className="reveal font-display font-normal leading-[1.2] text-white mb-5"
              style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}
            >
              The journey begins
              <br />
              before you{" "}
              <em className="italic text-gold">arrive.</em>
            </h2>
            <p className="reveal text-[0.88rem] text-white/40 leading-[1.95] mb-10">
              Eight hours through the Western Desert is not a transfer. It is
              the first part of the Siwa experience. We treat it that way —
              and so do the guests who've made it.
            </p>
            <div className="reveal flex gap-4 justify-center flex-wrap">
              <a
                href="#enquiry-form"
                className="text-[0.65rem] tracking-[0.2em] uppercase text-navy bg-gold px-10 py-4 hover:bg-gold-light transition-colors"
              >
                Arrange transportation
              </a>
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <label className="block text-[0.56rem] tracking-[0.22em] uppercase text-ink-soft/55 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
