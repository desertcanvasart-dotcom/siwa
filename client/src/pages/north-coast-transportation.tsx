import { useState } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { useReveal } from "@/components/home/useReveal";
import { Arch } from "@/components/ui/Arch";

/* ──────────────────────────────────────────────────────────────
 *  /north-coast/transportation
 *
 *  Coastal-blue hub. No desert drives (the NC has no equivalent)
 *  — replaced with six within-coast transfer types. Fleet drops
 *  4×4 and adds a Premium Sedan for airport runs. Comparison
 *  panel flips the framing: NC is "you are here", Siwa is the
 *  crosslink.
 * ────────────────────────────────────────────────────────────── */

const WAVE_TEX_HERO =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23FDFAF5' stroke-opacity='0.04' stroke-width='0.5'%3E%3Cpath d='M0 30 Q15 20 30 30 Q45 40 60 30'/%3E%3Cpath d='M0 45 Q15 35 30 45 Q45 55 60 45'/%3E%3Cpath d='M0 15 Q15 5 30 15 Q45 25 60 15'/%3E%3C/g%3E%3C/svg%3E\")";

const WAVE_TEX_BG =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23FDFAF5' stroke-opacity='0.06' stroke-width='0.5'%3E%3Cpath d='M0 30 Q15 20 30 30 Q45 40 60 30'/%3E%3C/g%3E%3C/svg%3E\")";

const PRINCIPLES = [
  "Private vehicles only — no shared transfers ever",
  "Drivers selected for route knowledge, not just licence",
  "Between-property transfers across Marassi, Almaza Bay, El Alamein",
  "Flexible timing — depart when your stay is ready",
];

interface RouteCard {
  num: string;
  from: string;
  arrow?: string;
  mid?: string;
  to: string;
  desc: string;
  facts: { key: string; val: string }[];
  price: string;
}

const FEATURED_ROUTE: RouteCard = {
  num: "Route 01 · Primary",
  from: "Cairo",
  to: "North Coast",
  desc: "Two and a half hours on the Desert Road or the Coastal Road — your choice, both are paved and well-maintained. The Desert Road is faster. The Coastal Road gives you the Mediterranean for the last forty minutes. We recommend the Coastal Road for arrivals — it frames the destination correctly. The Desert Road for departures — efficient and without sentiment.",
  facts: [
    { key: "Duration", val: "~2.5 hours" },
    { key: "Road options", val: "Desert Road (faster) or Coastal Road (scenic)" },
    { key: "Departure", val: "Flexible — morning recommended to beat traffic" },
    { key: "Vehicle", val: "Private air-conditioned SUV" },
    { key: "Drop-off", val: "Direct to your property" },
  ],
  price: "$80 per vehicle",
};

const ROUTES: RouteCard[] = [
  {
    num: "Route 02",
    from: "Alexandria",
    to: "North Coast",
    desc: "Less than an hour along the coastal road. The natural connection for guests arriving via Borg El Arab Airport or those combining a Cairo–Alexandria trip with coastal time.",
    facts: [
      { key: "Duration", val: "~45 min – 1 hour" },
      { key: "Road type", val: "Coastal road — Mediterranean visible" },
      { key: "Vehicle", val: "Private SUV" },
    ],
    price: "$45 per vehicle",
  },
  {
    num: "Route 03",
    from: "Cairo",
    mid: "Alexandria",
    to: "Coast",
    desc: "The full coastal approach — Cairo, then Alexandria for a few hours, then the coast. A longer journey but the right one if Alexandria is on your list. We'll suggest the stops worth making.",
    facts: [
      { key: "Duration", val: "~4 hours incl. Alexandria stop" },
      { key: "Style", val: "Full-day coastal approach" },
      { key: "Vehicle", val: "Private SUV with flexible stops" },
    ],
    price: "$120 per vehicle",
  },
  {
    num: "Route 04",
    from: "North Coast",
    to: "Cairo",
    desc: "The return. We recommend the Desert Road for departures — faster and more practical when you're heading to an airport or a meeting. Early morning departures leave the road clear.",
    facts: [
      { key: "Duration", val: "~2.5 hours" },
      { key: "Recommended", val: "Early morning — before 8am ideal" },
      { key: "Vehicle", val: "Private SUV" },
    ],
    price: "$80 per vehicle",
  },
];

interface TransferCard {
  num: string;
  title: string;
  desc: string;
  coverageLabel: string;
  coverage: string;
  duration: string;
  price: string;
}

const TRANSFERS: TransferCard[] = [
  {
    num: "01",
    title: "Marassi ↔ Almaza Bay",
    desc: "The most common inter-area transfer on the North Coast. About an hour's drive east along the coastal road — calm, direct, and worth doing for the coastline views alone.",
    coverageLabel: "Covers",
    coverage: "All Marassi properties · Almaza Bay resorts · One-way or return",
    duration: "~1 hour · Private vehicle",
    price: "From $40",
  },
  {
    num: "02",
    title: "Marassi ↔ El Alamein",
    desc: "Thirty minutes west along the coast road. Used primarily for the El Alamein heritage experience — battlefield, museum, and war cemetery. Also the route to the Al Alamein Hotel and Rixos Premium.",
    coverageLabel: "Covers",
    coverage: "Marassi · El Alamein sites · Al Alamein Hotel · Rixos Premium",
    duration: "~30 min · Private vehicle",
    price: "From $25",
  },
  {
    num: "03",
    title: "Property to Experience",
    desc: "Direct transfer from your resort to any Soléi experience — the marina for sunset sailing, the flamingo lagoon access point, a seafood lunch off the main strip. Coordinated with your experience booking.",
    coverageLabel: "Covers",
    coverage: "Marassi Marina · Flamingo lagoon · Seafood spots · Coastline drive start",
    duration: "On-demand · Private vehicle",
    price: "From $20",
  },
  {
    num: "04",
    title: "Airport Transfers",
    desc: "From Cairo International (2.5 hrs), Borg El Arab Airport in Alexandria (45 min), or Marsa Matrouh Airport — direct to your North Coast property. Flight tracking included so we adjust for delays.",
    coverageLabel: "Airports",
    coverage: "Cairo International · Borg El Arab · Marsa Matrouh",
    duration: "Flexible · Flight tracked",
    price: "From $45",
  },
  {
    num: "05",
    title: "Cairo Day Trip",
    desc: "Depart Cairo early morning, full day on the North Coast, return in the evening. The proximity makes it the only Egyptian coastal destination genuinely feasible as a day trip from the capital.",
    coverageLabel: "Includes",
    coverage: "Round-trip vehicle · Driver for the full day · Flexible itinerary",
    duration: "Full day · Private vehicle",
    price: "From $140",
  },
  {
    num: "06",
    title: "On-Demand Transfers",
    desc: "Simple point-to-point — within a resort area, between restaurants, to the beach access point your property doesn't have, or wherever you need to be at whatever time suits you.",
    coverageLabel: "Covers",
    coverage: "Any point on the North Coast · Any time · No minimum",
    duration: "On-demand · Private vehicle",
    price: "From $15",
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
    type: "Standard · All North Coast routes",
    desc: "Air-conditioned, comfortable, and right-sized for the Cairo–North Coast road. Handles all paved routes including the coastal road.",
    specs: [
      { key: "Passengers", val: "Up to 4" },
      { key: "Air conditioning", val: "Full — front and rear" },
      { key: "Best for", val: "Cairo · Alexandria · All routes" },
    ],
    gradient: "bg-[linear-gradient(155deg,#2F6F8F_0%,#1a4a6a_100%)]",
  },
  {
    name: "Premium Sedan",
    type: "Upgrade · Airport & city routes",
    desc: "For guests who prefer a quieter, more composed drive. Particularly suited to airport arrivals and the Cairo run when the journey matters as much as the destination.",
    specs: [
      { key: "Passengers", val: "Up to 3" },
      { key: "Style", val: "Premium — quieter ride" },
      { key: "Best for", val: "Airport · Cairo · Business travel" },
    ],
    gradient: "bg-[linear-gradient(155deg,#1a4a6a_0%,#0F2436_100%)]",
  },
  {
    name: "Private Minivan",
    type: "Groups · Family travel",
    desc: "For larger groups travelling together. Same private standard — never combined with other bookings regardless of group size. Ample luggage space for family travel.",
    specs: [
      { key: "Passengers", val: "Up to 8" },
      { key: "Luggage", val: "Large capacity — suitable for families" },
      { key: "Best for", val: "Groups · Families · Long routes" },
    ],
    gradient: "bg-[linear-gradient(155deg,#1a3a52_0%,#2F6F8F_100%)]",
  },
];

const HOW_STEPS = [
  {
    n: "1.",
    strong: "Submit your request",
    rest: "Route, date, passengers, pickup location. The form below takes two minutes.",
  },
  {
    n: "2.",
    strong: "We confirm vehicle & driver",
    rest: "Our team selects the right vehicle and a driver who knows the route. Response within 24 hours.",
  },
  {
    n: "3.",
    strong: "Payment link sent",
    rest: "Secure payment via WhatsApp or email. No charge until vehicle is confirmed.",
  },
  {
    n: "4.",
    strong: "Full details before travel",
    rest: "Driver name, vehicle registration, contact number, exact pickup time. Everything you need — sent in advance.",
  },
];

const PRACTICAL = [
  {
    numeral: "I",
    title: "Best time to depart from Cairo",
    desc: "Before 9am or after 7pm avoids the Cairo ring road at its worst. For a morning arrival, depart no later than 7am. Summer weekends are particularly busy — Friday afternoon departures from the city should be avoided.",
  },
  {
    numeral: "II",
    title: "Which road from Cairo",
    desc: "The Desert Road is faster and more consistent. The Coastal Road is scenic — 40 minutes longer but the Mediterranean is visible for much of the final stretch. We recommend the Coastal Road for arrivals, Desert Road for departures.",
  },
  {
    numeral: "III",
    title: "Mobile signal on route",
    desc: "Good signal throughout the Cairo–North Coast routes. Unlike the Siwa road, you won't lose connectivity. Drivers carry Egyptian SIMs — they can reach you if anything changes.",
  },
  {
    numeral: "IV",
    title: "Payment & tolls",
    desc: "All transport fees settled in advance with Soléi. Drivers handle any road tolls as part of the agreed price — no surprise additions. Payment in USD via secure link.",
  },
  {
    numeral: "V",
    title: "Coordinating with accommodation",
    desc: "If you've booked a North Coast property through us, we coordinate transport timing directly with your check-in. No need to manage both separately — we brief the driver on your property's access and parking.",
  },
  {
    numeral: "VI",
    title: "Combining with Siwa",
    desc: "Many guests do North Coast first, return to Cairo, then travel to Siwa. We manage the full routing across both destinations — one conversation, both legs arranged.",
  },
];

export default function NorthCoastTransportationPage() {
  useReveal();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <SEO
        title="North Coast Transportation — Soléi"
        description="Private transportation to and around Egypt's North Coast. Cairo, Alexandria, and airport routes, plus within-coast transfers. All private, by enquiry."
        path="/north-coast/transportation"
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
                Two and a half hours from Cairo.
              </h1>
            </div>

            <div className="animate-fade-up animation-delay-800 pb-2">
              <p className="text-[0.9rem] text-white/40 leading-[1.95] mb-8">
                The North Coast is Egypt's most accessible second
                destination. Cairo is two and a half hours by private
                vehicle. Alexandria is less than one. We arrange every
                transfer — nothing shared, nothing generic, nothing that
                makes the journey feel like a logistics problem.
              </p>
              <div className="flex flex-col gap-[2px]">
                {PRINCIPLES.map((p) => (
                  <div
                    key={p}
                    className="flex items-center gap-3 px-5 py-3 border border-white/10 text-[0.8rem] text-white/45"
                  >
                    <span className="w-[5px] h-[5px] rounded-full bg-gold opacity-60 flex-shrink-0" />
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── ROUTES TO NC ────────────────────────────────────── */}
        <section className="bg-cream px-6 md:px-12 lg:px-20 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <p className="reveal flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-10">
              <span className="block w-[22px] h-px bg-gold opacity-50" />
              Getting to the coast
            </p>
            <h2
              className="reveal font-display font-normal text-navy leading-[1.2] mb-4"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.4rem)" }}
            >
              Routes{" "}
              <em className="italic text-coastal">into the North Coast.</em>
            </h2>
            <p className="reveal text-[0.88rem] text-ink-soft leading-[1.95] max-w-[60ch] mb-10">
              The North Coast sits between Cairo and Alexandria along the
              Mediterranean. It is the closest of the two Soléi destinations
              and by far the easiest to reach — two and a half hours from
              central Cairo on a clear road.
            </p>

            {/* Featured */}
            <a
              href="#enquiry-form"
              className="reveal grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-[2px] group"
            >
              <div className="relative bg-[linear-gradient(155deg,#0F2436_0%,#2F6F8F_60%,#1a4a6a_100%)] min-h-[220px] md:min-h-[300px] overflow-hidden flex flex-col justify-end p-6 md:p-8">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ backgroundImage: WAVE_TEX_BG }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(9,24,32,0.88) 0%, transparent 55%)",
                  }}
                />
                <div className="relative z-[2]">
                  <p className="text-[0.56rem] tracking-[0.28em] uppercase text-gold/80 mb-2">
                    Most requested route
                  </p>
                  <div className="font-display text-[1.8rem] font-normal text-white leading-tight">
                    {FEATURED_ROUTE.from}{" "}
                    <span className="text-gold mx-1">→</span>{" "}
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
                    <em className="italic text-coastal/70 mx-1">→</em>{" "}
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
                        <span className="text-navy text-right ml-4">{f.val}</span>
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
                  <span className="text-[0.58rem] tracking-[0.16em] uppercase text-white bg-coastal px-5 py-2.5 whitespace-nowrap group-hover:bg-[#266080] transition-colors">
                    Book this route
                  </span>
                </div>
              </div>
            </a>

            {/* Routes grid */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]"
              style={{ marginTop: "2px" }}
            >
              {ROUTES.map((r, i) => (
                <a
                  key={r.num}
                  href="#enquiry-form"
                  className={`reveal ${i % 3 === 1 ? "reveal-d1" : i % 3 === 2 ? "reveal-d2" : ""} bg-white border border-sand p-7 flex flex-col hover:border-gold hover:bg-cream transition-colors group`}
                >
                  <p className="font-display italic text-[0.78rem] text-gold/65 mb-3">
                    {r.num}
                  </p>
                  <h3 className="font-display text-[1.15rem] font-normal text-navy leading-snug mb-2">
                    {r.from}{" "}
                    <em className="italic text-coastal/70 mx-0.5">→</em>{" "}
                    {r.mid && (
                      <>
                        {r.mid}{" "}
                        <em className="italic text-coastal/70 mx-0.5">→</em>{" "}
                      </>
                    )}
                    {r.to}
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
                        <span className="text-navy text-right ml-4">{f.val}</span>
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
                    <span className="text-[0.58rem] tracking-[0.16em] uppercase text-white bg-coastal px-4 py-2 whitespace-nowrap group-hover:bg-[#266080] transition-colors">
                      Book →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── WITHIN-COAST TRANSFERS ──────────────────────────── */}
        <section className="bg-white px-6 md:px-12 lg:px-20 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <p className="reveal flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-10">
              <span className="block w-[22px] h-px bg-gold opacity-50" />
              Within the coast
            </p>
            <h2
              className="reveal font-display font-normal text-navy leading-[1.2] mb-4"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.4rem)" }}
            >
              Moving between{" "}
              <em className="italic text-coastal">properties & areas.</em>
            </h2>
            <p className="reveal text-[0.88rem] text-ink-soft leading-[1.95] max-w-[60ch] mb-10">
              The North Coast's three main areas — Marassi, Almaza Bay, and
              El Alamein — are spread over roughly 100km of coastline. Moving
              between them, or between your property and an experience,
              requires a vehicle. We arrange all of it.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]">
              {TRANSFERS.map((t, i) => (
                <a
                  key={t.num}
                  href="#enquiry-form"
                  className={`reveal ${i % 3 === 1 ? "reveal-d1" : i % 3 === 2 ? "reveal-d2" : ""} border border-sand px-8 py-10 block hover:border-gold hover:bg-cream transition-colors`}
                >
                  <span className="block font-display italic text-[0.78rem] text-coastal/65 mb-4">
                    {t.num}
                  </span>
                  <h3 className="font-display text-[1.1rem] font-normal text-navy leading-snug mb-3">
                    {t.title}
                  </h3>
                  <p className="text-[0.82rem] text-ink-soft leading-[1.85] mb-5">
                    {t.desc}
                  </p>
                  <div className="text-[0.7rem] text-ink-soft/55 leading-[1.8] mb-5">
                    <strong className="block text-navy font-normal mb-0.5 text-[0.62rem] tracking-[0.12em] uppercase">
                      {t.coverageLabel}
                    </strong>
                    {t.coverage}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-sand-light">
                    <div className="text-[0.68rem] text-ink-soft/50">
                      {t.duration}
                    </div>
                    <div className="font-display text-[0.95rem] text-navy">
                      {t.price}
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
                The North Coast is all paved roads — no 4×4 required. What
                matters here is comfort for the drive, reliability on long
                routes, and air conditioning that actually works in August.
                Every vehicle in our fleet meets all three.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]">
              {VEHICLES.map((v, i) => (
                <div
                  key={v.name}
                  className={`reveal ${i % 3 === 1 ? "reveal-d1" : i % 3 === 2 ? "reveal-d2" : ""} bg-white border border-sand p-7`}
                >
                  <div className={`relative h-[110px] overflow-hidden mb-5 ${v.gradient}`}>
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ backgroundImage: WAVE_TEX_BG }}
                    />
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

        {/* ── VS SIWA COMPARISON ──────────────────────────────── */}
        <section className="relative overflow-hidden bg-coastal px-6 md:px-12 lg:px-20 py-16 md:py-20">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: WAVE_TEX_HERO }}
          />
          <div className="relative z-[2] max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-[2px]">
            <div className="reveal border border-white/15 p-8 md:p-10">
              <p className="flex items-center gap-2 text-[0.58rem] tracking-[0.3em] uppercase text-gold/70 mb-4">
                <span className="block w-[14px] h-px bg-gold opacity-50" />
                You are here
              </p>
              <h3 className="font-display text-[1.5rem] font-normal leading-[1.2] text-white mb-3">
                North <em className="italic text-gold">Coast</em>
              </h3>
              <p className="text-[0.84rem] text-white/40 leading-[1.85] mb-6">
                Close, fast, easy. The coast anyone can reach from Cairo
                without planning a full expedition. Two and a half hours and
                you're there.
              </p>
              <ul className="list-none border-t border-white/10">
                {[
                  ["From Cairo", "~2.5 hours"],
                  ["From Alexandria", "~45 minutes"],
                  ["Road type", "All paved — no off-road"],
                  ["Booking method", "Enquiry — payment link within 24 hrs"],
                  ["Best season", "April–June · September–November"],
                ].map(([k, v], i, arr) => (
                  <li
                    key={k}
                    className={`flex justify-between items-baseline py-3 text-[0.8rem] ${
                      i === arr.length - 1 ? "" : "border-b border-white/5"
                    }`}
                  >
                    <span className="text-white/30">{k}</span>
                    <span className="text-white/65 text-right ml-4">{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/siwa-oasis/transportation"
              className="reveal reveal-d1 bg-navy-deep/5 border border-white/10 p-8 md:p-10 block hover:bg-navy-deep/20 transition-colors group"
            >
              <p className="flex items-center gap-2 text-[0.58rem] tracking-[0.3em] uppercase text-gold/70 mb-4">
                <span className="block w-[14px] h-px bg-gold opacity-50" />
                Also explore
              </p>
              <h3 className="font-display text-[1.5rem] font-normal leading-[1.2] text-white mb-3">
                Siwa <em className="italic text-gold">Oasis</em>
              </h3>
              <p className="text-[0.84rem] text-white/40 leading-[1.85] mb-6">
                Further. Slower. A different kind of journey entirely —
                eight hours through the Western Desert. The distance is part
                of the experience.
              </p>
              <ul className="list-none border-t border-white/10">
                {[
                  ["From Cairo", "~8 hours"],
                  ["From Marsa Matrouh", "~3 hours"],
                  ["Road type", "Mixed — paved & sand roads"],
                  ["Booking method", "Enquiry — same process"],
                  ["Best season", "October–April"],
                ].map(([k, v], i, arr) => (
                  <li
                    key={k}
                    className={`flex justify-between items-baseline py-3 text-[0.8rem] ${
                      i === arr.length - 1 ? "" : "border-b border-white/5"
                    }`}
                  >
                    <span className="text-white/30">{k}</span>
                    <span className="text-white/65 text-right ml-4">{v}</span>
                  </li>
                ))}
              </ul>
              <span className="inline-flex items-center gap-2 text-[0.6rem] tracking-[0.2em] uppercase text-gold/70 mt-6 group-hover:gap-3 transition-all">
                View Siwa transportation →
              </span>
            </Link>
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
                All transportation
                <br />
                <em className="italic text-gold">arranged by our team.</em>
              </h2>
              <p className="text-[0.88rem] text-white/40 leading-[1.95]">
                Every vehicle is confirmed manually before any payment is
                taken. Routes, drivers, and timing are all personally
                selected. No automated booking — for the same reason we
                don't automate North Coast accommodation: we want to make
                sure what you get is exactly right before you pay for it.
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
                Tell us your route, when you're travelling, and how many
                passengers. We'll confirm vehicle availability and send a
                secure payment link within 24 hours.
              </p>
              <div className="bg-white border border-sand px-5 py-4 text-[0.78rem] text-ink-soft/80 leading-[1.7]">
                All North Coast transportation is confirmed manually. Every
                vehicle and driver is personally selected for your route.
                No automated booking — no payment until confirmed.
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
                  className="text-[0.58rem] tracking-[0.18em] uppercase text-coastal hover:text-[#266080] transition-colors"
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
                    className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-coastal outline-none appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Select your route
                    </option>
                    <optgroup label="Routes to North Coast">
                      <option>Cairo → North Coast (~2.5 hrs)</option>
                      <option>Alexandria → North Coast (~45 min)</option>
                      <option>Cairo → Alexandria → North Coast (~4 hrs)</option>
                      <option>Airport pickup → North Coast</option>
                    </optgroup>
                    <optgroup label="Return from North Coast">
                      <option>North Coast → Cairo (~2.5 hrs)</option>
                      <option>North Coast → Alexandria (~45 min)</option>
                      <option>North Coast → Airport</option>
                    </optgroup>
                    <optgroup label="Within the North Coast">
                      <option>Marassi ↔ Almaza Bay (~1 hr)</option>
                      <option>Marassi ↔ El Alamein (~30 min)</option>
                      <option>Property to experience transfer</option>
                      <option>On-demand in-area transfer</option>
                      <option>Cairo day trip (full day)</option>
                    </optgroup>
                  </select>
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-3">
                  <Field label="Travel date">
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-coastal outline-none cursor-pointer"
                    />
                  </Field>
                  <Field label="Departure time (approx.)">
                    <input
                      type="text"
                      placeholder="e.g. 7:00am"
                      className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-coastal outline-none"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-3">
                  <Field label="Passengers">
                    <select
                      defaultValue="2"
                      className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-coastal outline-none appearance-none cursor-pointer"
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
                      className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-coastal outline-none appearance-none cursor-pointer"
                    >
                      <option>Let Soléi decide</option>
                      <option>Private SUV</option>
                      <option>Premium Sedan</option>
                      <option>Private Minivan</option>
                    </select>
                  </Field>
                </div>

                <Field label="Pickup location">
                  <input
                    type="text"
                    placeholder="Hotel name, address, or area (e.g. Marassi marina)"
                    className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-coastal outline-none"
                  />
                </Field>

                <Field label="Drop-off location">
                  <input
                    type="text"
                    placeholder="Property name or destination on the coast"
                    className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-coastal outline-none"
                  />
                </Field>

                <Field label="Any notes or special requests">
                  <textarea
                    rows={4}
                    placeholder="Flight number for airport pickups, child seats, luggage, accessibility needs…"
                    className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-coastal outline-none resize-y"
                  />
                </Field>

                <button
                  type="submit"
                  className="block w-full mt-3 text-[0.65rem] tracking-[0.2em] uppercase text-white bg-coastal py-4 font-body font-medium hover:bg-[#266080] transition-colors"
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
              Close enough to go.
              <br />
              <em className="italic text-gold">Far enough to matter.</em>
            </h2>
            <p className="reveal text-[0.88rem] text-white/40 leading-[1.95] mb-10">
              Two and a half hours from Cairo — easy enough for a long
              weekend, close enough to return often. We'll handle the
              vehicle so the journey feels like the start of the
              experience, not the logistics before it.
            </p>
            <div className="reveal flex gap-4 justify-center flex-wrap">
              <a
                href="#enquiry-form"
                className="text-[0.65rem] tracking-[0.2em] uppercase text-navy bg-gold px-10 py-4 hover:bg-gold-light transition-colors"
              >
                Arrange transportation
              </a>
              <Link
                href="/north-coast/accommodation"
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
