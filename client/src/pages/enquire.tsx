import { useEffect, useMemo, useState, useId, isValidElement, cloneElement, Children } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { useReveal } from "@/components/home/useReveal";
import { Arch } from "@/components/ui/Arch";
import { HOTEL_DETAILS } from "@/lib/hotel-data";
import { EXPERIENCE_DETAILS } from "@/lib/experience-data";
import { useExperiencesBySlug } from "@/lib/useExperiencesBySlug";
import { useExperiencesRaw } from "@/lib/useExperiencesRaw";
import { useHotelsBySlug } from "@/lib/useHotelsBySlug";
import { useSiteContent } from "@/lib/useSiteContent";
import { NC_TRANSPORT, SIWA_TRANSPORT, resolveTransportPage } from "@/lib/transport-content";
import { ChoiceButtons, MultiPicker, type ExperienceOption, type PickOption } from "@/components/enquire/ChoiceFields";
import { useContact } from "@/lib/useContact";

/** Slugs the public API still publishes (drafts are filtered server-side). */
function useActiveSlugs(endpoint: string): Set<string> {
  const { data } = useQuery<string[]>({
    // Must NOT be a bare [endpoint]: this returns slug strings, while
    // other consumers cache the raw record objects under that key. Same
    // key + different shapes meant whichever hook mounted first won,
    // and the losers read fields that didn't exist. Matches the
    // convention in lib/useActiveSlugs.ts.
    queryKey: [endpoint, "slugs"],
    queryFn: async () => {
      const res = await fetch(endpoint);
      if (!res.ok) return [];
      const json = await res.json();
      if (!Array.isArray(json)) return [];
      return json.map((r: any) => r.slug).filter(Boolean);
    },
    staleTime: 60_000,
  });
  return useMemo(() => new Set(data ?? []), [data]);
}

/* ──────────────────────────────────────────────────────────────
 *  /enquire
 *
 *  The central enquiry page. Reads these URL params from inbound
 *  CTAs and pre-fills the appropriate form:
 *
 *    type=accommodation&destination=<siwa|north-coast>&property=<slug>
 *      &checkin=<date>&checkout=<date>&guests=<n>&room=<name>
 *
 *    type=experience&destination=<siwa|north-coast>&exp=<slug>
 *      &date=<date>&guests=<n>&private=<0|1>
 *
 *    type=transport&route=<route>   (future use)
 *
 *  Visual signals:
 *    • Context banner at the top explaining what was pre-filled
 *    • Pre-filled fields styled with a cream bg + gold border
 *    • "Start fresh" button clears everything
 * ────────────────────────────────────────────────────────────── */

type EnquiryType = "accommodation" | "experience" | "transport";

const TRAVEL_STYLES = ["Solo", "Couple", "Family", "Friends", "Group / corporate", "Other"];

/** "honeymoon-escape" → "Honeymoon Escape". Only a stopgap for the
 *  moment before live records load — never a substitute for the real
 *  title. */
function prettifySlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}


function buildRef(): string {
  const year = new Date().getFullYear();
  const n = String(Math.floor(Math.random() * 9000) + 1000);
  return `SL-${year}-${n}`;
}

export default function EnquirePage() {
  useReveal();
  const search = useSearch();
  const [, setLocation] = useLocation();

  /* ── Parse inbound params ──────────────────────────────── */
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const paramType = params.get("type") as EnquiryType | null;
  const paramDest = params.get("destination");
  const paramProperty = params.get("property");
  const paramExp = params.get("exp");
  // Curated journeys arrive as ?journey=<slug>. They're experience
  // records with category "Curated Journey", but they're multi-night,
  // often multi-destination, and always private — so they need their
  // own labelling and defaults rather than being called an
  // "Experience enquiry" with group defaults.
  const paramJourney = params.get("journey");
  const paramRoute = params.get("route");
  const paramCheckin = params.get("checkin") ?? "";
  const paramCheckout = params.get("checkout") ?? "";
  const paramGuests = params.get("guests") ?? "";
  const paramDate = params.get("date") ?? "";
  const paramRoom = params.get("room") ?? "";
  const paramPrivate = params.get("private") === "1";
  const paramStaying = params.get("staying") ?? "";
  const paramNotes = params.get("notes") ?? "";

  /* ── Active tab ────────────────────────────────────────── */
  const initialTab: EnquiryType =
    paramType ??
    (paramProperty ? "accommodation" : paramExp ? "experience" : paramRoute ? "transport" : "accommodation");
  const [tab, setTab] = useState<EnquiryType>(initialTab);

  /* ── Property + experience lookups ─────────────────────── */
  // Only show what the public API still publishes — drafted hotels /
  // experiences are filtered out server-side, so they drop from these
  // dropdowns automatically.
  const activeHotelSlugs = useActiveSlugs("/api/hotels");
  // Live records keyed by slug. EXPERIENCE_DETAILS is a static bundled
  // list, so anything created in the admin (every curated journey, for
  // one) isn't in it — looking names up here is what stops the form
  // showing a raw slug like "honeymoon-escape".
  const liveBySlug = useExperiencesBySlug();
  const contact = useContact();
  /** Display name for any experience/journey slug, live data first. */
  const nameForSlug = (slug: string | null): string =>
    !slug
      ? ""
      : liveBySlug.get(slug)?.title ??
        EXPERIENCE_DETAILS.find((e) => e.slug === slug)?.name ??
        "";

  const allHotels = useMemo(() => Object.values(HOTEL_DETAILS), []);
  const siwaHotels = useMemo(
    () => allHotels.filter((h) => h.destination === "siwa-oasis" && activeHotelSlugs.has(h.slug)),
    [allHotels, activeHotelSlugs],
  );
  const ncHotels = useMemo(
    () => allHotels.filter((h) => h.destination === "north-coast" && activeHotelSlugs.has(h.slug)),
    [allHotels, activeHotelSlugs],
  );
  // Every published property, straight from the API — hotels added in
  // the dashboard included. The bundled list only stands in until the
  // API answers.
  const liveHotels = useHotelsBySlug();
  const hotelOptions = useMemo<PickOption[]>(() => {
    const live: PickOption[] = [];
    liveHotels.forEach((h, slug) =>
      live.push({
        slug,
        name: h.name || allHotels.find((x) => x.slug === slug)?.name || prettifySlug(slug),
        dest: h.destination === "north-coast" ? "north-coast" : "siwa",
      }),
    );
    if (live.length > 0) return live;
    return [...siwaHotels, ...ncHotels].map((h) => ({
      slug: h.slug,
      name: h.name,
      dest: h.destination === "north-coast" ? ("north-coast" as const) : ("siwa" as const),
    }));
  }, [liveHotels, allHotels, siwaHotels, ncHotels]);
  // Every published experience and curated journey, straight from the
  // API — so anything added in the dashboard is selectable here. The
  // bundled list only stands in until the API answers (or if it fails).
  const { data: liveExps } = useExperiencesRaw();
  const expOptions = useMemo<ExperienceOption[]>(() => {
    const live = liveExps
      .filter((e) => e.slug && e.title)
      .map((e): ExperienceOption => ({
        slug: e.slug!,
        name: e.title!,
        dest: e.destination === "siwa" || e.destination === "north-coast" ? e.destination : null,
        journey: e.category === "Curated Journey",
        featured: e.category === "Curated Journey",
      }));
    if (live.length > 0) return live;
    return EXPERIENCE_DETAILS.map((e) => ({
      slug: e.slug,
      name: e.name,
      dest: e.destination === "north-coast" ? ("north-coast" as const) : ("siwa" as const),
      journey: false,
      featured: false,
    }));
  }, [liveExps]);

  /* ── Accommodation form state ──────────────────────────── */
  const initialAccomDest =
    paramDest === "north-coast"
      ? "north-coast"
      : paramDest === "siwa"
        ? "siwa"
        : paramProperty
          ? (ncHotels.some((h) => h.slug === paramProperty)
            ? "north-coast"
            : "siwa")
          : "";
  const [accomDests, setAccomDests] = useState<string[]>(initialAccomDest ? [initialAccomDest] : []);
  const [accomPicks, setAccomPicks] = useState<string[]>(paramProperty ? [paramProperty] : []);
  const [accomSuggest, setAccomSuggest] = useState(false);
  const [accomCheckin, setAccomCheckin] = useState(paramCheckin);
  const [accomCheckout, setAccomCheckout] = useState(paramCheckout);
  const [accomFlexible, setAccomFlexible] = useState(false);
  // Inbound guests arrive as "2", "2 adults", "2 adults, 1 child" or
  // "Family (5+)" — split them into the adults / children fields.
  const initialAccomGuests = (() => {
    const g = paramGuests.toLowerCase();
    const adultsN = parseInt(g.match(/(\d+)\s*adult/)?.[1] ?? (/^\d+$/.test(g) ? g : ""), 10);
    const childN = parseInt(g.match(/(\d+)\s*child/)?.[1] ?? "0", 10);
    const adults = !adultsN ? "2 adults" : adultsN >= 5 ? "5+ adults" : adultsN === 1 ? "1 adult" : `${adultsN} adults`;
    if (g.startsWith("family")) return { adults: "2 adults", children: "3+ children", family: true };
    const children = !childN ? "No children" : childN >= 3 ? "3+ children" : childN === 1 ? "1 child" : `${childN} children`;
    return { adults, children, family: childN > 0 };
  })();
  const [accomAdults, setAccomAdults] = useState(initialAccomGuests.adults);
  const [accomChildren, setAccomChildren] = useState(initialAccomGuests.children);
  const [accomRoom, setAccomRoom] = useState(paramRoom);

  /* ── Experience form state ─────────────────────────────── */
  // Destinations and experiences are multi-select: a visitor can plan
  // both regions and several experiences in one enquiry. A journey with
  // no single destination spans both regions.
  const journeyDest = paramJourney ? liveBySlug.get(paramJourney)?.destination : undefined;
  const staticExpDest = paramExp
    ? EXPERIENCE_DETAILS.find((e) => e.slug === paramExp)?.destination
    : undefined;
  const initialExpDests: string[] =
    paramDest === "north-coast" || paramDest === "siwa"
      ? [paramDest]
      : paramJourney
        ? journeyDest === "north-coast" || journeyDest === "siwa"
          ? [journeyDest]
          : []
        : staticExpDest
          ? [staticExpDest === "north-coast" ? "north-coast" : "siwa"]
          : [];
  const [expDests, setExpDests] = useState<string[]>(initialExpDests);
  const initialExpSlug = paramJourney ?? paramExp;
  const [expPicks, setExpPicks] = useState<string[]>(initialExpSlug ? [initialExpSlug] : []);
  const [expSuggest, setExpSuggest] = useState(false);
  const [travelStyle, setTravelStyle] = useState(initialAccomGuests.family ? "Family" : "");
  const [childAges, setChildAges] = useState("");
  const [expDate, setExpDate] = useState(paramDate);
  const [expDateTo, setExpDateTo] = useState("");
  const [expFlexible, setExpFlexible] = useState(false);
  // Convert numeric guests param to the dropdown option string
  const initialExpGuests = (() => {
    if (!paramGuests) return "2 people";
    const n = parseInt(paramGuests, 10);
    if (!Number.isNaN(n) && n >= 1 && n <= 6) {
      return n === 1 ? "1 person" : `${n} people`;
    }
    if (n >= 7) return "7+ people";
    return paramGuests;
  })();
  const [expGuests, setExpGuests] = useState(initialExpGuests);
  // Curated journeys are private by definition — never default one to
  // "shared with other guests".
  const [expPrivate, setExpPrivate] = useState(
    paramPrivate || paramJourney
      ? "Private — just our group"
      : "Group experience (shared with other guests)",
  );
  const [expStaying, setExpStaying] = useState(paramStaying);
  const [expNotes, setExpNotes] = useState(paramNotes);

  /* ── Transport form state ──────────────────────────────── */
  // Routes, drives and vehicles come from the (admin-editable)
  // transportation pages, so this list always matches what they offer.
  const siteContent = useSiteContent();
  const routeGroups = useMemo(() => {
    const label = (r: { from: string; via: string; to: string }) => [r.from, r.via, r.to].filter(Boolean).join(" → ");
    const siwa = resolveTransportPage(siteContent, "siwa_transport", SIWA_TRANSPORT);
    const nc = resolveTransportPage(siteContent, "nc_transport", NC_TRANSPORT);
    return {
      groups: [
        { label: "Siwa Oasis — routes", options: [siwa.featured, ...siwa.routeItems].map(label) },
        { label: "Siwa Oasis — desert drives", options: siwa.cardItems.map((c) => c.title) },
        { label: "North Coast — routes", options: [nc.featured, ...nc.routeItems].map(label) },
        { label: "North Coast — within the coast", options: nc.cardItems.map((c) => c.title) },
      ].map((g) => ({ ...g, options: g.options.filter(Boolean) })),
      vehicles: Array.from(new Set([...siwa.fleetItems, ...nc.fleetItems].map((v) => v.name).filter(Boolean))),
    };
  }, [siteContent]);
  // Inbound ?route= is either an option label or a slug like
  // "cairo-north-coast" (home booking bar) — map the slug onto the
  // matching route, or show it readably if there's no exact match.
  const initialRoute = (() => {
    if (!paramRoute) return "";
    const all = routeGroups.groups.flatMap((g) => g.options);
    if (all.includes(paramRoute)) return paramRoute;
    const m = paramRoute.toLowerCase().match(/^(cairo|alexandria|siwa|north-coast|marsa-matrouh)-(.+)$/);
    if (!m) return paramRoute;
    const words = (x: string) => x.replace(/-/g, " ");
    const from = words(m[1]);
    const to = words(m[2]);
    const hit = all.find((o) => {
      const [f, ...rest] = o.toLowerCase().split(" → ");
      return f.startsWith(from) && rest.join(" ").includes(to);
    });
    const title = (x: string) => x.replace(/\b\w/g, (c) => c.toUpperCase());
    return hit ?? `${title(from)} → ${title(to)}`;
  })();
  const [transportRoute, setTransportRoute] = useState(initialRoute);
  const [transportTrip, setTransportTrip] = useState("One way");
  const [transportDate, setTransportDate] = useState(paramDate);
  const [transportTime, setTransportTime] = useState("");
  const [transportPax, setTransportPax] = useState("2 passengers");
  const [transportVehicle, setTransportVehicle] = useState("Let Soléi decide");
  const [transportPickup, setTransportPickup] = useState("");
  const [transportDropoff, setTransportDropoff] = useState("");

  /* ── Prefill flags (drive styling + hints) ─────────────── */
  const accomPropertyPrefilled = !!paramProperty;
  const accomCheckinPrefilled = !!paramCheckin;
  const accomCheckoutPrefilled = !!paramCheckout;
  const accomRoomPrefilled = !!paramRoom;
  const expNamePrefilled = !!(paramExp || paramJourney);

  // liveBySlug arrives after the first render, so backfill the
  // destination once it lands — but never overwrite what the visitor
  // has already chosen themselves. A journey spanning both regions
  // selects both.
  useEffect(() => {
    const slug = paramJourney ?? paramExp;
    if (!slug) return;
    const live = liveBySlug.get(slug);
    if (!live) return;
    const dest = live.destination;
    setExpDests((prev) =>
      prev.length > 0
        ? prev
        : dest === "north-coast" || dest === "siwa"
          ? [dest]
          : paramJourney
            ? ["siwa", "north-coast"]
            : prev,
    );
  }, [liveBySlug, paramExp, paramJourney]);

  // Only list experiences for the chosen destination(s); with none
  // chosen, list everything. Journeys covering both always show.
  const visibleExpOptions = useMemo(
    () =>
      expDests.length === 0
        ? expOptions
        : expOptions.filter((o) => o.dest === null || expDests.includes(o.dest)),
    [expOptions, expDests],
  );
  const expNameOf = (slug: string) =>
    expOptions.find((o) => o.slug === slug)?.name || nameForSlug(slug) || prettifySlug(slug);
  const isJourneySlug = (slug: string) =>
    slug === paramJourney || !!expOptions.find((o) => o.slug === slug)?.journey;

  // Unticking a destination drops the experiences that belong only to it.
  const changeExpDests = (next: string[]) => {
    setExpDests(next);
    if (next.length > 0) {
      setExpPicks((picks) =>
        picks.filter((slug) => {
          const d = expOptions.find((o) => o.slug === slug)?.dest;
          return !d || next.includes(d);
        }),
      );
    }
  };

  // Solo / couple set the head count; the visitor can still change it.
  const changeTravelStyle = (next: string[]) => {
    const style = next[0] ?? "";
    setTravelStyle(style);
    if (style === "Solo") setExpGuests("1 person");
    if (style === "Couple") setExpGuests("2 people");
    if (style === "Solo") setAccomAdults("1 adult");
    if (style === "Couple") setAccomAdults("2 adults");
  };

  // Accommodation: list properties for the chosen destination(s), and
  // drop picks that belong only to a destination being unticked.
  const visibleHotelOptions = useMemo(
    () => (accomDests.length === 0 ? hotelOptions : hotelOptions.filter((o) => !o.dest || accomDests.includes(o.dest))),
    [hotelOptions, accomDests],
  );
  const changeAccomDests = (next: string[]) => {
    setAccomDests(next);
    if (next.length > 0) {
      setAccomPicks((picks) =>
        picks.filter((slug) => {
          const d = hotelOptions.find((o) => o.slug === slug)?.dest;
          return !d || next.includes(d);
        }),
      );
    }
  };
  const hotelNameOf = (slug: string) =>
    hotelOptions.find((o) => o.slug === slug)?.name ||
    allHotels.find((h) => h.slug === slug)?.name ||
    prettifySlug(slug);
  // A property link whose destination wasn't given: take it from the
  // live record once it loads.
  useEffect(() => {
    if (!paramProperty) return;
    const d = hotelOptions.find((o) => o.slug === paramProperty)?.dest;
    if (d) setAccomDests((prev) => (prev.length > 0 ? prev : [d]));
  }, [hotelOptions, paramProperty]);
  const expDatePrefilled = !!paramDate;
  const transportRoutePrefilled = !!paramRoute;

  /* ── Context banner ────────────────────────────────────── */
  const [bannerDismissed, setBannerDismissed] = useState(false);
  // Only claim something was pre-filled when it actually was. A bare
  // ?type=… (e.g. the "Plan your journey" CTA) selects a tab but fills
  // nothing, so the banner must stay hidden.
  const showBanner = !bannerDismissed && (
    accomPropertyPrefilled ||
    expNamePrefilled ||
    transportRoutePrefilled
  );

  const bannerTitle = useMemo(() => {
    if (accomPropertyPrefilled) {
      const h = allHotels.find((x) => x.slug === paramProperty);
      return `Accommodation enquiry — ${h?.name ?? paramProperty}`;
    }
    if (paramJourney) {
      // Fall back to the prettified slug only while live data loads.
      const name = nameForSlug(paramJourney) || prettifySlug(paramJourney);
      return `Journey enquiry — ${name}`;
    }
    if (expNamePrefilled) {
      const name = nameForSlug(paramExp) || prettifySlug(paramExp ?? "");
      return `Experience enquiry — ${name}`;
    }
    if (tab === "transport") return "Transportation enquiry";
    return "Pre-filled from your selection";
  }, [accomPropertyPrefilled, expNamePrefilled, paramProperty, paramExp, paramJourney, tab, allHotels, liveBySlug]);

  const bannerDesc = useMemo(() => {
    if (accomPropertyPrefilled) return "We've pre-filled the property from your selection. Add your dates and we'll confirm availability.";
    if (paramJourney) {
      return journeyDest === "north-coast" || journeyDest === "siwa"
        ? "We've pre-filled your journey. Add your preferred start date and we'll build the itinerary around it."
        : "We've pre-filled your journey — it spans both the North Coast and Siwa. Add your preferred start date and we'll build the itinerary around it.";
    }
    if (expNamePrefilled) return "We've pre-filled the experience from your selection. Add your preferred date and we'll confirm availability.";
    if (tab === "transport") return "Tell us your route and travel date — we'll confirm vehicle availability within 24 hours.";
    return "We've filled in what we know. Review below and add anything we've missed.";
  }, [accomPropertyPrefilled, expNamePrefilled, paramJourney, journeyDest, tab]);

  /* ── Success state ─────────────────────────────────────── */
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  // Contact details live here, not inside ContactFields, so switching
  // tabs (which unmounts that block) can't wipe what's been typed.
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactReply, setContactReply] = useState("WhatsApp (faster)");
  const [contactNotes, setContactNotes] = useState(paramNotes);
  const contactProps = {
    name: contactName, setName: setContactName,
    email: contactEmail, setEmail: setContactEmail,
    phone: contactPhone, setPhone: setContactPhone,
    reply: contactReply, setReply: setContactReply,
    notes: contactNotes, setNotes: setContactNotes,
  };

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [ref, setRef] = useState("");

  // Build "label: value" lines from the active tab's controlled state.
  const buildSummaryLines = (): { label: string; value: string }[] => {
    const lines: { label: string; value: string }[] = [];
    if (tab === "accommodation") {
      lines.push({ label: "Type", value: "Accommodation" });
      const destNames = (["siwa", "north-coast"] as const)
        .filter((d) => accomDests.includes(d))
        .map((d) => (d === "siwa" ? "Siwa Oasis" : "North Coast"));
      if (destNames.length) {
        lines.push({ label: destNames.length > 1 ? "Destinations" : "Destination", value: destNames.join(" + ") });
      }
      if (accomPicks.length) {
        lines.push({ label: accomPicks.length > 1 ? "Properties" : "Property", value: accomPicks.map(hotelNameOf).join(" · ") });
      }
      if (accomSuggest) lines.push({ label: "Suggestions", value: "Not sure yet — please recommend a property" });
      if (travelStyle) lines.push({ label: "Travelling as", value: travelStyle });
      const guests = [accomAdults, accomChildren !== "No children" ? accomChildren : ""].filter(Boolean).join(", ");
      if (guests) lines.push({ label: "Guests", value: guests });
      if (childAges.trim() && (accomChildren !== "No children" || travelStyle === "Family")) {
        lines.push({ label: "Children's ages", value: childAges.trim() });
      }
      if (accomCheckin) lines.push({ label: "Check-in", value: accomCheckin });
      if (accomCheckout) lines.push({ label: "Check-out", value: accomCheckout });
      if (accomFlexible) lines.push({ label: "Dates", value: "Flexible" });
      if (accomRoom) lines.push({ label: "Room preference", value: accomRoom });
    } else if (tab === "experience") {
      // A journey must not reach the team labelled as a one-off
      // experience — it's a multi-night itinerary, and when it has no
      // single destination it covers both regions.
      const journeys = expPicks.filter(isJourneySlug);
      const experiences = expPicks.filter((slug) => !isJourneySlug(slug));
      const isJourneyEnquiry = journeys.length > 0;
      lines.push({
        label: "Type",
        value: isJourneyEnquiry ? (experiences.length ? "Curated journey + experiences" : "Curated journey") : "Experience",
      });
      const destNames = (["siwa", "north-coast"] as const)
        .filter((d) => expDests.includes(d))
        .map((d) => (d === "siwa" ? "Siwa Oasis" : "North Coast"));
      if (destNames.length) {
        lines.push({ label: destNames.length > 1 ? "Destinations" : "Destination", value: destNames.join(" + ") });
      }
      if (journeys.length) {
        lines.push({ label: journeys.length > 1 ? "Journeys" : "Journey", value: journeys.map(expNameOf).join(" · ") });
      }
      if (experiences.length) {
        lines.push({ label: experiences.length > 1 ? "Experiences" : "Experience", value: experiences.map(expNameOf).join(" · ") });
      }
      if (expSuggest) lines.push({ label: "Suggestions", value: "Not sure yet — please suggest experiences" });
      if (travelStyle) {
        lines.push({
          label: "Travelling as",
          value: travelStyle === "Family" && childAges.trim() ? `Family — children aged ${childAges.trim()}` : travelStyle,
        });
      }
      if (expGuests) lines.push({ label: "Guests", value: expGuests });
      if (expDate || expDateTo) {
        const range = expDate && expDateTo && expDateTo !== expDate ? `${expDate} to ${expDateTo}` : expDate || expDateTo;
        lines.push({
          label: isJourneyEnquiry ? "Preferred start date" : expDateTo ? "Dates" : "Date",
          value: expFlexible ? `${range} (flexible)` : range,
        });
      } else if (expFlexible) {
        lines.push({ label: "Dates", value: "Flexible" });
      }
      if (expPrivate) lines.push({ label: "Privacy", value: expPrivate });
      if (expStaying) lines.push({ label: "Staying at", value: expStaying });
    } else if (tab === "transport") {
      lines.push({ label: "Type", value: "Transportation" });
      if (transportRoute) lines.push({ label: "Route", value: transportRoute });
      lines.push({ label: "Trip", value: transportTrip });
      if (transportDate) lines.push({ label: "Travel date", value: transportDate });
      if (transportTime) lines.push({ label: "Departure time", value: transportTime });
      if (transportPax) lines.push({ label: "Passengers", value: transportPax });
      if (transportVehicle) lines.push({ label: "Vehicle preference", value: transportVehicle });
      if (transportPickup) lines.push({ label: "Pickup", value: transportPickup });
      if (transportDropoff) lines.push({ label: "Drop-off", value: transportDropoff });
    }
    return lines;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    const name = String(fd.get("contactName") || "").trim();
    const email = String(fd.get("contactEmail") || "").trim();
    const phone = String(fd.get("contactPhone") || "").trim();
    const replyMethod = String(fd.get("replyMethod") || "").trim();
    const notes = String(fd.get("contactNotes") || "").trim();

    // Name each missing field rather than one generic message, and move
    // focus to the first problem so keyboard and screen-reader users
    // aren't left hunting for it.
    const missing: Array<{ field: string; label: string }> = [];
    if (!name) missing.push({ field: "contactName", label: "your name" });
    if (!email) missing.push({ field: "contactEmail", label: "your email address" });
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      missing.push({ field: "contactEmail", label: "a valid email address" });
    }

    if (missing.length > 0) {
      setErrorMsg(
        `Please add ${missing.map((m) => m.label).join(" and ")} so we can reply.`,
      );
      const first = form.querySelector<HTMLElement>(`[name="${missing[0].field}"]`);
      first?.focus();
      first?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    setErrorMsg(null);
    setSending(true);
    const reference = buildRef();
    const summaryLines = buildSummaryLines();
    if (replyMethod) summaryLines.push({ label: "Preferred reply", value: replyMethod });

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          notes,
          reference,
          source: `Enquire page · ${tab}`,
          summaryLines,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        throw new Error(json?.message || "Could not send your enquiry.");
      }
      setRef(reference);
      setSubmitted(true);
      if (typeof document !== "undefined") {
        document.body.style.overflow = "hidden";
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Something went wrong — please try again.");
    } finally {
      setSending(false);
    }
  };

  const closeSuccess = () => {
    setSubmitted(false);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
    setLocation("/");
  };

  useEffect(() => {
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, []);

  const clearContext = () => {
    setBannerDismissed(true);
    setAccomPicks([]);
    setAccomDests([]);
    setAccomSuggest(false);
    setAccomFlexible(false);
    setAccomChildren("No children");
    setAccomCheckin("");
    setAccomCheckout("");
    setAccomRoom("");
    setExpPicks([]);
    setExpDests([]);
    setExpSuggest(false);
    setTravelStyle("");
    setChildAges("");
    setExpDate("");
    setExpDateTo("");
    setExpFlexible(false);
    setExpStaying("");
    setExpNotes("");
    setTransportRoute("");
    setTransportDate("");
    setTransportTime("");
    setTransportPickup("");
    setTransportDropoff("");
    setLocation("/enquire");
  };

  return (
    <>
      <SEO
        title="Begin your stay — Soléi"
        description="Tell us what you're planning. A conversation starter for accommodation, experiences, or private transportation across Siwa Oasis and Egypt's North Coast."
        path="/enquire"
      />
      <Nav darkHero={false} />

      <main>
        {/* ── HEADER ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-navy px-6 md:px-12 lg:px-20 pt-32 pb-20">
          <div className="absolute inset-0 textile-bg pointer-events-none" />
          <div className="relative z-[2] max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-end">
            <div>
              <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-5 animate-fade-up animation-delay-200">
                <span className="block w-[22px] h-px bg-gold opacity-50" />
                Begin your stay
              </p>
              <h1
                className="font-display font-normal leading-[1.1] text-white animate-fade-up animation-delay-400"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)" }}
              >
                Tell us what
                <br />
                you're <em className="italic text-gold">planning.</em>
              </h1>
            </div>

            <div className="animate-fade-up animation-delay-600 pb-2">
              <p className="text-[0.9rem] text-white/40 leading-[1.95] mb-8">
                This is not a booking form. It's a conversation starter.
                Tell us where you want to go, when, and what matters to
                you — we'll handle the rest and come back to you within 24
                hours.
              </p>
              <div className="flex flex-col gap-[2px]">
                {[
                  "Response within 24 hours — usually same day",
                  "No payment until everything is confirmed",
                  "We work via WhatsApp or email — your preference",
                  "You're talking to the team, not an automated system",
                ].map((p) => (
                  <div
                    key={p}
                    className="flex items-center gap-3 px-5 py-3 border border-gold/10 text-[0.8rem] text-white/45"
                  >
                    <span className="w-[5px] h-[5px] rounded-full bg-gold opacity-60 flex-shrink-0" />
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTEXT BANNER ──────────────────────────────────── */}
        {showBanner && (
          <div className="relative overflow-hidden bg-coastal px-6 md:px-12 lg:px-20 py-5">
            <div className="relative z-[2] max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-8">
              <div className="text-[0.82rem] text-white/70 leading-[1.6]">
                <strong className="text-white font-normal">
                  {bannerTitle}
                </strong>
                <span className="block md:inline md:ml-2 text-white/60">
                  {bannerDesc}
                </span>
              </div>
              <button
                type="button"
                onClick={clearContext}
                className="text-[0.6rem] tracking-[0.15em] uppercase text-white/40 hover:text-white/70 whitespace-nowrap font-body transition-colors"
              >
                Start fresh ×
              </button>
            </div>
          </div>
        )}

        {/* ── MAIN LAYOUT ─────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-20 items-start">
          {/* ── FORM ── */}
          <div className="reveal">
            {/* Type tabs */}
            <div className="mb-12">
              <p className="text-[0.58rem] tracking-[0.3em] uppercase text-ink-soft/60 mb-4">
                What are you enquiring about?
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
                {(["accommodation", "experience", "transport"] as const).map((t) => {
                  const active = tab === t;
                  const labels: Record<EnquiryType, [string, string]> = {
                    accommodation: ["Accommodation", "Hotels & lodges"],
                    experience: ["Experiences", "Activities & guided"],
                    transport: ["Transportation", "Transfers & routes"],
                  };
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTab(t)}
                      className={`px-4 py-4 border bg-white text-[0.65rem] tracking-[0.15em] uppercase text-center font-body transition-colors ${
                        active
                          ? "border-gold text-navy"
                          : "border-sand text-ink-soft hover:bg-cream"
                      }`}
                    >
                      {labels[t][0]}
                      <span className="block text-[0.56rem] opacity-50 mt-0.5">
                        {labels[t][1]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* noValidate so our own check always runs: the native
                bubble is transient, mouse-only and not exposed as a
                summary. Fields keep required/aria-required for
                semantics; handleSubmit produces the visible, announced
                message and moves focus to the first problem. */}
            <form onSubmit={handleSubmit} noValidate>
              {tab === "accommodation" && (
                <div>
                  <h2 className="font-display text-[1.4rem] font-normal text-navy mb-2">
                    Accommodation{" "}
                    <em className="italic text-coastal">enquiry.</em>
                  </h2>
                  <p className="text-[0.82rem] text-ink-soft leading-[1.75] mb-8 pb-8 border-b border-sand-light">
                    Tell us which destinations and properties you're
                    interested in — one or several — your dates, and who's
                    travelling. For Siwa, we'll
                    confirm availability and send a secure booking link. For
                    North Coast, we confirm with the hotel directly and
                    send a secure payment link within 24 hours.
                  </p>

                  <ChoiceButtons
                    label="Destinations"
                    multiple
                    options={[
                      { value: "siwa", label: "Siwa Oasis" },
                      { value: "north-coast", label: "North Coast" },
                    ]}
                    value={accomDests}
                    onChange={changeAccomDests}
                  />

                  <MultiPicker
                    label="Properties"
                    noun="properties"
                    options={hotelOptions}
                    visible={visibleHotelOptions}
                    value={accomPicks}
                    onChange={setAccomPicks}
                    prefilled={accomPropertyPrefilled}
                  />
                  {accomPropertyPrefilled && accomPicks.includes(paramProperty ?? "") && (
                    <div className="-mt-2 mb-4">
                      <PrefillHint>Pre-filled from your selection — add more to compare</PrefillHint>
                    </div>
                  )}
                  <label className="flex items-center gap-2.5 -mt-1 mb-6 text-[0.78rem] text-ink-soft cursor-pointer w-fit">
                    <input
                      type="checkbox"
                      checked={accomSuggest}
                      onChange={(e) => setAccomSuggest(e.target.checked)}
                      className="w-4 h-4 accent-gold"
                    />
                    Not sure yet — recommend a property for us
                  </label>

                  <ChoiceButtons
                    label="Travelling as"
                    optional
                    columns="grid-cols-2 sm:grid-cols-3"
                    options={TRAVEL_STYLES.map((v) => ({ value: v, label: v }))}
                    value={travelStyle ? [travelStyle] : []}
                    onChange={changeTravelStyle}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-1">
                    <Field label="Check-in">
                      <input
                        type="date"
                        value={accomCheckin}
                        onChange={(e) => setAccomCheckin(e.target.value)}
                        className={`w-full px-4 py-3.5 border text-[0.84rem] text-navy font-body focus:border-gold outline-none cursor-pointer ${
                          accomCheckinPrefilled
                            ? "bg-cream border-gold/35"
                            : "bg-white border-sand"
                        }`}
                      />
                    </Field>
                    <Field label="Check-out">
                      <input
                        type="date"
                        value={accomCheckout}
                        min={accomCheckin || undefined}
                        onChange={(e) => setAccomCheckout(e.target.value)}
                        className={`w-full px-4 py-3.5 border text-[0.84rem] text-navy font-body focus:border-gold outline-none cursor-pointer ${
                          accomCheckoutPrefilled
                            ? "bg-cream border-gold/35"
                            : "bg-white border-sand"
                        }`}
                      />
                    </Field>
                  </div>
                  <label className="flex items-center gap-2.5 mb-6 text-[0.78rem] text-ink-soft cursor-pointer w-fit">
                    <input
                      type="checkbox"
                      checked={accomFlexible}
                      onChange={(e) => setAccomFlexible(e.target.checked)}
                      className="w-4 h-4 accent-gold"
                    />
                    My dates are flexible
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-3">
                    <Field label="Adults">
                      <select
                        value={accomAdults}
                        onChange={(e) => setAccomAdults(e.target.value)}
                        className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer"
                      >
                        <option>1 adult</option>
                        <option>2 adults</option>
                        <option>3 adults</option>
                        <option>4 adults</option>
                        <option>5+ adults</option>
                      </select>
                    </Field>
                    <Field label="Children" optional>
                      <select
                        value={accomChildren}
                        onChange={(e) => setAccomChildren(e.target.value)}
                        className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer"
                      >
                        <option>No children</option>
                        <option>1 child</option>
                        <option>2 children</option>
                        <option>3+ children</option>
                      </select>
                    </Field>
                  </div>

                  {(accomChildren !== "No children" || travelStyle === "Family") && (
                    <Field label="Children's ages" optional>
                      <input
                        type="text"
                        value={childAges}
                        onChange={(e) => setChildAges(e.target.value)}
                        placeholder="e.g. 6 and 9 — helps us suggest the right rooms"
                        className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none placeholder:text-ink-soft/35"
                      />
                    </Field>
                  )}

                  <Field label="Room preference" optional>
                    <input
                      type="text"
                      value={accomRoom}
                      onChange={(e) => setAccomRoom(e.target.value)}
                      placeholder="e.g. lake view, ground floor, adjoining rooms"
                      className={`w-full px-4 py-3.5 border text-[0.84rem] text-navy font-body focus:border-gold outline-none placeholder:text-ink-soft/35 ${
                        accomRoomPrefilled
                          ? "bg-cream border-gold/35"
                          : "bg-white border-sand"
                      }`}
                    />
                  </Field>

                  <ContactFields contact={contactProps} />

                  <Submit label="Send accommodation enquiry" sending={sending} error={errorMsg} />
                </div>
              )}

              {tab === "experience" && (
                <div>
                  <h2 className="font-display text-[1.4rem] font-normal text-navy mb-2">
                    Experience <em className="italic text-coastal">enquiry.</em>
                  </h2>
                  <p className="text-[0.82rem] text-ink-soft leading-[1.75] mb-8 pb-8 border-b border-sand-light">
                    Tell us which experiences you're interested in — one or
                    several, in one or both destinations — and your dates.
                    Siwa experiences book directly. North
                    Coast experiences are arranged by our team — we confirm
                    availability and send a payment link within 24 hours.
                  </p>

                  <ChoiceButtons
                    label="Destinations"
                    multiple
                    options={[
                      { value: "siwa", label: "Siwa Oasis" },
                      { value: "north-coast", label: "North Coast" },
                    ]}
                    value={expDests}
                    onChange={changeExpDests}
                  />

                  <MultiPicker
                    label="Experiences"
                    noun="experiences"
                    options={expOptions}
                    visible={visibleExpOptions}
                    value={expPicks}
                    onChange={setExpPicks}
                    prefilled={expNamePrefilled}
                  />
                  {expNamePrefilled && expPicks.includes(initialExpSlug ?? "") && (
                    <div className="-mt-2 mb-4">
                      <PrefillHint>Pre-filled from your selection — add more if you like</PrefillHint>
                    </div>
                  )}
                  <label className="flex items-center gap-2.5 -mt-1 mb-6 text-[0.78rem] text-ink-soft cursor-pointer w-fit">
                    <input
                      type="checkbox"
                      checked={expSuggest}
                      onChange={(e) => setExpSuggest(e.target.checked)}
                      className="w-4 h-4 accent-gold"
                    />
                    Not sure yet — suggest experiences for us
                  </label>

                  <ChoiceButtons
                    label="Travelling as"
                    optional
                    columns="grid-cols-2 sm:grid-cols-3"
                    options={TRAVEL_STYLES.map((v) => ({ value: v, label: v }))}
                    value={travelStyle ? [travelStyle] : []}
                    onChange={changeTravelStyle}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-3">
                    <Field label="Number of guests">
                      <select
                        value={expGuests}
                        onChange={(e) => setExpGuests(e.target.value)}
                        className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer"
                      >
                        <option>1 person</option>
                        <option>2 people</option>
                        <option>3 people</option>
                        <option>4 people</option>
                        <option>5 people</option>
                        <option>6 people</option>
                        <option>7+ people</option>
                      </select>
                    </Field>
                    {travelStyle === "Family" ? (
                      <Field label="Children's ages" optional>
                        <input
                          type="text"
                          value={childAges}
                          onChange={(e) => setChildAges(e.target.value)}
                          placeholder="e.g. 6 and 9"
                          className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none placeholder:text-ink-soft/35"
                        />
                      </Field>
                    ) : (
                      <div className="hidden md:block" />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-1">
                    <Field label="Travel dates — from">
                      <input
                        type="date"
                        value={expDate}
                        onChange={(e) => setExpDate(e.target.value)}
                        className={`w-full px-4 py-3.5 border text-[0.84rem] text-navy font-body focus:border-gold outline-none cursor-pointer ${
                          expDatePrefilled
                            ? "bg-cream border-gold/35"
                            : "bg-white border-sand"
                        }`}
                      />
                    </Field>
                    <Field label="To" optional>
                      <input
                        type="date"
                        value={expDateTo}
                        min={expDate || undefined}
                        onChange={(e) => setExpDateTo(e.target.value)}
                        className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none cursor-pointer"
                      />
                    </Field>
                  </div>
                  <label className="flex items-center gap-2.5 mb-6 text-[0.78rem] text-ink-soft cursor-pointer w-fit">
                    <input
                      type="checkbox"
                      checked={expFlexible}
                      onChange={(e) => setExpFlexible(e.target.checked)}
                      className="w-4 h-4 accent-gold"
                    />
                    My dates are flexible
                  </label>

                  <Field label="Private experience?" optional>
                    <select
                      value={expPrivate}
                      onChange={(e) => setExpPrivate(e.target.value)}
                      className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer"
                    >
                      <option>Group experience (shared with other guests)</option>
                      <option>Private — just our group</option>
                      <option>Not sure — advise us</option>
                    </select>
                  </Field>

                  <Field label="Staying at" optional>
                    <input
                      type="text"
                      value={expStaying}
                      onChange={(e) => setExpStaying(e.target.value)}
                      placeholder="Your property name — so we can coordinate timing"
                      className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none placeholder:text-ink-soft/35"
                    />
                  </Field>

                  <ContactFields notesPlaceholder="Accessibility needs, dietary requirements, questions about the experience, alternative dates…" contact={contactProps} />

                  <Submit label="Send experience enquiry" sending={sending} error={errorMsg} />
                </div>
              )}

              {tab === "transport" && (
                <div>
                  <h2 className="font-display text-[1.4rem] font-normal text-navy mb-2">
                    Transportation{" "}
                    <em className="italic text-coastal">enquiry.</em>
                  </h2>
                  <p className="text-[0.82rem] text-ink-soft leading-[1.75] mb-8 pb-8 border-b border-sand-light">
                    All Soléi transportation is private — never shared.
                    Tell us your route, date, and passenger count. We'll
                    confirm vehicle availability and send a secure payment
                    link within 24 hours.
                  </p>

                  <Field label="Route">
                    <select
                      value={transportRoute}
                      onChange={(e) => setTransportRoute(e.target.value)}
                      className={`w-full px-4 py-3.5 border text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer ${
                        transportRoutePrefilled
                          ? "bg-cream border-gold/35"
                          : "bg-white border-sand"
                      }`}
                    >
                      <option value="">Select your route</option>
                      {routeGroups.groups.map((group) =>
                        group.options.length > 0 ? (
                          <optgroup key={group.label} label={group.label}>
                            {group.options.map((opt) => (
                              <option key={opt}>{opt}</option>
                            ))}
                          </optgroup>
                        ) : null,
                      )}
                      {transportRoute && !routeGroups.groups.some((g) => g.options.includes(transportRoute)) && (
                        <option>{transportRoute}</option>
                      )}
                      <option>Something else (describe in notes)</option>
                    </select>
                    {transportRoutePrefilled && (
                      <PrefillHint>Pre-filled from your selection</PrefillHint>
                    )}
                  </Field>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-3">
                    <Field label="Trip">
                      <select
                        value={transportTrip}
                        onChange={(e) => setTransportTrip(e.target.value)}
                        className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer"
                      >
                        <option>One way</option>
                        <option>Return</option>
                      </select>
                    </Field>
                    <Field label="Travel date">
                      <input
                        type="date"
                        value={transportDate}
                        onChange={(e) => setTransportDate(e.target.value)}
                        className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none cursor-pointer"
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-3">
                    <Field label="Departure time (approx.)">
                      <input
                        type="text"
                        value={transportTime}
                        onChange={(e) => setTransportTime(e.target.value)}
                        placeholder="e.g. 6:00am"
                        className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none placeholder:text-ink-soft/35"
                      />
                    </Field>
                    <Field label="Passengers">
                      <select
                        value={transportPax}
                        onChange={(e) => setTransportPax(e.target.value)}
                        className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer"
                      >
                        <option>1 passenger</option>
                        <option>2 passengers</option>
                        <option>3 passengers</option>
                        <option>4 passengers</option>
                        <option>5–6 passengers</option>
                        <option>7–8 passengers</option>
                      </select>
                    </Field>
                  </div>

                  <Field label="Vehicle preference">
                    <select
                      value={transportVehicle}
                      onChange={(e) => setTransportVehicle(e.target.value)}
                      className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer"
                    >
                      <option>Let Soléi decide</option>
                      {routeGroups.vehicles.map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </Field>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-3">
                    <Field label="Pickup location">
                      <input
                        type="text"
                        value={transportPickup}
                        onChange={(e) => setTransportPickup(e.target.value)}
                        placeholder="Hotel name, address, or area"
                        className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none placeholder:text-ink-soft/35"
                      />
                    </Field>
                    <Field label="Drop-off location">
                      <input
                        type="text"
                        value={transportDropoff}
                        onChange={(e) => setTransportDropoff(e.target.value)}
                        placeholder="Property name or destination"
                        className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none placeholder:text-ink-soft/35"
                      />
                    </Field>
                  </div>

                  <ContactFields notesPlaceholder="Flight number for airport pickups, child seats, luggage details, accessibility needs…" contact={contactProps} />

                  <Submit label="Send transportation request" sending={sending} error={errorMsg} />
                </div>
              )}
            </form>
          </div>

          {/* ── INFO SIDEBAR ── */}
          <aside className="lg:sticky lg:top-[100px]">
            <div className="relative overflow-hidden bg-navy p-7 mb-[2px]">
              <div className="absolute inset-0 textile-bg pointer-events-none" />
              <div className="relative z-[2]">
                <p className="text-[0.56rem] tracking-[0.28em] uppercase text-gold/75 mb-1">
                  Response time
                </p>
                <div className="font-display text-[2rem] text-white font-normal leading-none mb-2">
                  24 hours
                </div>
                <p className="text-[0.78rem] text-white/40 leading-[1.7]">
                  Usually same day. We don't operate an automated reply
                  system — your enquiry goes directly to the team, and a
                  person responds.
                </p>
              </div>
            </div>

            <div className="mt-[2px]">
              <p className="text-[0.58rem] tracking-[0.28em] uppercase text-ink-soft/55 px-7 pt-5 pb-3 bg-white border border-sand border-b-0">
                What happens next
              </p>
              <ul className="list-none bg-white border border-sand border-t-0">
                {[
                  {
                    n: "1.",
                    strong: "We receive your enquiry",
                    rest: " and check availability directly — with the property, guide, or vehicle provider.",
                  },
                  {
                    n: "2.",
                    strong: "We come back to you",
                    rest: " with confirmation, pricing, and any questions — via WhatsApp or email.",
                  },
                  {
                    n: "3.",
                    strong: "Payment link sent",
                    rest: " once everything is agreed. Secure, in USD. No payment before you're ready.",
                  },
                  {
                    n: "4.",
                    strong: "Full confirmation",
                    rest: " with everything you need — booking details, what to expect, our personal recommendations.",
                  },
                ].map((s, i, arr) => (
                  <li
                    key={s.n}
                    className={`flex gap-3 items-start px-7 py-3 ${
                      i === arr.length - 1 ? "" : "border-b border-sand-light"
                    }`}
                  >
                    <span className="font-display italic text-[0.82rem] text-gold/70 min-w-4">
                      {s.n}
                    </span>
                    <p className="text-[0.78rem] text-ink-soft leading-[1.7]">
                      <strong className="text-navy font-normal">
                        {s.strong}
                      </strong>
                      {s.rest}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-sand-light border border-sand px-6 py-5 mt-[2px] flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  className="w-[18px] h-[18px] fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div className="text-[0.8rem] text-ink-soft leading-[1.6]">
                <strong className="text-navy font-normal block mb-0.5">
                  Prefer to message directly?
                </strong>
                Send us a WhatsApp — same team, faster response for
                time-sensitive requests.
                <a
                  href={contact.whatsappHref(
                    "Hello Soléi — I'd like help planning a trip.",
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="block mt-2 text-[0.6rem] tracking-[0.15em] uppercase text-coastal"
                >
                  Open WhatsApp — {contact.whatsappLabel} →
                </a>
              </div>
            </div>

            <div className="bg-white border border-sand p-7 mt-[2px]">
              <h3 className="font-display text-[1rem] text-navy mb-2">
                Combining <em className="italic text-coastal">both destinations?</em>
              </h3>
              <p className="text-[0.8rem] text-ink-soft leading-[1.8] mb-4">
                Many guests do Siwa and the North Coast in a single trip.
                We'll coordinate the full routing — accommodation,
                experiences, and transportation — across both legs in one
                conversation.
              </p>
              <Link
                href="/our-story"
                className="inline-flex items-center gap-1.5 text-[0.58rem] tracking-[0.18em] uppercase text-gold hover:gap-2.5 transition-all"
              >
                Read our story →
              </Link>
            </div>
          </aside>
        </section>

        {/* ── TRUST SECTION ───────────────────────────────────── */}
        <section className="bg-white border-t border-sand px-6 md:px-12 lg:px-20 py-20 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="reveal max-w-[55ch] mb-12">
              <h2
                className="font-display font-normal text-navy leading-[1.2] mb-3"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
              >
                Why guests{" "}
                <em className="italic text-coastal">choose us.</em>
              </h2>
              <p className="text-[0.88rem] text-ink-soft leading-[1.9]">
                Not a booking platform. Not an OTA. A small team that knows
                both destinations from the inside and takes responsibility
                for every stay we arrange.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[2px]">
              {[
                {
                  num: "8+",
                  label: "Years in Siwa",
                  desc: "We grew up here. The oasis is not a product for us — it is the place this brand was built around.",
                },
                {
                  num: "24h",
                  label: "Response guarantee",
                  desc: "Every enquiry gets a personal response within 24 hours. Usually same day. Always from a person.",
                },
                {
                  num: "0",
                  label: "Automated replies",
                  desc: "Your enquiry goes directly to the team and a person replies — no auto-responders. (Ask Soléi, in the menu, is our AI planning assistant; this form is not.)",
                },
                {
                  num: "100%",
                  label: "Private transport",
                  desc: "Every vehicle we arrange is private. We don't share vehicles across bookings regardless of group size.",
                },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className={`reveal ${i % 2 === 1 ? "reveal-d1" : ""} px-7 py-8 border border-sand bg-cream`}
                >
                  <div className="font-display text-[1.8rem] text-gold font-normal leading-none mb-2">
                    {item.num}
                  </div>
                  <p className="text-[0.62rem] tracking-[0.1em] uppercase text-ink-soft/55 mb-3">
                    {item.label}
                  </p>
                  <p className="text-[0.78rem] text-ink-soft leading-[1.75]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CLOSING ─────────────────────────────────────────── */}
        <section className="bg-cream border-t border-sand px-6 md:px-12 lg:px-20 py-24 md:py-28 text-center">
          <div className="max-w-xl mx-auto">
            <div className="flex justify-center mb-10">
              <Arch className="w-14" />
            </div>
            <h2
              className="reveal font-display font-normal leading-[1.2] text-navy mb-5"
              style={{ fontSize: "clamp(1.7rem, 4vw, 3rem)" }}
            >
              Come as you are.
              <br />
              We'll take care of the{" "}
              <em className="italic text-coastal">rest.</em>
            </h2>
            <p className="reveal text-[0.88rem] text-ink-soft leading-[1.95]">
              Whatever stage of planning you're at — a firm date, a loose
              idea, or just a feeling that Egypt should happen this year —
              we're here. Send the enquiry. We'll take it from there.
            </p>
          </div>
        </section>
      </main>

      <Footer />

      {/* ── SUCCESS OVERLAY ─────────────────────────────────── */}
      {submitted && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[300] flex items-center justify-center bg-navy-deep/85 backdrop-blur-md px-4"
        >
          <div className="bg-white max-w-[520px] w-full p-10 md:p-14 text-center">
            <div className="flex justify-center mb-8">
              <Arch className="w-12" />
            </div>
            <h2 className="font-display text-[1.8rem] md:text-[2rem] font-normal text-navy leading-[1.25] mb-4">
              We have your <em className="italic text-gold">enquiry.</em>
            </h2>
            <p className="text-[0.88rem] text-ink-soft leading-[1.9] mb-8">
              Someone from our team will be in touch within 24 hours —
              usually sooner. We'll confirm availability, answer any
              questions, and send next steps via WhatsApp or email,
              whichever you prefer.
            </p>
            <p className="text-[0.7rem] text-ink-soft/50 mb-8 tracking-wide">
              Reference:{" "}
              <strong className="font-display text-navy font-medium">
                {ref}
              </strong>
            </p>
            <button
              type="button"
              onClick={closeSuccess}
              className="text-[0.62rem] tracking-[0.2em] uppercase text-navy bg-gold px-10 py-3 font-body font-medium hover:bg-gold-light transition-colors"
            >
              Back to Soléi
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
 *  Helpers
 * ────────────────────────────────────────────────────────────── */

/** "Preferred reply method" → "preferredReplyMethod" */
function labelToName(label: string): string {
  const words = label
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  return words
    .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join("");
}

/**
 * Labelled form row.
 *
 * The <label> used to have no `htmlFor`, so not one control on this page
 * had an accessible name — screen readers announced the date inputs as
 * bare textboxes, and several fields had no `name` either. Field now
 * generates an id, binds the label to it, and injects the id/name onto
 * its child control, so every call site is fixed at once.
 */
function Field({
  label,
  children,
  optional,
  required,
}: {
  label: string;
  children: React.ReactNode;
  optional?: boolean;
  required?: boolean;
}) {
  const generatedId = useId();
  // Some rows render the control plus a hint, so children can be an
  // array — bind the label to the FIRST element and leave the rest.
  const items = Children.toArray(children);
  const firstElementIndex = items.findIndex((c) => isValidElement(c));
  const firstElement =
    firstElementIndex >= 0 ? (items[firstElementIndex] as React.ReactElement<any>) : null;
  const controlId = firstElement ? (firstElement.props.id ?? generatedId) : undefined;
  const child = firstElement
    ? items.map((c, i) =>
        i === firstElementIndex
          ? cloneElement(firstElement, {
              id: controlId,
              name: firstElement.props.name ?? labelToName(label),
              required: firstElement.props.required ?? required,
              "aria-required": required || undefined,
            })
          : c,
      )
    : children;

  return (
    <div className="mb-4">
      <label
        htmlFor={controlId}
        className={`block text-[0.56rem] tracking-[0.22em] uppercase mb-2 ${
          optional ? "text-ink-soft/35" : "text-ink-soft/55"
        }`}
      >
        {label}
        {required && <span aria-hidden className="text-gold ml-1">*</span>}
        {optional && <span className="normal-case tracking-normal ml-1.5">(optional)</span>}
      </label>
      {child}
    </div>
  );
}

function PrefillHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.62rem] text-gold/75 mt-2 flex items-center gap-1.5">
      <span aria-hidden>✓</span>
      {children}
    </p>
  );
}

/**
 * Contact block. Rendered inside each tab's branch, so it unmounts on
 * every tab switch — which is why these values used to vanish when the
 * visitor moved between Accommodation / Experiences / Transportation.
 * The values now live in the parent and are passed in, so they survive.
 */
function ContactFields({
  notesPlaceholder,
  contact,
}: {
  notesPlaceholder?: string;
  contact: {
    name: string; setName: (v: string) => void;
    email: string; setEmail: (v: string) => void;
    phone: string; setPhone: (v: string) => void;
    reply: string; setReply: (v: string) => void;
    notes: string; setNotes: (v: string) => void;
  };
}) {
  return (
    <>
      <hr className="my-8 border-sand-light" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-3">
        <Field label="Your name" required>
          <input
            type="text"
            name="contactName"
            required
            value={contact.name}
            onChange={(e) => contact.setName(e.target.value)}
            placeholder="Full name"
            className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none placeholder:text-ink-soft/35"
          />
        </Field>
        <Field label="Email address" required>
          <input
            type="email"
            name="contactEmail"
            required
            value={contact.email}
            onChange={(e) => contact.setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none placeholder:text-ink-soft/35"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-3">
        <Field label="WhatsApp number" optional>
          <input
            type="tel"
            name="contactPhone"
            value={contact.phone}
            onChange={(e) => contact.setPhone(e.target.value)}
            placeholder="+20 or country code"
            className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none placeholder:text-ink-soft/35"
          />
        </Field>
        <Field label="Preferred reply method">
          <select
            name="replyMethod"
            value={contact.reply}
            onChange={(e) => contact.setReply(e.target.value)}
            className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer"
          >
            <option>WhatsApp (faster)</option>
            <option>Email</option>
            <option>Either is fine</option>
          </select>
        </Field>
      </div>

      <Field label="Anything else we should know" optional>
        <textarea
          rows={4}
          name="contactNotes"
          value={contact.notes}
          onChange={(e) => contact.setNotes(e.target.value)}
          placeholder={
            notesPlaceholder ??
            "Special occasions, accessibility needs, dietary requirements, questions about the property…"
          }
          className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none resize-y placeholder:text-ink-soft/35"
        />
      </Field>
    </>
  );
}

function Submit({
  label,
  sending,
  error,
}: {
  label: string;
  sending?: boolean;
  error?: string | null;
}) {
  return (
    <div className="mt-8">
      {/* role=alert so the message is announced, not just shown. */}
      <p
        role="alert"
        aria-live="polite"
        className={
          error
            ? "mb-3 text-[0.78rem] text-rose-600 border border-rose-200 bg-rose-50 px-3 py-2"
            : "sr-only"
        }
      >
        {error ?? ""}
      </p>
      <button
        type="submit"
        disabled={sending}
        className="block w-full text-[0.65rem] tracking-[0.2em] uppercase text-navy bg-gold py-5 text-center font-body font-medium hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {sending ? "Sending…" : label}
      </button>
      <p className="text-[0.7rem] text-ink-soft/50 text-center mt-3 leading-[1.6]">
        We'll respond within 24 hours. No payment until availability is
        confirmed.
      </p>
    </div>
  );
}
