/**
 * Siwa experience detail data.
 *
 * Source of truth for the unified /siwa-oasis/experiences/:slug template.
 * One record per experience. Structure matches the section blocks in the
 * experience-detail page exactly.
 */

export type Destination = "siwa-oasis" | "north-coast";

export type ExperienceSlug =
  // Siwa
  | "salt-lake-float-therapy"
  | "sunset-sand-surfing"
  | "cleopatra-spring-soak"
  | "desert-breathwork-meditation"
  | "sleeping-under-stars"
  | "sunset-horseback-ride"
  | "desert-stargazing-experience"
  | "oracle-temple-pilgrimage"
  | "traditional-sand-bath-healing"
  | "premium-siwa-full-day"
  // North Coast
  | "sunset-sailing"
  | "flamingo-watching-experience"
  | "open-water-swim"
  | "coastline-drive"
  | "el-alamein"
  | "seafood-lunch";

export interface ExperienceFact {
  label: string;
  value: string;
}

export interface ScheduleEntry {
  time: string;
  title: string;
  body: string;
}

export interface ExperienceReview {
  name: string;
  origin: string;
  text: string;
}

export interface ExperienceDetail {
  slug: ExperienceSlug;
  /**
   * Destination the experience belongs to. Drives the detail page's
   * colour scheme, booking-vs-enquiry behaviour, and related-links pool.
   */
  destination: Destination;
  /** Name as displayed in nav breadcrumbs / sticky bar */
  name: string;
  /** Left part of the hero title (non-italic) */
  titleMain: string;
  /** Italicised gold fragment of the hero title */
  titleItalic: string;
  /** Block heading on the description section (left of "italic.") */
  blockHeadline: string;
  blockHeadlineItalic: string;
  /** Gold pill tag in the hero (optional — e.g. Signature experience) */
  heroTagGold?: string;
  /** Neutral outlined hero tags — category · timing · price etc. */
  heroTags: string[];
  /** Dots-separated metadata row under the hero title */
  heroMeta: string[];
  gallerySize: number;
  /** Tailwind gradient class (navy / sand / stars etc.) */
  gradient: string;
  /** Copy paragraphs for the "The experience" block */
  description: string[];
  facts: ExperienceFact[];
  includes: string[];
  /** Dot-separated list of items NOT included */
  notIncluded: string;
  /** Optional copy above the schedule timeline */
  scheduleIntro?: string;
  schedule: ScheduleEntry[];
  /** "Good to know" notes — each rendered as a line item */
  notes: string[];
  reviews: ExperienceReview[];
  /** Price per person in EUR */
  price: number;
  /** Optional flat rate for private booking; omitted => no private toggle */
  privatePrice?: number;
  /** Max group size for the public (non-private) booking */
  maxGuests: number;
  /** Price-label row under the headline total (e.g. "/ person") */
  priceSuffix: string;
  /** Short availability line shown above the booking form */
  availabilityNotice: string;
  /** Time-slot options in the booking form */
  timeSlots: string[];
  /** Three slugs shown in "Other Siwa experiences" */
  related: ExperienceSlug[];
}

/* ──────────────────────────────────────────────────────────────
 *  Shared reusable fragments
 * ────────────────────────────────────────────────────────────── */

const DEFAULT_NOT_INCLUDED =
  "Swimwear (bring your own) · Hotel pickup if outside Siwa town · Gratuity (discretionary)";

const DEFAULT_AVAILABILITY =
  "Available this season. Books quickly October–March.";

/* ──────────────────────────────────────────────────────────────
 *  Experiences
 * ────────────────────────────────────────────────────────────── */

export const EXPERIENCE_DETAILS: ExperienceDetail[] = [
  {
    slug: "salt-lake-float-therapy",
    destination: "siwa-oasis",
    name: "Salt Lake Float Therapy",
    titleMain: "Salt Lake",
    titleItalic: "Float Therapy.",
    blockHeadline: "When the water turns the colour of",
    blockHeadlineItalic: "the sky.",
    heroTagGold: "Signature experience",
    heroTags: ["Water · Wellness", "Sunset · 2–3 hours", "From €45 per person"],
    heroMeta: ["Siwa salt lakes", "Small group — max 6", "All abilities", "Year-round"],
    gallerySize: 8,
    gradient:
      "bg-[linear-gradient(155deg,#1a3a52_0%,#0F2436_50%,#2a5a7a_100%)]",
    description: [
      "Float effortlessly in Siwa's hyper-saline lakes as the sun descends and the world goes quiet around you. The water is so dense — several times saltier than the ocean — that you cannot sink. You lie back, arms wide, and the lake holds you completely.",
      "The light at this hour is extraordinary. As the sun drops toward the dunes, it turns amber and then gold, and the water — perfectly still, perfectly reflective — becomes a mirror for everything above it. You cannot tell where the lake ends and the sky begins. Most guests go quiet at this point without deciding to.",
      "This is the experience most guests name first when they describe their time in Siwa. Not because it is the most dramatic, but because it is the most true to what the oasis actually is — a place that earns its stillness slowly, and rewards you for staying long enough to feel it.",
      "We run this experience at sunset, always. The timing is not negotiable because the light is the experience. Groups are capped at six to keep the lake surface undisturbed.",
    ],
    facts: [
      { label: "Duration", value: "2–3 hours" },
      { label: "Time of day", value: "Sunset — non-negotiable" },
      { label: "Group size", value: "2–6 guests max" },
      { label: "Difficulty", value: "None — all abilities" },
      { label: "Minimum age", value: "8 years" },
      { label: "Meeting point", value: "Siwa lake shore — details sent on booking" },
      { label: "Price", value: "€45 per person" },
      { label: "Private option", value: "€220 for up to 6 guests" },
      { label: "Season", value: "Year-round" },
    ],
    includes: [
      "Guide for the full duration",
      "Towels and fresh water",
      "Traditional Siwan tea after",
      "Safe transport to the lake shore",
      "Changing area access",
      "Photography — we'll take yours",
    ],
    notIncluded: DEFAULT_NOT_INCLUDED,
    scheduleIntro:
      "We say rough because the best moments are unscheduled. This is an approximate arc — not a timetable.",
    schedule: [
      {
        time: "90 min before sunset",
        title: "Meet at the lake shore",
        body: "Your guide greets you. Brief orientation — what the lake is, how it works, what to expect. No safety lecture. Just context.",
      },
      {
        time: "75 min before sunset",
        title: "First float",
        body: "Into the water. The first few minutes are always surprising — the buoyancy is unlike anything else. Then it becomes obvious and natural.",
      },
      {
        time: "At sunset",
        title: "The light changes",
        body: "This is what the whole experience is built around. Thirty minutes where the lake becomes something else entirely.",
      },
      {
        time: "After sunset",
        title: "Siwan tea on the shore",
        body: "Out of the water, wrapped in towels, tea poured. No rush to leave. The guide will stay as long as you want to sit there.",
      },
    ],
    notes: [
      "The salt will sting any open cuts, shaving nicks, or skin irritation. Avoid shaving 24 hours before the experience.",
      "Do not apply sunscreen or body lotion before entering the lake — it affects the water and your float. We provide a rinse before entry.",
      "Contact lenses must be removed before floating. The salt concentration will cause significant discomfort if water enters the eyes.",
      "The lake is in a protected natural area. Photography is permitted for personal use. Commercial photography requires prior notice.",
      "Cancellations within 48 hours of the experience are charged in full. Earlier cancellations receive a full refund.",
      "In the rare event of extreme weather, we will reschedule at no charge. Siwa's weather is predictable — this is uncommon.",
    ],
    reviews: [
      {
        name: "Laila & Thomas M.",
        origin: "Germany · Stayed November 2024",
        text: "We almost didn't book it because 'float therapy' sounded like a spa thing. It isn't. It's the most beautiful hour I've had in years. The silence, the light, the feeling of weightlessness — I keep trying to explain it to people at home and I can't. You just have to go.",
      },
      {
        name: "Sara N.",
        origin: "United Kingdom · Solo traveller · January 2025",
        text: "I was travelling alone and slightly anxious about it. The guide made it feel completely easy — never hovering, never performing. Just present. The lake at sunset was genuinely one of those moments where you think: this is why I travel.",
      },
      {
        name: "James & Priya K.",
        origin: "USA · Stayed February 2025",
        text: "We did this on our last evening in Siwa. Perfect timing. It felt like a proper goodbye to the oasis. The tea afterwards was warm, nobody rushed us, and we drove back to the lodge in complete silence — which felt exactly right.",
      },
    ],
    price: 45,
    privatePrice: 220,
    maxGuests: 6,
    priceSuffix: "/ person",
    availabilityNotice: DEFAULT_AVAILABILITY,
    timeSlots: ["Sunset (recommended)"],
    related: ["sunset-sand-surfing", "desert-stargazing-experience", "oracle-temple-pilgrimage"],
  },

  {
    slug: "sunset-sand-surfing",
    destination: "siwa-oasis",
    name: "Sunset Sand Surfing",
    titleMain: "Sunset Sand",
    titleItalic: "Surfing.",
    blockHeadline: "Wooden boards, golden dunes, and the",
    blockHeadlineItalic: "Great Sand Sea.",
    heroTags: ["Desert", "Sunset · 2 hours", "From €40 per person"],
    heroMeta: ["Great Sand Sea", "Small group — max 8", "All levels", "Year-round"],
    gallerySize: 6,
    gradient:
      "bg-[linear-gradient(155deg,#0F2436_0%,#3a2a14_60%,#1a1a0a_100%)]",
    description: [
      "Wooden boards, golden dunes, and the Great Sand Sea at the hour it looks most alive. No experience required — the descent handles itself. The ascent is worth it every time.",
      "Your guide selects a dune based on wind direction and the quality of light that evening. The best runs are the ones that end with you lying on your back at the bottom, laughing, watching the sky turn amber.",
      "This isn't extreme. It isn't an adrenaline sport. It's closer to a slow-motion meditation with a bit of speed at the end — and the shared laughter afterwards is what most guests remember.",
    ],
    facts: [
      { label: "Duration", value: "2 hours" },
      { label: "Time of day", value: "Sunset" },
      { label: "Group size", value: "2–8 guests max" },
      { label: "Difficulty", value: "Beginner-friendly" },
      { label: "Minimum age", value: "10 years" },
      { label: "Meeting point", value: "Lodge pickup · Siwa town" },
      { label: "Price", value: "€40 per person" },
      { label: "Private option", value: "€180 for up to 6 guests" },
      { label: "Season", value: "Year-round" },
    ],
    includes: [
      "Wooden sand boards",
      "Experienced 4×4 transport to the dunes",
      "Local guide for the session",
      "Water and traditional Siwan tea",
      "Photography on request",
    ],
    notIncluded: "Closed shoes (bring your own) · Hotel pickup if outside Siwa town · Gratuity (discretionary)",
    schedule: [
      {
        time: "90 min before sunset",
        title: "4×4 into the dunes",
        body: "Pickup from your accommodation. The drive into the Great Sand Sea is part of the experience — the landscape shifts halfway through.",
      },
      {
        time: "60 min before sunset",
        title: "First descent",
        body: "Board orientation from your guide, then a gentle practice run. The technique is simple; the fun is immediate.",
      },
      {
        time: "At sunset",
        title: "Golden runs",
        body: "The light on the dunes at this hour is what brings people back. Multiple descents, photography, and space to just sit with it.",
      },
      {
        time: "After sunset",
        title: "Tea in the desert",
        body: "Traditional tea prepared at the top of a dune before the return drive. No rush.",
      },
    ],
    notes: [
      "Wear clothes that can get sandy. Loose-fitting, long-sleeved cotton is ideal.",
      "Closed shoes are required — the sand gets hot and boards are rough-edged.",
      "Hydration matters. Drink water before and after. We provide water throughout.",
      "Motion-sensitive guests should mention this in advance — we adjust pace accordingly.",
      "Cancellations within 48 hours of the experience are charged in full.",
    ],
    reviews: [
      {
        name: "Marco V.",
        origin: "Italy · Stayed December 2024",
        text: "I was expecting a bit of sand and a tourist photo. What I got was an hour of genuine laughter on a dune with two new friends and a guide who felt like a local cousin. The sunset was a bonus.",
      },
      {
        name: "Amira H.",
        origin: "Egypt · Stayed March 2025",
        text: "We booked it for the kids and all of us ended up doing it. The guide was patient, the dunes were perfect, and the sunset at the top was quietly one of the best moments of the trip.",
      },
    ],
    price: 40,
    privatePrice: 180,
    maxGuests: 8,
    priceSuffix: "/ person",
    availabilityNotice: DEFAULT_AVAILABILITY,
    timeSlots: ["Sunset"],
    related: ["desert-stargazing-experience", "sleeping-under-stars", "sunset-horseback-ride"],
  },

  {
    slug: "cleopatra-spring-soak",
    destination: "siwa-oasis",
    name: "Cleopatra Spring Soak",
    titleMain: "Cleopatra",
    titleItalic: "Spring Soak.",
    blockHeadline: "Two thousand years of",
    blockHeadlineItalic: "clear water.",
    heroTags: ["Water · Heritage", "Morning · 1–2 hours", "From €35 per person"],
    heroMeta: ["Aghurmi village", "All ages", "Year-round"],
    gallerySize: 5,
    gradient:
      "bg-[linear-gradient(155deg,#1a3050_0%,#1a3a52_60%,#0F2436_100%)]",
    description: [
      "Swim in the ancient spring said to have been bathed in by Cleopatra herself. Cool, clear water, a stone pool carved into the rock, and the particular calm of a place that has been visited for two thousand years.",
      "The spring is still in daily local use. You are visiting a working piece of Siwan life, not a cordoned-off monument. A short walk from the Aghurmi ruins means you can pair this with the oracle temple if you want a longer morning.",
      "The water is mineral-rich, the temperature is steady year-round, and the feeling after fifteen minutes in it is unlike any pool you've swum in before.",
    ],
    facts: [
      { label: "Duration", value: "1–2 hours" },
      { label: "Time of day", value: "Morning" },
      { label: "Group size", value: "2–6 guests" },
      { label: "Difficulty", value: "None — all ages" },
      { label: "Minimum age", value: "All ages welcome" },
      { label: "Meeting point", value: "Aghurmi · details sent on booking" },
      { label: "Price", value: "€35 per person" },
      { label: "Private option", value: "€150 for up to 6 guests" },
      { label: "Season", value: "Year-round" },
    ],
    includes: [
      "Local guide",
      "Spring access fee",
      "Towels and fresh water",
      "Siwan tea after",
      "Option to extend to Aghurmi ruins",
    ],
    notIncluded: "Swimwear (bring your own) · Hotel pickup if outside Siwa town · Gratuity (discretionary)",
    schedule: [
      {
        time: "Morning start",
        title: "Arrive at the spring",
        body: "Meet your guide at Aghurmi. A brief history of the spring — Cleopatra, the oracle, the role of water in Siwa.",
      },
      {
        time: "First 30 min",
        title: "Into the water",
        body: "Swim freely in the stone-walled pool. The water is cool even in summer and the space is yours — shared only with the occasional local.",
      },
      {
        time: "Mid-visit",
        title: "Optional Aghurmi extension",
        body: "If you'd like, your guide will walk you up to the oracle temple ruins a few minutes from the spring. No extra charge.",
      },
      {
        time: "Close",
        title: "Tea and departure",
        body: "Traditional Siwan tea on the edge of the spring before the return. No rush.",
      },
    ],
    notes: [
      "The spring is a working community space. Dress modestly when arriving and departing — you can change into swimwear at the site.",
      "Photography of other bathers without consent is not permitted.",
      "The steps into the pool can be slippery. Take care.",
      "Cancellations within 48 hours of the experience are charged in full.",
    ],
    reviews: [
      {
        name: "Clara M.",
        origin: "Spain · Stayed October 2024",
        text: "I came in expecting a tourist photo op. I left having had the best swim of my holiday. The water is something else, and being in a place that has been used for centuries is quietly moving.",
      },
      {
        name: "The Okoye family",
        origin: "Nigeria · Stayed January 2025",
        text: "Perfect for us with two kids. The water is safe, the setting is unusual, and our guide took the time to actually explain things rather than just shepherd us around.",
      },
    ],
    price: 35,
    privatePrice: 150,
    maxGuests: 6,
    priceSuffix: "/ person",
    availabilityNotice: "Available year-round. Morning slots fill quickly — book ahead.",
    timeSlots: ["Morning (9:00am)", "Late morning (10:30am)"],
    related: ["oracle-temple-pilgrimage", "salt-lake-float-therapy", "traditional-sand-bath-healing"],
  },

  {
    slug: "desert-breathwork-meditation",
    destination: "siwa-oasis",
    name: "Desert Breathwork & Meditation",
    titleMain: "Desert Breathwork",
    titleItalic: "& Meditation.",
    blockHeadline: "Still, vast, and",
    blockHeadlineItalic: "without distraction.",
    heroTags: ["Wellness · Desert", "Sunrise · 90 minutes", "From €50 per person"],
    heroMeta: ["Edge of the sand sea", "Max 8 guests", "All levels", "Year-round"],
    gallerySize: 4,
    gradient:
      "bg-[linear-gradient(155deg,#0F2436_0%,#0d2030_60%,#1a3a4a_100%)]",
    description: [
      "Guided breathwork and silent meditation at the edge of the sand sea as the sun rises. The desert at this hour is a different environment entirely — still, vast, and completely without distraction.",
      "Our guide is a trained breathwork practitioner who has spent years in Siwa. The session is gentle and accessible for complete beginners, but the setting does most of the work.",
      "You return from this session in a state that is difficult to describe. Most guests spend the rest of the morning in unusual quiet. That's the point.",
    ],
    facts: [
      { label: "Duration", value: "90 minutes (plus transfers)" },
      { label: "Time of day", value: "Sunrise" },
      { label: "Group size", value: "2–8 guests max" },
      { label: "Difficulty", value: "Beginner-friendly" },
      { label: "Minimum age", value: "14 years" },
      { label: "Meeting point", value: "Lodge pickup · pre-dawn" },
      { label: "Price", value: "€50 per person" },
      { label: "Private option", value: "€240 for up to 4 guests" },
      { label: "Season", value: "Year-round" },
    ],
    includes: [
      "Pre-dawn 4×4 transfer",
      "Trained breathwork practitioner",
      "Mat, blanket, and cushions",
      "Warm herbal tea after",
      "Return transfer to accommodation",
    ],
    notIncluded: "Warm layers (bring your own) · Hotel pickup if outside Siwa town · Gratuity (discretionary)",
    schedule: [
      {
        time: "Pre-dawn pickup",
        title: "Transfer to the dunes",
        body: "A quiet 4×4 into the sand sea before first light. No talking required — we encourage the transition to begin early.",
      },
      {
        time: "Before sunrise",
        title: "Arrival & settling",
        body: "Blankets and mats laid out on a flat dune. A short welcome from your guide, then silence.",
      },
      {
        time: "At sunrise",
        title: "Breathwork & meditation",
        body: "A 60-minute guided session that uses the light as a natural anchor. Very few words from the practitioner — just when needed.",
      },
      {
        time: "After",
        title: "Tea on the dune",
        body: "Warm tea, stillness, and a slow return. Many guests stay an extra half hour before leaving.",
      },
    ],
    notes: [
      "This is not a fitness class. All positions are seated or lying down.",
      "The desert is cold before sunrise even in summer. Bring or borrow a warm layer.",
      "Guests with a history of panic attacks or severe anxiety should mention this in advance.",
      "Not suitable during pregnancy unless cleared by your practitioner beforehand.",
      "Cancellations within 48 hours of the experience are charged in full.",
    ],
    reviews: [
      {
        name: "Ingrid B.",
        origin: "Norway · Stayed February 2025",
        text: "I have done breathwork in studios in Oslo for years. This is the first time the setting made the technique feel genuinely different. The silence is not the same silence you get anywhere else.",
      },
      {
        name: "Rohan K.",
        origin: "Australia · Stayed November 2024",
        text: "Sceptical going in, completely converted coming out. The desert at sunrise is an environment that does something to your nervous system you can't quite explain afterwards.",
      },
    ],
    price: 50,
    privatePrice: 240,
    maxGuests: 8,
    priceSuffix: "/ person",
    availabilityNotice: "Available year-round. Cold-weather months (Dec–Feb) require extra layers.",
    timeSlots: ["Sunrise (pre-dawn pickup)"],
    related: ["salt-lake-float-therapy", "traditional-sand-bath-healing", "desert-stargazing-experience"],
  },

  {
    slug: "sleeping-under-stars",
    destination: "siwa-oasis",
    name: "Sleeping Under the Stars",
    titleMain: "Sleeping Under",
    titleItalic: "the Stars.",
    blockHeadline: "A night without walls or",
    blockHeadlineItalic: "a ceiling.",
    heroTags: ["Desert · Overnight", "Dinner included", "From €120 per person"],
    heroMeta: ["Bedouin camp", "Group or private", "October–April recommended"],
    gallerySize: 7,
    gradient:
      "bg-[linear-gradient(155deg,#050d18_0%,#0F2436_60%,#0a1828_100%)]",
    description: [
      "A night in the open desert. Bedouin camp, no walls, no ceiling — just the Great Sand Sea above you and a sky with no light pollution. The kind of sleep you remember for years because of what surrounded it.",
      "The camp is simple. Traditional Bedouin tent structures, hand-woven rugs, mattresses on the sand. Dinner is cooked over open fire by Siwan hosts. There is no generator, no WiFi, no distraction.",
      "You sleep as deeply as you've slept anywhere — partly because of the silence, partly because of the day's exertion, partly because the desert has a way of settling a mind that nothing else does.",
    ],
    facts: [
      { label: "Duration", value: "Overnight (~16 hrs incl. transfers)" },
      { label: "Time of day", value: "Afternoon–morning" },
      { label: "Group size", value: "2–10 guests (private option)" },
      { label: "Difficulty", value: "None — comfort camping" },
      { label: "Minimum age", value: "12 years" },
      { label: "Meeting point", value: "Lodge pickup" },
      { label: "Price", value: "€120 per person" },
      { label: "Private option", value: "€900 flat — up to 6 guests" },
      { label: "Best season", value: "October–April" },
    ],
    includes: [
      "4×4 transfer to and from camp",
      "Traditional Bedouin dinner",
      "Breakfast at sunrise",
      "Mattress, pillow, blankets",
      "Local hosts throughout the stay",
      "Stargazing — guided on clear nights",
    ],
    notIncluded: "Personal sleeping bag if preferred · Alcohol (not permitted at camp) · Gratuity (discretionary)",
    scheduleIntro:
      "A rough sequence — the evening is deliberately unscheduled from after dinner onwards.",
    schedule: [
      {
        time: "Mid-afternoon",
        title: "Depart for the camp",
        body: "Private 4×4 from your accommodation. The drive takes around an hour and is part of the experience.",
      },
      {
        time: "Before sunset",
        title: "Arrival & orientation",
        body: "Welcome tea, settle in, short tour of the camp. Time to walk the dunes around the camp before dark.",
      },
      {
        time: "Sunset",
        title: "Open fire dinner",
        body: "Traditional Siwan fare cooked in the sand. Long table, candles, and the first stars appearing above.",
      },
      {
        time: "Night",
        title: "Stars and silence",
        body: "On clear nights, a guide walks you through the constellations. Otherwise — sit, look up, go quiet.",
      },
      {
        time: "Sunrise",
        title: "Breakfast and return",
        body: "Slow start, breakfast, and the drive back. Most guests are unusually quiet on the return.",
      },
    ],
    notes: [
      "The desert is cold at night — October to April especially. Bring warm layers; heavy blankets are provided.",
      "Camp is shared unless you've booked the private option. Private camps are separate sites, not partitioned areas.",
      "No electricity at the camp. Your accommodation holds your bags — bring only an overnight kit.",
      "Not suitable for very young children. 12+ is our minimum.",
      "Cancellations within 72 hours of the experience are charged in full.",
    ],
    reviews: [
      {
        name: "Henrik J.",
        origin: "Denmark · Stayed December 2024",
        text: "We almost didn't book it because we thought we'd hate camping. We slept better than in any hotel I can remember. The silence alone is worth the trip.",
      },
      {
        name: "Yasmine & Karim",
        origin: "Lebanon · Stayed November 2024",
        text: "We booked the private camp. Worth every additional euro. Dinner under a sky we had never seen like that before, then a night of genuinely deep sleep. We're planning to go back.",
      },
    ],
    price: 120,
    privatePrice: 900,
    maxGuests: 6,
    priceSuffix: "/ person",
    availabilityNotice: "Best October–April. Summer nights available on request.",
    timeSlots: ["Overnight (mid-afternoon departure)"],
    related: ["desert-stargazing-experience", "sunset-sand-surfing", "desert-breathwork-meditation"],
  },

  {
    slug: "sunset-horseback-ride",
    destination: "siwa-oasis",
    name: "Sunset Horseback Ride",
    titleMain: "Sunset Horseback",
    titleItalic: "Ride.",
    blockHeadline: "Through the palm groves and into the",
    blockHeadlineItalic: "gold hour.",
    heroTags: ["Desert", "Sunset · 2 hours", "From €55 per person"],
    heroMeta: ["Oasis edge", "Beginners welcome", "Max 6 riders", "Year-round"],
    gallerySize: 5,
    gradient:
      "bg-[linear-gradient(155deg,#1a3a52_0%,#2a3820_60%,#0F2436_100%)]",
    description: [
      "Through the palm groves and into the dunes at the hour the light turns gold. Siwan horses are calm, the terrain is forgiving, and the route — chosen by our guides who know it by heart — takes you past corners of the oasis most visitors never see.",
      "This is a walking-and-trotting ride. There's no galloping across dunes. The pace is set so that beginners are comfortable and experienced riders get the scenery they came for, not a rodeo.",
      "The ride finishes at a viewpoint on the edge of the sand sea, where you dismount and watch the sun drop while the horses drink.",
    ],
    facts: [
      { label: "Duration", value: "2 hours" },
      { label: "Time of day", value: "Sunset" },
      { label: "Group size", value: "2–6 riders" },
      { label: "Difficulty", value: "Beginner-friendly" },
      { label: "Minimum age", value: "12 years" },
      { label: "Meeting point", value: "Siwan stables · outside town" },
      { label: "Price", value: "€55 per person" },
      { label: "Private option", value: "€240 for up to 4 riders" },
      { label: "Season", value: "Year-round" },
    ],
    includes: [
      "Horse and tack matched to your experience level",
      "Siwan guide who knows the route",
      "Helmet on request",
      "Water for riders and horses",
      "Siwan tea at the viewpoint",
    ],
    notIncluded: "Long trousers (bring your own) · Hotel pickup if outside Siwa town · Gratuity (discretionary)",
    schedule: [
      {
        time: "90 min before sunset",
        title: "Arrival at the stables",
        body: "Meet your horse, brief orientation. Our guides match the horse to your experience — this isn't negotiable.",
      },
      {
        time: "Palm groves",
        title: "Out of the oasis",
        body: "Through irrigation channels and date groves to the edge of cultivation. The landscape shifts completely.",
      },
      {
        time: "The dunes",
        title: "Into the sand",
        body: "A gentle section across the dune edge. Walking and slow trotting, timed to land at the viewpoint as the light turns.",
      },
      {
        time: "Sunset",
        title: "Dismount and watch",
        body: "Off the horses at a quiet high point. The guide pours tea while you sit and the sun does the rest.",
      },
    ],
    notes: [
      "Long trousers are required. Shorts are not suitable.",
      "Closed shoes are required — riding boots are ideal but trainers are fine.",
      "Complete beginners are welcome but must let us know in advance so we match you to the right horse.",
      "Back or joint issues — mention in advance so we can advise.",
      "Cancellations within 48 hours of the experience are charged in full.",
    ],
    reviews: [
      {
        name: "Elena T.",
        origin: "Argentina · Stayed January 2025",
        text: "I ride at home, so I was a little nervous about the standard. No need — the horses are beautifully kept and the guide genuinely rode the whole route with us, not behind us.",
      },
      {
        name: "The Al Futtaim family",
        origin: "UAE · Stayed December 2024",
        text: "Our daughter is eight and we thought she'd be too young. She wasn't — they matched her with a patient horse and she rode with a guide next to her the entire time. Her favourite part of Siwa.",
      },
    ],
    price: 55,
    privatePrice: 240,
    maxGuests: 6,
    priceSuffix: "/ person",
    availabilityNotice: DEFAULT_AVAILABILITY,
    timeSlots: ["Sunset"],
    related: ["sunset-sand-surfing", "salt-lake-float-therapy", "sleeping-under-stars"],
  },

  {
    slug: "desert-stargazing-experience",
    destination: "siwa-oasis",
    name: "Desert Stargazing",
    titleMain: "Desert",
    titleItalic: "Stargazing.",
    blockHeadline: "The clearest sky you have",
    blockHeadlineItalic: "ever seen.",
    heroTags: ["Desert · Night", "3 hours", "From €55 per person"],
    heroMeta: ["Great Sand Sea", "Telescope provided", "Max 8 guests"],
    gallerySize: 5,
    gradient:
      "bg-[linear-gradient(155deg,#050a14_0%,#091820_60%,#0a1428_100%)]",
    description: [
      "No light pollution. No noise. Just you, the sand, and the clearest sky you have ever seen. A guide who knows the constellations and the myths behind them, a blanket, and two hours that reframe the scale of everything.",
      "We position ourselves far from any settlement. On new-moon nights the Milky Way is a ribbon across the sky. On full-moon nights the dunes glow silver and you can walk them by starlight.",
      "A portable telescope is set up on arrival. Planets, nebulae, and detailed lunar observation depending on the night. But the experience is mostly about the naked-eye sky — the telescope is just a bonus.",
    ],
    facts: [
      { label: "Duration", value: "3 hours" },
      { label: "Time of day", value: "Evening (post-sunset)" },
      { label: "Group size", value: "2–8 guests max" },
      { label: "Difficulty", value: "None" },
      { label: "Minimum age", value: "8 years" },
      { label: "Meeting point", value: "Lodge pickup" },
      { label: "Price", value: "€55 per person" },
      { label: "Private option", value: "€280 for up to 6 guests" },
      { label: "Best conditions", value: "Around new moon" },
    ],
    includes: [
      "4×4 transfer into the desert",
      "Astronomy guide",
      "Portable telescope",
      "Blankets, floor cushions, chairs",
      "Hot Siwan tea and snacks",
    ],
    notIncluded: "Warm layers (bring your own) · Hotel pickup if outside Siwa town · Gratuity (discretionary)",
    schedule: [
      {
        time: "90 min after sunset",
        title: "Drive into the desert",
        body: "Private 4×4 to the stargazing site — 30 minutes from Siwa town, well beyond any residual light.",
      },
      {
        time: "Arrival",
        title: "Eyes adjust",
        body: "We give your eyes 10 minutes in the dark. The difference is dramatic — many guests assume the sky has changed when it's only their eyes.",
      },
      {
        time: "Main session",
        title: "Guided walk-through of the sky",
        body: "Constellations, planets, Milky Way (most nights), and the stories behind them — ancient Egyptian, Greek, Bedouin.",
      },
      {
        time: "Close",
        title: "Tea and the return",
        body: "Hot tea and quiet before the drive back. Most guests go silent after the session — this is completely normal.",
      },
    ],
    notes: [
      "Cloudy nights are rare in Siwa but possible. We reschedule at no charge if visibility is poor.",
      "Bring warm clothes — desert nights are cold even in summer.",
      "Red-light head torches are better than phone lights for preserving night vision.",
      "Check your phone brightness before arrival and turn it off if possible.",
      "Cancellations within 48 hours of the experience are charged in full.",
    ],
    reviews: [
      {
        name: "Michael O.",
        origin: "Canada · Stayed October 2024",
        text: "I grew up in rural Saskatchewan and thought I'd seen dark skies. I hadn't. This was another category entirely. The guide was genuinely knowledgeable — not scripted.",
      },
      {
        name: "Alia S.",
        origin: "Jordan · Stayed February 2025",
        text: "Went expecting to be impressed. Came back unable to sleep for two hours thinking about what I'd just seen. Book it on a new-moon week if you can.",
      },
    ],
    price: 55,
    privatePrice: 280,
    maxGuests: 8,
    priceSuffix: "/ person",
    availabilityNotice: "Best around the new moon. Full moon nights also available.",
    timeSlots: ["Evening (after sunset)", "Late evening (10pm)"],
    related: ["sleeping-under-stars", "salt-lake-float-therapy", "desert-breathwork-meditation"],
  },

  {
    slug: "oracle-temple-pilgrimage",
    destination: "siwa-oasis",
    name: "Oracle Temple Pilgrimage",
    titleMain: "Oracle Temple",
    titleItalic: "Pilgrimage.",
    blockHeadline: "Where Alexander sought",
    blockHeadlineItalic: "divine counsel.",
    heroTags: ["Heritage", "Morning · Half day", "From €35 per person"],
    heroMeta: ["Aghurmi", "Max 8 guests", "Moderate walking", "Year-round"],
    gallerySize: 6,
    gradient:
      "bg-[linear-gradient(155deg,#2a1a0a_0%,#0F2436_60%,#1a2a3a_100%)]",
    description: [
      "Walk to the temple where Alexander the Great sought divine counsel in 331 BC. Most visitors walk past too quickly. This is a guided half-day — the history, the architecture, the views from the summit, and the story of why this remote oasis became one of the ancient world's most visited sites.",
      "Our guide is a Siwan historian who has been leading this walk for over a decade. The Alexander story is only half of what he'll share — the temple's place in Siwan identity is the other half.",
      "The walk up is moderate. The view from the top — both of the oasis and of the surrounding sand sea — is the reason the oracle was placed here in the first place.",
    ],
    facts: [
      { label: "Duration", value: "Half day (~4 hours)" },
      { label: "Time of day", value: "Morning" },
      { label: "Group size", value: "2–8 guests max" },
      { label: "Difficulty", value: "Moderate walking" },
      { label: "Minimum age", value: "10 years" },
      { label: "Meeting point", value: "Aghurmi village" },
      { label: "Price", value: "€35 per person" },
      { label: "Private option", value: "€160 for up to 6 guests" },
      { label: "Season", value: "Year-round (mornings preferred)" },
    ],
    includes: [
      "Siwan historian guide",
      "Temple entry fees",
      "Bottled water",
      "Traditional Siwan tea after",
      "Optional extension to Cleopatra Spring",
    ],
    notIncluded: "Closed walking shoes (bring your own) · Hotel pickup if outside Siwa town · Gratuity (discretionary)",
    schedule: [
      {
        time: "9:00am",
        title: "Meet at Aghurmi",
        body: "Introduction to the site and its context before entering. The oracle's reputation in the ancient world, and why this specific oasis mattered.",
      },
      {
        time: "Mid-morning",
        title: "The climb",
        body: "Gradual walk to the temple ruins on top of the hill. Several stopping points to talk about the architecture and what remains of the inscriptions.",
      },
      {
        time: "Summit",
        title: "Alexander's audience",
        body: "At the temple itself — the story of Alexander's visit, what the oracle is believed to have said, and what it meant for his campaign.",
      },
      {
        time: "Close",
        title: "Tea and optional extension",
        body: "Siwan tea below the site. Option to walk to Cleopatra Spring for a swim before returning.",
      },
    ],
    notes: [
      "Closed walking shoes required. The path has loose stones.",
      "There is some climbing involved — anyone with significant mobility limitations should mention in advance.",
      "Temple entry is subject to local heritage authority hours — we confirm on booking.",
      "Modest dress is advised at the site.",
      "Cancellations within 48 hours of the experience are charged in full.",
    ],
    reviews: [
      {
        name: "Jonas & Emma P.",
        origin: "Sweden · Stayed November 2024",
        text: "Our guide was exceptional. I've done guided tours in half a dozen countries and this one actually felt like a conversation, not a performance. The site is remarkable but the storytelling is what made it.",
      },
      {
        name: "Priya R.",
        origin: "India · Stayed January 2025",
        text: "As a history student this was the experience I came for. The layered history — ancient Egyptian, Greek, Islamic — was delivered thoughtfully. We added the spring at the end and it was a perfect morning.",
      },
    ],
    price: 35,
    privatePrice: 160,
    maxGuests: 8,
    priceSuffix: "/ person",
    availabilityNotice: DEFAULT_AVAILABILITY,
    timeSlots: ["Morning (9:00am)"],
    related: ["cleopatra-spring-soak", "traditional-sand-bath-healing", "premium-siwa-full-day"],
  },

  {
    slug: "traditional-sand-bath-healing",
    destination: "siwa-oasis",
    name: "Traditional Sand Bath Healing",
    titleMain: "Traditional",
    titleItalic: "Sand Bath Healing.",
    blockHeadline: "An ancient Siwan",
    blockHeadlineItalic: "practice.",
    heroTags: ["Wellness", "Sunrise · 1 hour", "From €45 per person"],
    heroMeta: ["Local healer", "Max 6 guests", "Summer mornings only"],
    gallerySize: 4,
    gradient:
      "bg-[linear-gradient(155deg,#3a2a0a_0%,#2a1a08_60%,#0F2436_100%)]",
    description: [
      "An ancient Siwan practice used for centuries to ease joint pain and restore circulation. Buried in warm sand at sunrise, the heat working through the body while the air is still cool. Our guide is a local healer whose family has practised this for generations — not a spa treatment, a tradition.",
      "The practice is most effective in summer, when the daytime sand temperature reaches therapeutic levels. We run it at sunrise so the air is manageable while the sand is still warm from the previous day.",
      "This is not a luxury spa add-on. It is a piece of Siwan medicine, offered by the people who actually use it. Guests with chronic joint or circulation issues report real benefit. Everyone else gets a very particular kind of morning they'll remember.",
    ],
    facts: [
      { label: "Duration", value: "1 hour (plus transfers)" },
      { label: "Time of day", value: "Sunrise" },
      { label: "Group size", value: "1–6 guests max" },
      { label: "Difficulty", value: "None" },
      { label: "Minimum age", value: "16 years" },
      { label: "Meeting point", value: "Lodge pickup · pre-dawn" },
      { label: "Price", value: "€45 per person" },
      { label: "Private option", value: "€200 for up to 4 guests" },
      { label: "Best season", value: "June–September" },
    ],
    includes: [
      "Pre-dawn 4×4 transfer",
      "Traditional Siwan healer",
      "Robes, towels, and cover cloths",
      "Cool water and mint tea after",
      "Return transfer",
    ],
    notIncluded: "Swimwear or light cotton clothing (bring your own) · Hotel pickup if outside Siwa town · Gratuity (discretionary)",
    schedule: [
      {
        time: "Pre-dawn",
        title: "Transfer to the sand bath site",
        body: "Short drive to the healer's family site outside Siwa town. Quiet arrival.",
      },
      {
        time: "First 15 min",
        title: "Preparation",
        body: "Introduction from the healer, explanation of the practice, and preparation of the sand pit at the correct depth and temperature.",
      },
      {
        time: "Main session",
        title: "Under the sand",
        body: "Buried up to the neck, head shaded, cloth over the body. The depth and temperature are adjusted continuously by the healer.",
      },
      {
        time: "After",
        title: "Cooling down & tea",
        body: "Gradual emergence, cool water rinse, and traditional mint tea. No rush. The healer speaks about the lineage of the practice.",
      },
    ],
    notes: [
      "Not suitable for guests with heart conditions, high blood pressure, pregnancy, or fever. Disclose medical conditions honestly on booking.",
      "Hydration matters significantly before and after. Drink 500ml of water before the session.",
      "This is a summer practice. We do not run it November–March.",
      "Loose cotton clothing or swimwear is fine — this is not a dressed affair.",
      "Cancellations within 72 hours of the experience are charged in full.",
    ],
    reviews: [
      {
        name: "Farida M.",
        origin: "Egypt · Stayed August 2024",
        text: "My knees have never felt like this since. Whatever this practice is doing, it works. And the setting — with someone whose grandparents did the same thing — felt meaningful.",
      },
      {
        name: "Rupert H.",
        origin: "United Kingdom · Stayed September 2024",
        text: "I came in thinking this was a gimmick. Left thinking it was the most unusual thing I did in Egypt. Not a spa experience. Something else.",
      },
    ],
    price: 45,
    privatePrice: 200,
    maxGuests: 6,
    priceSuffix: "/ person",
    availabilityNotice: "Summer season only — June through September.",
    timeSlots: ["Sunrise (pre-dawn pickup)"],
    related: ["desert-breathwork-meditation", "salt-lake-float-therapy", "cleopatra-spring-soak"],
  },

  {
    slug: "premium-siwa-full-day",
    destination: "siwa-oasis",
    name: "The Full Siwa Day",
    titleMain: "The Full Siwa",
    titleItalic: "Day.",
    blockHeadline: "One day. The whole",
    blockHeadlineItalic: "oasis.",
    heroTagGold: "Premium · Private",
    heroTags: ["Full day", "From €180 per person", "Lunch included"],
    heroMeta: ["Siwa-wide", "Private guide & vehicle", "Max 6 guests"],
    gallerySize: 9,
    gradient:
      "bg-[linear-gradient(155deg,#0F2436_0%,#1a3a52_60%,#0f2840_100%)]",
    description: [
      "Our most comprehensive Siwa experience — a privately guided full day combining the oracle temple, Cleopatra Spring, a traditional lunch, the sand dunes at golden hour, and the salt lake at sunset. Designed for guests who have one day and want to feel the whole oasis.",
      "This is private from start to finish. Your own guide, your own vehicle, and a pace set entirely by you. The sequence below is a recommendation — if you'd rather linger at the spring and skip the sand bath, your guide adjusts accordingly.",
      "We run this as a single-group experience only. There is no combining with strangers. The premium isn't in the itinerary — it's in the permission to go slowly, to stop for photos, and to change your mind at the spring because the tea is good.",
    ],
    facts: [
      { label: "Duration", value: "Full day (~10 hours)" },
      { label: "Time of day", value: "Early morning to sunset" },
      { label: "Group size", value: "1–6 guests · private only" },
      { label: "Difficulty", value: "Moderate — some walking" },
      { label: "Minimum age", value: "10 years" },
      { label: "Meeting point", value: "Lodge pickup · 7:30am" },
      { label: "Price", value: "€180 per person" },
      { label: "Group rate", value: "€950 flat for up to 6" },
      { label: "Season", value: "Year-round" },
    ],
    includes: [
      "Private 4×4 and driver for the day",
      "Private Siwan guide",
      "All site entry fees",
      "Traditional lunch at a local home",
      "Refreshments throughout",
      "Professional photo support",
    ],
    notIncluded: "Overnight stay at the desert camp (available as add-on) · Alcohol · Gratuity (discretionary)",
    scheduleIntro:
      "A suggested sequence. Your guide adjusts for energy, weather, and preference on the day.",
    schedule: [
      {
        time: "7:30am",
        title: "Lodge pickup · coffee in hand",
        body: "Private 4×4 and guide meet you at your accommodation. Early start to make the most of cool hours.",
      },
      {
        time: "Morning",
        title: "Oracle temple & Aghurmi",
        body: "Guided walk up to the oracle temple, then the ruins of Aghurmi village, then a swim at Cleopatra Spring.",
      },
      {
        time: "Midday",
        title: "Lunch at a Siwan home",
        body: "Traditional meal at a local host family's home. Not a restaurant — an actual meal with the family.",
      },
      {
        time: "Afternoon",
        title: "The Great Sand Sea",
        body: "Into the dunes with time for sand surfing if you like, and golden-hour photography.",
      },
      {
        time: "Sunset",
        title: "Salt lake close",
        body: "Finish the day at the salt lake for the float and the light. Tea on the shore before the return.",
      },
      {
        time: "After dark",
        title: "Return to the lodge",
        body: "Back by 8:30pm. Most guests skip dinner — you will be completely fed.",
      },
    ],
    notes: [
      "This is a long day. Wear layers — morning is cold, midday is warm, evening is cool again.",
      "Closed shoes are required for the oracle walk. Swimwear for the spring and lake. Bring both.",
      "Dietary requirements are accommodated — disclose on booking.",
      "Younger children are welcome but the pace is full. Discuss with us if you're considering it for under-10s.",
      "Cancellations within 72 hours of the experience are charged in full.",
    ],
    reviews: [
      {
        name: "The Wang family",
        origin: "Singapore · Stayed December 2024",
        text: "We had one day in Siwa and were worried we'd miss the best of it. We did not. Our guide ran the day like a friend showing us around — adjusted twice when we wanted to linger, and never once rushed us. The lunch was the memory our kids talk about most.",
      },
      {
        name: "Robert & Diane H.",
        origin: "USA · Stayed February 2025",
        text: "Best single day of our three-week Egypt trip. The mix of ancient sites, a real local lunch, the desert, and the salt lake in one day was enormous — and yet it didn't feel rushed. Worth the premium entirely.",
      },
    ],
    price: 180,
    maxGuests: 6,
    priceSuffix: "/ person",
    availabilityNotice: "Private only. Available year-round. Book 72 hours ahead where possible.",
    timeSlots: ["Full day (7:30am start)"],
    related: ["oracle-temple-pilgrimage", "salt-lake-float-therapy", "sunset-sand-surfing"],
  },

  /* ──────────────────────────────────────────────────────────────
   *  North Coast — all enquiry-based (no direct booking)
   * ────────────────────────────────────────────────────────────── */

  {
    slug: "sunset-sailing",
    destination: "north-coast",
    name: "Private Sunset Sailing",
    titleMain: "Private Sunset",
    titleItalic: "Sailing.",
    blockHeadline: "The Mediterranean at the hour it",
    blockHeadlineItalic: "earns its reputation.",
    heroTagGold: "Enquire to book",
    heroTags: ["Water · Private", "Sunset · 3 hours", "From €85 per person"],
    heroMeta: ["Mediterranean Sea", "Private — up to 6 guests", "Year-round", "Captain & crew included"],
    gallerySize: 6,
    gradient:
      "bg-[linear-gradient(155deg,#0F2436_0%,#2F6F8F_55%,#1a5a7a_100%)]",
    description: [
      "A private boat, open water, and the sun descending into the sea in front of you. The simplest luxury on the North Coast — and the one guests mention most when they describe what they actually remember.",
      "There is no commentary. No organised activity. The captain keeps the boat in the right position as the light changes; the crew ensures you have what you need; and you have three hours of Mediterranean water and sky with nobody else on the boat except the people you came with.",
      "The North Coast's coastline looks entirely different from the water than it does from a sun lounger. The resorts recede, the scale of the sea becomes apparent, and the light in the last forty minutes before the sun meets the horizon is the kind that photographers specifically plan their entire trips around.",
      "We schedule departure two hours before sunset — enough time to get clear of the marina and find open water before the light begins its descent.",
    ],
    facts: [
      { label: "Duration", value: "3 hours" },
      { label: "Time of day", value: "Sunset — departs 2 hrs prior" },
      { label: "Group size", value: "Private — up to 6 guests" },
      { label: "Vessel", value: "Private sailing boat or yacht" },
      { label: "Crew", value: "Captain + 1 crew member" },
      { label: "Minimum age", value: "No restriction" },
      { label: "Departure point", value: "Marassi Marina — details on confirmation" },
      { label: "Price", value: "€85 per person" },
      { label: "Season", value: "Year-round · Best Apr–Nov" },
    ],
    includes: [
      "Private vessel — no shared charters",
      "Captain and crew for the full duration",
      "Cold drinks and light refreshments",
      "Snorkelling equipment (optional use)",
      "Towels and sun protection on board",
      "Return to marina — no rush at end",
    ],
    notIncluded:
      "Transport to/from marina (we can arrange separately) · Alcohol (available on request at additional cost) · Gratuity for crew (discretionary)",
    scheduleIntro:
      "The best part of this experience is what isn't scheduled. This is an approximate arc — not a timetable.",
    schedule: [
      {
        time: "Departure",
        title: "Meet at the marina",
        body: "The captain greets you, brief orientation of the boat, and departure. The marina channel is calm — the open sea is ten minutes out.",
      },
      {
        time: "Open water",
        title: "The coast from the sea",
        body: "Once clear of the marina, the full coastline becomes visible. The captain finds the right position — far enough from shore for the view, close enough for the light to catch the water well.",
      },
      {
        time: "~1 hr before sunset",
        title: "Drinks on deck",
        body: "The crew brings drinks. The light begins to shift. This is when most guests go quiet without deciding to.",
      },
      {
        time: "Sunset",
        title: "The light changes",
        body: "Thirty minutes where the sea turns gold and then pink. The captain holds position. Nobody schedules anything for this part.",
      },
      {
        time: "After sunset",
        title: "Return to marina",
        body: "No rush. The boat stays out as long as you want it to. Return whenever the evening feels complete.",
      },
    ],
    notes: [
      "The experience is weather-dependent. In the event of strong wind or sea conditions, we will reschedule at no charge. The Mediterranean is generally calm April–November.",
      "This is a private charter — no other guests. The boat is yours for the full three hours. We do not combine bookings.",
      "If you are prone to motion sickness, the open Mediterranean can be choppy in winter months. October to March we recommend checking sea conditions with us before confirming.",
      "Cancellations within 48 hours of the experience are charged in full. Earlier cancellations receive a full refund.",
      "Transport from your property to the marina can be arranged as part of your booking — mention it in the enquiry form and we'll include it in your confirmation.",
    ],
    reviews: [
      {
        name: "Claire & Antoine D.",
        origin: "France · Stayed September 2024",
        text: "We've sailed in Greece, Croatia, Turkey. This was quieter than all of them — partly because it was private, partly because the captain understood that we didn't want anything organised. He just put the boat in the right place and left us to it. The sunset was extraordinary.",
      },
      {
        name: "Khalid & Nour F.",
        origin: "Saudi Arabia · Stayed October 2024",
        text: "We'd been at the resort for three days before this and hadn't really left. The sailing changed the whole trip — suddenly we understood where we were. The coast looks completely different from the water. We went back the next evening and asked for the same captain.",
      },
      {
        name: "Sophie T.",
        origin: "United Kingdom · Solo · August 2024",
        text: "I was slightly nervous booking a private sailing trip alone — unnecessary, it turned out. The crew was entirely professional and the three hours was the most peaceful part of a busy summer trip. Book it. Do it on your first evening so it sets the tone for the rest of the stay.",
      },
    ],
    price: 85,
    maxGuests: 6,
    priceSuffix: "/ person",
    availabilityNotice: "Available year-round. Best April–November when the Mediterranean is calmest.",
    timeSlots: ["Sunset (2 hrs prior departure)"],
    related: ["flamingo-watching-experience", "open-water-swim", "el-alamein"],
  },

  {
    slug: "flamingo-watching-experience",
    destination: "north-coast",
    name: "Flamingo Watching",
    titleMain: "Flamingo",
    titleItalic: "Watching.",
    blockHeadline: "A landscape that feels nothing like the",
    blockHeadlineItalic: "coast you just left.",
    heroTagGold: "Enquire to book",
    heroTags: ["Nature", "Morning · Half day", "From €45 per person"],
    heroMeta: ["Coastal lagoons", "Max 8 guests", "Year-round", "Guide included"],
    gallerySize: 5,
    gradient:
      "bg-[linear-gradient(155deg,#1a4060_0%,#0F2436_60%,#2a5a6a_100%)]",
    description: [
      "The lagoons behind the coastal strip are home to flamingos in the thousands — a fact that most guests staying at nearby resorts never discover. A quiet morning drive, a guide who knows where they gather, and two hours in a landscape that feels nothing like the coast you just left.",
      "These are wild birds in protected habitat. We go early, we go quietly, and we don't disturb. The best viewings happen when you sit still for twenty minutes and let the flock resume its routine around you.",
      "Bring a camera with a long lens if you have one — or don't, and let the memory be the memory. Both work.",
    ],
    facts: [
      { label: "Duration", value: "Half day (~4 hours)" },
      { label: "Time of day", value: "Early morning" },
      { label: "Group size", value: "2–8 guests" },
      { label: "Difficulty", value: "None — easy walking" },
      { label: "Minimum age", value: "8 years" },
      { label: "Meeting point", value: "Resort pickup · details on confirmation" },
      { label: "Price", value: "€45 per person" },
      { label: "Season", value: "Year-round" },
      { label: "Best conditions", value: "October–April" },
    ],
    includes: [
      "Private vehicle with driver",
      "Local naturalist guide",
      "Binoculars on loan",
      "Water and morning snacks",
      "Entrance and access fees",
      "Return transfer to resort",
    ],
    notIncluded:
      "Personal camera equipment · Alcohol · Gratuity (discretionary)",
    schedule: [
      {
        time: "Pre-dawn pickup",
        title: "Resort departure",
        body: "Short private drive to the lagoon area. The road is quiet; most traffic doesn't start for another two hours.",
      },
      {
        time: "Arrival",
        title: "Find the flock",
        body: "The guide knows where the birds gather this season. We stop, stay quiet, and let them settle.",
      },
      {
        time: "Main viewing",
        title: "Observation",
        body: "90 minutes of watching — ideally in stillness. Binoculars and tea on request.",
      },
      {
        time: "Close",
        title: "Return by mid-morning",
        body: "Back at your resort before the day heats up, in time for breakfast if you missed it.",
      },
    ],
    notes: [
      "This experience depends on where the flamingos are on the day. We cannot guarantee a specific viewing location, but our guides consistently find the flock.",
      "Dress in neutral colours — bright colours startle the birds. Layers recommended for the morning chill.",
      "No drones. Photography is welcome; disturbance is not.",
      "Cancellations within 48 hours of the experience are charged in full.",
    ],
    reviews: [
      {
        name: "Emma & David R.",
        origin: "United Kingdom · Stayed November 2024",
        text: "Genuinely astonishing. We had no idea this existed behind the coast — our resort certainly didn't mention it. The guide was exceptional and we saw more than a thousand flamingos. A quiet morning that reframed our whole week.",
      },
      {
        name: "The Ahmed family",
        origin: "Egypt · Stayed December 2024",
        text: "We brought our children, aged 10 and 12, and they were captivated. The guide was patient and knew how to keep them quiet. Better than any zoo visit.",
      },
    ],
    price: 45,
    maxGuests: 8,
    priceSuffix: "/ person",
    availabilityNotice: "Year-round. Best October–April for cool mornings and larger flocks.",
    timeSlots: ["Early morning (pre-dawn pickup)"],
    related: ["sunset-sailing", "open-water-swim", "coastline-drive"],
  },

  {
    slug: "open-water-swim",
    destination: "north-coast",
    name: "Open Water Swimming",
    titleMain: "Open Water",
    titleItalic: "Swimming.",
    blockHeadline: "Almaza Bay before the",
    blockHeadlineItalic: "beach fills.",
    heroTagGold: "Enquire to book",
    heroTags: ["Water", "Morning · 2 hours", "From €30 per person"],
    heroMeta: ["Almaza Bay", "Max 6 swimmers", "Swim ability required", "Apr–Nov"],
    gallerySize: 4,
    gradient:
      "bg-[linear-gradient(155deg,#1a5a7a_0%,#2F6F8F_100%)]",
    description: [
      "Guided early morning swims along the coast before the beach fills and the water churns. Almaza Bay has some of the clearest water on the Mediterranean — this is the way to appreciate it properly, not from a sun lounger fifty metres back.",
      "Our guide is a qualified open-water swim coach. Groups are capped at six, and routes are adjusted for swimmer ability on the day. The pace is set by the slowest; nobody is left behind or pushed ahead.",
      "This is not a race or a training session. It's a swim — in clear water, at the best time of day, with someone who knows the bay.",
    ],
    facts: [
      { label: "Duration", value: "2 hours (incl. briefing)" },
      { label: "Time of day", value: "Early morning" },
      { label: "Group size", value: "2–6 swimmers" },
      { label: "Difficulty", value: "Confident swimmer required" },
      { label: "Minimum age", value: "14 years" },
      { label: "Meeting point", value: "Almaza Bay beach · details on confirmation" },
      { label: "Price", value: "€30 per person" },
      { label: "Distance", value: "500m–1.5km based on ability" },
      { label: "Season", value: "April–November" },
    ],
    includes: [
      "Qualified swim guide",
      "Safety tow floats",
      "Warm drinks after",
      "Secure storage for belongings",
      "Towels provided",
    ],
    notIncluded:
      "Swimwear and goggles (bring your own) · Wetsuit (available for hire) · Gratuity (discretionary)",
    schedule: [
      {
        time: "Pre-dawn",
        title: "Meet on the beach",
        body: "Brief from the guide, swim-ability check, and route overview. We adjust the plan based on who is swimming.",
      },
      {
        time: "First light",
        title: "Warm-up and into the water",
        body: "Short shallow-water warm-up, then into open water. The first 5 minutes always feel cool; by minute 10 you forget.",
      },
      {
        time: "Main swim",
        title: "The route",
        body: "Typically a point-to-point along the bay, following the coastline with the guide alongside. Duration matches the group's pace.",
      },
      {
        time: "Return",
        title: "Warm drinks on the beach",
        body: "Out of the water, towels, warm tea, and a short debrief. The sun is fully up by now; the day can begin.",
      },
    ],
    notes: [
      "You must be a confident open-water swimmer. This is not a swimming lesson.",
      "Medical conditions affecting your ability to swim in open water should be disclosed on booking.",
      "Sea conditions can change quickly. The guide has final say on whether a swim goes ahead — rescheduled at no charge if cancelled for safety.",
      "Cancellations within 48 hours of the experience are charged in full.",
      "Water temperature is ideal April–November. Earlier or later requires a wetsuit.",
    ],
    reviews: [
      {
        name: "Helen B.",
        origin: "Ireland · Stayed June 2024",
        text: "I swim at home three times a week and was missing it on holiday. This was the perfect middle ground — guided but not patronised, social but not chatty. The bay at 6am is exceptional.",
      },
      {
        name: "Tom & Lucia P.",
        origin: "Italy · Stayed September 2024",
        text: "We've done guided swims in Greece and Croatia. The water here is clearer than both. Small group, knowledgeable guide, and back to breakfast before our kids were awake.",
      },
    ],
    price: 30,
    maxGuests: 6,
    priceSuffix: "/ person",
    availabilityNotice: "April–November when sea temperature is ideal. Earlier/later requires a wetsuit.",
    timeSlots: ["Early morning (pre-sunrise meet)"],
    related: ["sunset-sailing", "flamingo-watching-experience", "seafood-lunch"],
  },

  {
    slug: "coastline-drive",
    destination: "north-coast",
    name: "Private Coastline Drive",
    titleMain: "Private Coastline",
    titleItalic: "Drive.",
    blockHeadline: "A coast most visitors only see",
    blockHeadlineItalic: "from a bus window.",
    heroTagGold: "Enquire to book",
    heroTags: ["Coastal", "Full day · Flexible", "From €120 per person"],
    heroMeta: ["Alexandria to Marsa Matrouh corridor", "Private vehicle & guide", "Year-round"],
    gallerySize: 5,
    gradient:
      "bg-[linear-gradient(155deg,#1a3a52_0%,#2F6F8F_100%)]",
    description: [
      "The road from Alexandria to Marsa Matrouh follows the Mediterranean the entire way. With a private vehicle and a guide who knows the stops worth making, it becomes something close to a coastal pilgrimage — hidden beaches, quiet fishing villages, views that don't appear on any tourist map.",
      "This is a day spent out of the resort. The pace is entirely yours; the stops are agreed with the guide on the morning. Some guests run the full corridor; others settle at two or three favourite spots.",
      "Lunch at a small seafood place along the way is included — the guide chooses based on what's been landed that morning.",
    ],
    facts: [
      { label: "Duration", value: "Full day (~8 hours)" },
      { label: "Time of day", value: "Morning to late afternoon" },
      { label: "Group size", value: "Up to 4 guests per vehicle" },
      { label: "Difficulty", value: "None — vehicle-based" },
      { label: "Minimum age", value: "No restriction" },
      { label: "Meeting point", value: "Resort pickup" },
      { label: "Price", value: "€120 per person" },
      { label: "Season", value: "Year-round" },
      { label: "Lunch", value: "Included — local seafood" },
    ],
    includes: [
      "Private air-conditioned vehicle",
      "Experienced driver-guide",
      "Lunch at a local seafood spot",
      "Water and refreshments",
      "All fuel and road costs",
      "Flexible itinerary",
    ],
    notIncluded:
      "Alcohol · Additional meals beyond lunch · Gratuity (discretionary)",
    scheduleIntro:
      "The day is shaped by you. This is a typical sequence — your guide will adjust.",
    schedule: [
      {
        time: "09:00",
        title: "Resort pickup",
        body: "Introductions with your driver-guide, brief on the day, and departure. Route agreed together — east toward Alexandria or west toward Marsa Matrouh.",
      },
      {
        time: "Mid-morning",
        title: "First stops",
        body: "Hidden beaches, fishing villages, roadside viewpoints. Stopping is flexible — we linger where you linger.",
      },
      {
        time: "~1pm",
        title: "Seafood lunch",
        body: "A small place along the coast where the catch comes in by noon. Lunch lasts an hour or two — longer if the food deserves it.",
      },
      {
        time: "Afternoon",
        title: "Return route",
        body: "Different road back where possible. Photography stops, a quick walk on a quiet beach, tea at a coastal town.",
      },
      {
        time: "Before sunset",
        title: "Back to resort",
        body: "Home in time to change before dinner — or not, if you'd like to extend.",
      },
    ],
    notes: [
      "Distances along the coast are real — the full Alexandria–Marsa Matrouh corridor is over 300km. We do not attempt to cover all of it.",
      "Road conditions in some fishing villages are rough. Wear comfortable shoes.",
      "The guide speaks Arabic and English. Other languages available on request.",
      "Cancellations within 72 hours of the experience are charged in full.",
      "If you'd like the day to focus on specific things (photography, food, architecture), mention it in the enquiry.",
    ],
    reviews: [
      {
        name: "The Patel family",
        origin: "United Kingdom · Stayed July 2024",
        text: "We spent eight hours with our guide and wished we'd had twelve. The stops he picked were not on any tourist map, and the lunch was extraordinary. Our kids asked to do it again the next day.",
      },
      {
        name: "Monika & Stefan W.",
        origin: "Germany · Stayed October 2024",
        text: "We speak German only. They arranged a German-speaking driver at no extra cost. Professional from start to finish. A genuine alternative to spending another day at the resort.",
      },
    ],
    price: 120,
    maxGuests: 4,
    priceSuffix: "/ person",
    availabilityNotice: "Year-round. Cooler months are more pleasant for longer daylight exploration.",
    timeSlots: ["Full day (9am pickup)"],
    related: ["el-alamein", "sunset-sailing", "seafood-lunch"],
  },

  {
    slug: "el-alamein",
    destination: "north-coast",
    name: "El Alamein Heritage Visit",
    titleMain: "El Alamein",
    titleItalic: "Heritage Visit.",
    blockHeadline: "The turning point of the",
    blockHeadlineItalic: "North Africa campaign.",
    heroTagGold: "Enquire to book",
    heroTags: ["Heritage", "Morning · Half day", "From €35 per person"],
    heroMeta: ["El Alamein", "Max 8 guests", "Guide included", "Year-round"],
    gallerySize: 6,
    gradient:
      "bg-[linear-gradient(155deg,#2a1a0a_0%,#0F2436_60%,#1a3a4a_100%)]",
    description: [
      "One of the Second World War's most significant battlefields — the turning point of the North Africa campaign — thirty minutes from Marassi. The war museum, the Commonwealth cemetery, the German memorial. A quiet, important place that most guests staying on the coast fly home without having visited.",
      "Our guide is a historian who has led this walk for over a decade. The visit is paced — not rushed through three sites in ninety minutes, but walked properly across a morning.",
      "The cemeteries in particular are not easily forgotten. Many guests describe this as the most unexpectedly moving part of their trip.",
    ],
    facts: [
      { label: "Duration", value: "Half day (~4 hours)" },
      { label: "Time of day", value: "Morning" },
      { label: "Group size", value: "2–8 guests" },
      { label: "Difficulty", value: "Moderate walking" },
      { label: "Minimum age", value: "12 years" },
      { label: "Meeting point", value: "Resort pickup" },
      { label: "Price", value: "€35 per person" },
      { label: "Sites covered", value: "Museum · Commonwealth · German memorial" },
      { label: "Season", value: "Year-round" },
    ],
    includes: [
      "Private vehicle with driver",
      "Historian guide",
      "All site entry fees",
      "Bottled water",
      "Return transfer to resort",
    ],
    notIncluded:
      "Lunch · Souvenir purchases · Gratuity (discretionary)",
    schedule: [
      {
        time: "09:00",
        title: "Resort pickup",
        body: "Departure for El Alamein. Thirty-minute drive during which the guide sets the context for the campaign.",
      },
      {
        time: "Mid-morning",
        title: "War museum",
        body: "The museum's collection is modest but well-curated. Guide walks you through the key exhibits — the maps, the artefacts, the personal accounts.",
      },
      {
        time: "Late morning",
        title: "Commonwealth cemetery",
        body: "The largest and quietest of the three sites. Time to walk alone, read, reflect. Most guests want this part unguided.",
      },
      {
        time: "Before noon",
        title: "German memorial & return",
        body: "A short visit to the German memorial, then the return drive. Back at your resort before lunch.",
      },
    ],
    notes: [
      "Dress modestly — the cemeteries are active memorial sites.",
      "Photography is permitted at all three sites. Drones are not.",
      "The visit is reflective by design. We do not rush it, and we do not combine it with unrelated activities on the same morning.",
      "Cancellations within 48 hours of the experience are charged in full.",
      "Guide available in English, Arabic, or German — specify on booking.",
    ],
    reviews: [
      {
        name: "Richard H.",
        origin: "United Kingdom · Stayed May 2024",
        text: "My grandfather fought here. I had been meaning to visit for forty years. This was as respectful and thorough a morning as I could have asked for. The guide's knowledge was deep and his tone was right.",
      },
      {
        name: "The Martinez family",
        origin: "Spain · Stayed October 2024",
        text: "We brought our teenager who didn't want to come. She was the most moved of all of us. Our guide made the history feel immediate, and the Commonwealth cemetery in particular is a place she talks about still.",
      },
    ],
    price: 35,
    maxGuests: 8,
    priceSuffix: "/ person",
    availabilityNotice: "Year-round. Cooler months (Oct–Apr) are most comfortable for walking.",
    timeSlots: ["Morning (9am pickup)"],
    related: ["coastline-drive", "sunset-sailing", "flamingo-watching-experience"],
  },

  {
    slug: "seafood-lunch",
    destination: "north-coast",
    name: "Local Seafood Lunch",
    titleMain: "Local Seafood",
    titleItalic: "Lunch.",
    blockHeadline: "The catch came in this",
    blockHeadlineItalic: "morning.",
    heroTagGold: "Enquire to book",
    heroTags: ["Food", "Midday · 2–3 hours", "From €40 per person"],
    heroMeta: ["Off-strip fishing village", "Max 8 guests", "Transport included"],
    gallerySize: 5,
    gradient:
      "bg-[linear-gradient(155deg,#3d8aad_0%,#1a4060_100%)]",
    description: [
      "Off the tourist strip, there are small fishing spots where the catch comes in at noon and lunch is served by 1pm from whatever arrived that morning. We know the ones worth going to — the ones where the fish is the only thing on the menu because nothing else needs to be.",
      "Simple, fresh, and the kind of meal you compare everything else to. Sea bass, sea bream, red mullet, prawns — grilled over charcoal, dressed with lemon and olive oil, served with bread and salad.",
      "This is a meal, not a tour. We pick you up, you eat, we bring you back. The whole thing takes two to three hours, most of which is sitting at the table.",
    ],
    facts: [
      { label: "Duration", value: "2–3 hours (incl. transfers)" },
      { label: "Time of day", value: "Midday" },
      { label: "Group size", value: "2–8 guests" },
      { label: "Difficulty", value: "None" },
      { label: "Minimum age", value: "No restriction" },
      { label: "Meeting point", value: "Resort pickup" },
      { label: "Price", value: "€40 per person" },
      { label: "Menu", value: "Whatever came in that morning" },
      { label: "Season", value: "Year-round" },
    ],
    includes: [
      "Private transfer to and from the spot",
      "Set menu of the morning's catch",
      "Bread, salads, mezze, fresh fruit",
      "Soft drinks and water",
      "Local mint tea after",
    ],
    notIncluded:
      "Alcohol (not served at these spots) · Specific fish requests · Gratuity (discretionary)",
    schedule: [
      {
        time: "12:00",
        title: "Resort pickup",
        body: "Short private drive off the main strip. The road narrows; the setting shifts.",
      },
      {
        time: "12:30",
        title: "Arrival and first course",
        body: "Welcome mezze and bread on the table before you sit down. Order is kept simple — you eat what came in.",
      },
      {
        time: "13:00",
        title: "The catch",
        body: "Grilled whole fish, dressed simply. You'll know what's on your plate — the staff walk through it at the table.",
      },
      {
        time: "After",
        title: "Tea and return",
        body: "Mint tea, dates or fruit, then the short drive back. Most guests are quiet in the car, which is a good sign.",
      },
    ],
    notes: [
      "There is no menu. What you eat is what was caught this morning. If you have strong food preferences or allergies, tell us in advance.",
      "Vegetarians can be accommodated with advance notice — but this is fundamentally a fish lunch.",
      "These are small, family-run places. Dress code is casual. Service is warm, not polished.",
      "Cancellations within 48 hours of the experience are charged in full.",
      "Transport from your resort is always included — this is not an experience you drive to yourself.",
    ],
    reviews: [
      {
        name: "James & Louise K.",
        origin: "United Kingdom · Stayed June 2024",
        text: "The best meal we had in Egypt, and we're not exaggerating. We've eaten at proper restaurants in Cairo and Alexandria. This small spot off the coast beat them all because the fish was an hour out of the sea.",
      },
      {
        name: "Nadia F.",
        origin: "Lebanon · Stayed September 2024",
        text: "As a Lebanese we are particular about seafood. This was the real thing. The family running the place clearly knows what they're doing, and the setting is so unpretentious you relax immediately.",
      },
    ],
    price: 40,
    maxGuests: 8,
    priceSuffix: "/ person",
    availabilityNotice: "Year-round. Catch varies by season — the guide selects the best spot on the day.",
    timeSlots: ["Midday (12pm pickup)"],
    related: ["open-water-swim", "coastline-drive", "sunset-sailing"],
  },
];

/* ──────────────────────────────────────────────────────────────
 *  Lookup
 * ────────────────────────────────────────────────────────────── */

export function getExperience(slug: string): ExperienceDetail | undefined {
  return EXPERIENCE_DETAILS.find((e) => e.slug === slug);
}
