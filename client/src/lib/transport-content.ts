import { pickContent, type SiteContentMap } from "@/lib/useSiteContent";

/**
 * Editable copy for the two transportation pages
 * (/siwa-oasis/transportation, /north-coast/transportation).
 *
 * Each page's default copy lives here once. The page overlays admin
 * edits from site_content on top of it (resolveTransportPage), and the
 * admin Pages editor builds its fields from the same defaults
 * (transportAdminSections), so the grey placeholder always shows what
 * the live page currently falls back to.
 *
 * Keys are `<prefix>.<section>.<field>` and, for repeating cards,
 * `<prefix>.<section>.items.<i>.<field>`. Each card list ships with
 * spare empty slots so the admin can add cards; a card whose first
 * field is blank or "-" is hidden. Fact / spec lists are one
 * "Label: value" pair per line; bullet lists are one item per line.
 */

export type Pair = { key: string; val: string };

export interface TransportRoute {
  num: string;
  from: string;
  via: string;
  to: string;
  desc: string;
  facts: string;
  price: string;
  /** Optional photo; the featured route shows it in its image panel. */
  image: string;
}
export interface TransportCard {
  num: string;
  title: string;
  desc: string;
  includes_label: string;
  includes: string;
  duration: string;
  price: string;
  image: string;
}
export interface TransportVehicle {
  name: string;
  type: string;
  desc: string;
  specs: string;
  image: string;
}
export interface TransportStep {
  title: string;
  text: string;
}
export interface TransportTip {
  title: string;
  desc: string;
}
export interface TransportCompareSide {
  eyebrow: string;
  title: string;
  italic: string;
  body: string;
  facts: string;
}

export interface TransportPageDefaults {
  seo: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    italic: string;
    title_2: string;
    body: string;
    principles: string;
    media: string;
  };
  routes: {
    eyebrow: string;
    title: string;
    italic: string;
    body: string;
    featured_label: string;
    featured_cta: string;
    card_cta: string;
    price_label: string;
  };
  featured: TransportRoute;
  routeItems: TransportRoute[];
  cards: { eyebrow: string; title: string; italic: string; body: string };
  cardItems: TransportCard[];
  fleet: { eyebrow: string; title: string; italic: string; body: string };
  fleetItems: TransportVehicle[];
  compare?: { here: TransportCompareSide; other: TransportCompareSide & { cta: string; href: string } };
  how: { eyebrow: string; title: string; italic: string; body: string };
  howItems: TransportStep[];
  practical: { eyebrow: string; title: string; italic: string };
  practicalItems: TransportTip[];
  enquiry: { eyebrow: string; title: string; italic: string; body: string; note: string };
  closing: {
    title: string;
    italic: string;
    body: string;
    cta: string;
    cta_2: string;
    cta_2_href: string;
    media: string;
  };
}

const EMPTY_ROUTE: TransportRoute = { num: "", from: "", via: "", to: "", desc: "", facts: "", price: "", image: "" };
const EMPTY_CARD: TransportCard = { num: "", title: "", desc: "", includes_label: "", includes: "", duration: "", price: "", image: "" };
const EMPTY_VEHICLE: TransportVehicle = { name: "", type: "", desc: "", specs: "", image: "" };
const EMPTY_STEP: TransportStep = { title: "", text: "" };
const EMPTY_TIP: TransportTip = { title: "", desc: "" };

/** Pad a default list with empty slots so the admin has room to add. */
function withSpare<T>(items: Omit<T, "image">[], empty: T, total: number): T[] {
  const filled = items.map((item) => ({ ...empty, ...item }) as T);
  return [...filled, ...Array.from({ length: Math.max(0, total - items.length) }, () => ({ ...empty }))];
}

export const SIWA_TRANSPORT: TransportPageDefaults = {
  seo: {
    title: "Siwa Oasis Transportation — Soléi",
    description:
      "Private transportation to and around Siwa Oasis. Cairo, Alexandria, and Marsa Matrouh routes, plus desert drives within the oasis. All private, by enquiry.",
  },
  hero: {
    eyebrow: "Getting here & getting around",
    title: "Private",
    italic: "transportation.",
    title_2: "Arrive the right way.",
    body: "The journey to Siwa is part of the experience. Eight hours through the Western Desert from Cairo, or three hours across sand roads from Marsa Matrouh. We arrange every vehicle, every route, and every detail — nothing shared, nothing generic.",
    principles: [
      "Private vehicles only — no shared transfers",
      "All drivers are vetted and known to us personally",
      "Routes selected for the journey, not just the destination",
      "Flexible timing — depart when you're ready",
    ].join("\n"),
    media: "",
  },
  routes: {
    eyebrow: "Getting to Siwa",
    title: "Routes",
    italic: "into the oasis.",
    body: "",
    featured_label: "Most requested route",
    featured_cta: "Book this route",
    card_cta: "Book →",
    price_label: "From",
  },
  featured: {
    num: "Route 01 · Signature",
    from: "Cairo",
    via: "",
    to: "Siwa Oasis",
    desc: "The defining journey. Eight hours through the Western Desert — past Alexandria, along the Mediterranean coast to Marsa Matrouh, then south into the sand. The road narrows as the landscape opens. By the time you arrive, you've understood why Siwa exists at the edge of everything. We choose vehicles and drivers who know this route intimately. Stops are yours to decide — we'll suggest where the light is best.",
    facts: [
      "Duration: ~8 hours",
      "Road type: Paved throughout — no off-road required",
      "Departure: Early morning recommended (5–7am)",
      "Stops: Flexible — Marsa Matrouh, rest stops as needed",
      "Vehicle: Private SUV or 4×4 — air-conditioned",
    ].join("\n"),
    price: "$180 per vehicle",
    image: "",
  },
  routeItems: withSpare(
    [
      {
        num: "Route 02",
        from: "Marsa Matrouh",
        via: "",
        to: "Siwa",
        desc: "The shorter approach — three hours across sand roads as the landscape flattens into the oasis edge. A good option if you're flying into Marsa Matrouh's domestic airport or arriving from the coast.",
        facts: "Duration: ~3 hours\nRoad type: Mixed — paved & sand road\nVehicle: Private 4×4 recommended",
        price: "$95 per vehicle",
      },
      {
        num: "Route 03",
        from: "Alexandria",
        via: "",
        to: "Siwa",
        desc: "Six hours via the coastal road and then inland. A scenic alternative to the Cairo departure — the Mediterranean is visible for much of the first half before the desert takes over completely.",
        facts: "Duration: ~6 hours\nRoad type: Coastal then paved desert\nVehicle: Private SUV — air-conditioned",
        price: "$140 per vehicle",
      },
      {
        num: "Route 04",
        from: "Siwa",
        via: "",
        to: "Cairo (return)",
        desc: "The same road, a different direction. Leaving Siwa is always harder than arriving. We schedule returns for early morning so you have the desert to yourselves before the day begins.",
        facts: "Duration: ~8 hours\nDeparture: Early morning recommended\nVehicle: Private SUV or 4×4",
        price: "$180 per vehicle",
      },
    ],
    EMPTY_ROUTE,
    6,
  ),
  cards: {
    eyebrow: "Within the oasis",
    title: "Desert drives —",
    italic: "Siwa explored.",
    body: "Once you're in Siwa, the oasis rewards exploration. These are not excursion packages — they're private drives to specific places, with guides who know what's worth stopping for and what isn't.",
  },
  cardItems: withSpare(
    [
      {
        num: "01",
        title: "Great Sand Sea Drive",
        desc: "Into the dunes of the Great Sand Sea — one of the largest continuous sand seas on earth. Experienced 4×4 guides, dune driving, and the particular silence of a landscape with no edges.",
        includes_label: "Includes",
        includes: "Dune driving · Sand sea viewpoints · Sunset stop · Traditional tea",
        duration: "Half or full day · 4×4 · Private",
        price: "From $85",
      },
      {
        num: "02",
        title: "Salt Lakes & Springs Circuit",
        desc: "A loop through the oasis's natural water features — Siwa Lake, Birket Zeitoun, Cleopatra Spring, and the lesser-known springs most visitors miss entirely. A half day that covers the full range of Siwa's water landscape.",
        includes_label: "Includes",
        includes: "Siwa Lake stop · Cleopatra Spring · Birket Zeitoun · Hidden springs",
        duration: "Half day · 4×4 · Private",
        price: "From $65",
      },
      {
        num: "03",
        title: "Ancient Sites Drive",
        desc: "The oracle temple, the Mountain of the Dead, the ruins of Aghurmi village, and the Shali fortress. Four sites, a full morning, and a guide who explains not just what they are but why they matter in sequence.",
        includes_label: "Includes",
        includes: "Oracle Temple · Mountain of the Dead · Aghurmi · Shali fortress views",
        duration: "Full morning · Vehicle + guide · Private",
        price: "From $75",
      },
      {
        num: "04",
        title: "Sunrise Desert Drive",
        desc: "Departure before dawn, into the desert as the sky lightens. The dunes at sunrise are a different environment from sunset — cooler, quieter, and with a quality of light that photographers specifically request.",
        includes_label: "Includes",
        includes: "Pre-dawn departure · Dune position for sunrise · Breakfast in the desert",
        duration: "3–4 hours · 4×4 · Private",
        price: "From $95",
      },
      {
        num: "05",
        title: "In-Oasis Transfers",
        desc: "Simple point-to-point transfers within Siwa — lodge to experiences, accommodation to restaurants, property to property. Reliable, private, and always on time.",
        includes_label: "Covers",
        includes: "Lodge pickups · Experience drop-offs · Town centre · Airport",
        duration: "On demand · Private vehicle",
        price: "From $15",
      },
      {
        num: "06 · Bespoke",
        title: "Full Day — Your Route",
        desc: "A full day private vehicle with a Siwa guide. You decide the destinations, the pace, the stops. Suited to guests who want complete flexibility or who are returning to Siwa with specific places in mind.",
        includes_label: "Includes",
        includes: "Full day vehicle · Local guide · Lunch arranged · No fixed itinerary",
        duration: "Full day · Private · Bespoke",
        price: "From $145",
      },
    ],
    EMPTY_CARD,
    9,
  ),
  fleet: {
    eyebrow: "Our fleet",
    title: "The right vehicle\nfor every",
    italic: "route.",
    body: "Every vehicle in our fleet is maintained to our own standard, not a rental company's. Drivers are selected for knowledge of the route as much as driving ability — for the Cairo–Siwa road, that distinction matters.",
  },
  fleetItems: withSpare(
    [
      {
        name: "Private SUV",
        type: "Long-distance · Paved routes",
        desc: "Air-conditioned, comfortable, and appropriate for the Cairo–Siwa road. Seats up to 4 passengers with luggage.",
        specs: "Passengers: Up to 4\nAir conditioning: Yes\nBest for: Cairo · Alexandria · Marsa routes",
      },
      {
        name: "4×4 Desert Vehicle",
        type: "Off-road · Sand routes · Desert drives",
        desc: "Essential for dune driving and the Marsa Matrouh sand road. High-clearance, experienced desert drivers only.",
        specs: "Passengers: Up to 5\nTerrain: All terrain including dunes\nBest for: Sand Sea · Desert drives · Marsa route",
      },
      {
        name: "Private Minivan",
        type: "Groups · Long-distance",
        desc: "For larger groups travelling together. Same private standard — no shared vehicle arrangements at any size.",
        specs: "Passengers: Up to 8\nAir conditioning: Yes\nBest for: Groups · Family travel · Long routes",
      },
    ],
    EMPTY_VEHICLE,
    6,
  ),
  how: {
    eyebrow: "How to book",
    title: "Transportation books\n",
    italic: "by enquiry.",
    body: "All transportation — whether a route to Siwa or a desert drive within it — is arranged through our team. We confirm the vehicle, the driver, and the timing before anything is confirmed. No automated booking for this one.",
  },
  howItems: withSpare(
    [
      { title: "Submit your request", text: "Route, date, number of passengers, any specific requirements. The form below takes two minutes." },
      { title: "We confirm vehicle & driver", text: "Our team matches you to the right vehicle and a driver who knows the route. We respond within 24 hours." },
      { title: "Payment link sent", text: "Secure payment via WhatsApp or email. Pay in USD. No payment until vehicle is confirmed." },
      { title: "Full details before travel", text: "Driver name, vehicle, pickup time, contact number, and any stop recommendations — all sent in advance." },
    ],
    EMPTY_STEP,
    6,
  ),
  practical: { eyebrow: "Before you travel", title: "Good to", italic: "know." },
  practicalItems: withSpare(
    [
      { title: "Best time to depart", desc: "For Cairo–Siwa, depart before 6am. You arrive before the afternoon heat, have time to settle, and don't lose a day to travel. Evening arrivals are fine but make the journey feel longer." },
      { title: "What to bring in the vehicle", desc: "More water than you think — minimum 2 litres per person for the Cairo route. Snacks for long journeys. A jacket — the air conditioning in shared taxis is unreliable; ours is not, but the desert morning can be cold." },
      { title: "Mobile signal on route", desc: "Signal is intermittent between Cairo and Siwa, particularly the last 80km. Download your music and any reading offline before departure. Our drivers carry emergency contact equipment." },
      { title: "Currency & tolls", desc: "All transport fees are settled with us in advance. Drivers handle any road tolls. No need to carry cash specifically for transport — though Egyptian Pounds are useful for stop refreshments." },
      { title: "Luggage", desc: "Standard luggage for the vehicle type selected. For desert drives, a small daypack is sufficient — lodge storage handles the rest. If you have unusual luggage, mention it in the request." },
      { title: "Combining with accommodation", desc: "If you've booked a Soléi property, we coordinate transport timing automatically with your check-in. No need to manage the two separately." },
    ],
    EMPTY_TIP,
    9,
  ),
  enquiry: {
    eyebrow: "Book transportation",
    title: "Arrange your",
    italic: "journey.",
    body: "Tell us where you're travelling from, when, and how many people. We'll confirm vehicle availability and send a secure payment link within 24 hours.",
    note: "All transportation is confirmed manually by our team before any payment is taken. No automated booking — every vehicle and driver is personally selected for your route.",
  },
  closing: {
    title: "The journey begins\nbefore you",
    italic: "arrive.",
    body: "Eight hours through the Western Desert is not a transfer. It is the first part of the Siwa experience. We treat it that way — and so do the guests who've made it.",
    cta: "Arrange transportation",
    cta_2: "View accommodation",
    cta_2_href: "/siwa-oasis/accommodation",
    media: "",
  },
};

export const NC_TRANSPORT: TransportPageDefaults = {
  seo: {
    title: "North Coast Transportation — Soléi",
    description:
      "Private transportation to and around Egypt's North Coast. Cairo, Alexandria, and airport routes, plus within-coast transfers. All private, by enquiry.",
  },
  hero: {
    eyebrow: "Getting here & getting around",
    title: "Private",
    italic: "transportation.",
    title_2: "Two and a half hours from Cairo.",
    body: "The North Coast is Egypt's most accessible second destination. Cairo is two and a half hours by private vehicle. Alexandria is less than one. We arrange every transfer — nothing shared, nothing generic, nothing that makes the journey feel like a logistics problem.",
    principles: [
      "Private vehicles only — no shared transfers ever",
      "Drivers selected for route knowledge, not just licence",
      "Between-property transfers across Marassi, Almaza Bay, El Alamein",
      "Flexible timing — depart when your stay is ready",
    ].join("\n"),
    media: "",
  },
  routes: {
    eyebrow: "Getting to the coast",
    title: "Routes",
    italic: "into the North Coast.",
    body: "The North Coast sits between Cairo and Alexandria along the Mediterranean. It is the closest of the two Soléi destinations and by far the easiest to reach — two and a half hours from central Cairo on a clear road.",
    featured_label: "Most requested route",
    featured_cta: "Book this route",
    card_cta: "Book →",
    price_label: "From",
  },
  featured: {
    num: "Route 01 · Primary",
    from: "Cairo",
    via: "",
    to: "North Coast",
    desc: "Two and a half hours on the Desert Road or the Coastal Road — your choice, both are paved and well-maintained. The Desert Road is faster. The Coastal Road gives you the Mediterranean for the last forty minutes. We recommend the Coastal Road for arrivals — it frames the destination correctly. The Desert Road for departures — efficient and without sentiment.",
    facts: [
      "Duration: ~2.5 hours",
      "Road options: Desert Road (faster) or Coastal Road (scenic)",
      "Departure: Flexible — morning recommended to beat traffic",
      "Vehicle: Private air-conditioned SUV",
      "Drop-off: Direct to your property",
    ].join("\n"),
    price: "$80 per vehicle",
    image: "",
  },
  routeItems: withSpare(
    [
      {
        num: "Route 02",
        from: "Alexandria",
        via: "",
        to: "North Coast",
        desc: "Less than an hour along the coastal road. The natural connection for guests arriving via Borg El Arab Airport or those combining a Cairo–Alexandria trip with coastal time.",
        facts: "Duration: ~45 min – 1 hour\nRoad type: Coastal road — Mediterranean visible\nVehicle: Private SUV",
        price: "$45 per vehicle",
      },
      {
        num: "Route 03",
        from: "Cairo",
        via: "Alexandria",
        to: "Coast",
        desc: "The full coastal approach — Cairo, then Alexandria for a few hours, then the coast. A longer journey but the right one if Alexandria is on your list. We'll suggest the stops worth making.",
        facts: "Duration: ~4 hours incl. Alexandria stop\nStyle: Full-day coastal approach\nVehicle: Private SUV with flexible stops",
        price: "$120 per vehicle",
      },
      {
        num: "Route 04",
        from: "North Coast",
        via: "",
        to: "Cairo",
        desc: "The return. We recommend the Desert Road for departures — faster and more practical when you're heading to an airport or a meeting. Early morning departures leave the road clear.",
        facts: "Duration: ~2.5 hours\nRecommended: Early morning — before 8am ideal\nVehicle: Private SUV",
        price: "$80 per vehicle",
      },
    ],
    EMPTY_ROUTE,
    6,
  ),
  cards: {
    eyebrow: "Within the coast",
    title: "Moving between",
    italic: "properties & areas.",
    body: "The North Coast's three main areas — Marassi, Almaza Bay, and El Alamein — are spread over roughly 100km of coastline. Moving between them, or between your property and an experience, requires a vehicle. We arrange all of it.",
  },
  cardItems: withSpare(
    [
      {
        num: "01",
        title: "Marassi ↔ Almaza Bay",
        desc: "The most common inter-area transfer on the North Coast. About an hour's drive east along the coastal road — calm, direct, and worth doing for the coastline views alone.",
        includes_label: "Covers",
        includes: "All Marassi properties · Almaza Bay resorts · One-way or return",
        duration: "~1 hour · Private vehicle",
        price: "From $40",
      },
      {
        num: "02",
        title: "Marassi ↔ El Alamein",
        desc: "Thirty minutes west along the coast road. Used primarily for the El Alamein heritage experience — battlefield, museum, and war cemetery. Also the route to the Al Alamein Hotel and Rixos Premium.",
        includes_label: "Covers",
        includes: "Marassi · El Alamein sites · Al Alamein Hotel · Rixos Premium",
        duration: "~30 min · Private vehicle",
        price: "From $25",
      },
      {
        num: "03",
        title: "Property to Experience",
        desc: "Direct transfer from your resort to any Soléi experience — the marina for sunset sailing, the flamingo lagoon access point, a seafood lunch off the main strip. Coordinated with your experience booking.",
        includes_label: "Covers",
        includes: "Marassi Marina · Flamingo lagoon · Seafood spots · Coastline drive start",
        duration: "On-demand · Private vehicle",
        price: "From $20",
      },
      {
        num: "04",
        title: "Airport Transfers",
        desc: "From Cairo International (2.5 hrs), Borg El Arab Airport in Alexandria (45 min), or Marsa Matrouh Airport — direct to your North Coast property. Flight tracking included so we adjust for delays.",
        includes_label: "Airports",
        includes: "Cairo International · Borg El Arab · Marsa Matrouh",
        duration: "Flexible · Flight tracked",
        price: "From $45",
      },
      {
        num: "05",
        title: "Cairo Day Trip",
        desc: "Depart Cairo early morning, full day on the North Coast, return in the evening. The proximity makes it the only Egyptian coastal destination genuinely feasible as a day trip from the capital.",
        includes_label: "Includes",
        includes: "Round-trip vehicle · Driver for the full day · Flexible itinerary",
        duration: "Full day · Private vehicle",
        price: "From $140",
      },
      {
        num: "06",
        title: "On-Demand Transfers",
        desc: "Simple point-to-point — within a resort area, between restaurants, to the beach access point your property doesn't have, or wherever you need to be at whatever time suits you.",
        includes_label: "Covers",
        includes: "Any point on the North Coast · Any time · No minimum",
        duration: "On-demand · Private vehicle",
        price: "From $15",
      },
    ],
    EMPTY_CARD,
    9,
  ),
  fleet: {
    eyebrow: "Our fleet",
    title: "The right vehicle\nfor every",
    italic: "route.",
    body: "The North Coast is all paved roads — no 4×4 required. What matters here is comfort for the drive, reliability on long routes, and air conditioning that actually works in August. Every vehicle in our fleet meets all three.",
  },
  fleetItems: withSpare(
    [
      {
        name: "Private SUV",
        type: "Standard · All North Coast routes",
        desc: "Air-conditioned, comfortable, and right-sized for the Cairo–North Coast road. Handles all paved routes including the coastal road.",
        specs: "Passengers: Up to 4\nAir conditioning: Full — front and rear\nBest for: Cairo · Alexandria · All routes",
      },
      {
        name: "Premium Sedan",
        type: "Upgrade · Airport & city routes",
        desc: "For guests who prefer a quieter, more composed drive. Particularly suited to airport arrivals and the Cairo run when the journey matters as much as the destination.",
        specs: "Passengers: Up to 3\nStyle: Premium — quieter ride\nBest for: Airport · Cairo · Business travel",
      },
      {
        name: "Private Minivan",
        type: "Groups · Family travel",
        desc: "For larger groups travelling together. Same private standard — never combined with other bookings regardless of group size. Ample luggage space for family travel.",
        specs: "Passengers: Up to 8\nLuggage: Large capacity — suitable for families\nBest for: Groups · Families · Long routes",
      },
    ],
    EMPTY_VEHICLE,
    6,
  ),
  compare: {
    here: {
      eyebrow: "You are here",
      title: "North",
      italic: "Coast",
      body: "Close, fast, easy. The coast anyone can reach from Cairo without planning a full expedition. Two and a half hours and you're there.",
      facts: [
        "From Cairo: ~2.5 hours",
        "From Alexandria: ~45 minutes",
        "Road type: All paved — no off-road",
        "Booking method: Enquiry — payment link within 24 hrs",
        "Best season: April–June · September–November",
      ].join("\n"),
    },
    other: {
      eyebrow: "Also explore",
      title: "Siwa",
      italic: "Oasis",
      body: "Further. Slower. A different kind of journey entirely — eight hours through the Western Desert. The distance is part of the experience.",
      facts: [
        "From Cairo: ~8 hours",
        "From Marsa Matrouh: ~3 hours",
        "Road type: Mixed — paved & sand roads",
        "Booking method: Enquiry — same process",
        "Best season: October–April",
      ].join("\n"),
      cta: "View Siwa transportation →",
      href: "/siwa-oasis/transportation",
    },
  },
  how: {
    eyebrow: "How to book",
    title: "All transportation\n",
    italic: "arranged by our team.",
    body: "Every vehicle is confirmed manually before any payment is taken. Routes, drivers, and timing are all personally selected. No automated booking — for the same reason we don't automate North Coast accommodation: we want to make sure what you get is exactly right before you pay for it.",
  },
  howItems: withSpare(
    [
      { title: "Submit your request", text: "Route, date, passengers, pickup location. The form below takes two minutes." },
      { title: "We confirm vehicle & driver", text: "Our team selects the right vehicle and a driver who knows the route. Response within 24 hours." },
      { title: "Payment link sent", text: "Secure payment via WhatsApp or email. No charge until vehicle is confirmed." },
      { title: "Full details before travel", text: "Driver name, vehicle registration, contact number, exact pickup time. Everything you need — sent in advance." },
    ],
    EMPTY_STEP,
    6,
  ),
  practical: { eyebrow: "Before you travel", title: "Good to", italic: "know." },
  practicalItems: withSpare(
    [
      { title: "Best time to depart from Cairo", desc: "Before 9am or after 7pm avoids the Cairo ring road at its worst. For a morning arrival, depart no later than 7am. Summer weekends are particularly busy — Friday afternoon departures from the city should be avoided." },
      { title: "Which road from Cairo", desc: "The Desert Road is faster and more consistent. The Coastal Road is scenic — 40 minutes longer but the Mediterranean is visible for much of the final stretch. We recommend the Coastal Road for arrivals, Desert Road for departures." },
      { title: "Mobile signal on route", desc: "Good signal throughout the Cairo–North Coast routes. Unlike the Siwa road, you won't lose connectivity. Drivers carry Egyptian SIMs — they can reach you if anything changes." },
      { title: "Payment & tolls", desc: "All transport fees settled in advance with Soléi. Drivers handle any road tolls as part of the agreed price — no surprise additions. Payment in USD via secure link." },
      { title: "Coordinating with accommodation", desc: "If you've booked a North Coast property through us, we coordinate transport timing directly with your check-in. No need to manage both separately — we brief the driver on your property's access and parking." },
      { title: "Combining with Siwa", desc: "Many guests do North Coast first, return to Cairo, then travel to Siwa. We manage the full routing across both destinations — one conversation, both legs arranged." },
    ],
    EMPTY_TIP,
    9,
  ),
  enquiry: {
    eyebrow: "Book transportation",
    title: "Arrange your",
    italic: "journey.",
    body: "Tell us your route, when you're travelling, and how many passengers. We'll confirm vehicle availability and send a secure payment link within 24 hours.",
    note: "All North Coast transportation is confirmed manually. Every vehicle and driver is personally selected for your route. No automated booking — no payment until confirmed.",
  },
  closing: {
    title: "Close enough to go.\n",
    italic: "Far enough to matter.",
    body: "Two and a half hours from Cairo — easy enough for a long weekend, close enough to return often. We'll handle the vehicle so the journey feels like the start of the experience, not the logistics before it.",
    cta: "Arrange transportation",
    cta_2: "View accommodation",
    cta_2_href: "/north-coast/accommodation",
    media: "",
  },
};

// ── Resolving admin edits over the defaults ─────────────────────

/** "Label: value" per line → pairs. A line without a colon is a label
 *  with no value. Blank lines are skipped. */
export function parsePairs(text: string): Pair[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const i = l.indexOf(":");
      return i === -1
        ? { key: l, val: "" }
        : { key: l.slice(0, i).trim(), val: l.slice(i + 1).trim() };
    });
}

/** One item per line, blanks skipped. */
export function parseLines(text: string): string[] {
  return text.split("\n").map((l) => l.trim()).filter(Boolean);
}

const isHidden = (v: string) => !v.trim() || v.trim() === "-";

function overlay<T extends object>(c: SiteContentMap, prefix: string, defaults: T): T {
  const out = {} as T;
  for (const k of Object.keys(defaults) as (keyof T & string)[]) {
    out[k] = pickContent(c, `${prefix}.${k}`, defaults[k]);
  }
  return out;
}

function overlayList<T extends object>(
  c: SiteContentMap,
  prefix: string,
  defaults: T[],
  visibleBy: keyof T & string,
): T[] {
  return defaults
    .map((d, i) => overlay(c, `${prefix}.items.${i}`, d))
    .filter((item) => !isHidden(String(item[visibleBy] ?? "")));
}

export type ResolvedTransportPage = ReturnType<typeof resolveTransportPage>;

/** Merge site_content edits for `prefix` over the page defaults. */
export function resolveTransportPage(c: SiteContentMap, prefix: string, d: TransportPageDefaults) {
  return {
    seo: overlay(c, `${prefix}.seo`, d.seo),
    hero: overlay(c, `${prefix}.hero`, d.hero),
    routes: overlay(c, `${prefix}.routes`, d.routes),
    featured: overlay(c, `${prefix}.featured`, d.featured),
    routeItems: overlayList(c, `${prefix}.routes`, d.routeItems, "from"),
    cards: overlay(c, `${prefix}.cards`, d.cards),
    cardItems: overlayList(c, `${prefix}.cards`, d.cardItems, "title"),
    fleet: overlay(c, `${prefix}.fleet`, d.fleet),
    fleetItems: overlayList(c, `${prefix}.fleet`, d.fleetItems, "name"),
    compare: d.compare && {
      here: overlay(c, `${prefix}.compare.here`, d.compare.here),
      other: overlay(c, `${prefix}.compare.other`, d.compare.other),
    },
    how: overlay(c, `${prefix}.how`, d.how),
    howItems: overlayList(c, `${prefix}.how`, d.howItems, "title"),
    practical: overlay(c, `${prefix}.practical`, d.practical),
    practicalItems: overlayList(c, `${prefix}.practical`, d.practicalItems, "title"),
    enquiry: overlay(c, `${prefix}.enquiry`, d.enquiry),
    closing: overlay(c, `${prefix}.closing`, d.closing),
  };
}

// ── Admin field definitions ─────────────────────────────────────

export interface TransportAdminField {
  key: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
  /** Renders the media library picker + upload button. */
  type?: "media" | "media-image";
}
export interface TransportAdminSection {
  id: string;
  label: string;
  description?: string;
  fields: TransportAdminField[];
}

type FieldSpec = [field: string, label: string, multiline?: boolean, type?: TransportAdminField["type"]];

function fieldsFor(prefix: string, defaultsObj: object, specs: FieldSpec[]): TransportAdminField[] {
  const defaults = defaultsObj as Record<string, string>;
  return specs.map(([field, label, multiline, type]) => ({
    key: `${prefix}.${field}`,
    label,
    placeholder: defaults[field] || undefined,
    multiline: multiline || (defaults[field] ?? "").includes("\n") || undefined,
    type,
  }));
}

function itemFields(
  prefix: string,
  defaults: object[],
  noun: string,
  specs: FieldSpec[],
): TransportAdminField[] {
  return defaults.flatMap((d, i) =>
    fieldsFor(`${prefix}.items.${i}`, d, specs).map((f, j) => ({
      ...f,
      label: `${noun} ${i + 1} — ${f.label}`,
      placeholder: f.placeholder ?? (j === 0 ? "(empty — fill in to add)" : undefined),
    })),
  );
}

const HEADING_SPECS: FieldSpec[] = [
  ["eyebrow", "Eyebrow"],
  ["title", "Title (before the italic words)"],
  ["italic", "Italic accent"],
];

const PAIRS_HELP = 'One per line, written "Label: value".';
const HIDE_HELP = 'To hide a card, enter - as its first field. Empty cards at the end are spare — fill one in to add a card.';

/** Pages-editor sections for one transportation page. */
export function transportAdminSections(
  prefix: string,
  d: TransportPageDefaults,
  names: { cards: string; card: string },
): TransportAdminSection[] {
  const sections: TransportAdminSection[] = [
    {
      id: "seo",
      label: "Search engine title & description",
      fields: fieldsFor(`${prefix}.seo`, d.seo, [
        ["title", "Browser / Google title"],
        ["description", "Google description", true],
      ]),
    },
    {
      id: "hero",
      label: "Hero",
      description: "Top of the page. The heading reads: [title] [italic accent], then the second line below.",
      fields: fieldsFor(`${prefix}.hero`, d.hero, [
        ...HEADING_SPECS,
        ["title_2", "Second line"],
        ["body", "Intro paragraph", true],
        ["principles", "Bullet boxes (one per line)", true],
        ["media", "Background image or video (optional)", false, "media"],
      ]),
    },
    {
      id: "routes",
      label: "Routes — heading & featured route",
      description: `Section heading, then the large featured route card. Facts are ${PAIRS_HELP}`,
      fields: [
        ...fieldsFor(`${prefix}.routes`, d.routes, [
          ...HEADING_SPECS,
          ["body", "Intro paragraph (optional)", true],
          ["featured_label", "Featured card — small label on the image"],
          ["featured_cta", "Featured card — button"],
          ["card_cta", "Other route cards — button"],
          ["price_label", "Price label"],
        ]),
        ...fieldsFor(`${prefix}.featured`, d.featured, [
          ["num", "Featured — route number"],
          ["from", "Featured — from"],
          ["via", "Featured — via (optional)"],
          ["to", "Featured — to"],
          ["desc", "Featured — description", true],
          ["facts", "Featured — facts", true],
          ["price", "Featured — price"],
          ["image", "Featured — photo (fills the large image panel)", false, "media-image"],
        ]),
      ],
    },
    {
      id: "route-cards",
      label: "Routes — other route cards",
      description: `Smaller cards under the featured route. Facts are ${PAIRS_HELP} ${HIDE_HELP}`,
      fields: itemFields(`${prefix}.routes`, d.routeItems, "Route card", [
        ["from", "from"],
        ["num", "route number"],
        ["via", "via (optional)"],
        ["to", "to"],
        ["desc", "description", true],
        ["facts", "facts", true],
        ["price", "price"],
        ["image", "photo (optional)", false, "media-image"],
      ]),
    },
    {
      id: "cards",
      label: names.cards,
      description: HIDE_HELP,
      fields: [
        ...fieldsFor(`${prefix}.cards`, d.cards, [...HEADING_SPECS, ["body", "Intro paragraph", true]]),
        ...itemFields(`${prefix}.cards`, d.cardItems, names.card, [
          ["title", "title"],
          ["num", "number"],
          ["desc", "description", true],
          ["includes_label", "list label (Includes / Covers)"],
          ["includes", "list"],
          ["duration", "duration line"],
          ["price", "price"],
          ["image", "photo (optional)", false, "media-image"],
        ]),
      ],
    },
    {
      id: "fleet",
      label: "Our fleet (vehicles)",
      description: `Specs are ${PAIRS_HELP} ${HIDE_HELP}`,
      fields: [
        ...fieldsFor(`${prefix}.fleet`, d.fleet, [...HEADING_SPECS, ["body", "Paragraph", true]]),
        ...itemFields(`${prefix}.fleet`, d.fleetItems, "Vehicle", [
          ["name", "name"],
          ["type", "type line"],
          ["desc", "description", true],
          ["specs", "specs", true],
          ["image", "photo (replaces the coloured panel)", false, "media-image"],
        ]),
      ],
    },
  ];

  if (d.compare) {
    sections.push({
      id: "compare",
      label: "North Coast vs Siwa panel",
      description: `Two side-by-side boxes. Facts are ${PAIRS_HELP}`,
      fields: [
        ...fieldsFor(`${prefix}.compare.here`, d.compare.here, [
          ["eyebrow", "Left box — eyebrow"],
          ["title", "Left box — title"],
          ["italic", "Left box — italic accent"],
          ["body", "Left box — text", true],
          ["facts", "Left box — facts", true],
        ]),
        ...fieldsFor(`${prefix}.compare.other`, d.compare.other, [
          ["eyebrow", "Right box — eyebrow"],
          ["title", "Right box — title"],
          ["italic", "Right box — italic accent"],
          ["body", "Right box — text", true],
          ["facts", "Right box — facts", true],
          ["cta", "Right box — link text"],
          ["href", "Right box — link URL"],
        ]),
      ],
    });
  }

  sections.push(
    {
      id: "how",
      label: "How to book",
      description: `Navy section with the numbered steps (numbers are added automatically). ${HIDE_HELP}`,
      fields: [
        ...fieldsFor(`${prefix}.how`, d.how, [...HEADING_SPECS, ["body", "Paragraph", true]]),
        ...itemFields(`${prefix}.how`, d.howItems, "Step", [
          ["title", "title"],
          ["text", "text", true],
        ]),
      ],
    },
    {
      id: "practical",
      label: "Good to know (practical tips)",
      description: `Roman numerals are added automatically. ${HIDE_HELP}`,
      fields: [
        ...fieldsFor(`${prefix}.practical`, d.practical, HEADING_SPECS),
        ...itemFields(`${prefix}.practical`, d.practicalItems, "Tip", [
          ["title", "title"],
          ["desc", "text", true],
        ]),
      ],
    },
    {
      id: "enquiry",
      label: "Booking form — text beside the form",
      fields: fieldsFor(`${prefix}.enquiry`, d.enquiry, [
        ...HEADING_SPECS,
        ["body", "Paragraph", true],
        ["note", "Boxed note", true],
      ]),
    },
    {
      id: "closing",
      label: "Closing",
      description: "Navy finale at the bottom of the page.",
      fields: fieldsFor(`${prefix}.closing`, d.closing, [
        ["title", "Title (before the italic words)"],
        ["italic", "Italic accent"],
        ["body", "Paragraph", true],
        ["cta", "Gold button (scrolls to the form)"],
        ["cta_2", "Second button — label"],
        ["cta_2_href", "Second button — URL"],
        ["media", "Background image or video (optional)", false, "media"],
      ]),
    },
  );

  return sections;
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
export const romanNumeral = (i: number) => ROMAN[i] ?? String(i + 1);
