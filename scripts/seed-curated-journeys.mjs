/**
 * scripts/seed-curated-journeys.mjs
 *
 * Inserts the seven Soléi Curated Journeys (multi-night packages) into
 * the experiences table with category = "Curated Journey". Idempotent —
 * matches on slug, INSERTs if missing, otherwise leaves the row alone
 * so manual admin edits are not overwritten.
 *
 * Run with:
 *   DATABASE_URL=postgres://… node scripts/seed-curated-journeys.mjs
 */

import pg from "pg";

const { Pool } = pg;

const STANDARD_EXCLUSIONS = [
  "International or domestic flights to Egypt",
  "Travel insurance",
  "Personal expenses, spa add-ons, alcohol unless specified",
  "Tips and gratuities (recommended, at your discretion)",
  "Optional experiences not listed under Includes",
];

const STANDARD_VIP_EXCLUSIONS = [
  "International flights to Egypt",
  "Travel insurance",
  "Personal expenses not specified in the itinerary",
];

const STANDARD_CANCELLATION =
  "Free cancellation up to 14 days before arrival. 50% refund 7–14 days before. Non-refundable within 7 days. Full credit toward a future Soléi journey on request.";

const STANDARD_MEETING =
  "Cairo pickup included. Specific meeting point and contact details are sent with the booking confirmation.";

const journeys = [
  {
    slug: "north-coast-signature-stay",
    title: "North Coast Signature Stay",
    destination: "north-coast",
    duration: "3 Days · 2 Nights",
    pricePerPerson: "650.00",
    maxGuests: 2,
    luxury: true,
    wellness: false,
    eco: false,
    imageUrl: "/attached_assets/Pristine Beaches_1764585387661.jpg",
    summary:
      "A refined coastal escape designed around the rhythm of the Mediterranean — relaxed, effortless, fully curated.",
    description:
      "Two nights on the Mediterranean at one of our partner properties, paired with a private sunset on the water, an unhurried beach club day, and a reserved dinner at one of the coast's quietly excellent restaurants.",
    details: {
      overview: [
        "The Signature Stay is our shortest North Coast itinerary — designed for guests who want to slow the pace down without losing anything that makes the coast worth visiting.",
        "Accommodation is at one of our hand-picked Marassi, Almaza Bay, or El Alamein properties (matched to your preferences before booking). Everything else — the yacht, the beach club, the dinner reservation — is sequenced so each day has one anchor and plenty of space.",
      ],
      includes: [
        "2 nights at a curated Soléi partner property",
        "Private Yacht Sunset Experience (3 hours)",
        "Beach Club day pass with reserved sun loungers",
        "Dinner reservation at a Soléi-recommended restaurant",
        "Welcome amenities on arrival",
        "Concierge support throughout the stay",
      ],
      excludes: STANDARD_EXCLUSIONS,
      whatToBring: [
        "Swimwear and beachwear",
        "Light layers for evenings",
        "Sun protection",
        "Smart-casual outfit for dinner",
      ],
      itinerary: [
        {
          time: "Day 1",
          title: "Arrival & settling in",
          body: "Check-in, welcome amenities, and an afternoon at leisure at the property. Beach access, pools, and time to acclimate.",
        },
        {
          time: "Day 2",
          title: "Beach club + yacht sunset",
          body: "Late breakfast, a full afternoon at the beach club, then the private yacht sunset experience. Dinner reservation in the evening.",
        },
        {
          time: "Day 3",
          title: "Slow morning & departure",
          body: "A final swim, breakfast at the property, and check-out. Transfers arranged if requested.",
        },
      ],
      faqs: [
        {
          q: "Which property do we stay at?",
          a: "Matched to your preferences. Our team confirms the property with you before payment, drawing from our eight curated North Coast partners.",
        },
        {
          q: "Can we add extra nights?",
          a: "Yes. Most guests extend by 1–2 nights. Add-on pricing is shared on enquiry.",
        },
        {
          q: "Is the yacht private?",
          a: "Yes — the yacht is exclusively yours for the three-hour sunset window.",
        },
      ],
      meetingPoint: STANDARD_MEETING,
      cancellationPolicy: STANDARD_CANCELLATION,
    },
  },
  {
    slug: "siwa-desert-escape",
    title: "Siwa Desert Escape",
    destination: "siwa",
    duration: "4 Days · 3 Nights",
    pricePerPerson: "580.00",
    maxGuests: 4,
    luxury: false,
    wellness: false,
    eco: true,
    imageUrl: "/attached_assets/sand-boarding_1753576015281.png",
    summary:
      "A complete Siwa experience — simple, authentic, and deeply connected to the desert and oasis landscape.",
    description:
      "Three nights inside Siwa, anchored by a full desert safari, salt-lake mornings, and one night under the stars. The version of Siwa most travellers wish they had taken the time for.",
    details: {
      overview: [
        "Designed for guests who want the full Siwa rhythm — not the highlights reel, but the actual texture: slow mornings at the lake, an afternoon disappearing into the Great Sand Sea, and nights where the only sound is the wind moving over the dunes.",
        "Stays are at Adrère Amellal, Taziry, or our partner Siwa eco-lodges — matched to your travel style on enquiry.",
      ],
      includes: [
        "3 nights at a curated Siwa eco-lodge",
        "Full-day 4×4 Desert Safari with experienced Bedouin guide",
        "Salt lake morning + Cleopatra Spring visit",
        "Stargazing night in the Great Sand Sea",
        "All breakfasts and selected meals (full board at Adrère Amellal)",
        "Soléi welcome briefing on arrival",
      ],
      excludes: STANDARD_EXCLUSIONS,
      whatToBring: [
        "Closed-toe shoes for desert walks",
        "Swimwear (lakes and springs)",
        "Warm layer for desert evenings",
        "Refillable water bottle",
        "Headlamp / small torch",
      ],
      itinerary: [
        {
          time: "Day 1",
          title: "Arrival in Siwa",
          body: "Welcome and check-in at your lodge. Evening at leisure — a walk through the palm gardens or up to the Shali fortress at sunset.",
        },
        {
          time: "Day 2",
          title: "Salt lakes & Cleopatra Spring",
          body: "Morning swim in the salt lakes, lunch at the lodge, and an afternoon at Cleopatra Spring. Slow pace, deliberately.",
        },
        {
          time: "Day 3",
          title: "Desert Safari + stargazing",
          body: "4×4 deep into the Great Sand Sea — dune driving, sandboarding, hot springs in the desert. Dinner under the stars before returning to your lodge.",
        },
        {
          time: "Day 4",
          title: "Departure",
          body: "Breakfast and a final walk through the oasis. Private transfer back to Cairo or Alexandria.",
        },
      ],
      faqs: [
        {
          q: "How do we get to Siwa?",
          a: "Private vehicle transfer from Cairo (~8 hours) or Alexandria (~5 hours), included on request.",
        },
        {
          q: "Is the stargazing night a real overnight?",
          a: "It's a long evening into the early hours — typically returning to the lodge before dawn. Full overnight camps can be added if you want to sleep in the desert.",
        },
        {
          q: "How active is the safari?",
          a: "Moderate — driving, walking on dunes, optional sandboarding. No fitness requirements beyond comfortable walking.",
        },
      ],
      meetingPoint: STANDARD_MEETING,
      cancellationPolicy: STANDARD_CANCELLATION,
    },
  },
  {
    slug: "siwa-wellness-journey",
    title: "Wellness Journey",
    destination: "siwa",
    duration: "4 Days · 3 Nights",
    pricePerPerson: "620.00",
    maxGuests: 4,
    luxury: false,
    wellness: true,
    eco: true,
    imageUrl:
      "/attached_assets/Traditional Sand Bath Healing_1764121689995.JPG",
    summary:
      "A slower Siwa — focused on rest, healing, and the rituals that have made this oasis a wellness destination for centuries.",
    description:
      "Salt-lake therapy mornings, a traditional sand bath, daily meditation, and three nights inside an eco-lodge that asks nothing of you except that you slow down.",
    details: {
      overview: [
        "Siwa has been a healing destination for as long as it has been a settlement — salt lakes that float you weightless, mineral springs, and the dry desert air that the locals have used for traditional sand-bath therapy for centuries.",
        "This journey strips out the activity-heavy pieces of the standard Siwa program and replaces them with rest, breath, and movement. Best for solo travellers, couples, or small groups who specifically want a wellness arc.",
      ],
      includes: [
        "3 nights at a curated Siwa wellness-oriented lodge",
        "Two salt-lake therapy mornings",
        "Traditional Siwan sand-bath healing session",
        "Daily guided meditation or breathwork (optional)",
        "All breakfasts and selected meals (organic, locally sourced)",
        "Cleopatra Spring access and quiet-hours pool time",
      ],
      excludes: [
        ...STANDARD_EXCLUSIONS,
        "Massage and bodywork (available as add-ons)",
      ],
      whatToBring: [
        "Comfortable, loose clothing for movement",
        "Swimwear",
        "A journal if you'd like one",
        "Warm layer for evenings",
      ],
      itinerary: [
        {
          time: "Day 1",
          title: "Arrival & landing",
          body: "Welcome at the lodge, gentle walk through the palm grove, and a quiet first evening. Sleep early.",
        },
        {
          time: "Day 2",
          title: "Salt lake therapy + meditation",
          body: "Sunrise meditation, breakfast, then a morning floating in the salt lake. Free afternoon. Optional sunset breathwork.",
        },
        {
          time: "Day 3",
          title: "Sand bath ritual",
          body: "The traditional Siwan sand bath — a two-hour heat session in the dunes followed by rest, tea, and a slow lunch. Evening at the spring.",
        },
        {
          time: "Day 4",
          title: "Closing & departure",
          body: "Final breakfast, a closing meditation if you want it, and private transfer back.",
        },
      ],
      faqs: [
        {
          q: "Do I need any wellness or yoga experience?",
          a: "None at all. Everything is gentle, guided, and entirely optional.",
        },
        {
          q: "Is the sand bath safe?",
          a: "Yes — supervised by experienced Siwan practitioners. Not recommended for guests with serious cardiovascular conditions; flag any health concerns on enquiry.",
        },
        {
          q: "Can I add massage / spa treatments?",
          a: "Yes — we can arrange in-lodge massage, mineral baths, and other bodywork as add-ons.",
        },
      ],
      meetingPoint: STANDARD_MEETING,
      cancellationPolicy: STANDARD_CANCELLATION,
    },
  },
  {
    slug: "from-the-sea-to-the-sands",
    title: "From the Sea to the Sands",
    destination: null,
    duration: "5 Days · 4 Nights",
    pricePerPerson: "1200.00",
    maxGuests: 4,
    luxury: true,
    wellness: false,
    eco: true,
    imageUrl: "/attached_assets/hero-image_1753576015270.png",
    summary:
      "A journey between two worlds — from the Mediterranean coast to the silence of the desert. Soléi's signature.",
    description:
      "Two nights on the North Coast, a private transfer west into the desert, and two nights in Siwa. The most popular Soléi itinerary, and the one the brand was built around.",
    details: {
      overview: [
        "The single journey that captures what Soléi is. Two nights on the Mediterranean — yacht sunset, beach club, a curated property — before crossing west into Siwa for two nights at one of our eco-lodges with a full-day desert safari and salt lake morning.",
        "Designed as a complete arc: from the open horizon of the sea to the contained quiet of the oasis. Most guests describe the Siwa second half as the part they didn't know they were coming for.",
      ],
      includes: [
        "2 nights at a curated North Coast property",
        "Private Yacht Sunset Experience",
        "Private transfer Cairo / North Coast → Siwa",
        "2 nights at a curated Siwa eco-lodge",
        "Full-day 4×4 Desert Safari",
        "Salt lakes morning",
        "All breakfasts and selected meals",
        "Concierge support throughout",
      ],
      excludes: STANDARD_EXCLUSIONS,
      whatToBring: [
        "Swimwear and beachwear",
        "Closed-toe shoes for the desert",
        "Layers for desert evenings (it gets cold)",
        "Smart-casual for North Coast dining",
        "Sun protection",
      ],
      itinerary: [
        {
          time: "Day 1",
          title: "North Coast arrival",
          body: "Transfer from Cairo to the coast, check-in, afternoon at the beach club, evening at the property.",
        },
        {
          time: "Day 2",
          title: "Yacht sunset",
          body: "Slow morning, beach access, private yacht sunset experience in the late afternoon. Dinner at a Soléi-recommended restaurant.",
        },
        {
          time: "Day 3",
          title: "Coast → Siwa",
          body: "Private transfer west across the desert (~5 hours). Lunch en route. Arrival in Siwa late afternoon, settle in.",
        },
        {
          time: "Day 4",
          title: "Desert + salt lakes",
          body: "Sunrise at the salt lake, late breakfast, full afternoon 4×4 desert safari with dinner under the stars.",
        },
        {
          time: "Day 5",
          title: "Departure",
          body: "Breakfast, oasis walk, and private transfer back to Cairo (~8 hours) or onward.",
        },
      ],
      faqs: [
        {
          q: "Why this itinerary specifically?",
          a: "Because the contrast is the point. Most travellers see one or the other — the people who do both come back with the strongest memory of the trip.",
        },
        {
          q: "Can the order be reversed (Siwa first)?",
          a: "Yes — we can flip the itinerary to start in Siwa. Many guests prefer to end on the coast.",
        },
        {
          q: "Is the cross-desert transfer comfortable?",
          a: "Private vehicle, A/C, water provided. The drive itself is part of the experience — wide open desert, very little traffic.",
        },
      ],
      meetingPoint: STANDARD_MEETING,
      cancellationPolicy: STANDARD_CANCELLATION,
    },
  },
  {
    slug: "solei-grand-escape",
    title: "Soléi Grand Escape",
    destination: null,
    duration: "7 Days · 6 Nights",
    pricePerPerson: "1950.00",
    maxGuests: 4,
    luxury: true,
    wellness: true,
    eco: true,
    imageUrl: "/attached_assets/sleeping-under-stars.jpg",
    summary:
      "A full journey across coast and desert — designed to experience Egypt at its most considered.",
    description:
      "Three nights on the North Coast with yacht, beach club, and dining, followed by three nights in Siwa with the full desert + culture + wellness program. The expanded version of From the Sea to the Sands.",
    details: {
      overview: [
        "Six nights — three on the Mediterranean, three in the oasis — with every layer of the brand experience layered in. Most often booked by couples or small groups who want a single trip to anchor a 7-day vacation around.",
        "The North Coast half includes the yacht, the beach club, two signature dinners, and a free day at the property. Siwa includes the desert safari, salt lakes, Cleopatra Spring, traditional sand-bath ritual, and stargazing.",
      ],
      includes: [
        "3 nights at a curated North Coast property",
        "Private Yacht Sunset Experience",
        "Beach Club day with reserved loungers",
        "Two signature dinner reservations",
        "Private transfer North Coast → Siwa",
        "3 nights at a curated Siwa eco-lodge",
        "Full-day 4×4 Desert Safari",
        "Salt lakes + Cleopatra Spring",
        "Traditional Siwan sand-bath healing session",
        "Stargazing night in the Great Sand Sea",
        "All breakfasts and selected meals throughout",
      ],
      excludes: STANDARD_EXCLUSIONS,
      whatToBring: [
        "Swimwear and beachwear",
        "Closed-toe shoes for desert",
        "Layers for cold desert evenings",
        "Smart-casual outfits for coastal dining",
        "Sun protection",
      ],
      itinerary: [
        { time: "Day 1", title: "North Coast arrival", body: "Transfer, check-in, beach + property at leisure." },
        { time: "Day 2", title: "Yacht sunset", body: "Beach club day → private yacht sunset → dinner reservation." },
        { time: "Day 3", title: "Free coastal day", body: "Open day at the property. Optional add-on experiences on request." },
        { time: "Day 4", title: "Coast → Siwa", body: "Private transfer west. Arrival in the oasis, settle in." },
        { time: "Day 5", title: "Salt lakes + sand bath", body: "Salt lake morning, traditional sand-bath ritual afternoon." },
        { time: "Day 6", title: "Desert safari + stars", body: "Full-day 4×4 safari with dinner under the stars." },
        { time: "Day 7", title: "Departure", body: "Final breakfast, private transfer back to Cairo." },
      ],
      faqs: [
        {
          q: "Is this the full Soléi experience?",
          a: "Yes — every signature piece across both destinations. Anything else is custom add-ons (private chef, photographer, additional excursions).",
        },
        {
          q: "Is it possible to upgrade to Adrère Amellal in Siwa?",
          a: "Yes — premium property upgrades available on both halves, quoted on enquiry.",
        },
      ],
      meetingPoint: STANDARD_MEETING,
      cancellationPolicy: STANDARD_CANCELLATION,
    },
  },
  {
    slug: "honeymoon-escape",
    title: "Honeymoon Escape",
    destination: null,
    duration: "6 Days · 5 Nights",
    pricePerPerson: "1600.00",
    maxGuests: 2,
    luxury: true,
    wellness: true,
    eco: false,
    imageUrl: "/attached_assets/candlelit-dinner-outdoor_1752959631145.jpg",
    summary:
      "A romantic journey for two — private, quiet, and built around the small moments that make a trip memorable.",
    description:
      "Two nights on the North Coast with a private yacht sunset, then three nights in Siwa with a private desert dinner under the stars and a closing wellness afternoon.",
    details: {
      overview: [
        "Built for two. Smaller properties, private dining where possible, and an arc that ends on a quiet wellness note in the desert.",
        "Every dinner is reserved. Every transfer is private. The yacht is yours. The desert dinner is set up only for you. The whole trip is engineered around privacy.",
      ],
      includes: [
        "2 nights at a boutique North Coast property",
        "Private Yacht Sunset Experience (extended)",
        "Private dinner reservation on the coast",
        "Private transfer North Coast → Siwa",
        "3 nights at a curated Siwa eco-lodge (boutique room or suite)",
        "Private desert dinner under the stars (just the two of you)",
        "Stargazing night with a Bedouin guide",
        "Wellness afternoon: salt lake float + closing sand bath",
        "All breakfasts and selected meals",
        "Honeymoon welcome amenities at both properties",
      ],
      excludes: STANDARD_EXCLUSIONS,
      whatToBring: [
        "Swimwear",
        "One slightly dressier outfit for the private dinners",
        "Warm layers for the desert evenings",
        "Sun protection",
      ],
      itinerary: [
        { time: "Day 1", title: "North Coast arrival", body: "Private transfer, check-in, welcome amenities, evening at leisure." },
        { time: "Day 2", title: "Yacht sunset + private dinner", body: "Beach morning, extended yacht sunset, private dinner reservation." },
        { time: "Day 3", title: "Coast → Siwa", body: "Private transfer west. Arrival, suite check-in, slow evening." },
        { time: "Day 4", title: "Private desert dinner", body: "Salt lake morning, desert drive in the afternoon, private dinner under the stars, stargazing." },
        { time: "Day 5", title: "Wellness day", body: "Salt-lake float, sand-bath ritual, closing dinner at the lodge." },
        { time: "Day 6", title: "Departure", body: "Slow breakfast, private transfer back." },
      ],
      faqs: [
        {
          q: "Can we extend?",
          a: "Yes — most honeymoon guests extend by 1–2 nights on either side. Pricing is shared on enquiry.",
        },
        {
          q: "Are dietary preferences accommodated?",
          a: "Yes — share any dietary requirements when you enquire and we'll confirm with both properties.",
        },
        {
          q: "Is there a single-supplement?",
          a: "This package is priced per person assuming two travellers sharing. Solo bookings are quoted separately.",
        },
      ],
      meetingPoint: STANDARD_MEETING,
      cancellationPolicy: STANDARD_CANCELLATION,
    },
  },
  {
    slug: "solei-elite-journey",
    title: "Soléi Elite Journey",
    destination: null,
    duration: "Flexible",
    pricePerPerson: "3500.00",
    maxGuests: 6,
    luxury: true,
    wellness: true,
    eco: true,
    imageUrl: "/attached_assets/stargazing_1752963245806.jpg",
    summary:
      "A fully private experience — tailored from arrival to departure around your preferences, your pace, and your party.",
    description:
      "The VIP arc. Luxury stays at both destinations, extended private yacht time, fully private dining experiences, private transfers throughout, and a fully customised Siwa program. Designed in conversation with you before booking.",
    details: {
      overview: [
        "Elite is not a packaged itinerary — it's a private brief. We start with a 30-minute call to understand what kind of trip you want, then design the arc around it. Everything in our other packages is available; nothing is required.",
        "Best for guests who want flexibility above structure, families who want a private guide throughout, or groups travelling for a milestone occasion.",
      ],
      includes: [
        "Top-tier accommodation at both destinations (Adrère Amellal in Siwa, your choice of luxury property on the coast)",
        "Private yacht for an extended window (full day or sunset + dinner cruise)",
        "Fully private dining experiences — beach, desert, rooftop, on request",
        "Private transfers at every step (Mercedes V-class or equivalent)",
        "Dedicated Soléi concierge throughout the trip",
        "Custom Siwa program: choice of desert depth, cultural focus, wellness focus, or all three",
        "All meals at the lodges, all gratuities, all entrance fees",
        "Optional add-ons: private chef, photographer, helicopter transfer to/from Siwa",
      ],
      excludes: STANDARD_VIP_EXCLUSIONS,
      whatToBring: [
        "We provide a personalised packing brief once your itinerary is locked in",
      ],
      itinerary: [
        {
          time: "Step 1",
          title: "Discovery call",
          body: "30-minute conversation with our team to scope the trip — duration, party size, interests, dietary preferences, special occasions.",
        },
        {
          time: "Step 2",
          title: "Itinerary draft",
          body: "We send a detailed draft itinerary with property options, daily plan, and a fixed quote within 48 hours.",
        },
        {
          time: "Step 3",
          title: "Refine & confirm",
          body: "Two rounds of revisions included. Once you confirm, deposit secures your dates and all bookings.",
        },
        {
          time: "Step 4",
          title: "On the ground",
          body: "Dedicated concierge with you throughout. Everything is arranged; you make decisions only when you want to.",
        },
      ],
      faqs: [
        {
          q: "What's the minimum trip length for Elite?",
          a: "5 nights. Below that, the Honeymoon Escape or From the Sea to the Sands packages are usually a better fit.",
        },
        {
          q: "Is there a maximum party size?",
          a: "Six guests for a single concierge-led experience. Larger groups are still possible — we add additional staff.",
        },
        {
          q: "Can you accommodate special occasions (anniversary, milestone birthday)?",
          a: "Yes — most Elite bookings are for occasions. Share the brief during the discovery call.",
        },
        {
          q: "What does the deposit / payment schedule look like?",
          a: "30% deposit to confirm, balance due 30 days before arrival. Pay in EUR or USD via secure link.",
        },
      ],
      meetingPoint: STANDARD_MEETING,
      cancellationPolicy:
        "Free changes up to 30 days before arrival. 50% refund 14–30 days before. Non-refundable within 14 days. Insurance strongly recommended for Elite-tier bookings.",
    },
  },
];

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL env var required");
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  let inserted = 0;
  let skipped = 0;

  for (const j of journeys) {
    const existing = await pool.query(
      "SELECT id FROM experiences WHERE slug = $1 LIMIT 1",
      [j.slug],
    );
    if (existing.rowCount > 0) {
      console.log(`  · skip  ${j.slug} (already exists, id=${existing.rows[0].id})`);
      skipped++;
      continue;
    }

    await pool.query(
      `INSERT INTO experiences (
        title, slug, destination, category, price_per_person,
        duration, max_guests, min_age, difficulty,
        summary, description, image_url, media_type,
        eco, luxury, wellness, is_active, details
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12, $13,
        $14, $15, $16, $17, $18
      )`,
      [
        j.title,
        j.slug,
        j.destination,
        "Curated Journey",
        j.pricePerPerson,
        j.duration,
        j.maxGuests,
        12,
        "Easy",
        j.summary,
        j.description,
        j.imageUrl,
        "image",
        j.eco,
        j.luxury,
        j.wellness,
        true,
        JSON.stringify(j.details),
      ],
    );
    console.log(`  + insert  ${j.slug}`);
    inserted++;
  }

  console.log(`\nDone — ${inserted} inserted, ${skipped} skipped.`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
