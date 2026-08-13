import { useEffect, useState } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { useReveal } from "@/components/home/useReveal";
import { useSiteContent, pickContent } from "@/lib/useSiteContent";
import { Arch } from "@/components/ui/Arch";

/* ──────────────────────────────────────────────────────────────
 *  /siwa-travel-tips
 *
 *  Long-form travel guide. Two-column layout with sticky sidebar
 *  (page nav, quick-reference table, must-see list, cross-links).
 *  Content split into 8 numbered sections.
 * ────────────────────────────────────────────────────────────── */

const PAGE_NAV = [
  { id: "getting-there", label: "Getting there" },
  { id: "best-time", label: "Best time to visit" },
  { id: "culture", label: "Culture & etiquette" },
  { id: "where-to-stay", label: "Where to stay" },
  { id: "experiences", label: "Must-try experiences" },
  { id: "food", label: "Food & dining" },
  { id: "health", label: "Health & safety" },
  { id: "practical", label: "Practical tips" },
];

const QUICK_REF: { k: string; v: string }[] = [
  { k: "From Cairo", v: "~8 hours by road" },
  { k: "From Marsa Matrouh", v: "~3 hours by road" },
  { k: "Best season", v: "October – April" },
  { k: "Peak months", v: "Oct, Nov, Mar, Apr" },
  { k: "Ideal stay", v: "3 – 5 nights" },
  { k: "Currency", v: "Egyptian Pounds (EGP)" },
  { k: "Language", v: "Siwi, Arabic, English" },
  { k: "Dress in town", v: "Modest — shoulders & knees covered" },
  { k: "Mobile signal", v: "Intermittent — download offline" },
  { k: "Water", v: "Bottled only" },
  { k: "Accommodation from", v: "$95 / night" },
  { k: "Experiences from", v: "$35 / person" },
];

const MUST_SEE = [
  "Salt lake at sunset — Birket Siwa",
  "Oracle Temple of Amun — Aghurmi",
  "Cleopatra's Spring — Ein Guba",
  "Shali Fortress ruins — Old Town",
  "Great Sand Sea — oasis perimeter",
  "Mountain of the Dead — Gebel el-Mawta",
  "Fatnas Island — palm island on the lake",
];

export default function SiwaTravelTipsPage() {
  useReveal();
  const c = useSiteContent();
  // Hero
  const heroEyebrow = pickContent(c, "siwa_tips.hero.eyebrow", "Siwa Oasis");
  const heroTitle = pickContent(c, "siwa_tips.hero.title", "Travel tips for");
  const heroItalic = pickContent(c, "siwa_tips.hero.italic", "Siwa Oasis.");
  const heroBody = pickContent(
    c,
    "siwa_tips.hero.body",
    "More than a guide — a set of things worth knowing before you arrive. Siwa rewards preparation not because it is difficult, but because the guests who find what they came for are always the ones who understood what they were arriving into. These tips are drawn from years of operating here.",
  );
  const stat1V = pickContent(c, "siwa_tips.hero.stat1_value", "~8 hrs");
  const stat1L = pickContent(c, "siwa_tips.hero.stat1_label", "From Cairo");
  const stat2V = pickContent(c, "siwa_tips.hero.stat2_value", "Oct–Apr");
  const stat2L = pickContent(c, "siwa_tips.hero.stat2_label", "Best season");
  const stat3V = pickContent(c, "siwa_tips.hero.stat3_value", "3–5");
  const stat3L = pickContent(c, "siwa_tips.hero.stat3_label", "Ideal nights");
  // NC crosslink
  const xTitle = pickContent(c, "siwa_tips.crosslink.title", "Also visiting the");
  const xItalic = pickContent(c, "siwa_tips.crosslink.italic", "North Coast?");
  const xBody = pickContent(
    c,
    "siwa_tips.crosslink.body",
    "Separate travel tips cover everything about Egypt's Mediterranean coast — getting there, best season, where to stay, and what the enquiry-based booking process looks like.",
  );
  const xCta = pickContent(c, "siwa_tips.crosslink.cta", "North Coast travel tips →");
  // Closing
  const closingTitle = pickContent(c, "siwa_tips.closing.title", "Plan your Siwa");
  const closingItalic = pickContent(c, "siwa_tips.closing.italic", "escape.");
  const closingBody = pickContent(
    c,
    "siwa_tips.closing.body",
    "Accommodation, experiences, and transport — all arranged by a team that grew up here and knows it from the inside. Tell us your dates and we'll take care of the rest.",
  );
  const closingPrimary = pickContent(c, "siwa_tips.closing.primary_cta", "Begin your stay");
  const closingSecondary = pickContent(c, "siwa_tips.closing.secondary_cta", "Explore Siwa Oasis");

  return (
    <>
      <SEO
        title="Travel Tips for Siwa Oasis — Soléi"
        description="More than a guide — a set of things worth knowing before you arrive in Siwa Oasis. Transport, season, culture, stays, experiences, food, health, and practical budget tips."
        path="/siwa-travel-tips"
      />
      <Nav darkHero={false} />

      <main>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-navy px-6 md:px-12 lg:px-20 pt-32 pb-16 md:pb-20">
          <div className="absolute inset-0 textile-bg pointer-events-none" />
          <div className="relative z-[2] max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-end">
            <div>
              <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-5 animate-fade-up animation-delay-200">
                <span className="block w-[22px] h-px bg-gold opacity-50" />
                {heroEyebrow}
              </p>
              <h1
                className="font-display font-normal leading-[1.1] text-white animate-fade-up animation-delay-400"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)" }}
              >
                {heroTitle}
                <br />
                <em className="italic text-gold">{heroItalic}</em>
              </h1>
            </div>

            <div className="animate-fade-up animation-delay-600 pb-2">
              <p className="text-[0.9rem] text-white/40 leading-[1.95] mb-8">
                {heroBody}
              </p>
              <div className="flex gap-10 border-t border-gold/15 pt-6">
                {[
                  { v: stat1V, l: stat1L },
                  { v: stat2V, l: stat2L },
                  { v: stat3V, l: stat3L },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="font-display text-[1.4rem] text-gold leading-none">
                      {s.v}
                    </div>
                    <div className="text-[0.58rem] tracking-[0.18em] uppercase text-white/30 mt-1">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── MAIN LAYOUT ─────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-20 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-20 items-start">
          {/* ── LEFT — TIPS ── */}
          <div>
            {/* 1. Getting There */}
            <TipSection num="01" id="getting-there" title="Getting there & " titleItalic="getting around.">
              <SubBlock title="By car from Cairo (recommended)">
                <p>
                  The standard route is the Western Desert highway —
                  approximately 8 hours from central Cairo via the coastal
                  road to Marsa Matrouh, then south into the oasis. The road
                  is paved and well-maintained throughout. A 4WD is not
                  required for the Cairo–Siwa road itself, though one is
                  essential for desert drives within the oasis.
                </p>
                <p>
                  Depart before 6am. Traffic out of Cairo is negligible at
                  this hour and you arrive by mid-to-late afternoon — enough
                  time to settle in before evening. Arriving after dark on a
                  first visit means missing the approach, which is part of
                  the experience.
                </p>
                <TipBox label="Soléi tip">
                  We arrange all transport with private vehicles and drivers
                  who know this route personally. From{" "}
                  <strong>$180 per vehicle</strong>. No shared transfers.{" "}
                  <Link href="/siwa-oasis/transportation">
                    View transport options →
                  </Link>
                </TipBox>
              </SubBlock>

              <SubBlock title="Getting around locally">
                <p>
                  Within Siwa, the most common transport is by bicycle,
                  donkey cart, or small electric buggy — all hireable in the
                  town. For desert excursions beyond the oasis perimeter, a
                  private 4WD and experienced local driver is essential. We
                  arrange all in-oasis transport and desert drives as part
                  of our experience and transportation bookings.
                </p>
              </SubBlock>

              <SubBlock title="Flights">
                <p>
                  There is no commercial airport in Siwa. The nearest with
                  domestic connections is Marsa Matrouh — approximately 3
                  hours by road. EgyptAir operates limited domestic flights
                  from Cairo to Marsa Matrouh. Most guests flying from
                  abroad arrive at Cairo International and drive from there.
                  If you fly into Marsa Matrouh, we arrange the onward
                  transfer from $95 per vehicle.
                </p>
              </SubBlock>

              <SubBlock title="Getting around once arrived — best avoided">
                <p>
                  Public buses to Siwa exist but are unreliable in timing,
                  uncomfortable over 8 hours, and arrive at times that
                  rarely align with a useful check-in. Shared taxis also
                  exist but are not something we recommend. The journey
                  matters — treat it as the opening of the experience
                  rather than a logistics problem to minimise.
                </p>
              </SubBlock>
            </TipSection>

            {/* 2. Best Time */}
            <TipSection num="02" id="best-time" title="Best time " titleItalic="to visit.">
              <SubBlock title="Peak season: October to April — highly recommended">
                <p>
                  This is when Siwa is at its best. Daytime temperatures are
                  comfortable (20–28°C), evenings are cool enough for a
                  jacket, and the oasis is fully operational. The salt lakes
                  are calm and the light at sunset is extraordinary. The
                  Great Sand Sea is accessible for all-day drives without
                  heat management issues.
                </p>
                <p>
                  <strong>Best specific months:</strong> October, November,
                  March, and April. Warm days, cool evenings, good
                  photography light, and the fewest visitors of the peak
                  period.
                </p>
              </SubBlock>

              <SubBlock title="Summer: May to September — proceed with caution">
                <p>
                  Temperatures regularly exceed 40°C at midday. Most
                  experiences are scheduled at sunrise or sunset. Desert
                  drives in the middle of the day are not recommended. The
                  oasis is quieter in summer and prices are lower, but
                  you'll spend significant time managing heat rather than
                  experiencing the place.
                </p>
                <WarnBox label="Summer consideration">
                  July and August see the highest temperatures. If this is
                  your only option, plan the majority of outdoor activity
                  for before 9am and after 5pm. Midday is for shade, food,
                  and rest.
                </WarnBox>
              </SubBlock>

              <SubBlock title="Weather considerations">
                <p>
                  The desert has near-zero rainfall. Occasional sandstorms
                  (khamsin) occur in late spring — typically brief and
                  manageable. The oasis itself is genuinely calm by desert
                  standards. Night temperatures in winter
                  (December–February) can drop to 5–10°C — a warm layer for
                  evenings is not optional in these months.
                </p>
              </SubBlock>
            </TipSection>

            {/* 3. Culture */}
            <TipSection num="03" id="culture" title="Local culture " titleItalic="& etiquette.">
              <SubBlock>
                <p>
                  Siwa is one of Egypt's most culturally distinct
                  communities — a Berber people with their own language
                  (Siwi), their own textile traditions, and their own
                  relationship to time and hospitality. Understanding this,
                  even briefly, makes the stay substantially richer.
                </p>
              </SubBlock>

              <SubBlock title="Dress code">
                <p>
                  In Siwa town, modest dress is appropriate and appreciated.
                  Shoulders and knees covered is the expectation. At the
                  lodges themselves, dress more casually as you prefer —
                  the expectation changes at the property gate. Women
                  travelling solo should expect to be treated with respect;
                  Siwa is one of the more welcoming oasis communities in
                  this regard.
                </p>
              </SubBlock>

              <SubBlock title="Friday and weekend culture">
                <p>
                  Friday is the day of rest and prayer in Siwa. The town
                  market and many local shops are closed or operating
                  reduced hours on Friday morning. Plan supply runs (water,
                  snacks, anything from the town) for Thursday. The lodges
                  operate normally throughout the week.
                </p>
              </SubBlock>

              <SubBlock title="Photography">
                <p>
                  Always ask before photographing local people, particularly
                  women. Landscape, architecture, and nature photography is
                  unrestricted. The oasis is extraordinarily photogenic —
                  the light at sunrise and sunset, the salt lakes, the Shali
                  fortress ruins — and none of it requires a special permit.
                </p>
              </SubBlock>

              <SubBlock title="Tipping convention">
                <p>
                  Tipping is expected and appreciated for guides, drivers,
                  and lodge staff. A rough guide: EGP 50–100 per day for a
                  driver, EGP 100–200 per day for a guide. At restaurants,
                  10–15% is standard. At Soléi properties, tips go directly
                  to the staff member — there is no pooling system.
                </p>
              </SubBlock>

              <SubBlock title="The Siwi language">
                <p>
                  Siwi is the native tongue of the oasis — a Berber dialect
                  distinct from Egyptian Arabic. Arabic is widely spoken
                  and understood. English is spoken at lodges and by guides
                  working with international guests. A few words of Arabic
                  (shukran for thank you, sabah el kheir for good morning)
                  go a long way.
                </p>
              </SubBlock>
            </TipSection>

            {/* 4. Where to Stay */}
            <TipSection num="04" id="where-to-stay" title="Where " titleItalic="to stay.">
              <SubBlock title="Luxury lodges">
                <p>
                  Siwa has a genuinely excellent luxury lodge category —
                  properties that use traditional materials (karsheef salt
                  rock, palm wood) and offer experiences that are deeply
                  connected to the oasis. Adrere Amellal is the benchmark:
                  no electricity, full board, salt lake front, and a
                  quality of stillness that guests describe as
                  transformative. Our Soléi properties (Old Town, Royal,
                  Desert Retreat) sit in the same category with the
                  additional accountability of being ours to run.
                </p>
                <Link
                  href="/siwa-oasis/accommodation"
                  className="inline-block mt-3 text-[0.62rem] tracking-[0.18em] uppercase text-coastal border-b border-coastal/30 pb-0.5 hover:border-coastal transition-colors"
                >
                  View all Siwa accommodation →
                </Link>
              </SubBlock>

              <SubBlock title="Boutique & heritage options">
                <p>
                  Taziry Ecolodge, Ghaliet Ecolodge & Spa, Talist Siwa, and
                  Siwa Shali Resort represent the mid-range of our Siwa
                  portfolio — all personally visited, all genuinely good,
                  all offering something distinct. Taziry for eco-conscious
                  guests. Ghaliet for its salt pool spa. Talist for its
                  infinity pool and Shali fortress views.
                </p>
              </SubBlock>

              <SubBlock title="Budget guesthouses">
                <p>
                  Azad Siwa Hotel is the most affordable property in our
                  portfolio at from $95/night. Beyond our curated list,
                  Siwa town has simple guesthouses at much lower price
                  points for travellers on tight budgets. These are not
                  properties we vet or recommend, but they are viable for
                  guests who prioritise cost above environment.
                </p>
                <TipBox label="Our recommendation">
                  Booking in advance is essential for peak season
                  (October–March). October and the Egyptian long weekends
                  (particularly Easter) sell out months ahead. Don't leave
                  it to arrival.
                </TipBox>
              </SubBlock>
            </TipSection>

            {/* 5. Experiences */}
            <TipSection num="05" id="experiences" title="Must-try " titleItalic="experiences.">
              <SubBlock title="Start with the salt lake at sunset">
                <p>
                  The float therapy at Siwa's hyper-saline lakes is the
                  single experience most guests name first when describing
                  what Siwa gave them. Not the views, not the desert drive,
                  not the temple — the float. At sunset. In silence. It is
                  from $45 per person and it books before almost everything
                  else in peak season.
                </p>
              </SubBlock>

              <SubBlock title="Explore the Cleopatra Spring">
                <p>
                  A natural spring fed pool said to have been visited by
                  Cleopatra. Cool, clear water, a carved stone setting, and
                  the particular calm of a place visited continuously for
                  two thousand years. Best in the early morning before it
                  gets busy. From $35 per person.
                </p>
              </SubBlock>

              <SubBlock title="Sand surf the Great Sand Sea by 4×4">
                <p>
                  The Great Sand Sea begins at the oasis edge — one of the
                  largest continuous sand masses on earth. Dune driving at
                  sunset is one of the more purely joyful things available
                  in Siwa, combining the physicality of the desert with
                  light that makes the dunes look like they're glowing from
                  inside. From $85 per group.
                </p>
              </SubBlock>

              <SubBlock title="Oracle Temple pilgrimage">
                <p>
                  The temple where Alexander the Great sought divine counsel
                  in 331 BC — and reportedly received the answer he was
                  looking for. Most visitors walk through in twenty minutes.
                  Half a day with a guide who explains the political and
                  spiritual context of the visit produces a fundamentally
                  different experience. From $35 per person.
                </p>
              </SubBlock>

              <SubBlock title="Sleeping under the stars">
                <p>
                  No light pollution. A sky that looks nothing like the sky
                  in any city you have ever been in. A Bedouin camp, dinner
                  in the open air, and the kind of sleep people describe
                  for years afterward because of what surrounded it. From
                  $120 per person including dinner.
                </p>
                <TipBox label="Booking note">
                  All Siwa experiences book directly on our site — instant
                  confirmation, no waiting. Book before arrival, not on the
                  morning of the experience.
                </TipBox>
              </SubBlock>
            </TipSection>

            {/* 6. Food */}
            <TipSection num="06" id="food" title="Food " titleItalic="& dining.">
              <SubBlock title="The food of the oasis">
                <p>
                  Siwa has a genuine food identity rooted in its
                  agricultural products — dates in extraordinary variety,
                  olives and olive oil from the oasis groves, organic
                  vegetables, the flatbreads baked daily in town. At
                  properties like Adrere Amellal and our Soléi lodges,
                  meals are composed entirely from local produce and
                  genuinely worth the full board rate.
                </p>
              </SubBlock>

              <SubBlock title="Egyptian favourites">
                <p>
                  In Siwa town, small local restaurants serve standard
                  Egyptian fare — ful (slow-cooked fava beans), ta'meya
                  (Egyptian falafel), koshary, grilled meats and fish.
                  Prices are very low by any standard. These are not
                  tourist restaurants — they serve what the town eats. The
                  quality is often better than it looks.
                </p>
              </SubBlock>

              <SubBlock title="Dietary requirements">
                <p>
                  Vegetarian and vegan diets are handled easily at the
                  lodges — Siwan cuisine is naturally vegetable-forward and
                  the produce is excellent. Gluten-free is manageable but
                  requires flagging in advance. Halal is the default
                  everywhere. Alcohol is not available in Siwa town and is
                  limited at most lodges — Adrere Amellal serves wine; our
                  Soléi properties do not.
                </p>
              </SubBlock>

              <SubBlock title="Independent dining">
                <p>
                  If you want to eat outside the lodge, the town has around
                  a dozen small restaurants in the central area around the
                  Shali fortress. Ask your lodge for the current
                  recommendations — the quality of small restaurants shifts
                  over seasons. Abdu's Restaurant has been consistently
                  good for years and serves non-Egyptians without any
                  difficulty.
                </p>
              </SubBlock>
            </TipSection>

            {/* 7. Health & Safety */}
            <TipSection num="07" id="health" title="Health " titleItalic="& safety.">
              <SubBlock title="Sun & heat protection">
                <p>
                  The desert sun in Siwa is genuinely intense, even in
                  cooler months. High SPF sunscreen, a hat, and sunglasses
                  are non-negotiable for any outdoor time. Drink water
                  continuously — a minimum of 2–3 litres per day in cooler
                  months, significantly more in summer. Dehydration comes
                  faster than expected and takes longer to correct than
                  expected.
                </p>
              </SubBlock>

              <SubBlock title="Water safety">
                <p>
                  Drink bottled water throughout your stay. The tap water
                  in Siwa is not safe for drinking and lodges will provide
                  bottled water. Bring enough bottled water in your vehicle
                  from Cairo or Marsa Matrouh for the journey — stock up
                  before you leave as road stop options are limited.
                </p>
              </SubBlock>

              <SubBlock title="Medical facilities">
                <p>
                  There is a small hospital and several pharmacies in Siwa
                  town. Adequate for routine issues and basic emergencies.
                  For anything requiring specialist care, the nearest city
                  is Marsa Matrouh (3 hours). Bring any prescription
                  medications you need for the full duration of your stay —
                  do not rely on sourcing specific medications in Siwa.
                  Travel insurance with medical evacuation coverage is
                  recommended.
                </p>
              </SubBlock>

              <SubBlock title="Desert safety">
                <p>
                  Never drive into the desert alone or without a guide who
                  knows the terrain. The Great Sand Sea is genuinely
                  disorienting without GPS and local knowledge — people
                  get lost. All Soléi desert drives use experienced local
                  guides. If you arrange independent drives, use registered
                  Siwa guides only.
                </p>
                <WarnBox label="Important">
                  Mobile signal is intermittent in Siwa and drops out
                  completely in many desert areas. Download offline maps
                  before departure and ensure your driver has emergency
                  communication equipment. Ours always do.
                </WarnBox>
              </SubBlock>
            </TipSection>

            {/* 8. Practical */}
            <TipSection num="08" id="practical" title="Practical tips " titleItalic="& budget." last>
              <SubBlock title="Money & payments">
                <p>
                  ATMs exist in Siwa town but are unreliable — bring
                  sufficient Egyptian Pounds from Cairo or Alexandria. All
                  Soléi bookings are settled in USD via secure
                  payment links. Credit cards are not widely accepted in
                  small local businesses — cash is king for anything in the
                  town market.
                </p>
              </SubBlock>

              <SubBlock title="Connectivity">
                <p>
                  Mobile signal is intermittent throughout the oasis.
                  Vodafone Egypt provides the best coverage. Wi-Fi at most
                  lodges is limited to common areas and variable in
                  quality. Adrere Amellal has no internet at all. Download
                  everything you'll need offline before the journey —
                  music, podcasts, navigation maps, any reading.
                </p>
              </SubBlock>

              <SubBlock title="What to bring">
                <InfoList
                  items={[
                    "Sunscreen SPF 50+ and a wide-brimmed hat",
                    "Warm layer for evenings (essential October–March)",
                    "Swimwear for the salt lake and Cleopatra Spring",
                    "Comfortable walking shoes for temple visits and town exploration",
                    "Cash in Egyptian Pounds for the town",
                    "Prescription medications for the full duration — don't rely on Siwa pharmacies",
                    "Offline maps and downloaded entertainment for the drive",
                    "Modest clothing for time in Siwa town",
                  ]}
                />
              </SubBlock>

              <SubBlock title="Budget guide">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mt-3">
                  {[
                    {
                      title: "Accommodation",
                      text: "$95–$320+ per night depending on property. Our Soléi properties from $145. Budget guesthouses from ~$20 (not curated).",
                    },
                    {
                      title: "Experiences",
                      text: "$35–$180 per person. Most half-day experiences fall between $35–$55. The Full Siwa Day at $180 covers the most ground.",
                    },
                    {
                      title: "Transportation",
                      text: "Cairo–Siwa from $180 per vehicle. Desert drives from $65. In-oasis transfers from $15.",
                    },
                    {
                      title: "Food in town",
                      text: "Local restaurants: EGP 50–150 per person (very affordable). Lodge dining: included in full board or EGP 300–800 for dinner.",
                    },
                  ].map((card) => (
                    <div
                      key={card.title}
                      className="bg-white border border-sand px-5 py-5"
                    >
                      <h4 className="font-display text-[0.9rem] text-navy mb-2">
                        {card.title}
                      </h4>
                      <p className="text-[0.8rem] text-ink-soft leading-[1.8]">
                        {card.text}
                      </p>
                    </div>
                  ))}
                </div>
              </SubBlock>

              <SubBlock title="Photography permits">
                <p>
                  No permits are required for personal photography at
                  Siwa's natural sites. The oracle temple and other
                  archaeological sites may require a standard Egyptian
                  antiquities entry ticket (included in guided visit fees).
                  Commercial photography requires prior coordination —
                  contact us if you're coming for a shoot.
                </p>
              </SubBlock>

              <div className="mt-8">
                <TipBox label="A final note">
                  The guests who find what they came for in Siwa are almost
                  always the ones who arrive with fewer plans than they
                  think they need. The oasis earns its quiet slowly. Three
                  nights of unhurried time will give you more than a week
                  of over-scheduled activity.
                </TipBox>
              </div>
            </TipSection>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <aside className="lg:sticky lg:top-[100px] space-y-[2px]">
            {/* Page nav */}
            <div className="bg-sand-light border border-sand p-5">
              <p className="text-[0.56rem] tracking-[0.28em] uppercase text-ink-soft/55 mb-3">
                Jump to section
              </p>
              <ul className="list-none">
                {PAGE_NAV.map((item, i, arr) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={`flex items-center justify-between py-2 text-[0.75rem] text-ink-soft hover:text-navy transition-colors ${
                        i === arr.length - 1
                          ? ""
                          : "border-b border-sand/50"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-[0.65rem] opacity-40">↓</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick reference */}
            <div className="bg-navy overflow-hidden">
              <div
                className="px-6 py-4 border-b border-gold/15"
                style={{ background: "rgba(184,154,91,0.12)" }}
              >
                <p className="text-[0.56rem] tracking-[0.3em] uppercase text-gold/80">
                  Quick Reference
                </p>
              </div>
              <div className="py-3">
                {QUICK_REF.map((r, i, arr) => (
                  <div
                    key={r.k}
                    className={`flex justify-between items-center px-6 py-2.5 ${
                      i === arr.length - 1 ? "" : "border-b border-white/5"
                    }`}
                  >
                    <span className="text-[0.68rem] text-white/35">
                      {r.k}
                    </span>
                    <span className="text-[0.72rem] text-white font-normal text-right max-w-[55%]">
                      {r.v}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Must-see */}
            <div className="bg-white border border-sand p-5">
              <p className="text-[0.56rem] tracking-[0.28em] uppercase text-gold mb-3">
                Must-see locations
              </p>
              <ul className="list-none">
                {MUST_SEE.map((loc, i, arr) => (
                  <li
                    key={loc}
                    className={`flex gap-3 items-start py-2.5 text-[0.78rem] text-ink-soft leading-[1.6] ${
                      i === arr.length - 1 ? "" : "border-b border-sand/50"
                    }`}
                  >
                    <span className="font-display italic text-[0.78rem] text-gold/70 min-w-[18px]">
                      {i + 1}.
                    </span>
                    <span>{loc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sidebar links */}
            <SidebarLink
              href="/siwa-oasis/accommodation"
              title="Siwa"
              titleItalic="accommodation"
              desc="8 curated properties including 3 Soléi-owned lodges. Direct booking, instant confirmation."
              cta="View properties"
            />
            <SidebarLink
              href="/siwa-oasis/experiences"
              title="Siwa"
              titleItalic="experiences"
              desc="10 curated experiences — salt lake float, desert stargazing, oracle temple and more."
              cta="View experiences"
            />
            <SidebarLink
              href="/siwa-faq"
              title="Siwa"
              titleItalic="FAQ"
              desc="34 questions answered — planning, booking, arriving, and everything in between."
              cta="Read the FAQ"
            />
          </aside>
        </section>

        {/* ── NC CROSSLINK ─────────────────────────────────────── */}
        <section className="bg-sand-light border-t border-sand px-6 md:px-12 lg:px-20 py-16">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="font-display text-[1.4rem] font-normal text-navy mb-2">
                {xTitle}{" "}
                <em className="italic text-coastal">{xItalic}</em>
              </h3>
              <p className="text-[0.84rem] text-ink-soft leading-[1.8] max-w-[60ch]">
                {xBody}
              </p>
            </div>
            <Link
              href="/north-coast-travel-tips"
              className="text-[0.62rem] tracking-[0.18em] uppercase text-navy border border-sand px-8 py-3.5 hover:border-gold hover:text-gold transition-colors whitespace-nowrap flex-shrink-0"
            >
              {xCta}
            </Link>
          </div>
        </section>

        {/* ── CLOSING ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-navy px-6 md:px-12 lg:px-20 py-24 md:py-28 text-center">
          <div className="absolute inset-0 textile-bg pointer-events-none" />
          <div className="relative z-[2] max-w-xl mx-auto">
            <div className="flex justify-center mb-10">
              <Arch className="w-14" />
            </div>
            <h2
              className="font-display font-normal leading-[1.2] text-white mb-5"
              style={{ fontSize: "clamp(1.7rem, 4vw, 3rem)" }}
            >
              {closingTitle}{" "}
              <em className="italic text-gold">{closingItalic}</em>
            </h2>
            <p className="text-[0.88rem] text-white/40 leading-[1.95] mb-10">
              {closingBody}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/enquire"
                className="text-[0.65rem] tracking-[0.2em] uppercase text-navy bg-gold px-10 py-4 hover:bg-gold-light transition-colors"
              >
                {closingPrimary}
              </Link>
              <Link
                href="/siwa-oasis"
                className="text-[0.65rem] tracking-[0.2em] uppercase text-white border border-white/20 px-10 py-4 hover:border-gold hover:text-gold transition-colors"
              >
                {closingSecondary}
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
 *  Helpers
 * ────────────────────────────────────────────────────────────── */

function TipSection({
  num,
  id,
  title,
  titleItalic,
  last,
  children,
}: {
  num: string;
  id: string;
  title: string;
  titleItalic: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className={`reveal scroll-mt-[120px] ${
        last ? "" : "mb-16 pb-16 border-b border-sand"
      }`}
    >
      <p className="font-display italic text-[0.78rem] text-gold/65 mb-2">
        {num}
      </p>
      <h2
        className="font-display font-normal text-navy mb-8"
        style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
      >
        {title}
        <em className="italic text-coastal">{titleItalic}</em>
      </h2>
      {children}
    </div>
  );
}

function SubBlock({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8 last:mb-0">
      {title && (
        <h3 className="flex items-center gap-3 font-display text-[1.05rem] font-normal text-navy mb-3">
          <span className="block w-4 h-px bg-gold opacity-50 flex-shrink-0" />
          {title}
        </h3>
      )}
      <div className="text-[0.88rem] text-ink-soft leading-[1.95] faq-answer-body">
        {children}
      </div>
    </div>
  );
}

function TipBox({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-sand border-l-[3px] border-l-gold px-5 py-4 my-4">
      <p className="text-[0.55rem] tracking-[0.28em] uppercase text-gold mb-1.5">
        {label}
      </p>
      <p className="text-[0.82rem] text-ink-soft leading-[1.8] faq-answer-body m-0">
        {children}
      </p>
    </div>
  );
}

function WarnBox({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-sand-light border border-sand px-5 py-4 my-4">
      <p className="text-[0.55rem] tracking-[0.28em] uppercase text-navy/60 mb-1.5">
        {label}
      </p>
      <p className="text-[0.82rem] text-ink-soft leading-[1.8] m-0">
        {children}
      </p>
    </div>
  );
}

function InfoList({ items }: { items: string[] }) {
  return (
    <ul className="list-none mt-3">
      {items.map((item, i, arr) => (
        <li
          key={i}
          className={`flex gap-3 items-start py-2 text-[0.84rem] text-ink-soft leading-[1.7] ${
            i === arr.length - 1 ? "" : "border-b border-sand-light"
          }`}
        >
          <span className="w-[5px] h-[5px] rounded-full bg-gold opacity-60 flex-shrink-0 mt-[10px]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SidebarLink({
  href,
  title,
  titleItalic,
  desc,
  cta,
}: {
  href: string;
  title: string;
  titleItalic: string;
  desc: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="block bg-white border border-sand p-5 hover:border-gold transition-colors group"
    >
      <h4 className="font-display text-[0.9rem] text-navy mb-1">
        {title} <em className="italic text-coastal">{titleItalic}</em>
      </h4>
      <p className="text-[0.75rem] text-ink-soft leading-[1.7] mb-3">{desc}</p>
      <span className="flex items-center gap-1.5 text-[0.58rem] tracking-[0.15em] uppercase text-gold group-hover:gap-2.5 transition-all">
        {cta} →
      </span>
    </Link>
  );
}
