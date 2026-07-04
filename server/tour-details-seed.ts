/**
 * Rich detail content for each of the 13 curated tours.
 *
 * Stored in experiences.details as JSONB on first boot (only when
 * the column is still null) so admin edits aren't overwritten on
 * restart. Mirrors the TourDetail shape in @shared/tour-detail.
 */

import type { TourDetail } from "@shared/tour-detail";

const STANDARD_EXCLUDES_SIWA: string[] = [
  "Gratuities for guides and drivers",
  "Personal expenses",
  "Travel insurance",
];

const STANDARD_EXCLUDES_NC: string[] = [
  "Gratuities",
  "Personal expenses",
  "Transport to and from your accommodation (can be arranged separately)",
];

const STANDARD_FAQS_DESERT: TourDetail["faqs"] = [
  {
    q: "Is this suitable for first-timers?",
    a: "Yes. The route is chosen to suit any fitness level, and the guide adjusts the pace to the group.",
  },
  {
    q: "What if I have a young child or older guest in the group?",
    a: "Tell us at booking — we'll pair you with a 4×4 with extra space and let the guide know to keep things gentle.",
  },
];

const STANDARD_FAQS_WATER: TourDetail["faqs"] = [
  {
    q: "Do I need to know how to swim?",
    a: "No. You float effortlessly in the salt lakes and Cleopatra's spring is shallow enough to stand in.",
  },
  {
    q: "Is anything provided?",
    a: "Yes — towels, drinking water, and a light snack. Bring swimwear, sunscreen, and a change of clothes.",
  },
];

export const tourDetailsBySlug: Record<string, TourDetail> = {
  // ─── Siwa ────────────────────────────────────────────────────
  "salt-and-spring-escape": {
    overview: [
      "Two of Siwa's quietest moments, paired into a single afternoon. The hyper-saline lakes hold you weightless at the sky's reflection. Cleopatra's spring closes the loop with cool, clear water carved into the rock.",
      "The driver knows the lakes that stay quiet at this hour. The pace is unhurried — float, dry off, drive, float again. By the end the body feels reset in a way you cannot quite name.",
    ],
    includes: [
      "Round-trip transfer from your accommodation",
      "Access to a quiet salt lake away from the busy spots",
      "Visit to Cleopatra's Spring",
      "Towels & drinking water",
      "Local guide for the duration",
    ],
    excludes: STANDARD_EXCLUDES_SIWA,
    itinerary: [
      { time: "3:00 PM", title: "Pickup", body: "Driver collects you from your accommodation in Siwa." },
      { time: "3:30 PM", title: "Salt lake", body: "Arrive at the salt lake, towels and water laid out. Float as long as you like — most guests stay an hour." },
      { time: "5:00 PM", title: "Cleopatra's Spring", body: "Drive a few minutes to the ancient stone-carved pool. Cool, clear water and a stone rim shaded by palms." },
      { time: "6:00 PM", title: "Return", body: "Back to your accommodation, in time to dress for dinner." },
    ],
    whatToBring: [
      "Swimwear (worn under clothes is easiest)",
      "Sunglasses — the salt lakes are bright",
      "Sunscreen reef-safe if possible",
      "A change of clothes for after the spring",
    ],
    faqs: STANDARD_FAQS_WATER,
    meetingPoint: "Pickup from your hotel in Siwa.",
    cancellationPolicy: "Free cancellation up to 24 hours before the experience.",
  },

  "desert-sunset-experience": {
    overview: [
      "A 4×4 across the Great Sand Sea at the hour the light turns gold. Sandboarding down whatever dune the driver picks for you, tea at the highest point as the sun sets, and back into Siwa by full dark.",
      "No experience required — the descent on the boards takes care of itself, and the climb back up is short. The point is the light, the silence, and the scale of the dunes.",
    ],
    includes: [
      "Pickup from your accommodation",
      "Private 4×4 with experienced desert driver",
      "Sandboards and instruction",
      "Sunset tea at the dune summit",
      "Bottled water",
    ],
    excludes: STANDARD_EXCLUDES_SIWA,
    itinerary: [
      { time: "3:30 PM", title: "Pickup", body: "Driver collects you and heads west into the Great Sand Sea." },
      { time: "4:15 PM", title: "Dune time", body: "Stop at a series of dunes, sandboarding and climbing while the light starts to turn." },
      { time: "5:45 PM", title: "Sunset tea", body: "Tea brewed on a small fire at the top of the highest dune as the sun sets over the sand." },
      { time: "7:00 PM", title: "Return", body: "Drive back into Siwa under the early stars." },
    ],
    whatToBring: [
      "Closed-toe shoes that can handle sand",
      "Long sleeves — evenings cool quickly",
      "A scarf or buff for the wind",
      "Camera with low-light capability if you have one",
    ],
    faqs: STANDARD_FAQS_DESERT,
    meetingPoint: "Pickup from your hotel in Siwa.",
    cancellationPolicy: "Free cancellation up to 24 hours before the experience.",
  },

  "desert-night-experience": {
    overview: [
      "Everything the sunset trip is, plus dinner cooked on fire in the open desert, a guide who reads the constellations out loud, and a bed beneath a ceiling of stars. The point of the night is the silence, the dark sky, and the kind of sleep you do not get inside walls.",
      "Bedouin camp setup with proper bedding, blankets, and a fire. Breakfast at sunrise before the drive back into town.",
    ],
    includes: [
      "Pickup and return transfer",
      "Private 4×4 and driver",
      "Sandboarding",
      "Sunset tea",
      "Fire-cooked dinner and breakfast",
      "Overnight in a Bedouin camp with bedding",
      "Stargazing with a guide",
    ],
    excludes: [
      "Gratuities for guides and drivers",
      "Personal expenses",
      "Alcohol (Siwa is dry — bring your own discreetly if you want it)",
    ],
    itinerary: [
      { time: "3:30 PM", title: "Pickup", body: "Driver collects you and heads into the Great Sand Sea." },
      { time: "5:45 PM", title: "Sunset", body: "Sunset tea at the dunes." },
      { time: "7:30 PM", title: "Camp", body: "Arrive at the Bedouin camp. Fire lit, dinner being prepared." },
      { time: "9:00 PM", title: "Stargazing", body: "Guide walks through the constellations once full dark sets in." },
      { time: "10:30 PM", title: "Rest", body: "Bed down under blankets in the open. Camp is quiet from this point." },
      { time: "6:30 AM", title: "Sunrise & breakfast", body: "Wake to sunrise over the dunes. Breakfast and coffee at the fire." },
      { time: "9:00 AM", title: "Return", body: "Drive back into Siwa." },
    ],
    whatToBring: [
      "Warm layer for the night — desert gets cold even in summer",
      "Closed-toe shoes",
      "Headlamp or small torch",
      "Toiletries for one night",
    ],
    faqs: [
      {
        q: "How private is the camp?",
        a: "Camps are sized to your group. You'll either have it to yourselves or share with at most one other couple/family who booked separately.",
      },
      {
        q: "Is there a toilet?",
        a: "Yes — a clean composting toilet at the camp.",
      },
      {
        q: "What if it rains?",
        a: "Siwa gets rain a handful of nights a year. If it's forecast, we offer to reschedule or refund.",
      },
    ],
    meetingPoint: "Pickup from your hotel in Siwa.",
    cancellationPolicy: "Free cancellation up to 48 hours before the experience.",
  },

  "siwa-essential-experience": {
    overview: [
      "A full day designed to give you the whole oasis in one continuous arc — water, desert, heritage, silence. Best for guests on a tight schedule who only have one day in Siwa.",
      "Pace is brisk but never rushed. The order is chosen so the heat of midday is spent in cool water and the heat of late afternoon is spent climbing dunes in air-conditioning.",
    ],
    includes: [
      "Pickup and return transfer",
      "Guide for the full day",
      "Heritage walk through Shali fortress",
      "Salt lake float + Cleopatra Spring visit",
      "Sandboarding in the Great Sand Sea",
      "Sunset tea at the highest dune",
      "Drinking water throughout",
    ],
    excludes: [
      ...STANDARD_EXCLUDES_SIWA,
      "Lunch (we recommend a local spot — your guide will take you)",
    ],
    itinerary: [
      { time: "9:00 AM", title: "Pickup & Shali", body: "Collect from your hotel, walk through the karsheef walls of the old fortress." },
      { time: "11:00 AM", title: "Salt & spring", body: "Float in a quiet salt lake, then Cleopatra's Spring." },
      { time: "1:00 PM", title: "Lunch", body: "Stop at a local lunch spot in town — order from a short, seasonal menu." },
      { time: "3:30 PM", title: "Into the desert", body: "Switch to 4×4 and head into the Great Sand Sea." },
      { time: "5:30 PM", title: "Dunes", body: "Sandboarding and dune-climbing." },
      { time: "6:30 PM", title: "Sunset tea", body: "Tea at the highest point for the last of the light." },
      { time: "7:30 PM", title: "Return", body: "Back to your accommodation." },
    ],
    whatToBring: [
      "Swimwear under clothes",
      "Sunscreen and sunglasses",
      "A modest layer for the heritage walk",
      "Closed-toe shoes for the dunes",
    ],
    faqs: [
      ...(STANDARD_FAQS_DESERT ?? []),
      {
        q: "Can we customise the order?",
        a: "Yes — tell us at booking. The order is optimised for heat, but the activities can shuffle.",
      },
    ],
    meetingPoint: "Pickup from your hotel in Siwa.",
    cancellationPolicy: "Free cancellation up to 48 hours before the experience.",
  },

  "solei-signature-siwa-journey": {
    overview: [
      "Our most comprehensive Siwa experience. The full day arc — heritage, water, desert — extended into the night with dinner under the stars and an optional overnight in the desert. Best for guests who want to feel everything Siwa has to offer in a single deliberate day.",
      "Privately guided, privately paced. Your guide chooses the salt lake, the dune route, and the dinner setup based on conditions on the day. No two journeys run identically.",
    ],
    includes: [
      "Private pickup and return transfer",
      "Dedicated private guide for the full journey",
      "Heritage walk through Shali",
      "Salt & spring ritual",
      "Private 4×4 in the Great Sand Sea",
      "Sandboarding & dune-climbing",
      "Sunset tea at a chosen high point",
      "Dinner under the stars in the desert",
      "Stargazing with a guide who knows the sky",
      "Optional overnight stay in a private Bedouin camp",
    ],
    excludes: [
      "Gratuities for guides and drivers",
      "Personal expenses",
      "Alcohol",
    ],
    itinerary: [
      { time: "9:00 AM", title: "Pickup & Shali", body: "Private collection and a heritage walk through the old fortress before the heat builds." },
      { time: "11:00 AM", title: "Water", body: "Quiet salt lake float and a visit to Cleopatra's Spring." },
      { time: "1:00 PM", title: "Lunch", body: "Lunch at a quiet spot of your guide's choosing." },
      { time: "3:30 PM", title: "Desert", body: "Private 4×4 into the Great Sand Sea. Sandboarding, dune-climbing, photography stops." },
      { time: "6:30 PM", title: "Sunset", body: "Tea at the highest point as the light gives out." },
      { time: "8:00 PM", title: "Dinner under the stars", body: "Fire-cooked dinner at a private camp setup, the sky overhead with no light pollution." },
      { time: "10:00 PM", title: "Stargazing", body: "Guide walks through the constellations and the myths behind them." },
      { time: "—", title: "Optional overnight", body: "Stay the night under the stars and wake to sunrise over the dunes, or return to Siwa." },
    ],
    whatToBring: [
      "Swimwear, sunscreen, sunglasses",
      "Closed-toe shoes for the dunes",
      "Warm layer for the night",
      "Camera with low-light capability",
      "Toiletries for one night if you stay over",
    ],
    faqs: [
      {
        q: "How private is this?",
        a: "Completely. Private guide, private vehicle, private camp. The day is built around your group only.",
      },
      {
        q: "Is overnight required?",
        a: "No — return to your hotel after dinner if you prefer. Many guests do.",
      },
      {
        q: "Can dinner be tailored?",
        a: "Yes. Tell us dietary preferences at booking and the cook will plan around them.",
      },
    ],
    meetingPoint: "Private pickup from your accommodation.",
    cancellationPolicy: "Free cancellation up to 72 hours before the experience.",
  },

  "wellness-and-sand-ritual": {
    overview: [
      "A traditional Siwan healing ritual practised in this region for centuries. The body is buried in warm sand at the right hour of the day, the heat working through joints and muscle while the air stays cool. Used locally for joint pain, circulation, and a general reset.",
      "Held by a local healer whose family has practised this for three generations. Tea, shade, and a slow recovery follow. Optional extension into a private massage.",
    ],
    includes: [
      "Round-trip transfer from your accommodation",
      "Sand bath session with a local healer",
      "Tea and fresh dates after",
      "Rest in shade",
      "Drinking water",
    ],
    excludes: [
      "Optional private massage (add €50)",
      "Gratuities",
      "Personal expenses",
    ],
    itinerary: [
      { time: "8:30 AM", title: "Pickup", body: "Driver collects you and heads to the sand-bath site outside Siwa." },
      { time: "9:30 AM", title: "Sand bath", body: "20–30 minutes buried in warm sand under shade." },
      { time: "10:15 AM", title: "Recovery", body: "Cool tea, fresh dates, rest in shade. Body recalibrates." },
      { time: "11:00 AM", title: "Return", body: "Drive back to your accommodation, gently." },
    ],
    whatToBring: [
      "Swimwear or light cotton clothes you don't mind getting sandy",
      "A towel",
      "A loose change of clothes for after",
      "Water bottle",
    ],
    faqs: [
      {
        q: "Is it safe?",
        a: "Yes — sand temperature is controlled by the healer and you are never fully covered. Not recommended for guests with heart conditions or uncontrolled high blood pressure.",
      },
      {
        q: "How does it feel after?",
        a: "Most guests describe it as a deep loosening — joints feel oiled and muscles relaxed. The effect lasts for days.",
      },
    ],
    meetingPoint: "Pickup from your hotel in Siwa.",
    cancellationPolicy: "Free cancellation up to 24 hours before the experience.",
  },

  "desert-stargazing": {
    overview: [
      "Siwa sits at Bortle 1–2 — among the darkest skies in North Africa. Drive a few minutes out of town, away from even Siwa's minimal lights, and the Milky Way appears as a bright structured river overhead.",
      "A guide who knows the constellations and the myths behind them, a blanket, a telescope, and two hours that reframe the scale of everything.",
    ],
    includes: [
      "Pickup and return transfer",
      "Astronomy guide",
      "Telescope on site",
      "Blankets, tea, and biscuits",
    ],
    excludes: STANDARD_EXCLUDES_SIWA,
    itinerary: [
      { time: "8:30 PM", title: "Pickup", body: "Driver collects you once the sky is fully dark." },
      { time: "9:00 PM", title: "On site", body: "Settle in at a dark-sky spot just outside Siwa. Tea, blankets." },
      { time: "9:15 PM", title: "Constellation walk", body: "Guide walks through the visible constellations and the stories behind them." },
      { time: "10:00 PM", title: "Telescope viewing", body: "Look at planets, the moon (when up), and deep-sky objects." },
      { time: "11:30 PM", title: "Return", body: "Back to your accommodation." },
    ],
    whatToBring: [
      "Warm layer — desert nights are cold even in summer",
      "Closed shoes",
      "Camera with manual exposure if you have one",
    ],
    faqs: [
      {
        q: "What if the sky is cloudy?",
        a: "We track conditions and reschedule or refund if it looks unfavourable.",
      },
      {
        q: "Is this suitable for kids?",
        a: "Yes — especially curious 8-and-up. Younger guests are welcome but may not last the full two hours.",
      },
    ],
    meetingPoint: "Pickup from your hotel in Siwa.",
    cancellationPolicy: "Free cancellation up to 24 hours before the experience.",
  },

  // ─── North Coast ─────────────────────────────────────────────
  "private-yacht-sunset-ritual": {
    overview: [
      "A private vessel, the Mediterranean at golden hour, and three hours where the day finally breathes out. We choose the launch point closest to your accommodation, the route is open — your captain will take you wherever the light is best.",
      "Refreshments on board, the boat to yourselves, and a sky that turns through every shade of red.",
    ],
    includes: [
      "Private yacht for up to 6 guests",
      "Captain and crew",
      "Light refreshments and water",
      "3 hours on the water",
      "Marina launch from Marassi or Almaza Bay",
    ],
    excludes: [
      ...STANDARD_EXCLUDES_NC,
      "Alcoholic drinks (can be added at booking)",
      "Dinner (can be added — full setup on board on request)",
    ],
    itinerary: [
      { time: "5:00 PM", title: "Boarding", body: "Welcome aboard at the marina. Brief safety, then push off." },
      { time: "5:15 PM", title: "Open water", body: "Cruise out along the coast as the light turns." },
      { time: "6:30 PM", title: "Sunset", body: "Captain holds position at the best vantage as the sun sets." },
      { time: "7:30 PM", title: "Return", body: "Slow return to the marina." },
    ],
    whatToBring: [
      "Light layer for after sunset",
      "Sunscreen",
      "Camera or phone for the light",
    ],
    faqs: [
      {
        q: "Is the boat private?",
        a: "Yes — entirely yours for the duration.",
      },
      {
        q: "Can we customise food and drink?",
        a: "Yes. Tell us at booking and we'll set up canapés, dinner, or a specific drink list on board.",
      },
    ],
    meetingPoint: "Marassi Marina or Almaza Bay marina — confirmed at booking based on your stay.",
    cancellationPolicy: "Free cancellation up to 48 hours before the experience.",
  },

  "beach-club-experience": {
    overview: [
      "A seamless day at one of the North Coast's most refined beach clubs — selected for atmosphere, not crowd. Reserved seating, considered service, the kind of slow afternoon that defines a coastal day done well.",
      "We handle the booking, the timing, and the route there. You arrive, your table is ready, the day unfolds.",
    ],
    includes: [
      "Reserved beach club access",
      "Reserved seating (cabana or sunbed depending on club)",
      "Drinks credit (€25 per guest)",
      "Concierge support throughout the day",
    ],
    excludes: [
      ...STANDARD_EXCLUDES_NC,
      "Meals beyond the drinks credit",
      "Spa or treatment add-ons",
    ],
    itinerary: [
      { time: "12:00 PM", title: "Arrival", body: "Arrive at the beach club. Reserved table or cabana waiting." },
      { time: "—", title: "Open afternoon", body: "Swim, lounge, eat. Day is yours — concierge is on call if you need anything." },
      { time: "Sunset", title: "Optional sunset", body: "Stay through sunset (extra reservation fee may apply) or return at your leisure." },
    ],
    whatToBring: [
      "Swimwear",
      "Cover-up for transitions between sea and lunch",
      "Sunscreen",
    ],
    faqs: [
      {
        q: "Which beach club?",
        a: "We select based on the day, the season, and your group. Options include 6IX Degrees, ZED Beach Club, and similar refined venues.",
      },
      {
        q: "Is this family-friendly?",
        a: "Yes — selected clubs welcome families. Tell us at booking and we'll match you with one that fits.",
      },
    ],
    meetingPoint: "We arrange transport from your accommodation if you'd like — otherwise meet at the club entrance.",
    cancellationPolicy: "Free cancellation up to 48 hours before the experience.",
  },

  "marassi-water-world-experience": {
    overview: [
      "A vibrant day of energy and movement — slides, pools, and open-air moments balanced with comfort, space, and ease. Marassi's water park is well-designed, well-maintained, and built around the idea that a water park should still feel like the coast.",
      "Full-day access, reserved lounging areas, and a guide who knows the park well enough to time the queues.",
    ],
    includes: [
      "Full-day access to Marassi Water World",
      "Slides, pools, lazy river",
      "Reserved poolside lounging area",
      "Towels",
      "Food & beverage available on site",
    ],
    excludes: [
      ...STANDARD_EXCLUDES_NC,
      "Food and drinks (pay as you go at the park)",
    ],
    itinerary: [
      { time: "10:00 AM", title: "Arrival", body: "Park opens. Skip-the-line entry with reserved lounging area." },
      { time: "—", title: "Open day", body: "Slides, lazy river, pools. Lunch on site at the park's restaurants." },
      { time: "5:00 PM", title: "Park close", body: "Pickup arranged if requested." },
    ],
    whatToBring: [
      "Swimwear",
      "Reef-safe sunscreen (high SPF)",
      "Hat and sunglasses",
      "Cash or card for food",
    ],
    faqs: [
      {
        q: "Is this good for young kids?",
        a: "Yes — the park has dedicated kid zones plus slides for older children.",
      },
      {
        q: "Can we leave and come back?",
        a: "Yes — re-entry is included with the wristband.",
      },
    ],
    meetingPoint: "Marassi Water World main entrance.",
    cancellationPolicy: "Free cancellation up to 48 hours before the experience.",
  },

  "signature-dinner-experience": {
    overview: [
      "An intimate dining moment by the sea — curated in location, mood, and detail. Whether it is a quiet table for two on the sand or a full private setup beneath the stars, the evening is shaped around how you want it to feel.",
      "Menu set in conversation with you ahead of the night. The result is a meal that feels personal rather than performed.",
    ],
    includes: [
      "Reserved or fully private dining setup",
      "Curated multi-course menu",
      "Service staff for the evening",
      "Decor and lighting as agreed",
    ],
    excludes: [
      ...STANDARD_EXCLUDES_NC,
      "Wine pairing (add on request)",
      "Photography or videography (can be arranged)",
    ],
    itinerary: [
      { time: "7:30 PM", title: "Arrival", body: "Greet at the chosen location. First course already at the table." },
      { time: "—", title: "Dinner", body: "Multi-course tasting menu paced to the evening." },
      { time: "10:30 PM", title: "Close", body: "Coffee and digestif at the table, then leave when you're ready." },
    ],
    whatToBring: [
      "Smart casual attire",
      "Whatever you'd like to set the mood — music playlist, a book of poems, a guest list",
    ],
    faqs: [
      {
        q: "Can this be a proposal?",
        a: "Yes. Many of our signature dinners are. Tell us at booking and we'll plan it discreetly.",
      },
      {
        q: "How private is it?",
        a: "Entirely. Either a reserved corner of a venue or a fully private setup on the sand or in a villa.",
      },
    ],
    meetingPoint: "Confirmed at booking — we will share the exact location 24 hours before.",
    cancellationPolicy: "Free cancellation up to 72 hours before the experience.",
  },

  "nightlife-experience": {
    overview: [
      "Curated evenings across the North Coast's most refined venues. We handle the table, the access, and the route between, so the night feels handled before it begins.",
      "Reservations at one or more of the season's best venues, your preferred crowd, and an optional chauffeur so nobody has to drive.",
    ],
    includes: [
      "Table reservations at one or more venues",
      "Priority entry",
      "Local host on call for the night",
      "Drinks credit (€30 per guest)",
    ],
    excludes: [
      ...STANDARD_EXCLUDES_NC,
      "Bottles and bottle service beyond the credit",
      "Chauffeur (add €60 for the night)",
    ],
    itinerary: [
      { time: "10:00 PM", title: "First venue", body: "Arrive at the agreed first venue. Table waiting, host meets you on entry." },
      { time: "—", title: "Open night", body: "Move between venues as the night progresses. Host coordinates between them." },
      { time: "Late", title: "Close", body: "Chauffeur (if booked) returns you to your accommodation." },
    ],
    whatToBring: [
      "Smart attire — most venues have a dress code",
      "Photo ID",
    ],
    faqs: [
      {
        q: "Which venues?",
        a: "Selected based on the night and your preferences. Common stops include 6IX Degrees, ZED, and seasonal pop-ups.",
      },
      {
        q: "What's a typical group size?",
        a: "2–8 guests works well. Larger groups need a different approach — tell us at booking.",
      },
    ],
    meetingPoint: "First venue confirmed 24 hours ahead.",
    cancellationPolicy: "Free cancellation up to 48 hours before the experience.",
  },

  "coastal-wellness-ritual": {
    overview: [
      "A slow morning by the sea designed to relax the body and clear the mind. Breathwork into light movement into a private massage, with refreshments and time to do nothing afterwards. The quietest way to start a day on the coast.",
      "Held in a spa setting or as a private setup at your accommodation depending on preference. The practitioner is the same in both — local, considered, and very good at what she does.",
    ],
    includes: [
      "Breathwork & guided light movement (45 min)",
      "60-minute private massage",
      "Tea, juice & light refreshments",
      "Spa access (where applicable) or private setup at your accommodation",
    ],
    excludes: [
      ...STANDARD_EXCLUDES_NC,
      "Extra treatments (facials, scrubs — add on request)",
    ],
    itinerary: [
      { time: "8:00 AM", title: "Begin", body: "Settle in, tea and juice. Practitioner introduces the morning." },
      { time: "8:15 AM", title: "Breathwork & movement", body: "45 minutes of breath and gentle movement to wake the body." },
      { time: "9:00 AM", title: "Massage", body: "60-minute massage tailored to what your body is asking for that day." },
      { time: "10:15 AM", title: "Rest", body: "Tea, more juice, time to lie in the shade or look at the water." },
    ],
    whatToBring: [
      "Loose, comfortable clothes for the movement portion",
      "Towel (provided if you forget)",
    ],
    faqs: [
      {
        q: "Can my partner and I do this together?",
        a: "Yes — book for 2 and the practitioner brings a colleague so massages happen side by side.",
      },
      {
        q: "Is this a beginner-friendly breathwork session?",
        a: "Yes. The practitioner adjusts the practice to whoever is in the room.",
      },
    ],
    meetingPoint: "Confirmed at booking — spa location or at your accommodation.",
    cancellationPolicy: "Free cancellation up to 48 hours before the experience.",
  },
};
