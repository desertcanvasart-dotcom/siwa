import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { useReveal } from "@/components/home/useReveal";
import { Arch } from "@/components/ui/Arch";
import { HOTEL_DETAILS } from "@/lib/hotel-data";
import { EXPERIENCE_DETAILS } from "@/lib/experience-data";

/** Slugs the public API still publishes (drafts are filtered server-side). */
function useActiveSlugs(endpoint: string): Set<string> {
  const { data } = useQuery<string[]>({
    queryKey: [endpoint],
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

const ROUTE_OPTIONS = [
  {
    label: "Routes to Siwa Oasis",
    options: [
      "Cairo → Siwa Oasis (~8 hrs)",
      "Marsa Matrouh → Siwa (~3 hrs)",
      "Alexandria → Siwa (~6 hrs)",
    ],
  },
  {
    label: "Return from Siwa",
    options: [
      "Siwa → Cairo (~8 hrs)",
      "Siwa → Marsa Matrouh (~3 hrs)",
      "Siwa → Alexandria (~6 hrs)",
    ],
  },
  {
    label: "Desert drives within Siwa",
    options: [
      "Great Sand Sea drive (half/full day)",
      "Salt Lakes & Springs circuit",
      "Ancient sites drive",
      "Sunrise desert drive",
      "In-oasis transfer",
      "Full day bespoke",
    ],
  },
  {
    label: "Routes to North Coast",
    options: [
      "Cairo → North Coast (~2.5 hrs)",
      "Alexandria → North Coast (~45 min)",
      "Cairo → Alexandria → North Coast",
      "Airport pickup → North Coast",
    ],
  },
  {
    label: "Return from North Coast",
    options: [
      "North Coast → Cairo (~2.5 hrs)",
      "North Coast → Alexandria (~45 min)",
      "North Coast → Airport",
    ],
  },
  {
    label: "Within the North Coast",
    options: [
      "Marassi ↔ Almaza Bay (~1 hr)",
      "Marassi ↔ El Alamein (~30 min)",
      "Property to experience transfer",
      "On-demand in-area transfer",
      "Cairo day trip (full day)",
    ],
  },
];

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
  const activeExpSlugs = useActiveSlugs("/api/experiences");

  const allHotels = useMemo(() => Object.values(HOTEL_DETAILS), []);
  const siwaHotels = useMemo(
    () => allHotels.filter((h) => h.destination === "siwa-oasis" && activeHotelSlugs.has(h.slug)),
    [allHotels, activeHotelSlugs],
  );
  const ncHotels = useMemo(
    () => allHotels.filter((h) => h.destination === "north-coast" && activeHotelSlugs.has(h.slug)),
    [allHotels, activeHotelSlugs],
  );
  const siwaExps = useMemo(
    () => EXPERIENCE_DETAILS.filter((e) => e.destination === "siwa-oasis" && activeExpSlugs.has(e.slug)),
    [activeExpSlugs],
  );
  const ncExps = useMemo(
    () => EXPERIENCE_DETAILS.filter((e) => e.destination === "north-coast" && activeExpSlugs.has(e.slug)),
    [activeExpSlugs],
  );

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
  const [accomDest, setAccomDest] = useState(initialAccomDest);
  const initialAccomProperty = paramProperty
    ? (allHotels.find((h) => h.slug === paramProperty)?.name ?? "")
    : "";
  const [accomProperty, setAccomProperty] = useState(initialAccomProperty);
  const [accomCheckin, setAccomCheckin] = useState(paramCheckin);
  const [accomCheckout, setAccomCheckout] = useState(paramCheckout);
  const [accomAdults, setAccomAdults] = useState(paramGuests || "2 adults");
  const [accomRoom, setAccomRoom] = useState(paramRoom);

  /* ── Experience form state ─────────────────────────────── */
  const derivedExpDest = paramDest === "north-coast" || paramDest === "siwa"
    ? paramDest
    : paramExp
      ? (ncExps.some((e) => e.slug === paramExp) ? "north-coast" : "siwa")
      : "";
  const [expDest, setExpDest] = useState(derivedExpDest);
  const initialExpName = paramExp
    ? (EXPERIENCE_DETAILS.find((e) => e.slug === paramExp)?.name ?? "")
    : "";
  const [expName, setExpName] = useState(initialExpName);
  const [expDate, setExpDate] = useState(paramDate);
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
  const [expPrivate, setExpPrivate] = useState(
    paramPrivate ? "Private — just our group" : "Group experience (shared with other guests)",
  );
  const [expStaying, setExpStaying] = useState(paramStaying);
  const [expNotes, setExpNotes] = useState(paramNotes);

  /* ── Transport form state ──────────────────────────────── */
  const [transportRoute, setTransportRoute] = useState(paramRoute ?? "");
  const [transportDate, setTransportDate] = useState(paramDate);

  /* ── Prefill flags (drive styling + hints) ─────────────── */
  const accomPropertyPrefilled = !!paramProperty;
  const accomCheckinPrefilled = !!paramCheckin;
  const accomCheckoutPrefilled = !!paramCheckout;
  const accomRoomPrefilled = !!paramRoom;
  const expNamePrefilled = !!paramExp;
  const expDatePrefilled = !!paramDate;
  const transportRoutePrefilled = !!paramRoute;

  /* ── Context banner ────────────────────────────────────── */
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const showBanner = !bannerDismissed && (
    accomPropertyPrefilled ||
    expNamePrefilled ||
    transportRoutePrefilled ||
    paramType !== null
  );

  const bannerTitle = useMemo(() => {
    if (accomPropertyPrefilled) {
      const h = allHotels.find((x) => x.slug === paramProperty);
      return `Accommodation enquiry — ${h?.name ?? paramProperty}`;
    }
    if (expNamePrefilled) {
      const e = EXPERIENCE_DETAILS.find((x) => x.slug === paramExp);
      return `Experience enquiry — ${e?.name ?? paramExp}`;
    }
    if (tab === "transport") return "Transportation enquiry";
    return "Pre-filled from your selection";
  }, [accomPropertyPrefilled, expNamePrefilled, paramProperty, paramExp, tab, allHotels]);

  const bannerDesc = useMemo(() => {
    if (accomPropertyPrefilled) return "We've pre-filled the property from your selection. Add your dates and we'll confirm availability.";
    if (expNamePrefilled) return "We've pre-filled the experience from your selection. Add your preferred date and we'll confirm availability.";
    if (tab === "transport") return "Tell us your route and travel date — we'll confirm vehicle availability within 24 hours.";
    return "We've filled in what we know. Review below and add anything we've missed.";
  }, [accomPropertyPrefilled, expNamePrefilled, tab]);

  /* ── Success state ─────────────────────────────────────── */
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [ref, setRef] = useState("");

  // Build "label: value" lines from the active tab's controlled state.
  const buildSummaryLines = (): { label: string; value: string }[] => {
    const lines: { label: string; value: string }[] = [];
    if (tab === "accommodation") {
      lines.push({ label: "Type", value: "Accommodation" });
      if (accomDest) lines.push({ label: "Destination", value: accomDest === "siwa" ? "Siwa Oasis" : "North Coast" });
      if (accomProperty) lines.push({ label: "Property", value: accomProperty });
      if (accomCheckin) lines.push({ label: "Check-in", value: accomCheckin });
      if (accomCheckout) lines.push({ label: "Check-out", value: accomCheckout });
      if (accomAdults) lines.push({ label: "Guests", value: accomAdults });
      if (accomRoom) lines.push({ label: "Room preference", value: accomRoom });
    } else if (tab === "experience") {
      lines.push({ label: "Type", value: "Experience" });
      if (expDest) lines.push({ label: "Destination", value: expDest === "siwa" ? "Siwa Oasis" : "North Coast" });
      if (expName) lines.push({ label: "Experience", value: expName });
      if (expDate) lines.push({ label: "Date", value: expDate });
      if (expGuests) lines.push({ label: "Guests", value: expGuests });
      if (expPrivate) lines.push({ label: "Privacy", value: expPrivate });
      if (expStaying) lines.push({ label: "Staying at", value: expStaying });
    } else if (tab === "transport") {
      lines.push({ label: "Type", value: "Transportation" });
      if (transportRoute) lines.push({ label: "Route", value: transportRoute });
      if (transportDate) lines.push({ label: "Travel date", value: transportDate });
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

    if (!name || !email) {
      setErrorMsg("Please add your name and email.");
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
    setAccomProperty("");
    setAccomCheckin("");
    setAccomCheckout("");
    setAccomRoom("");
    setExpName("");
    setExpDate("");
    setExpStaying("");
    setExpNotes("");
    setTransportRoute("");
    setTransportDate("");
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

            <form onSubmit={handleSubmit}>
              {tab === "accommodation" && (
                <div>
                  <h2 className="font-display text-[1.4rem] font-normal text-navy mb-2">
                    Accommodation{" "}
                    <em className="italic text-coastal">enquiry.</em>
                  </h2>
                  <p className="text-[0.82rem] text-ink-soft leading-[1.75] mb-8 pb-8 border-b border-sand-light">
                    Tell us which destination and property you're interested
                    in, your dates, and how many guests. For Siwa, we'll
                    confirm in Tab.travel and send a booking link. For
                    North Coast, we confirm with the hotel directly and
                    send a secure payment link within 24 hours.
                  </p>

                  <Field label="Destination">
                    <select
                      value={accomDest}
                      onChange={(e) => {
                        setAccomDest(e.target.value);
                        setAccomProperty("");
                      }}
                      className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer"
                    >
                      <option value="">Select destination</option>
                      <option value="siwa">Siwa Oasis</option>
                      <option value="north-coast">North Coast</option>
                    </select>
                  </Field>

                  <Field label="Property">
                    <select
                      value={accomProperty}
                      onChange={(e) => setAccomProperty(e.target.value)}
                      disabled={!accomDest}
                      className={`w-full px-4 py-3.5 border text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer ${
                        accomPropertyPrefilled
                          ? "bg-cream border-gold/35"
                          : "bg-white border-sand"
                      }`}
                    >
                      <option value="">
                        {accomDest
                          ? "Select a property"
                          : "Select destination first"}
                      </option>
                      {(accomDest === "siwa" ? siwaHotels : accomDest === "north-coast" ? ncHotels : []).map((h) => (
                        <option key={h.slug} value={h.name}>
                          {h.name}
                        </option>
                      ))}
                    </select>
                    {accomPropertyPrefilled && (
                      <PrefillHint>Pre-filled from your selection</PrefillHint>
                    )}
                  </Field>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-3">
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
                        onChange={(e) => setAccomCheckout(e.target.value)}
                        className={`w-full px-4 py-3.5 border text-[0.84rem] text-navy font-body focus:border-gold outline-none cursor-pointer ${
                          accomCheckoutPrefilled
                            ? "bg-cream border-gold/35"
                            : "bg-white border-sand"
                        }`}
                      />
                    </Field>
                  </div>

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
                    <Field label="Children (optional)" optional>
                      <select className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer">
                        <option>No children</option>
                        <option>1 child</option>
                        <option>2 children</option>
                        <option>3+ children</option>
                      </select>
                    </Field>
                  </div>

                  <Field label="Room preference (optional)" optional>
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

                  <ContactFields />

                  <Submit label="Send accommodation enquiry" sending={sending} error={errorMsg} />
                </div>
              )}

              {tab === "experience" && (
                <div>
                  <h2 className="font-display text-[1.4rem] font-normal text-navy mb-2">
                    Experience <em className="italic text-coastal">enquiry.</em>
                  </h2>
                  <p className="text-[0.82rem] text-ink-soft leading-[1.75] mb-8 pb-8 border-b border-sand-light">
                    Tell us which experience you're interested in and your
                    preferred date. Siwa experiences book directly. North
                    Coast experiences are arranged by our team — we confirm
                    availability and send a payment link within 24 hours.
                  </p>

                  <Field label="Destination">
                    <select
                      value={expDest}
                      onChange={(e) => {
                        setExpDest(e.target.value);
                        setExpName("");
                      }}
                      className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer"
                    >
                      <option value="">Select destination</option>
                      <option value="siwa">Siwa Oasis</option>
                      <option value="north-coast">North Coast</option>
                    </select>
                  </Field>

                  <Field label="Experience">
                    <select
                      value={expName}
                      onChange={(e) => setExpName(e.target.value)}
                      disabled={!expDest}
                      className={`w-full px-4 py-3.5 border text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer ${
                        expNamePrefilled
                          ? "bg-cream border-gold/35"
                          : "bg-white border-sand"
                      }`}
                    >
                      <option value="">
                        {expDest
                          ? "Select an experience"
                          : "Select destination first"}
                      </option>
                      {(expDest === "siwa" ? siwaExps : expDest === "north-coast" ? ncExps : []).map((e) => (
                        <option key={e.slug} value={e.name}>
                          {e.name}
                        </option>
                      ))}
                    </select>
                    {expNamePrefilled && (
                      <PrefillHint>Pre-filled from your selection</PrefillHint>
                    )}
                  </Field>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-3">
                    <Field label="Preferred date">
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
                  </div>

                  <Field label="Private experience? (optional)" optional>
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

                  <Field label="Staying at (optional)" optional>
                    <input
                      type="text"
                      value={expStaying}
                      onChange={(e) => setExpStaying(e.target.value)}
                      placeholder="Your property name — so we can coordinate timing"
                      className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none placeholder:text-ink-soft/35"
                    />
                  </Field>

                  <ContactFields notesPlaceholder="Accessibility needs, dietary requirements, questions about the experience, alternative dates…" initialNotes={expNotes} />

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
                      {ROUTE_OPTIONS.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                          {group.options.map((opt) => (
                            <option key={opt}>{opt}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    {transportRoutePrefilled && (
                      <PrefillHint>Pre-filled from your selection</PrefillHint>
                    )}
                  </Field>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-3">
                    <Field label="Travel date">
                      <input
                        type="date"
                        value={transportDate}
                        onChange={(e) => setTransportDate(e.target.value)}
                        className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none cursor-pointer"
                      />
                    </Field>
                    <Field label="Departure time (approx.)">
                      <input
                        type="text"
                        placeholder="e.g. 6:00am"
                        className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none placeholder:text-ink-soft/35"
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-3">
                    <Field label="Passengers">
                      <select
                        defaultValue="2 passengers"
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
                    <Field label="Vehicle preference">
                      <select
                        defaultValue="Let Soléi decide"
                        className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer"
                      >
                        <option>Let Soléi decide</option>
                        <option>Private SUV</option>
                        <option>4×4 Desert Vehicle (Siwa)</option>
                        <option>Premium Sedan (North Coast)</option>
                        <option>Private Minivan</option>
                      </select>
                    </Field>
                  </div>

                  <Field label="Pickup location">
                    <input
                      type="text"
                      placeholder="Hotel name, address, or area"
                      className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none placeholder:text-ink-soft/35"
                    />
                  </Field>

                  <Field label="Drop-off location">
                    <input
                      type="text"
                      placeholder="Property name or destination"
                      className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none placeholder:text-ink-soft/35"
                    />
                  </Field>

                  <ContactFields notesPlaceholder="Flight number for airport pickups, child seats, luggage details, accessibility needs…" />

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
                    rest: " once everything is agreed. Secure, in EUR or USD. No payment before you're ready.",
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
                  href="https://wa.me/201000000000"
                  target="_blank"
                  rel="noreferrer"
                  className="block mt-2 text-[0.6rem] tracking-[0.15em] uppercase text-coastal"
                >
                  Open WhatsApp →
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
                  desc: "No bots. No auto-responders. Your enquiry goes directly to the team and a person replies.",
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

function Field({
  label,
  children,
  optional,
}: {
  label: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <div className="mb-4">
      <label
        className={`block text-[0.56rem] tracking-[0.22em] uppercase mb-2 ${
          optional ? "text-ink-soft/35" : "text-ink-soft/55"
        }`}
      >
        {label}
      </label>
      {children}
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

function ContactFields({
  notesPlaceholder,
  initialNotes,
}: {
  notesPlaceholder?: string;
  initialNotes?: string;
}) {
  const [notes, setNotes] = useState(initialNotes ?? "");
  return (
    <>
      <hr className="my-8 border-sand-light" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-3">
        <Field label="Your name">
          <input
            type="text"
            name="contactName"
            required
            placeholder="Full name"
            className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none placeholder:text-ink-soft/35"
          />
        </Field>
        <Field label="Email address">
          <input
            type="email"
            name="contactEmail"
            required
            placeholder="you@example.com"
            className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none placeholder:text-ink-soft/35"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-3">
        <Field label="WhatsApp number (optional)" optional>
          <input
            type="tel"
            name="contactPhone"
            placeholder="+20 or country code"
            className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none placeholder:text-ink-soft/35"
          />
        </Field>
        <Field label="Preferred reply method">
          <select
            name="replyMethod"
            defaultValue="WhatsApp (faster)"
            className="w-full px-4 py-3.5 bg-white border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer"
          >
            <option>WhatsApp (faster)</option>
            <option>Email</option>
            <option>Either is fine</option>
          </select>
        </Field>
      </div>

      <Field label="Anything else we should know (optional)" optional>
        <textarea
          rows={4}
          name="contactNotes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
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
      {error && (
        <p className="mb-3 text-[0.78rem] text-rose-600 border border-rose-200 bg-rose-50 px-3 py-2">
          {error}
        </p>
      )}
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
