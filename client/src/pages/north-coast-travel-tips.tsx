import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { useReveal } from "@/components/home/useReveal";
import { useSiteContent, pickContent } from "@/lib/useSiteContent";
import { Arch } from "@/components/ui/Arch";
import { useMemo } from "react";
import { NORTH_COAST } from "@/lib/site-facts";
import { useHotelsBySlug } from "@/lib/useHotelsBySlug";
import { useExperiencesBySlug } from "@/lib/useExperiencesBySlug";
import { adminPrice, parseAmount, CANONICAL_CURRENCY } from "@/lib/price";

const NC_EXPERIENCE_NAMES: Record<
  (typeof NORTH_COAST.experienceSlugs)[number],
  string
> = {
  "private-yacht-sunset-ritual": "Private Yacht Experience",
  "beach-club-experience": "Beach Club",
  "marassi-water-world-experience": "Marassi Water World",
  "signature-dinner-experience": "Signature Dinner",
  "nightlife-experience": "Nightlife",
  "coastal-wellness-ritual": "Luxury Spa",
};
const ncExperienceHref = (slug: string) => `/north-coast/experiences/${slug}`;

/** Lowest admin-set "from" prices for the live NC catalogue (0 = none set). */
function useNcFromPrices() {
  const hotels = useHotelsBySlug();
  const experiences = useExperiencesBySlug();
  return useMemo(() => {
    const min = (xs: number[]) => {
      const pos = xs.filter((x) => x > 0);
      return pos.length ? Math.min(...pos) : 0;
    };
    return {
      stay: min(
        NORTH_COAST.properties.map((p) => adminPrice(hotels.get(p.slug)).amount),
      ),
      experience: min(
        NORTH_COAST.experienceSlugs.map((s) =>
          parseAmount(experiences.get(s)?.pricePerPerson),
        ),
      ),
    };
  }, [hotels, experiences]);
}
const fmtFrom = (amount: number, unit: string) =>
  amount > 0
    ? `From ${CANONICAL_CURRENCY}${amount.toLocaleString()} ${unit}`
    : "Price on request";

/* ──────────────────────────────────────────────────────────────
 *  /north-coast-travel-tips
 *
 *  Long-form travel guide for the North Coast. Coastal-blue hero
 *  with wave texture. 8 numbered sections. Sticky sidebar with
 *  jump nav + coastal quick-reference card + highlights +
 *  cross-link cards.
 * ────────────────────────────────────────────────────────────── */

const WAVE_TEX_HERO =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23FDFAF5' stroke-opacity='0.04' stroke-width='0.5'%3E%3Cpath d='M0 30 Q15 20 30 30 Q45 40 60 30'/%3E%3Cpath d='M0 45 Q15 35 30 45 Q45 55 60 45'/%3E%3C/g%3E%3C/svg%3E\")";

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

const QUICK_REF_STATIC: { k: string; v: string }[] = [
  { k: "From Cairo", v: "~3 hours to Marassi" },
  { k: "From Alexandria", v: "~1.5–2 hours to Marassi" },
  { k: "Best season", v: "Apr–Jun · Sept–Nov" },
  { k: "Peak season", v: "July – August" },
  { k: "Ideal stay", v: "3 – 5 nights" },
  { k: "Card payments", v: "Widely accepted at resorts" },
  { k: "Cash", v: "EGP outside the resorts" },
  { k: "Mobile signal", v: "Good throughout" },
  { k: "Water", v: "Bottled only" },
  { k: "Booking method", v: "Enquiry — 24hr response" },
];

const HIGHLIGHTS = [
  "Marassi Water World — the coast's family water park",
  "El Alamein battlefield & museum",
  "Commonwealth War Graves cemetery",
  "Almaza Bay — clearest water on the Egyptian Mediterranean",
  "Marassi Marina — sunset from the waterfront",
  "Hidden fishing villages — off the coastal highway",
];

export default function NorthCoastTravelTipsPage() {
  useReveal();
  const c = useSiteContent();
  // Hero
  const heroEyebrow = pickContent(c, "nc_tips.hero.eyebrow", "North Coast");
  const heroTitle = pickContent(c, "nc_tips.hero.title", "Travel tips for");
  const heroPre = pickContent(c, "nc_tips.hero.italic_pre", "Egypt's");
  const heroItalic = pickContent(c, "nc_tips.hero.italic", "North Coast.");
  const heroBody = pickContent(
    c,
    "nc_tips.hero.body",
    `Stretching west of Alexandria along the Mediterranean — our stays cover ${NORTH_COAST.geography.coastlineCovered} — Egypt's North Coast is a destination most Egyptians know as "the Sahel", and one that rewards knowing before you arrive. From a private yacht off Marassi to a long dinner by the sea, these tips will help you plan the right coastal escape in Egypt.`,
  );
  const stat1V = pickContent(c, "nc_tips.hero.stat1_value", "~3 hrs");
  const stat1L = pickContent(c, "nc_tips.hero.stat1_label", "From Cairo");
  const stat2V = pickContent(c, "nc_tips.hero.stat2_value", "Apr–Jun · Sep–Nov");
  const stat2L = pickContent(c, "nc_tips.hero.stat2_label", "Best season");
  const stat3V = pickContent(c, "nc_tips.hero.stat3_value", "3–5");
  const stat3L = pickContent(c, "nc_tips.hero.stat3_label", "Ideal nights");
  // Siwa cross-link
  const xTitle = pickContent(c, "nc_tips.crosslink.title", "Also visiting");
  const xItalic = pickContent(c, "nc_tips.crosslink.italic", "Siwa Oasis?");
  const xBody = pickContent(
    c,
    "nc_tips.crosslink.body",
    "Separate travel tips cover Siwa — the 8-hour drive through the Western Desert, the best season, what to bring, and how everything is different once you leave the coast behind.",
  );
  const xCta = pickContent(c, "nc_tips.crosslink.cta", "Siwa travel tips →");
  // Closing
  const closingTitle = pickContent(c, "nc_tips.closing.title", "Ready to experience");
  const closingPre = pickContent(c, "nc_tips.closing.italic_pre", "the");
  const closingItalic = pickContent(c, "nc_tips.closing.italic", "North Coast?");
  const closingBody = pickContent(
    c,
    "nc_tips.closing.body",
    "Accommodation, experiences, and private transport — arranged by a team that knows both sides of this coast. Tell us your dates and we'll put it together.",
  );
  const closingPrimary = pickContent(c, "nc_tips.closing.primary_cta", "Begin your stay");
  const closingSecondary = pickContent(c, "nc_tips.closing.secondary_cta", "Explore the North Coast");
  const fromPrices = useNcFromPrices();
  const QUICK_REF: { k: string; v: string }[] = [
    ...QUICK_REF_STATIC.slice(0, -1),
    { k: "Accommodation", v: fmtFrom(fromPrices.stay, "/ night") },
    { k: "Experiences", v: fmtFrom(fromPrices.experience, "/ person") },
    ...QUICK_REF_STATIC.slice(-1),
  ];

  return (
    <>
      <SEO
        title="Travel Tips for Egypt's North Coast — Soléi"
        description="Long-form travel guide for Egypt's Mediterranean coast — transport, season, culture, stays, experiences, food, health, and practical budget tips."
        path="/north-coast-travel-tips"
      />
      <Nav darkHero={false} />

      <main>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-coastal px-6 md:px-12 lg:px-20 pt-32 pb-16 md:pb-20">
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
                {heroPre} <em className="italic text-gold">{heroItalic}</em>
              </h1>
            </div>

            <div className="animate-fade-up animation-delay-600 pb-2">
              <p className="text-[0.9rem] text-white/40 leading-[1.95] mb-8">
                {heroBody}
              </p>
              <div className="flex gap-10 border-t border-white/10 pt-6">
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
                  Marassi is about three hours from central Cairo (Almaza
                  Bay about 4.5) — the Desert Road is faster and more
                  consistent.
                  The Coastal Road adds about 40 minutes but gives you the
                  Mediterranean for the final stretch. We recommend the
                  Coastal Road for arrivals: it frames the destination
                  correctly. The Desert Road for departures: efficient and
                  without sentiment.
                </p>
                <p>
                  Depart before 9am to avoid Cairo traffic. Summer weekends
                  (Thursday–Saturday) are particularly congested — the
                  Thursday run to the coast and the Saturday evening road
                  back to Cairo in peak season are among Egypt's most
                  reliably unpleasant driving experiences.
                </p>
                <TipBox label="Soléi tip">
                  We arrange private vehicles from Cairo from{" "}
                  <strong>$80 per vehicle</strong>. No shared transfers.
                  Flight tracking included for airport pickups.{" "}
                  <Link href="/north-coast/transportation">
                    View transport options →
                  </Link>
                </TipBox>
              </SubBlock>

              <SubBlock title="Getting around locally">
                <p>
                  Within the North Coast, a private vehicle is the only
                  practical option. The three main areas — Marassi, Almaza
                  Bay, and El Alamein — are spread over{" "}
                  {NORTH_COAST.geography.coastlineCovered}, with no public
                  transport between them. Almaza Bay is the furthest west
                  and El Alamein the furthest east, with Marassi between.
                  We arrange all within-coast transfers: Marassi to Almaza
                  Bay (~1.5–2 hours west, from $40), Marassi to El Alamein
                  (~20–30 min east, from $25), and on-demand property-to-experience transfers
                  from $20.
                </p>
              </SubBlock>

              <SubBlock title="Airports">
                <p>
                  El Alamein International is the closest airport to
                  Marassi and El Alamein, with mostly seasonal flights.
                  Borg El Arab (Alexandria) is{" "}
                  {NORTH_COAST.travelTimes.fromBorgElArab}, and Marsa
                  Matrouh is the closest to Almaza Bay. Cairo International
                  is about three hours by private vehicle and serves most
                  international arrivals. We arrange pickups from all of
                  them, with flight tracking included.
                </p>
              </SubBlock>
            </TipSection>

            {/* 2. Best Time */}
            <TipSection num="02" id="best-time" title="Best time " titleItalic="to visit.">
              <SubBlock title="Peak season: July to August — busy and hot">
                <p>
                  Summer is when the North Coast is most alive — Egyptians
                  from Cairo and Alexandria descend en masse, resorts
                  operate at full capacity, and the sea is at its warmest.
                  The social energy is high and the coast takes on a
                  particular rhythm. Prices are at their highest. If you
                  want the coast at its most vibrant, this is the time —
                  but book accommodation months in advance and avoid
                  travelling on long weekend days.
                </p>
              </SubBlock>

              <SubBlock title="Shoulder season: April to June, September to November — our recommendation">
                <p>
                  The sea is warm and swimmable, the light is exceptional
                  for photography, and the coast operates without the summer density.
                  Prices are lower. Experiences are bookable with
                  reasonable lead time rather than months in advance. This
                  is when the coast reveals its actual character rather
                  than its party version.
                </p>
                <TipBox label="Best months">
                  <strong>{NORTH_COAST.bestMonths}</strong> — warm sea,
                  excellent light, low density. The North Coast at
                  its most honest.
                </TipBox>
              </SubBlock>

              <SubBlock title="Winter: December to March — quietest period">
                <p>
                  Some resort facilities close or reduce hours. The sea is
                  cooler (17–20°C) but swimmable for hardy swimmers. The
                  El Alamein museum and cemeteries are excellent in winter
                  — quieter, better light, and no heat. Prices are at their
                  lowest. For guests who want the coast to themselves,
                  winter is the right call.
                </p>
              </SubBlock>

              <SubBlock title="Weather considerations">
                <p>
                  The Mediterranean coast has occasional winter rain
                  (November–February) and is susceptible to strong
                  westerly winds. Summer is reliably hot and dry — 30–35°C
                  with high humidity. The sea breeze makes it tolerable,
                  but midday sun in July and August is intense. Carry SPF
                  regardless of season.
                </p>
              </SubBlock>
            </TipSection>

            {/* 3. Culture */}
            <TipSection num="03" id="culture" title="Local culture " titleItalic="& etiquette.">
              <SubBlock>
                <p>
                  The North Coast occupies an interesting cultural position
                  in Egypt — the resort zone is internationally relaxed in
                  its norms, while the towns and communities beyond the
                  resort perimeter follow more conservative Egyptian
                  expectations. This contrast is important to understand
                  and navigate correctly.
                </p>
              </SubBlock>

              <SubBlock title="Dress code">
                <p>
                  Within the resort property: standard beach and poolside
                  norms apply. Swimwear, cover-ups, casual resort wear.
                  Evenings at fine dining venues: smart casual is expected
                  at the better restaurants. Outside the resort perimeter
                  — in towns, at El Alamein, on the coastal road — modest
                  dress is appropriate. Shoulders and knees covered.
                </p>
              </SubBlock>

              <SubBlock title="Friday and weekend culture">
                <p>
                  Friday is the day of rest and prayer. Outside the resort
                  zone, shops and local businesses close or operate reduced
                  hours on Friday morning. The resorts themselves operate
                  normally. Weekend traffic on the Coastal Road (Egyptian
                  holidaymakers travel for the Thursday–Saturday weekend)
                  is heavy in summer — factor this into your own travel
                  timing.
                </p>
              </SubBlock>

              <SubBlock title="Photography">
                <p>
                  Within the resort areas, photography is unrestricted. At
                  El Alamein's military cemeteries and museum, photography
                  is permitted for personal use — exercise the discretion
                  appropriate to a place of historical memory. Always ask
                  before photographing local people in towns beyond the
                  resort zone.
                </p>
              </SubBlock>

              <SubBlock title="Tipping convention">
                <p>
                  At resort properties, a service charge is typically
                  included in the bill (10–15%). Additional tipping is
                  optional but appreciated, particularly for individual
                  staff members. For guides and drivers arranged through
                  Soléi: EGP 100–200 per day for a guide, EGP 50–100 per
                  day for a driver. Cash tips go directly to the
                  individual.
                </p>
              </SubBlock>

              <SubBlock title="The El Alamein dimension">
                <p>
                  El Alamein is not only a coastal resort area — it is one
                  of the Second World War's most significant battlefields
                  and home to the Commonwealth War Graves Commission
                  cemetery. If you visit, approach with appropriate
                  respect. The museum is genuinely excellent and
                  undervisited. The cemetery is moving in a way that the
                  resort zone twenty minutes away makes it easy to forget
                  is nearby.
                </p>
              </SubBlock>
            </TipSection>

            {/* 4. Where to Stay */}
            <TipSection num="04" id="where-to-stay" title="Where " titleItalic="to stay.">
              <SubBlock title={`Marassi — ${NORTH_COAST.properties.filter((p) => p.area === "Marassi").length} properties`}>
                <p>
                  Marassi is the most developed area and the natural home
                  of the North Coast's luxury resort category. Address
                  Beach Resort Marassi is the flagship — private beach,
                  multiple pools, sea-facing rooms, and a level of service
                  that understands the difference between attentive and
                  intrusive. Vida Marina Resort offers marina views and a
                  more social energy. Address Marassi Golf Resort for the
                  18-hole course with Mediterranean backdrops. Al Alamein
                  Hotel, inside Marassi at Sidi Abdel Rahman, for older
                  character and a seafront position.
                </p>
              </SubBlock>

              <SubBlock title="Boutique stays">
                <p>
                  If you want something with more character than the large
                  resort complexes, Al Alamein Hotel is the one we point
                  to — older, quieter, and less of a production than the
                  newer Marassi resorts around it.
                </p>
              </SubBlock>

              <SubBlock title="Almaza Bay properties">
                <p>
                  Further west — about 130 km past Marassi, near Marsa
                  Matrouh — and quieter, Almaza Bay consistently
                  offers the clearest water on the Egyptian Mediterranean.
                  Jaz Almaza Beach Resort is our property there and an
                  excellent choice for guests who prioritise sea quality
                  over the social energy of Marassi. All-inclusive
                  available but not compulsory.
                </p>
              </SubBlock>

              <SubBlock title="El Alamein">
                <p>
                  Rixos Premium Alamein, just east of Marassi, for the most
                  comprehensive all-inclusive experience on the coast —
                  families particularly well served, and the El Alamein
                  museum and cemeteries are close by.
                </p>
                <TipBox label="Booking note">
                  All North Coast accommodation books through enquiry — not
                  instant booking. Submit your request and we confirm with
                  the property within 24 hours, then send a secure payment
                  link.{" "}
                  <Link href="/north-coast/accommodation">
                    View all {NORTH_COAST.properties.length} properties →
                  </Link>
                </TipBox>
              </SubBlock>
            </TipSection>

            {/* 5. Experiences */}
            <TipSection num="05" id="experiences" title="Must-try " titleItalic="experiences.">
              <SubBlock title="A private yacht on the open Mediterranean">
                <p>
                  Your own boat and crew, from a short hour off the marina
                  to a full day at sea. The coast looks completely
                  different from the water — the resorts recede, the scale
                  of the Mediterranean becomes apparent, and the light in
                  the last forty minutes before sunset is extraordinary.
                  The experience most guests name first when they describe
                  what made the North Coast feel like somewhere.{" "}
                  <Link href={ncExperienceHref("private-yacht-sunset-ritual")}>
                    Private Yacht Experience →
                  </Link>
                </p>
              </SubBlock>

              <SubBlock title="Days by the water">
                <p>
                  A reserved day at one of the coast's beach clubs — a
                  proper sunbed, service, and the summer crowd at its best
                  — or, for families, a day at Marassi Water World.
                  Beyond what we arrange, most resort water sports centres
                  offer snorkelling, paddleboarding, and kayaking.{" "}
                  <Link href={ncExperienceHref("beach-club-experience")}>
                    Beach Club →
                  </Link>{" "}
                  <Link href={ncExperienceHref("marassi-water-world-experience")}>
                    Marassi Water World →
                  </Link>
                </p>
              </SubBlock>

              <SubBlock title="Evenings: dinner and nightlife">
                <p>
                  The coast comes alive after dark in summer. A Signature
                  Dinner gets you a reserved table somewhere worth
                  dressing for; our Nightlife experience gets you into the
                  season's venues without the queue or the guesswork.{" "}
                  <Link href={ncExperienceHref("signature-dinner-experience")}>
                    Signature Dinner →
                  </Link>{" "}
                  <Link href={ncExperienceHref("nightlife-experience")}>
                    Nightlife →
                  </Link>
                </p>
              </SubBlock>

              <SubBlock title="A spa day">
                <p>
                  The slowest day of the trip, deliberately. A Luxury Spa
                  session at one of the partner resorts is the right
                  counterweight to a day on the boat or a late night.{" "}
                  <Link href={ncExperienceHref("coastal-wellness-ritual")}>
                    Luxury Spa →
                  </Link>
                </p>
                <TipBox label="Booking note">
                  All {NORTH_COAST.experienceSlugs.length} North Coast
                  experiences are arranged by our team — not instant
                  booking. Current prices and terms are on each
                  experience's page. Enquire at least 48 hours before your
                  preferred date. Summer weekends require significantly
                  more lead time.
                </TipBox>
              </SubBlock>
            </TipSection>

            {/* 6. Food */}
            <TipSection num="06" id="food" title="Food " titleItalic="& dining.">
              <SubBlock title="The food of the coast">
                <p>
                  The North Coast's culinary identity is primarily
                  Mediterranean — fresh seafood, grilled fish, mezze, and
                  the lighter Egyptian repertoire that the sea and the
                  coast tradition produce. The major resort properties
                  have multiple restaurants covering Egyptian,
                  international, and Mediterranean cuisine. Quality is
                  consistently high at the properties in our portfolio.
                </p>
              </SubBlock>

              <SubBlock title="Egyptian favourites">
                <p>
                  Beyond the resort restaurants, coastal towns have small
                  local spots serving the North Coast seafood tradition —
                  grilled fish caught that morning, calamari, and the
                  particular Egyptian coastal salad culture that is more
                  interesting than the generic tourist menu suggests. We
                  know the ones worth going to and include them in our
                  guest recommendations after booking.
                </p>
              </SubBlock>

              <SubBlock title="Dining highlights">
                <p>
                  The North Coast has a genuine food scene that most
                  resort guests miss by staying within the property. Our{" "}
                  <Link href={ncExperienceHref("signature-dinner-experience")}>
                    Signature Dinner
                  </Link>{" "}
                  books you a table at one of the coast's best restaurants,
                  and after booking we share the local seafood spots we
                  know — off the main strip, no tourist markup, the catch
                  of that morning.
                </p>
              </SubBlock>

              <SubBlock title="All-inclusive vs independent dining">
                <p>
                  Rixos Premium Alamein operates full all-inclusive —
                  drinks, meals, and most activities included. The other
                  properties offer room-only or half-board. Our view:
                  all-inclusive makes sense for families or guests who
                  specifically want a contained experience. For guests who
                  want to explore the coast's food culture, room-only
                  gives the flexibility to eat where the experience
                  warrants it.
                </p>
              </SubBlock>
            </TipSection>

            {/* 7. Health & Safety */}
            <TipSection num="07" id="health" title="Health " titleItalic="& safety.">
              <SubBlock title="Sun & heat protection">
                <p>
                  The Egyptian Mediterranean sun is stronger than its
                  European equivalent at the same latitude. High SPF
                  (50+) sunscreen, a hat, and sunglasses are essential for
                  beach and pool time. Reapply regularly — the sea breeze
                  makes it easy to underestimate UV exposure. Children
                  especially need consistent attention to sun protection
                  throughout the day.
                </p>
              </SubBlock>

              <SubBlock title="Water safety">
                <p>
                  Drink bottled water — not tap water from the resort or
                  outside. All major resort properties supply bottled
                  water. The sea is safe for swimming throughout the
                  resort areas; follow any red flag warnings (uncommon but
                  worth respecting). Jellyfish appear occasionally in late
                  summer — ask resort staff about current conditions
                  before open-water activities.
                </p>
              </SubBlock>

              <SubBlock title="Medical facilities">
                <p>
                  Major resort complexes have on-site medical facilities
                  or contracted physicians. Marsa Matrouh city (west, near
                  Almaza Bay) has hospital infrastructure. Alexandria
                  (about 1.5–2 hours east of Marassi) has the most
                  comprehensive medical services near the coast. Bring prescription medications for the
                  full duration of your stay. Travel insurance with
                  medical coverage is advisable.
                </p>
              </SubBlock>

              <SubBlock title="Road safety">
                <p>
                  Egyptian highway driving requires attention, particularly
                  on the Coastal Road during summer peak hours. Night
                  driving on the Desert Road is not recommended for
                  self-drive guests unfamiliar with the route. All
                  vehicles we arrange have experienced, vetted drivers —
                  if you're renting independently, drive defensively and
                  avoid the road at peak hours on long weekends.
                </p>
                <WarnBox label="Summer driving note">
                  Weekend (Thursday–Saturday) traffic on the Cairo–North
                  Coast roads in July and August is among Egypt's most
                  congested. Travel Sunday–Wednesday if your schedule
                  allows it.
                </WarnBox>
              </SubBlock>
            </TipSection>

            {/* 8. Practical */}
            <TipSection num="08" id="practical" title="Practical tips " titleItalic="& budget." last>
              <SubBlock title="Money & payments">
                <p>
                  Major credit cards (Visa, Mastercard) are widely accepted
                  inside the resorts — at all properties in our portfolio
                  and at most resort restaurants. Carry Egyptian Pounds
                  (EGP) in cash for anything outside the resort zone — towns,
                  roadside stops, tips for local guides and drivers. ATMs
                  are available within the major resort developments
                  (Marassi has multiple). All
                  Soléi bookings are settled in USD via secure
                  payment links.
                </p>
              </SubBlock>

              <SubBlock title="Connectivity">
                <p>
                  Mobile signal is good throughout the North Coast resort
                  areas — significantly better than Siwa. All major
                  resort properties have Wi-Fi throughout their
                  facilities. Egyptian SIM cards (Vodafone, Orange)
                  provide reliable coverage on the Coastal Road. Download
                  any offline navigation as backup but you're unlikely to
                  need it.
                </p>
              </SubBlock>

              <SubBlock title="What to bring">
                <InfoList
                  items={[
                    "Sunscreen SPF 50+ — Egyptian Mediterranean sun is stronger than it looks",
                    "Light cover-up or linen layer for evenings and towns",
                    "Swimwear and a change of clothes for beach and sea activities",
                    "Comfortable walking shoes if you plan to visit the El Alamein museum and cemeteries",
                    "Egyptian Pounds cash for outside the resort zone",
                    "Motion sickness medication if prone — for time on the yacht, especially outside summer",
                    "Smart-casual evening wear for dinners and nightlife",
                    "Camera for coastline and sunset photography from the water",
                  ]}
                />
              </SubBlock>

              <SubBlock title="Budget guide">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mt-3">
                  {[
                    {
                      title: "Accommodation",
                      text: `${fmtFrom(fromPrices.stay, "per night")}; rates vary by property and season — see each property page. Rixos Premium Alamein is all-inclusive. Enquiry-based booking for all properties.`,
                    },
                    {
                      title: "Experiences",
                      text: `${fmtFrom(fromPrices.experience, "per person")}; current prices on each experience page. All enquiry-based.`,
                    },
                    {
                      title: "Transportation",
                      text: "Cairo–North Coast from $80 per vehicle. Within-coast transfers from $15. Cairo day trip from $140.",
                    },
                    {
                      title: "Food outside resort",
                      text: "Local seafood restaurants: EGP 200–500 per person. Resort dining: EGP 500–1500 per person at dinner.",
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

              <div className="mt-8">
                <TipBox label="A final note">
                  Most guests who come to the North Coast and stay within
                  the resort perimeter the entire time leave having had a
                  fine holiday. Those who take the yacht out at sunset, spend a
                  day at a beach club, and book a long dinner by the sea
                  leave having had something they can't quite explain to
                  people at home. The experiences are close, and they're
                  the reason the coast is worth
                  coming to rather than just flying to the Red Sea.
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

            {/* Quick reference — coastal variant */}
            <div className="bg-coastal overflow-hidden">
              <div
                className="px-6 py-4 border-b border-white/10"
                style={{ background: "rgba(9,24,32,0.25)" }}
              >
                <p className="text-[0.56rem] tracking-[0.3em] uppercase text-white/60">
                  Quick Reference
                </p>
              </div>
              <div className="py-3">
                {QUICK_REF.map((r, i, arr) => (
                  <div
                    key={r.k}
                    className={`flex justify-between items-center px-6 py-2.5 ${
                      i === arr.length - 1 ? "" : "border-b border-white/7"
                    }`}
                  >
                    <span className="text-[0.68rem] text-white/40">
                      {r.k}
                    </span>
                    <span className="text-[0.72rem] text-white font-normal text-right max-w-[55%]">
                      {r.v}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coastal highlights */}
            <div className="bg-white border border-sand p-5">
              <p className="text-[0.56rem] tracking-[0.28em] uppercase text-gold mb-3">
                Coastal highlights
              </p>
              <ul className="list-none">
                {HIGHLIGHTS.map((loc, i, arr) => (
                  <li
                    key={loc}
                    className={`flex gap-3 items-start py-2.5 text-[0.78rem] text-ink-soft leading-[1.6] ${
                      i === arr.length - 1 ? "" : "border-b border-sand/50"
                    }`}
                  >
                    <span className="font-display italic text-[0.78rem] text-coastal/70 min-w-[18px]">
                      {i + 1}.
                    </span>
                    <span>{loc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sidebar links */}
            <SidebarLink
              href="/north-coast/accommodation"
              title="North Coast"
              titleItalic="accommodation"
              desc={`${NORTH_COAST.properties.length} curated properties across Marassi, Almaza Bay, and El Alamein. Enquiry-based booking.`}
              cta="View properties"
            />
            <SidebarLink
              href="/north-coast/experiences"
              title="North Coast"
              titleItalic="experiences"
              desc={`${NORTH_COAST.experienceSlugs.length} curated experiences — ${Object.values(NC_EXPERIENCE_NAMES).slice(0, 3).join(", ")} and more.`}
              cta="View experiences"
            />
            <SidebarLink
              href="/north-coast-faq"
              title="North Coast"
              titleItalic="FAQ"
              desc="29 questions answered — planning, booking, arriving, and how the enquiry process works."
              cta="Read the FAQ"
            />
          </aside>
        </section>

        {/* ── SIWA CROSSLINK ───────────────────────────────────── */}
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
              href="/siwa-travel-tips"
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
              {closingTitle}
              <br />
              {closingPre} <em className="italic text-gold">{closingItalic}</em>
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
                href="/north-coast"
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
      <p className="font-display italic text-[0.78rem] text-coastal/65 mb-2">
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
          <span className="block w-4 h-px bg-coastal opacity-50 flex-shrink-0" />
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
    <div className="bg-white border border-sand border-l-[3px] border-l-coastal px-5 py-4 my-4">
      <p className="text-[0.55rem] tracking-[0.28em] uppercase text-coastal mb-1.5">
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
