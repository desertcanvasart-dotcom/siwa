/**
 * Single source of truth for facts repeated across static pages
 * (FAQs, travel tips, transport, index pages, Terms).
 *
 * Product data (prices, room specs, itineraries, reviews) lives in the CMS
 * and must be read from the API — never hard-code a CMS product's price or
 * spec in page copy. Use the counts/labels below instead of writing numbers
 * into prose, so pages cannot drift apart again.
 */

export const SIWA = {
  /** Soléi-owned properties with live pages. */
  ownedProperties: [
    { slug: "solei-old-town", name: "Soléi Old Town" },
    { slug: "solei-royal", name: "Soléi Royal" },
    { slug: "solei-desert-retreat", name: "Soléi Desert Retreat" },
    { slug: "solei-salt-caves", name: "Soléi Salt Caves" },
  ],
  /**
   * Partner lodges we can arrange through the concierge on request.
   * They have NO pages — never link to them or call them instantly bookable.
   */
  partnerLodgesOnRequest: ["Adrère Amellal", "Taziry Ecolodge"],
  /** Bookable single-day / overnight experiences (not journeys). */
  experienceSlugs: [
    "siwa-essential-experience",
    "solei-signature-siwa-journey",
    "wellness-and-sand-ritual",
    "desert-night-experience",
    "desert-sunset-experience",
    "desert-stargazing",
    "salt-and-spring-escape",
  ],
  driveFromCairo: "about 8 hours",
  /** One answer to "when should I leave Cairo?" */
  cairoDepartureAdvice: "leave Cairo between 5 and 6 am",
  season: "October to April",
  summerHeat: "regularly above 40°C",
  /** Salt-lake float: available through the day; sunset is the favourite slot. */
  saltLakeFloatTiming:
    "Floats run through the day; late afternoon into sunset is our favourite time, when the water is warm and the light is low.",
  sandBath: {
    duration: "20–30 minutes",
    warning:
      "Not suitable for guests with heart conditions or uncontrolled high blood pressure. Check with your doctor if unsure.",
    season: "Traditionally June to September, when the sand is hottest",
  },
  bookingEngine: "Tab.travel",
} as const;

export const NORTH_COAST = {
  /** All North Coast properties with live pages. */
  properties: [
    { slug: "address-marassi-golf-resort", name: "Address Marassi Golf Resort", area: "Marassi" },
    { slug: "address-beach-resort-marassi", name: "Address Beach Resort Marassi", area: "Marassi" },
    { slug: "vida-marina-resort-marassi", name: "Vida Marina Resort Marassi", area: "Marassi" },
    { slug: "al-alamein-hotel", name: "Al Alamein Hotel", area: "Marassi" },
    { slug: "rixos-premium-alamein", name: "Rixos Premium Alamein", area: "El Alamein" },
    { slug: "jaz-almaza-beach-resort", name: "Jaz Almaza Beach Resort", area: "Almaza Bay" },
  ],
  /** The live experience catalogue (CMS). Anything else is not sold. */
  experienceSlugs: [
    "private-yacht-sunset-ritual", // "Private Yacht Experience"
    "beach-club-experience",
    "marassi-water-world-experience",
    "signature-dinner-experience",
    "nightlife-experience",
    "coastal-wellness-ritual", // "Luxury Spa Experience"
  ],
  /** Geography, west → east along the coast. */
  geography: {
    order: "Almaza Bay (west, near Marsa Matrouh) → Marassi / Sidi Abdel Rahman → El Alamein (east)",
    almazaFromMarassi: "about 130 km west of Marassi, roughly 1.5–2 hours by car",
    elAlameinFromMarassi: "about 20–30 minutes east of Marassi",
    position: "west of Alexandria, along the Mediterranean",
    coastlineCovered: "roughly 200 km, from El Alamein west to Almaza Bay",
  },
  travelTimes: {
    fromCairo: "about 3 hours to Marassi; about 4.5 hours to Almaza Bay",
    fromAlexandria: "about 1.5–2 hours to Marassi",
    fromBorgElArab: "about 1–1.5 hours to Marassi",
  },
  airports: [
    "El Alamein International (closest to Marassi)",
    "Borg El Arab (Alexandria)",
    "Marsa Matrouh (closest to Almaza Bay)",
    "Cairo International",
  ],
  bestMonths: "April–June and September–November",
  peakSeason: "July–August (busiest and hottest)",
} as const;

export const POLICIES = {
  currency: "USD",
  /** Precedence rule used by the Terms and the FAQs. */
  cancellationPrecedence:
    "Each product's booking page states its own cancellation and payment terms. Where those differ from these general Terms, the terms on the product's booking page apply.",
  travelInsurance:
    "Travel insurance with medical cover is required for every booking (Terms §13) and is not included in any price.",
} as const;

export const nc = (slug: string) => `/north-coast/accommodation/${slug}`;
export const siwa = (slug: string) => `/siwa-oasis/accommodation/${slug}`;
