import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { useReveal } from "@/components/home/useReveal";
import { useSiteContent } from "@/lib/useSiteContent";

/* ──────────────────────────────────────────────────────────────
 *  /north-coast-faq
 *
 *  North Coast FAQ. Coastal-blue header. Same structure as the
 *  Siwa FAQ — sticky section filter bar, search with live
 *  match-count + auto-open-single-result, sidebar TOC, scroll-
 *  spy, accordion with one-at-a-time toggling.
 * ────────────────────────────────────────────────────────────── */

type SectionId =
  | "planning"
  | "accommodation"
  | "experiences"
  | "transportation"
  | "practical";

interface FaqItem {
  q: string;
  a: React.ReactNode;
}

interface FaqSection {
  id: SectionId;
  eyebrow: string;
  headline: string;
  headlineItalic: string;
  label: string;
  items: FaqItem[];
}

/** Recursively extract plain text from a ReactNode tree for search. */
function extractText(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join(" ");
  if (typeof node === "object" && "props" in node) {
    return extractText(
      (node as { props: { children?: React.ReactNode } }).props.children,
    );
  }
  return "";
}

const SECTIONS: FaqSection[] = [
  {
    id: "planning",
    eyebrow: "Planning your trip",
    headline: "Before you",
    headlineItalic: "decide.",
    label: "Planning your trip",
    items: [
      {
        q: "When is the best time to visit Egypt's North Coast?",
        a: (
          <>
            <p>
              April to June and September to November are the best months.
              The sea is warm, the coast is calm, and the resort
              infrastructure isn't at full summer capacity. The light in
              shoulder season is also significantly better than the flat
              glare of July and August.
            </p>
            <p>
              July and August are peak summer season — the North Coast at
              this time is crowded, expensive, and operating at a pace that
              makes it hard to find the quiet that makes the destination
              worthwhile. If summer is unavoidable, go mid-week and stay
              away from the long weekend crowds.
            </p>
            <p>
              December to March is the quietest period. Some resort
              facilities close or operate reduced hours. The sea is cool but
              swimmable. Prices are lower and the coast returns to
              something close to its actual character.
            </p>
          </>
        ),
      },
      {
        q: "How long should I spend on the North Coast?",
        a: (
          <>
            <p>
              Three nights is the most common and most satisfying stay. One
              night to arrive and find your footing. One full day — a
              morning experience and an afternoon on the beach. One day
              with a coastal activity and dinner somewhere worth going to.
              A morning departure.
            </p>
            <p>
              Two nights is workable if you've been before. Five or more
              nights makes sense for families or guests who specifically
              want extended coastal time without wanting to do much beyond
              settling into a rhythm of sea and meals.
            </p>
            <p>
              Unlike Siwa — where more time consistently produces a better
              stay — the North Coast has a natural ceiling. After five
              nights, most guests have found what the coast offers. More
              time than that is a matter of preference, not necessity.
            </p>
          </>
        ),
      },
      {
        q: "What makes the North Coast different from Siwa?",
        a: (
          <>
            <p>
              They are fundamentally different experiences. The North Coast
              is Mediterranean — the sea, the light, the pace, the food,
              the feel. Siwa is desert — isolated, ancient, and a completely
              different register of travel.
            </p>
            <InfoCard
              title="Key differences at a glance"
              items={[
                <>
                  <strong>Distance from Cairo:</strong> North Coast ~2.5 hrs
                  · Siwa ~8 hrs
                </>,
                <>
                  <strong>Environment:</strong> North Coast = Mediterranean
                  sea · Siwa = Desert oasis
                </>,
                <>
                  <strong>Accommodation:</strong> North Coast = partner
                  hotels · Siwa = partner + 3 Soléi-owned
                </>,
                <>
                  <strong>Booking:</strong> North Coast = enquiry-based ·
                  Siwa = direct on site
                </>,
                <>
                  <strong>Best season:</strong> North Coast = Apr–Jun,
                  Sept–Nov · Siwa = Oct–Apr
                </>,
                <>
                  <strong>Primary draw:</strong> North Coast = sea, coast,
                  resort · Siwa = silence, desert, ancient culture
                </>,
              ]}
            />
          </>
        ),
      },
      {
        q: "Can I do the North Coast as a day trip from Cairo?",
        a: (
          <>
            <p>
              Yes — the North Coast is the only Egyptian coastal
              destination that's genuinely feasible as a day trip from
              Cairo. Two and a half hours each way means you can leave
              before 7am, have a full day on the coast, and return to Cairo
              by evening.
            </p>
            <p>
              We offer a full-day{" "}
              <Link href="/north-coast/transportation">
                Cairo day trip vehicle
              </Link>{" "}
              from €140 — private vehicle with a driver for the full day,
              flexible itinerary, return in the evening. Best suited to
              guests who want a taste of the coast without committing to an
              overnight stay.
            </p>
            <p>
              That said, one night at minimum is what allows the coast to
              actually feel like somewhere rather than a logistics exercise.
              The day trip is a viable option but not the one we'd recommend
              if your schedule allows an overnight.
            </p>
          </>
        ),
      },
      {
        q: "Is the North Coast suitable for families?",
        a: (
          <>
            <p>
              Yes — it is arguably better suited to families than Siwa. The
              large resort complexes (Rixos Premium Alamein, Address Beach
              Resort Marassi) have dedicated kids clubs, water parks, and
              multiple pools. The drive from Cairo is manageable for
              children at 2.5 hours. The beach environment is familiar and
              the activities are accessible.
            </p>
            <p>
              For families, Marassi's properties are the most comprehensive
              — specifically Rixos Premium Alamein for all-inclusive family
              stays and Address Beach Resort Marassi for families who want
              luxury without full all-inclusive. Jaz Almaza Beach Resort at
              Almaza Bay is also an excellent family option with some of
              the clearest water on the coast.
            </p>
          </>
        ),
      },
      {
        q: "Which area should I stay in — Marassi, Almaza Bay, or El Alamein?",
        a: (
          <>
            <p>
              <strong>Marassi</strong> is the most developed and the most
              social. Four properties, a marina, multiple restaurant and
              activity options, and the most comprehensive infrastructure
              on the coast. Best for guests who want the full resort
              experience and don't mind being in the midst of it.
            </p>
            <p>
              <strong>Almaza Bay</strong> is quieter and has the clearest
              water on the coast. Two properties — one larger resort, one
              boutique. Best for guests who want excellent sea quality and
              a slightly lower density than Marassi.
            </p>
            <p>
              <strong>El Alamein</strong> is the quietest and carries
              significant historical weight. The WWII battlefield, museum,
              and cemetery are thirty minutes away. Rixos Premium is
              comprehensive and self-contained. Al Alamein Hotel is older
              and more characterful. Best for guests who want coastal rest
              combined with something historically serious.
            </p>
            <p>
              Still not sure? <Link href="/enquire">Tell us what matters</Link>{" "}
              and we'll recommend the right fit.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "accommodation",
    eyebrow: "Accommodation",
    headline: "Staying on the",
    headlineItalic: "North Coast.",
    label: "Accommodation",
    items: [
      {
        q: "How does booking North Coast accommodation work?",
        a: (
          <>
            <p>
              North Coast accommodation is enquiry-based — unlike Siwa,
              where everything books directly on site. Submit your dates,
              property preference, and guest count. Our team contacts the
              hotel directly to confirm your exact room type — not just
              general availability — and sends a secure payment link via
              WhatsApp or email within 24 hours.
            </p>
            <p>
              No payment is taken until availability is confirmed. This is
              a deliberate choice: North Coast properties are partner
              hotels (not our own), and we want to make sure what we send
              you is exactly right before asking you to pay for it.
            </p>
          </>
        ),
      },
      {
        q: "Why is North Coast booking enquiry-based when Siwa books directly?",
        a: (
          <>
            <p>
              Two reasons. First, we don't own any of the North Coast
              properties — they are all partner hotels. Siwa has our three
              Soléi-owned lodges and long-established direct booking
              connections with partner properties. The North Coast
              relationships are newer and the live inventory connection is
              not yet built.
            </p>
            <p>
              Second, North Coast properties have more complex room type
              availability than Siwa lodges. A large resort has dozens of
              room categories and the availability picture changes
              constantly. Confirming directly with the hotel ensures you
              get exactly what you want, not just whatever the system says
              is open.
            </p>
            <p>
              The process takes up to 24 hours. Most enquiries are confirmed
              same day.
            </p>
          </>
        ),
      },
      {
        q: "How does the payment link work?",
        a: (
          <>
            <p>
              Once we've confirmed availability with your chosen property,
              we generate a secure payment link via Tab.travel and send it
              to you via WhatsApp or email — whichever you prefer. You
              click the link, review the booking details, and pay in EUR or
              USD. No account required. No payment information stored on
              our end.
            </p>
            <p>
              After payment you receive a booking confirmation with your
              reservation number, check-in details, and our personal
              recommendations for the property and the coast.
            </p>
          </>
        ),
      },
      {
        q: "Which North Coast property do you recommend most?",
        a: (
          <>
            <p>
              It depends entirely on what kind of stay you want. Our honest
              assessments:
            </p>
            <InfoCard
              title="Property recommendations by guest type"
              items={[
                <>
                  <strong>Best overall:</strong> Address Beach Resort
                  Marassi — the most consistently excellent property on the
                  coast for guests who want genuine luxury.
                </>,
                <>
                  <strong>Best for character:</strong> Casa Cook North Coast
                  — the most distinctive design, the most considered
                  atmosphere. Not a traditional resort.
                </>,
                <>
                  <strong>Best for families:</strong> Rixos Premium Alamein
                  — ultra all-inclusive, kids waterpark, extensive
                  facilities.
                </>,
                <>
                  <strong>Best water:</strong> Jaz Almaza Beach Resort —
                  Almaza Bay consistently has the clearest sea on the North
                  Coast.
                </>,
                <>
                  <strong>Best for couples:</strong> Vida Marina Resort
                  Marassi or Casa Cook — both suited to guests who want
                  quality without the family-resort energy.
                </>,
                <>
                  <strong>Best for golfers:</strong> Address Marassi Golf
                  Resort — 18-hole championship course, sea views from the
                  fairways.
                </>,
              ]}
            />
          </>
        ),
      },
      {
        q: "What is the difference between Marassi and Almaza Bay properties?",
        a: (
          <>
            <p>
              About an hour's drive east along the coastal road separates
              them, and the atmosphere shifts noticeably. Marassi is
              bigger, more developed, and has more activity. Four
              properties, a marina, multiple restaurants and shops. It is
              the social centre of the North Coast.
            </p>
            <p>
              Almaza Bay is quieter, less developed, and has genuinely
              superior water quality — consistently described as the
              clearest sea on the Egyptian Mediterranean. Two properties
              (Jaz Almaza Beach and The G Hotel Seashell), both of which
              suit guests who want excellent sea conditions with a lower
              density of other guests around them.
            </p>
          </>
        ),
      },
      {
        q: "What is the cancellation policy for North Coast accommodation?",
        a: (
          <>
            <p>
              Cancellation policies vary by property and are stated clearly
              in the booking confirmation. Most North Coast properties
              allow free cancellation up to 7–14 days before arrival;
              cancellations within that window are charged in full or at a
              penalty rate depending on the property.
            </p>
            <p>
              We will always tell you the exact cancellation terms before
              you pay. If you need to cancel or change dates, contact us
              first — in many cases we can work with the property to find a
              solution that avoids the full penalty.
            </p>
          </>
        ),
      },
      {
        q: "Is all-inclusive worth it on the North Coast?",
        a: (
          <>
            <p>
              For families: usually yes. The all-inclusive properties
              (Rixos Premium Alamein in particular) are designed to be
              genuinely comprehensive — drinks, food, entertainment — at a
              per-person cost that makes sense for a group that would
              otherwise be buying everything à la carte at resort prices.
            </p>
            <p>
              For couples or solo guests: often no. The value calculation
              changes when there are fewer people, and the all-inclusive
              format tends to anchor you to the property in a way that
              closes off the experiences that make the North Coast worth
              visiting — the flamingo lagoons, the sunset sailing, the El
              Alamein heritage sites. Half-board or room-only gives more
              flexibility.
            </p>
            <p>
              Casa Cook operates on a non all-inclusive basis and is
              specifically designed for guests who want quality without the
              managed-consumption model.
            </p>
          </>
        ),
      },
      {
        q: "What are check-in and check-out times on the North Coast?",
        a: (
          <>
            <p>
              Standard check-in is from 3:00pm at most North Coast resorts.
              Check-out is by 12:00pm noon. Given the 2.5-hour drive from
              Cairo, an early morning departure gets you there by late
              morning — most properties will hold your luggage and let you
              access facilities (pool, beach) while your room is being
              prepared.
            </p>
            <p>
              For early arrival or late departure, mention your timing in
              your booking notes and we'll flag it to the property. Most
              can accommodate with advance notice.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "experiences",
    eyebrow: "Experiences",
    headline: "What to do on the",
    headlineItalic: "coast.",
    label: "Experiences",
    items: [
      {
        q: "How do North Coast experiences work differently from Siwa?",
        a: (
          <>
            <p>
              All North Coast experiences are arranged by our team — they
              do not book directly on site the way Siwa experiences do.
              Enquire with your preferred experience, date, and guest count.
              We confirm availability with the guide or operator, then send
              a payment link within 24 hours. No payment until confirmed.
            </p>
            <p>
              This is the same enquiry-based model as North Coast
              accommodation. The coast's experience providers are mostly
              independent local operators with whom we have personal
              relationships but no live booking integration.
            </p>
          </>
        ),
      },
      {
        q: "What experience do you recommend most for a first-time North Coast visit?",
        a: (
          <>
            <p>
              Private sunset sailing — without hesitation. It is the
              experience that changes the North Coast from "a beach resort
              stay" into "a Mediterranean coastal experience." Seeing the
              coast from open water, at the hour the light is best, is the
              single thing that most clearly shows guests what the
              destination actually is.
            </p>
            <p>
              If you have time for two: add the flamingo lagoon morning. It
              costs €45 per person, takes half a day, and produces the kind
              of reaction most guests describe as genuinely unexpected —
              they had no idea flamingos existed fifteen minutes from their
              resort.
            </p>
          </>
        ),
      },
      {
        q: "What is there to do beyond the resort pool and beach?",
        a: (
          <>
            <p>
              More than most guests realise. Our six curated North Coast
              experiences are all off-resort:
            </p>
            <InfoCard
              title="North Coast experiences"
              items={[
                <>
                  <strong>Private sunset sailing</strong> — open
                  Mediterranean, 3 hours, from €85pp
                </>,
                <>
                  <strong>Flamingo watching</strong> — the lagoons behind
                  the resort strip, half day, from €45pp
                </>,
                <>
                  <strong>Open water swimming</strong> — guided early
                  morning swims in Almaza Bay, 2 hours, from €30pp
                </>,
                <>
                  <strong>El Alamein heritage visit</strong> — WWII
                  battlefield, museum, cemetery, half day, from €35pp
                </>,
                <>
                  <strong>Private coastline drive</strong> — Cairo to
                  Matrouh by sea, full day, from €120pp
                </>,
                <>
                  <strong>Local seafood lunch</strong> — off the tourist
                  strip, fishing spots, midday, from €40pp
                </>,
              ]}
            />
          </>
        ),
      },
      {
        q: "Is the sunset sailing suitable if I've never sailed before?",
        a: (
          <>
            <p>
              Yes — no sailing experience is required or relevant. You are
              a passenger, not crew. The captain and crew manage the boat
              entirely. Your job is to sit on deck and watch the light
              change. There is no minimum ability level and no age
              restriction.
            </p>
            <p>
              The experience is weather-dependent. In the event of strong
              wind or poor sea conditions, we reschedule at no charge. The
              Mediterranean is generally calm April to November. October to
              March can be choppier — guests prone to motion sickness in
              choppy conditions should check sea conditions with us before
              confirming a winter booking.
            </p>
          </>
        ),
      },
      {
        q: "Can I add transport to an experience if I don't have a vehicle?",
        a: (
          <>
            <p>
              Yes. All North Coast experience enquiries can include a
              transport request — mention your property and we'll include a
              private vehicle from your resort to the experience meeting
              point and back. This is standard for the flamingo lagoon, El
              Alamein, the seafood lunch spot, and the marina for sunset
              sailing.
            </p>
            <p>
              The transport cost is added to your experience booking and
              covered in the same payment link.
            </p>
          </>
        ),
      },
      {
        q: "How far in advance should I book North Coast experiences?",
        a: (
          <>
            <p>
              At least 48 hours before your preferred date — ideally more.
              The sunset sailing in particular operates with a single
              private boat booking per group and fills during summer
              weekends. For July and August stays, book experiences at the
              same time as accommodation, not after arrival.
            </p>
            <p>
              Shoulder season (April–June, September–November) is more
              flexible, but 24–48 hours lead time is still the minimum for
              our team to confirm with guides and arrange logistics
              properly.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "transportation",
    eyebrow: "Transportation",
    headline: "Getting to and around the",
    headlineItalic: "coast.",
    label: "Transportation",
    items: [
      {
        q: "How do I get to the North Coast from Cairo?",
        a: (
          <>
            <p>
              By private vehicle — approximately 2.5 hours on the Desert
              Road or the Coastal Road. The Desert Road is faster and more
              consistent. The Coastal Road adds about 40 minutes but gives
              you the Mediterranean for the final stretch. We recommend the
              Coastal Road for arrivals, the Desert Road for departures.
            </p>
            <p>
              We arrange all transport with private vehicles from €80 per
              vehicle Cairo–North Coast. Depart before 9am to avoid Cairo
              traffic — Friday morning departures should be especially
              early as Friday afternoon return traffic on the Coastal Road
              is significant in summer.
            </p>
          </>
        ),
      },
      {
        q: "Is there an airport near the North Coast?",
        a: (
          <>
            <p>
              Borg El Arab Airport in Alexandria is the most practical —
              roughly 45 minutes from the start of the North Coast resort
              area. EgyptAir operates domestic connections from Cairo to
              Borg El Arab. International connections are limited.
            </p>
            <p>
              Cairo International Airport is the main international gateway
              — 2.5 hours by private vehicle to the North Coast. For most
              international guests arriving specifically for the North
              Coast, flying into Cairo and driving is the standard routing.
            </p>
            <p>
              We arrange airport pickups from both airports — Borg El Arab
              from €45 per vehicle, Cairo International from €80 per
              vehicle, with flight tracking included.
            </p>
          </>
        ),
      },
      {
        q: "How do I get between Marassi, Almaza Bay, and El Alamein?",
        a: (
          <>
            <p>
              By private vehicle — the three areas are spread over roughly
              100km of coastline and there is no public transport between
              them. We arrange all within-coast transfers:
            </p>
            <InfoCard
              title="Within-coast transfer distances"
              items={[
                <>
                  <strong>Marassi ↔ Almaza Bay:</strong> ~1 hour · From €40
                  per vehicle
                </>,
                <>
                  <strong>Marassi ↔ El Alamein:</strong> ~30 minutes · From
                  €25 per vehicle
                </>,
                <>
                  <strong>Property to experience:</strong> On-demand · From
                  €20
                </>,
                <>
                  <strong>On-demand in-area:</strong> Any point on the coast
                  · From €15
                </>,
              ]}
            />
          </>
        ),
      },
      {
        q: "What vehicles do you use for North Coast transport?",
        a: (
          <>
            <p>
              The North Coast is all paved road — no 4×4 required. Three
              vehicle types:
            </p>
            <p>
              <strong>Private SUV</strong> — standard for all routes, up to
              4 passengers, full air conditioning. The right vehicle for
              most North Coast bookings.
            </p>
            <p>
              <strong>Premium Sedan</strong> — for guests who prefer a
              quieter, more composed drive. Particularly suited to airport
              runs and the Cairo route for business or anniversary travel.
              Up to 3 passengers.
            </p>
            <p>
              <strong>Private Minivan</strong> — for groups of 5–8. Same
              private standard, ample luggage space for families. Never
              combined with other bookings.
            </p>
          </>
        ),
      },
      {
        q: "How does transportation booking and payment work?",
        a: (
          <>
            <p>
              All North Coast transportation is arranged by enquiry. Submit
              your route, date, passenger count, pickup and drop-off
              locations via the{" "}
              <Link href="/north-coast/transportation">
                transportation page
              </Link>{" "}
              or the main enquiry form. We confirm vehicle and driver
              within 24 hours and send a secure payment link. No payment
              until confirmed.
            </p>
            <p>
              If you've booked accommodation with us, we coordinate
              transport timing with your check-in automatically — no need
              to manage the two separately. For airport pickups we include
              flight tracking, so if your flight is delayed the driver
              adjusts accordingly.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "practical",
    eyebrow: "On arrival",
    headline: "Once you're",
    headlineItalic: "there.",
    label: "On arrival",
    items: [
      {
        q: "What is the mobile signal and internet like on the North Coast?",
        a: (
          <>
            <p>
              Good — significantly better than Siwa. Mobile signal
              (Vodafone and Orange) is reliable throughout the resort areas
              and the coastal road between them. All major resort
              properties have Wi-Fi throughout their facilities. Unlike
              Siwa, connectivity is not something you need to plan around.
            </p>
            <p>
              The coastal road between Cairo and the North Coast also has
              reasonable signal throughout — you won't have the
              connectivity drop-out you'd experience on the desert road to
              Siwa.
            </p>
          </>
        ),
      },
      {
        q: "What currency do I need on the North Coast?",
        a: (
          <>
            <p>
              Egyptian Pounds (EGP) for anything within resort areas —
              restaurants, shops, tips. ATMs are available within the
              resort developments (Marassi has multiple). Major credit
              cards (Visa, Mastercard) are accepted at all the larger
              resort properties.
            </p>
            <p>
              All Soléi bookings — accommodation, experiences,
              transportation — are settled in EUR or USD via our secure
              payment links. You do not need foreign currency for anything
              we arrange directly.
            </p>
          </>
        ),
      },
      {
        q: "What should I wear on the North Coast?",
        a: (
          <>
            <p>
              Within the resort properties, beach and poolside dress norms
              apply — swimwear, light cover-ups, casual resort wear.
              Evenings at resort restaurants are smart casual; some fine
              dining venues request no beachwear.
            </p>
            <p>
              Outside the resort perimeter — in nearby towns, at the El
              Alamein sites, on the coastal road — modest dress is
              appropriate. Shoulders and knees covered is the standard
              expectation. The North Coast resort zone is more
              internationally relaxed in its dress expectations than
              Egyptian towns in general, but once you leave the resort
              gates that changes.
            </p>
          </>
        ),
      },
      {
        q: "How do I reach the Soléi team during my North Coast stay?",
        a: (
          <>
            <p>
              WhatsApp — the number is in your booking confirmation. Unlike
              Siwa, where we have our own on-site team at three properties,
              the North Coast is entirely partner hotels and our contact is
              remote. If something isn't right with your accommodation,
              reach us on WhatsApp and we'll intervene with the property
              directly.
            </p>
            <p>
              For time-sensitive issues — a room that isn't ready, a
              transport that hasn't arrived, an experience that needs
              adjusting — WhatsApp is faster than email and we monitor it
              throughout the day.
            </p>
          </>
        ),
      },
    ],
  },
];

const FILTERS: { value: "all" | SectionId; label: string }[] = [
  { value: "all", label: "All questions" },
  { value: "planning", label: "Planning" },
  { value: "accommodation", label: "Accommodation" },
  { value: "experiences", label: "Experiences" },
  { value: "transportation", label: "Transportation" },
  { value: "practical", label: "On arrival" },
];

const WAVE_TEX_HERO =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23FDFAF5' stroke-opacity='0.04' stroke-width='0.5'%3E%3Cpath d='M0 30 Q15 20 30 30 Q45 40 60 30'/%3E%3Cpath d='M0 45 Q15 35 30 45 Q45 55 60 45'/%3E%3C/g%3E%3C/svg%3E\")";

export default function NorthCoastFaqPage() {
  useReveal();
  const [filter, setFilter] = useState<"all" | SectionId>("all");
  const [query, setQuery] = useState("");
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId>("planning");
  const siteContent = useSiteContent();

  // Per-section override from site_content. Stored as
  // `nc_faq.<section_id>.items` — array of { q, a } strings.
  const overrideForSection = (id: SectionId): FaqItem[] | null => {
    const raw = siteContent[`nc_faq.${id}.items`];
    if (!Array.isArray(raw) || raw.length === 0) return null;
    return raw
      .filter((it: any) => it && typeof it.q === "string" && typeof it.a === "string" && it.q.trim())
      .map((it: any) => ({
        q: it.q,
        a: (
          <>
            {it.a.split(/\n\n+/).map((p: string, i: number) => (
              <p key={i}>{p}</p>
            ))}
          </>
        ),
      }));
  };

  const q = query.trim().toLowerCase();
  const visibleBySection = useMemo(() => {
    return SECTIONS.map((section) => {
      const passesFilter = filter === "all" || filter === section.id;
      const sourceItems = overrideForSection(section.id) ?? section.items;
      if (!passesFilter) return { section, items: [] as FaqItem[] };
      const items = sourceItems.filter((item) => {
        if (!q) return true;
        const hay = (item.q + " " + extractText(item.a)).toLowerCase();
        return hay.includes(q);
      });
      return { section, items };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, q, siteContent]);

  const totalVisible = visibleBySection.reduce(
    (a, s) => a + s.items.length,
    0,
  );

  // Auto-open a single search result
  useEffect(() => {
    if (!q) return;
    const allVisible = visibleBySection.flatMap((s) =>
      s.items.map((item) => `${s.section.id}:${item.q}`),
    );
    if (allVisible.length === 1) setOpenKey(allVisible[0]);
  }, [q, visibleBySection]);

  // Scroll-spy
  useEffect(() => {
    const onScroll = () => {
      const threshold = 200;
      let current: SectionId = "planning";
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - threshold) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggle = (key: string) => {
    setOpenKey((cur) => (cur === key ? null : key));
  };

  return (
    <>
      <SEO
        title="North Coast FAQ — Soléi"
        description="Everything guests ask before visiting Egypt's Mediterranean coast — how bookings work, which properties suit which travellers, and practical differences from Siwa."
        path="/north-coast-faq"
      />
      <Nav darkHero={false} />

      <main>
        {/* ── HEADER ──────────────────────────────────────────── */}
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
                North Coast
              </p>
              <h1
                className="font-display font-normal leading-[1.1] text-white animate-fade-up animation-delay-400"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)" }}
              >
                Frequently asked
                <br />
                <em className="italic text-gold">questions.</em>
              </h1>
            </div>
            <div className="animate-fade-up animation-delay-600 pb-2">
              <p className="text-[0.9rem] text-white/40 leading-[1.95] mb-6">
                Everything guests ask before visiting Egypt's Mediterranean
                coast — how bookings work, which properties suit which
                travellers, and the practical differences from Siwa. If
                something isn't here, ask us directly.
              </p>
              <Link
                href="/siwa-faq"
                className="inline-flex items-center gap-2 text-[0.62rem] tracking-[0.18em] uppercase text-white/30 border border-white/10 px-5 py-2.5 hover:text-gold hover:border-gold/30 transition-colors"
              >
                Siwa Oasis FAQ instead →
              </Link>
            </div>
          </div>
        </section>

        {/* ── FILTER BAR ──────────────────────────────────────── */}
        <div className="sticky top-[64px] z-[40] bg-white border-b border-sand">
          <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 flex overflow-x-auto">
            {FILTERS.map((f) => {
              const active = filter === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
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
        </div>

        {/* ── SEARCH ──────────────────────────────────────────── */}
        <div className="bg-sand-light border-b border-sand px-6 md:px-12 lg:px-20 py-6">
          <div className="max-w-5xl mx-auto">
            <div className="relative max-w-lg">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-[14px] h-[14px] opacity-35 pointer-events-none text-navy"
                aria-hidden
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions…"
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body font-light focus:border-coastal outline-none placeholder:text-ink-soft/40"
              />
            </div>
          </div>
        </div>

        {/* ── MAIN LAYOUT ─────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-20 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10 lg:gap-20 items-start">
          {/* Sidebar TOC */}
          <nav className="hidden lg:block sticky top-[130px]">
            <ul className="list-none">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={`block py-3 text-[0.68rem] tracking-[0.12em] uppercase border-b border-sand-light transition-all ${
                      activeSection === s.id
                        ? "text-navy opacity-100 pl-2 border-l-2 border-l-coastal"
                        : "text-ink-soft opacity-50 hover:opacity-100 hover:text-navy hover:pl-2"
                    }`}
                  >
                    {s.label}
                    <span className="float-right text-[0.6rem] font-display italic text-coastal/65">
                      {s.items.length}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <Link
              href="/enquire"
              className="block mt-8 p-5 bg-coastal text-center hover:opacity-85 transition-opacity"
            >
              <div className="text-[0.56rem] tracking-[0.28em] uppercase text-white/50 mb-1">
                Still have questions?
              </div>
              <div className="font-display text-[0.9rem] text-white">
                Ask our team →
              </div>
            </Link>
          </nav>

          {/* Sections */}
          <div>
            {totalVisible === 0 ? (
              <p className="text-center text-ink-soft text-[0.88rem] py-16">
                No questions match your search.{" "}
                <Link
                  href="/enquire"
                  className="text-coastal border-b border-coastal/30 hover:border-coastal"
                >
                  Ask us directly →
                </Link>
              </p>
            ) : (
              visibleBySection.map(({ section, items }) => {
                if (items.length === 0) return null;
                return (
                  <div
                    key={section.id}
                    id={section.id}
                    className="reveal mb-16 pb-16 border-b border-sand last:border-b-0 last:pb-0 last:mb-0"
                  >
                    <p className="flex items-center gap-3 text-[0.58rem] tracking-[0.35em] uppercase text-gold mb-3">
                      <span className="block w-[18px] h-px bg-gold opacity-50" />
                      {section.eyebrow}
                    </p>
                    <h2
                      className="font-display font-normal text-navy mb-8"
                      style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)" }}
                    >
                      {section.headline}{" "}
                      <em className="italic text-coastal">
                        {section.headlineItalic}
                      </em>
                    </h2>

                    <div>
                      {items.map((item, i, arr) => {
                        const key = `${section.id}:${item.q}`;
                        const open = openKey === key;
                        return (
                          <div
                            key={key}
                            className={`border-t border-sand-light ${
                              i === arr.length - 1
                                ? "border-b border-sand-light"
                                : ""
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => toggle(key)}
                              className="w-full flex justify-between items-start gap-6 py-5 text-left group"
                            >
                              <span className="text-[0.92rem] text-navy font-normal leading-[1.5] group-hover:text-coastal transition-colors">
                                {item.q}
                              </span>
                              <span
                                className={`w-5 h-5 flex-shrink-0 border rounded-full flex items-center justify-center transition-all mt-0.5 ${
                                  open
                                    ? "bg-gold border-gold"
                                    : "border-sand"
                                }`}
                                aria-hidden
                              >
                                <span
                                  className={`text-[0.85rem] leading-none ${
                                    open ? "text-navy" : "text-ink-soft/60"
                                  }`}
                                >
                                  {open ? "−" : "+"}
                                </span>
                              </span>
                            </button>
                            <div
                              className={`overflow-hidden transition-[max-height,padding] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                                open ? "max-h-[2000px]" : "max-h-0"
                              }`}
                            >
                              <div className="pr-8 pb-6 text-[0.88rem] text-ink-soft leading-[1.95] faq-answer-body">
                                {item.a}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* ── STILL HAVE QUESTIONS ────────────────────────────── */}
        <section className="bg-sand-light px-6 md:px-12 lg:px-20 py-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-[2px]">
            <Link
              href="/enquire"
              className="reveal bg-coastal p-10 block hover:opacity-85 transition-opacity group"
            >
              <p className="flex items-center gap-2 text-[0.58rem] tracking-[0.28em] uppercase text-gold/75 mb-4">
                <span className="block w-[14px] h-px bg-gold opacity-50" />
                Not here?
              </p>
              <h3 className="font-display text-[1.4rem] font-normal leading-[1.3] text-white mb-3">
                Ask us <em className="italic text-gold">directly.</em>
              </h3>
              <p className="text-[0.82rem] text-white/40 leading-[1.85] mb-5">
                If your question isn't answered above, send it through. A
                person responds — usually within a few hours, always within
                24.
              </p>
              <span className="flex items-center gap-2 text-[0.6rem] tracking-[0.2em] uppercase text-white/60 group-hover:gap-3 transition-all">
                Send an enquiry →
              </span>
            </Link>
            <Link
              href="/north-coast"
              className="reveal reveal-d1 bg-white border border-sand p-10 block hover:border-gold transition-colors group"
            >
              <p className="flex items-center gap-2 text-[0.58rem] tracking-[0.28em] uppercase text-gold/75 mb-4">
                <span className="block w-[14px] h-px bg-gold opacity-50" />
                Explore the coast
              </p>
              <h3 className="font-display text-[1.4rem] font-normal leading-[1.3] text-navy mb-3">
                Destination overview
              </h3>
              <p className="text-[0.82rem] text-ink-soft leading-[1.85] mb-5">
                Accommodation, experiences, and transportation — the full
                picture of what the North Coast offers before you decide.
              </p>
              <span className="flex items-center gap-2 text-[0.6rem] tracking-[0.2em] uppercase text-gold group-hover:gap-3 transition-all">
                View North Coast →
              </span>
            </Link>
          </div>
        </section>

        {/* ── SIWA CROSSLINK ──────────────────────────────────── */}
        <section className="bg-white border-t border-sand px-6 md:px-12 lg:px-20 py-16">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="font-display text-[1.4rem] font-normal text-navy mb-2">
                Also visiting{" "}
                <em className="italic text-coastal">Siwa Oasis?</em>
              </h3>
              <p className="text-[0.84rem] text-ink-soft leading-[1.8] max-w-[60ch]">
                A separate FAQ covers everything about our desert
                destination — accommodation, experiences, the Cairo–Siwa
                journey, and what to expect from the oasis.
              </p>
            </div>
            <Link
              href="/siwa-faq"
              className="text-[0.62rem] tracking-[0.18em] uppercase text-navy border border-sand px-8 py-3.5 hover:border-gold hover:text-gold transition-colors whitespace-nowrap flex-shrink-0"
            >
              Siwa FAQ →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
 *  Info card — used inline inside FAQ answers
 * ────────────────────────────────────────────────────────────── */

function InfoCard({
  title,
  items,
}: {
  title: string;
  items: React.ReactNode[];
}) {
  return (
    <div className="bg-sand-light border border-sand px-5 py-4 mt-4">
      <p className="text-[0.6rem] tracking-[0.22em] uppercase text-gold mb-2">
        {title}
      </p>
      <ul className="list-none">
        {items.map((item, i, arr) => (
          <li
            key={i}
            className={`flex gap-3 items-start text-[0.82rem] text-ink-soft py-2 ${
              i === arr.length - 1 ? "" : "border-b border-sand/50"
            }`}
          >
            <span className="w-1 h-1 rounded-full bg-gold opacity-60 flex-shrink-0 mt-2.5" />
            <span className="leading-[1.7]">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
