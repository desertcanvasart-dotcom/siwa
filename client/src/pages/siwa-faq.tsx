import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { useReveal } from "@/components/home/useReveal";
import { useSiteContent } from "@/lib/useSiteContent";

/* ──────────────────────────────────────────────────────────────
 *  /siwa-faq
 *
 *  Siwa Oasis FAQ. Sticky section filter bar, search with live
 *  match-count, sidebar table-of-contents, 5 sections with
 *  accordion items. Accordion only allows one open at a time
 *  (matches the reference). Search auto-opens a single result.
 * ────────────────────────────────────────────────────────────── */

type SectionId =
  | "planning"
  | "accommodation"
  | "experiences"
  | "transportation"
  | "practical";

interface FaqItem {
  q: string;
  /** Rendered answer — paragraphs, optional info-card, inline links */
  a: React.ReactNode;
}

/** Recursively extract plain text from a ReactNode tree for search. */
function extractText(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join(" ");
  if (typeof node === "object" && "props" in node) {
    return extractText((node as { props: { children?: React.ReactNode } }).props.children);
  }
  return "";
}

interface FaqSection {
  id: SectionId;
  eyebrow: string;
  headline: string;
  headlineItalic: string;
  label: string;
  items: FaqItem[];
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
        q: "When is the best time to visit Siwa Oasis?",
        a: (
          <>
            <p>
              October to April is the ideal window. Temperatures are
              comfortable — warm in the afternoons, cool in the evenings and
              mornings — and the oasis is at its most alive. The salt lakes
              are calm, the desert drives are manageable, and you can sleep
              outside without discomfort.
            </p>
            <p>
              May to September is possible but demanding. Midday temperatures
              regularly exceed 40°C. Most Siwa experiences are scheduled
              early morning or at sunset for this reason, and some activities
              pause entirely in July and August. If summer is your only
              option, plan around the cooler hours and accept that you'll
              spend midday inside.
            </p>
            <p>
              <strong>Best overall months:</strong> October, November, March,
              and April — warm days, cool evenings, and good light for
              photography.
            </p>
          </>
        ),
      },
      {
        q: "How long should I spend in Siwa?",
        a: (
          <>
            <p>
              The minimum that allows you to actually feel the oasis — not
              just tick boxes — is three nights. Two nights is a common
              choice and produces a visit that feels like it ended too soon
              for almost every guest who does it.
            </p>
            <p>
              Four to five nights is the most common stay among guests who
              have travelled to reach Siwa deliberately. It allows one
              unhurried day to arrive and find your footing, two days of
              experiences, and a final morning that doesn't feel rushed.
            </p>
            <p>
              A week is not excessive. The oasis rewards time. The guests who
              leave having found what they came for are almost always the
              ones who gave it more days than they thought they needed.
            </p>
          </>
        ),
      },
      {
        q: "Can I combine Siwa with the North Coast in one trip?",
        a: (
          <>
            <p>
              Yes — and many guests do. The most common routing is North
              Coast first (two or three nights), return to Cairo or
              Alexandria, then travel to Siwa (three to five nights). The
              reverse also works but the North Coast can feel anticlimactic
              after Siwa, so starting there tends to produce a better overall
              arc.
            </p>
            <p>
              We can arrange both legs in one conversation — accommodation,
              experiences, and transportation across both destinations.{" "}
              <Link href="/enquire">Tell us your dates</Link> and we'll
              suggest how to structure it.
            </p>
          </>
        ),
      },
      {
        q: "Is Siwa suitable for families with children?",
        a: (
          <>
            <p>
              Yes. Siwa is calm, safe, and relatively easy to navigate with
              children. The salt lake float has a minimum age of 8. The
              desert drives and horseback rides are suitable for older
              children and teenagers. The oracle temple visit and Cleopatra
              Spring work at any age.
            </p>
            <p>
              The main consideration is the journey — the 8-hour drive from
              Cairo is long for young children. Breaking it with a stop in
              Marsa Matrouh is a reasonable option. From Marsa Matrouh it is
              only 3 hours.
            </p>
            <p>
              The lodges themselves — including our own Soléi properties —
              are not designed primarily as family resorts, but they are
              welcoming to families who understand they are coming to a
              quiet, unhurried place rather than an activity-driven
              destination.
            </p>
          </>
        ),
      },
      {
        q: "Do I need a visa to visit Egypt?",
        a: (
          <>
            <p>
              Most nationalities can obtain a visa on arrival at Egyptian
              airports, or apply in advance via the Egypt e-Visa portal
              (visa2egypt.gov.eg). The cost is typically USD $25 for a
              single-entry tourist visa.
            </p>
            <p>
              Citizens of some countries — including most Arab nations — do
              not require a visa at all. A small number of nationalities must
              apply through an Egyptian embassy in advance. Check your
              country's specific requirements before travelling.
            </p>
            <p>
              We are not a visa service and cannot advise on specific visa
              situations, but we're happy to point you toward the right
              resources when you enquire.
            </p>
          </>
        ),
      },
      {
        q: "What currency should I bring to Siwa?",
        a: (
          <>
            <p>
              Egyptian Pounds (EGP) for incidental expenses in Siwa — small
              purchases in the market, tips, refreshments at stops along the
              route. ATMs are limited in Siwa town and their reliability
              varies; bring sufficient local currency from Cairo or
              Alexandria before departing.
            </p>
            <p>
              All Soléi bookings — accommodation, experiences, transportation
              — are settled in USD via our secure payment links. You
              do not need local currency for anything we arrange directly.
            </p>
          </>
        ),
      },
      {
        q: "Is Siwa safe to visit?",
        a: (
          <>
            <p>
              Siwa is safe. It is one of Egypt's most peaceful and isolated
              communities — far from major urban centres and with no history
              of instability. Guests of all nationalities visit without
              incident. Solo women travellers are a regular part of our guest
              base.
            </p>
            <p>
              The usual travel common sense applies: stay aware of your
              surroundings, keep valuables secure, and respect local customs
              around dress, particularly in Siwa town. The oasis is a
              conservative Berber community and modest dress in the town is
              appropriate and appreciated.
            </p>
            <p>
              We are always available via WhatsApp if anything feels
              uncertain before or during your stay.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "accommodation",
    eyebrow: "Accommodation",
    headline: "Staying in",
    headlineItalic: "Siwa.",
    label: "Accommodation",
    items: [
      {
        q: "How does booking accommodation work?",
        a: (
          <>
            <p>
              All Siwa accommodation books directly on our site — no waiting,
              no back-and-forth with a team. Select your property, choose
              your dates and room type, and pay securely via our Tab.travel
              booking system. Confirmation is instant.
            </p>
            <p>
              For our three Soléi-owned properties (Soléi Old Town, Soléi
              Royal, and Soléi Desert Retreat), you are booking directly with
              us and our team manages your stay end to end. For partner
              properties, we have live availability connected and your
              reservation goes directly to the property.
            </p>
          </>
        ),
      },
      {
        q: "What is the difference between Soléi-owned properties and partner properties?",
        a: (
          <>
            <p>
              <strong>Soléi-owned properties</strong> (Soléi Old Town, Soléi
              Royal, Soléi Desert Retreat) are designed, operated, and
              managed by our team directly. The service, the menus, the
              evening programming, the guide selection — all of it is ours.
              If something isn't right, you reach us and we fix it.
            </p>
            <p>
              <strong>Partner properties</strong> (Adrere Amellal, Taziry,
              Ghaliet, Talist, Siwa Shali Resort, Azad) are independently
              operated lodges and hotels that we have personally visited and
              chosen to include. We work closely with each one, but they are
              not ours to run.
            </p>
            <p>
              Both categories are booked through the same system. The
              practical difference is the degree of end-to-end
              accountability: for our own properties, we are fully
              responsible for your stay. For partner properties, we are
              responsible for the booking and will advocate on your behalf
              if needed.
            </p>
          </>
        ),
      },
      {
        q: "What is Adrere Amellal and why does it have no electricity?",
        a: (
          <>
            <p>
              Adrere Amellal is an eco-lodge built entirely from karsheef —
              the local salt rock — into the face of the White Mountain at
              the edge of the great salt lake. It has been operating since
              1997 and is widely regarded as one of Egypt's most distinctive
              lodges.
            </p>
            <p>
              The decision to have no electricity is not a compromise — it
              is the design. Oil lamp lighting, organic farm produce for all
              meals, no internet, no noise. Full board is included in the
              rate. It is an experience of a fundamentally different quality
              of time rather than a set of amenities.
            </p>
            <p>
              It is the highest-priced property in our Siwa portfolio at
              $320/night (Garden Room) for precisely this reason. Guests who
              choose it knowing what it is report some of the most
              compelling stays we hear about.
            </p>
          </>
        ),
      },
      {
        q: "What does \"full board\" mean at Siwa properties?",
        a: (
          <>
            <p>
              At properties where full board is included (notably Adrere
              Amellal), this means breakfast, lunch, and dinner are all
              provided on site. At most other Siwa properties, breakfast is
              included and meals beyond that are available on site at
              additional cost or can be arranged through local restaurants
              that we recommend.
            </p>
            <p>
              Each property listing specifies what meals are included. Our
              own Soléi properties offer breakfast included with rooms, and
              dinner available on request for small group dining experiences
              we organise most evenings.
            </p>
          </>
        ),
      },
      {
        q: "What are the standard check-in and check-out times?",
        a: (
          <>
            <p>
              Standard check-in is from 2:00pm and check-out is by 12:00pm
              noon at most Siwa properties. Early check-in and late check-out
              are subject to availability — mention your travel timing in the
              booking notes and we'll do what we can.
            </p>
            <p>
              For guests arriving from Cairo on the 8-hour drive, a
              mid-afternoon arrival is typical and aligns naturally with the
              2pm check-in. We recommend planning your departure from Cairo
              no later than 7am to avoid arriving after dark.
            </p>
          </>
        ),
      },
      {
        q: "Is there internet access in Siwa lodges?",
        a: (
          <>
            <p>
              It varies by property. Most Siwa lodges have limited or
              intermittent Wi-Fi — this is partly infrastructure and partly a
              deliberate choice. Adrere Amellal has no internet at all. Most
              other lodges have Wi-Fi in common areas with varying
              reliability.
            </p>
            <p>
              Mobile signal is also limited in the oasis, particularly at
              properties further from town. Egyptian SIM cards (Vodafone or
              Orange) provide the best local coverage. If connectivity is
              important to your trip, mention it when you enquire and we'll
              tell you exactly what to expect at your specific property.
            </p>
            <p>
              Our honest advice: budget for being partially unreachable. This
              is part of what Siwa offers.
            </p>
          </>
        ),
      },
      {
        q: "What is the cancellation policy?",
        a: (
          <>
            <p>
              Free cancellation is available up to 7 days before arrival for
              most Soléi-booked accommodation. Cancellations within 7 days
              are charged in full. Cancellations more than 30 days out
              receive a full refund within 5–10 business days.
            </p>
            <p>
              Partner properties may have slightly different policies which
              will be clearly stated at the time of booking confirmation. If
              you book and later need to change dates, contact us before the
              cancellation deadline — in most cases we can adjust without
              penalty.
            </p>
          </>
        ),
      },
      {
        q: "What is the minimum stay at Siwa properties?",
        a: (
          <>
            <p>
              Adrere Amellal has a minimum stay of 2 nights — a one-night
              stay there is not something we would recommend in any case.
              Most other Siwa properties have no formal minimum, but we'd
              encourage any guest to book at least 2–3 nights given the
              journey involved in getting there.
            </p>
            <p>
              A single-night stay in Siwa after an 8-hour drive is technically
              possible but means spending more time in transit than in the
              oasis. Three nights is the practical minimum for a stay that
              feels worthwhile.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "experiences",
    eyebrow: "Experiences",
    headline: "What to do in",
    headlineItalic: "Siwa.",
    label: "Experiences",
    items: [
      {
        q: "How do I book experiences?",
        a: (
          <>
            <p>
              All Siwa experiences book directly on our site with instant
              confirmation. Select your experience, choose a date, confirm
              your group size, and pay. No waiting, no back-and-forth.
            </p>
            <p>
              If you've already booked accommodation with us, we automatically
              coordinate experience timing with your property — you don't
              need to cross-reference separately. Experience bookings can be
              added before or after your accommodation booking.
            </p>
          </>
        ),
      },
      {
        q: "When should I book experiences — before or after arrival?",
        a: (
          <>
            <p>
              Before arrival — and ideally before you leave home. The salt
              lake float at sunset and sleeping under the stars fill quickly
              during peak season (October to March). Booking on the morning
              you want to do something is possible in the off-season but
              risky in busy months.
            </p>
            <p>
              That said, experiences are always secondary to accommodation
              in our booking journey. Book your property first, then layer
              experiences on top. The two are designed to work together
              around your stay dates.
            </p>
          </>
        ),
      },
      {
        q: "What is the salt lake float and why is it run only at sunset?",
        a: (
          <>
            <p>
              The salt lake float is our signature Siwa experience —
              floating effortlessly in Siwa's hyper-saline lakes as the sun
              descends. The water is several times saltier than the ocean,
              which means you float without any effort. You lie back and the
              lake holds you completely.
            </p>
            <p>
              It runs at sunset because the light is the experience. In the
              last twenty minutes before the sun meets the horizon, the lake
              and the sky become a single continuous reflective surface.
              There is no edge between them. Running it at any other time of
              day would be a different experience entirely and not one we'd
              stake our reputation on.
            </p>
            <p>
              It is the experience most guests name first when describing
              their time in Siwa. From $45 per person.
            </p>
          </>
        ),
      },
      {
        q: "Can experiences be made private?",
        a: (
          <>
            <p>
              Yes. All experiences listed for groups are available as
              private bookings. The Full Siwa Day (experience 10) is private
              by default. For all others, a private option is available —
              contact us before booking and we'll give you the private
              pricing based on your group size.
            </p>
            <p>
              Private bookings have a flat rate rather than a per-person
              rate, which means larger groups often find private bookings
              comparable in total cost to the group rate.
            </p>
          </>
        ),
      },
      {
        q: "What is the cancellation policy for experiences?",
        a: (
          <>
            <p>
              Free cancellation up to 48 hours before the scheduled
              experience. Cancellations within 48 hours are charged in full.
              In the rare event of extreme weather, we reschedule at no
              charge — Siwa's weather is generally predictable and this is
              uncommon.
            </p>
            <p>
              If you need to change the date of an experience rather than
              cancel it entirely, contact us as early as possible and we'll
              do what we can to accommodate the change.
            </p>
          </>
        ),
      },
      {
        q: "What should I bring to experiences?",
        a: (
          <>
            <p>
              General guidance for all experiences: light layers for evenings
              and early mornings — the desert temperature drops significantly
              after sunset and before dawn. Comfortable walking shoes or
              sandals. Water — always more than you think you need.
            </p>
            <InfoCard
              title="Experience-specific notes"
              items={[
                <>
                  <strong>Salt lake float:</strong> Swimwear and a change of
                  clothes. No sunscreen or body lotion before entering.
                  Remove contact lenses.
                </>,
                <>
                  <strong>Sand surfing:</strong> Clothes you don't mind
                  getting sand in. Closed shoes or trainers for the walk up
                  the dune.
                </>,
                <>
                  <strong>Stargazing:</strong> A warm layer — even in mild
                  months the open desert at night is cold. The experience
                  starts after dark.
                </>,
                <>
                  <strong>Sand bath healing:</strong> Old clothes — you will
                  be buried in sand. Avoid this if you have open wounds or
                  skin conditions.
                </>,
                <>
                  <strong>Cleopatra Spring:</strong> Swimwear. The spring is
                  a natural pool — cool and clear. No changing facilities on
                  site.
                </>,
              ]}
            />
          </>
        ),
      },
      {
        q: "What experience do you recommend most for a first visit?",
        a: (
          <>
            <p>
              The salt lake float at sunset — without hesitation. It is the
              experience that most consistently produces the reaction that
              brought guests to Siwa in the first place: the particular
              feeling of being somewhere completely unlike anywhere else.
            </p>
            <p>
              If you have three nights, we'd add the Oracle Temple on your
              first full morning and desert stargazing on your second
              evening. That combination — heritage, salt lake, stars —
              covers the three essential registers of the oasis without
              over-programming the stay.
            </p>
          </>
        ),
      },
      {
        q: "Are experiences suitable for guests with limited mobility?",
        a: (
          <>
            <p>
              Some experiences work well with limited mobility and some do
              not. The salt lake float is suitable for almost everyone — the
              water does the work. The oracle temple involves an uphill walk
              on uneven ground. The desert drives require getting in and out
              of a 4×4.
            </p>
            <p>
              Tell us about any mobility considerations when you enquire and
              we'll be honest about which experiences work and which don't.
              We will never put a guest in a situation that isn't right for
              them.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "transportation",
    eyebrow: "Transportation",
    headline: "Getting to and around",
    headlineItalic: "Siwa.",
    label: "Transportation",
    items: [
      {
        q: "How do I get to Siwa from Cairo?",
        a: (
          <>
            <p>
              By private vehicle — approximately 8 hours on the Western
              Desert road via the Mediterranean coast and Marsa Matrouh.
              There is no train service to Siwa. There are shared bus
              services, but we do not use or recommend them: they are
              unreliable, uncomfortable over 8 hours, and arrive at times
              that rarely align with useful check-in windows.
            </p>
            <p>
              We arrange all Siwa transportation with private vehicles and
              drivers we know personally. The Cairo–Siwa route runs from
              $180 per vehicle. Depart before 7am to arrive by mid-afternoon.
            </p>
          </>
        ),
      },
      {
        q: "Is there an airport in or near Siwa?",
        a: (
          <>
            <p>
              There is no commercial airport in Siwa. The nearest airport
              with domestic connections is Marsa Matrouh — approximately 3
              hours from Siwa by road. EgyptAir operates domestic flights
              from Cairo to Marsa Matrouh, though scheduling is limited and
              seasonal.
            </p>
            <p>
              Most guests fly into Cairo International and drive from there.
              If you're flying into Marsa Matrouh, we arrange the 3-hour
              onward transfer from $95 per vehicle.
            </p>
          </>
        ),
      },
      {
        q: "What time should I depart from Cairo?",
        a: (
          <>
            <p>
              Before 6am if possible — ideally 5am or 5:30am. This gets you
              clear of Cairo before morning traffic builds, allows stops at
              a comfortable pace, and delivers you to Siwa by early to
              mid-afternoon. A mid-afternoon arrival means you can settle
              in, rest if needed, and still have an evening.
            </p>
            <p>
              Arriving after dark is manageable but not ideal for a first
              visit. The oasis deserves to be seen arriving, not stumbled
              into.
            </p>
          </>
        ),
      },
      {
        q: "What is the mobile signal like on the Cairo–Siwa route?",
        a: (
          <>
            <p>
              Signal is intermittent between Cairo and Siwa, particularly on
              the last 80km into the oasis. Download music, podcasts, or
              anything you'll want to listen to before departure. Our drivers
              carry emergency contact equipment and are experienced with the
              route.
            </p>
            <p>
              Once in the oasis, mobile signal varies by property. Most
              properties have Wi-Fi in common areas. Adrere Amellal has no
              internet or reliable signal — this is part of the experience.
            </p>
          </>
        ),
      },
      {
        q: "Do you use shared vehicles or private only?",
        a: (
          <>
            <p>
              Private only. We do not combine bookings across different
              groups in the same vehicle, regardless of group size. A couple
              books a private vehicle. A family of five books a private
              vehicle. This is a non-negotiable position — shared transfers
              are a different product and not one we offer.
            </p>
            <p>
              The vehicle fleet for Siwa includes private SUVs (up to 4
              passengers), 4×4 desert vehicles (essential for dune driving
              and the Marsa Matrouh sand road), and private minivans for
              groups up to 8.
            </p>
          </>
        ),
      },
      {
        q: "How does transportation booking work and when do I pay?",
        a: (
          <>
            <p>
              All transportation is arranged by enquiry — not automated
              booking. Submit your route, date, passengers, and pickup
              location via our{" "}
              <Link href="/siwa-oasis/transportation">
                transportation page
              </Link>{" "}
              or the main enquiry form. We confirm vehicle and driver within
              24 hours and send a secure payment link via WhatsApp or email.
              No payment until the vehicle is confirmed.
            </p>
            <p>
              If you've booked accommodation with us, we coordinate transport
              timing with your check-in automatically. You don't need to
              manage the two separately.
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
        q: "What should I wear in Siwa?",
        a: (
          <>
            <p>
              Light, breathable layers for the daytime. Something warmer for
              evenings and early mornings — even in mild months, the desert
              temperature drops significantly after sunset. Comfortable
              walking shoes for sites like the oracle temple. Sandals for the
              salt lake and Cleopatra Spring.
            </p>
            <p>
              <strong>In Siwa town</strong>, modest dress is appropriate and
              appreciated. Siwa is a conservative Berber community. Shoulders
              and knees covered in the town centre is the standard
              expectation. At the lodges, dress more casually as you prefer.
            </p>
            <p>
              You do not need specialist hiking gear or extreme weather
              clothing for standard Siwa stays. Light clothing and one warm
              layer covers most situations.
            </p>
          </>
        ),
      },
      {
        q: "What language is spoken in Siwa?",
        a: (
          <>
            <p>
              Siwi — a Berber language — is the native language of Siwa and
              spoken by most local residents. Arabic (Egyptian dialect) is
              also widely spoken and understood. English is spoken at the
              lodges and by guides working with international guests.
            </p>
            <p>
              Basic Arabic phrases are appreciated but not required. Our team
              communicates with guests in English, and our guides are fluent
              in English for all Soléi-arranged experiences.
            </p>
          </>
        ),
      },
      {
        q: "What food is available in Siwa?",
        a: (
          <>
            <p>
              Siwa has a genuine food culture rooted in the oasis's
              agricultural products — dates, olives, olive oil, organic
              vegetables, and the particular flatbreads baked in the town. At
              the better lodges, particularly Adrere Amellal and our own
              Soléi properties, meals are genuinely excellent and use local
              produce extensively.
            </p>
            <p>
              In Siwa town there are small local restaurants serving simple
              Egyptian and Siwan food at very low prices. They are not
              tourist restaurants — they serve what the town eats, and it is
              good.
            </p>
            <p>
              There are no international chain restaurants in Siwa. Dietary
              requirements (vegetarian, vegan, gluten-free) are handled
              easily at the lodges if flagged in advance. Mention any
              requirements when you book.
            </p>
          </>
        ),
      },
      {
        q: "Are there pharmacies or medical facilities in Siwa?",
        a: (
          <>
            <p>
              There is a small hospital and several pharmacies in Siwa town.
              For routine medications and minor issues, these are adequate.
              For anything requiring specialist care, the nearest city is
              Marsa Matrouh (3 hours) and the nearest major hospital
              infrastructure is in Alexandria or Cairo.
            </p>
            <p>
              Bring any prescription medications you need for the full
              duration of your stay — do not rely on being able to source
              specific medications in Siwa. Travel insurance that covers
              medical evacuation is recommended for guests with significant
              health conditions.
            </p>
          </>
        ),
      },
      {
        q: "How do I reach the Soléi team if I need something during my stay?",
        a: (
          <>
            <p>
              WhatsApp is the fastest and most reliable channel — our team
              number is sent to you in the booking confirmation. For guests
              staying at Soléi-owned properties, the team is also on site and
              reachable in person.
            </p>
            <p>
              For guests at partner properties, we remain your primary
              contact for any issue — even if the property itself is handling
              your day-to-day stay. If something isn't right, reach us
              directly and we'll intervene.
            </p>
            <p>
              We respond to WhatsApp messages throughout the day and into the
              evening. We are not a 24-hour call centre but we are a small
              team that takes our responsibility to guests seriously.
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

export default function SiwaFaqPage() {
  useReveal();
  const [filter, setFilter] = useState<"all" | SectionId>("all");
  const [query, setQuery] = useState("");
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId>("planning");
  const siteContent = useSiteContent();

  // Per-section override from site_content. Each section can have its
  // own array under `siwa_faq.<section_id>.items` — plain { q, a }
  // strings, paragraphs split on blank lines. When present, the
  // override REPLACES the JSX defaults below.
  const overrideForSection = (id: SectionId): FaqItem[] | null => {
    const raw = siteContent[`siwa_faq.${id}.items`];
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

  /* ── Filter + search ──────────────────────────────────────── */
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

  /* ── Auto-open a single search result ─────────────────────── */
  useEffect(() => {
    if (!q) return;
    const allVisible = visibleBySection.flatMap((s) =>
      s.items.map((item) => `${s.section.id}:${item.q}`),
    );
    if (allVisible.length === 1) setOpenKey(allVisible[0]);
  }, [q, visibleBySection]);

  /* ── Scroll-spy for sidebar active state ──────────────────── */
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
        title="Siwa Oasis FAQ — Soléi"
        description="Everything guests ask before arriving in Siwa — booking, accommodation, experiences, transportation, and the oasis itself."
        path="/siwa-faq"
      />
      <Nav darkHero={false} />

      <main>
        {/* ── HEADER ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-navy px-6 md:px-12 lg:px-20 pt-32 pb-16 md:pb-20">
          <div className="absolute inset-0 textile-bg pointer-events-none" />
          <div className="relative z-[2] max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-end">
            <div>
              <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-5 animate-fade-up animation-delay-200">
                <span className="block w-[22px] h-px bg-gold opacity-50" />
                Siwa Oasis
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
                Everything guests ask before arriving in Siwa — about booking,
                accommodation, experiences, transportation, and the oasis
                itself. If something isn't here, ask us directly.
              </p>
              <Link
                href="/north-coast-faq"
                className="inline-flex items-center gap-2 text-[0.62rem] tracking-[0.18em] uppercase text-white/30 border border-white/10 px-5 py-2.5 hover:text-gold hover:border-gold/30 transition-colors"
              >
                North Coast FAQ instead →
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
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body font-light focus:border-gold outline-none placeholder:text-ink-soft/40"
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
                        ? "text-navy opacity-100 pl-2 border-l-2 border-l-gold"
                        : "text-ink-soft opacity-50 hover:opacity-100 hover:text-navy hover:pl-2"
                    }`}
                  >
                    {s.label}
                    <span className="float-right text-[0.6rem] font-display italic text-gold/65">
                      {s.items.length}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <Link
              href="/enquire"
              className="block mt-8 p-5 bg-navy text-center hover:opacity-85 transition-opacity"
            >
              <div className="text-[0.56rem] tracking-[0.28em] uppercase text-gold/70 mb-1">
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
              className="reveal bg-navy p-10 block hover:opacity-85 transition-opacity group"
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
              <span className="flex items-center gap-2 text-[0.6rem] tracking-[0.2em] uppercase text-gold/75 group-hover:gap-3 transition-all">
                Send an enquiry →
              </span>
            </Link>
            <Link
              href="/siwa-oasis"
              className="reveal reveal-d1 bg-white border border-sand p-10 block hover:border-gold transition-colors group"
            >
              <p className="flex items-center gap-2 text-[0.58rem] tracking-[0.28em] uppercase text-gold/75 mb-4">
                <span className="block w-[14px] h-px bg-gold opacity-50" />
                Explore Siwa
              </p>
              <h3 className="font-display text-[1.4rem] font-normal leading-[1.3] text-navy mb-3">
                Destination overview
              </h3>
              <p className="text-[0.82rem] text-ink-soft leading-[1.85] mb-5">
                The full picture of what Siwa offers — accommodation,
                experiences, and transportation all in one place before you
                decide.
              </p>
              <span className="flex items-center gap-2 text-[0.6rem] tracking-[0.2em] uppercase text-gold group-hover:gap-3 transition-all">
                View Siwa Oasis →
              </span>
            </Link>
          </div>
        </section>

        {/* ── NC CROSSLINK ────────────────────────────────────── */}
        <section className="bg-white border-t border-sand px-6 md:px-12 lg:px-20 py-16">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="font-display text-[1.4rem] font-normal text-navy mb-2">
                Also visiting the{" "}
                <em className="italic text-coastal">North Coast?</em>
              </h3>
              <p className="text-[0.84rem] text-ink-soft leading-[1.8] max-w-[60ch]">
                A separate FAQ covers everything about our Mediterranean
                destination — accommodation, experiences, transportation,
                and the practical differences in how North Coast bookings
                work.
              </p>
            </div>
            <Link
              href="/north-coast-faq"
              className="text-[0.62rem] tracking-[0.18em] uppercase text-navy border border-sand px-8 py-3.5 hover:border-gold hover:text-gold transition-colors whitespace-nowrap flex-shrink-0"
            >
              North Coast FAQ →
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
