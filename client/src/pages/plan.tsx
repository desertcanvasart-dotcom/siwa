import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { useReveal } from "@/components/home/useReveal";
import { HOTEL_DETAILS } from "@/lib/hotel-data";
import { useHotelOverlay } from "@/lib/useHotelOverlay";
import { Clock, ArrowUpRight, Check, ChevronUp, Car, CarFront, Bus, Plane } from "lucide-react";

/**
 * /plan — guided booking flow.
 *
 * Entry point: the "Book now" / "Enquire to book" button on a hotel
 * detail page sends here with the property pre-filled. The visitor is
 * then walked, in order, through:
 *
 *   1. Your stay        (hotel confirmed; dates / guests editable)
 *   2. Getting there    (transportation — destination defaults to the
 *                        hotel's region; skippable)
 *   3. Things to do     (experiences for that destination; skippable)
 *   4. Your details     (contact form → POST /api/enquiry)
 *
 * Linear — no tabs. Optional steps carry a "Skip this step" link so the
 * visitor never has to engage with transport or tours if they don't
 * want them. The final step sends one combined enquiry email.
 */

const STEPS = [
  { id: "stay", label: "Your stay" },
  { id: "transport", label: "Getting there" },
  { id: "experiences", label: "Things to do" },
  { id: "details", label: "Your details" },
] as const;

function fmtDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function destLabel(slug: string): string {
  if (slug === "siwa") return "Siwa Oasis";
  if (slug === "north-coast") return "North Coast";
  if (slug === "cairo") return "Cairo";
  if (slug === "alexandria") return "Alexandria";
  return slug;
}

function buildRef(): string {
  const year = new Date().getFullYear();
  const n = String(Math.floor(Math.random() * 9000) + 1000);
  return `SL-${year}-${n}`;
}

interface ExperienceOption {
  slug: string;
  name: string;
  destination: string | null;
  category: string;
  duration: string;
  pricePerPerson: number;
  imageUrl: string;
  summary: string;
}

function useExperienceOptions(destination: string) {
  const { data = [] } = useQuery<ExperienceOption[]>({
    queryKey: ["/api/experiences"],
    queryFn: async () => {
      const res = await fetch("/api/experiences");
      if (!res.ok) return [];
      const json = await res.json();
      if (!Array.isArray(json)) return [];
      return json.map((e: any) => ({
        slug: e.slug,
        name: e.title,
        destination: e.destination ?? null,
        category: e.category ?? "",
        duration: e.duration ?? "",
        pricePerPerson: parseMoney(e.pricePerPerson),
        imageUrl: e.imageUrl ?? "",
        summary: e.summary ?? "",
      }));
    },
    staleTime: 60_000,
  });
  return useMemo(
    () =>
      data.filter(
        (e) =>
          e.slug &&
          (destination
            ? e.destination === destination
            : e.destination === "siwa" || e.destination === "north-coast"),
      ),
    [data, destination],
  );
}

/* ── Pricing helpers ────────────────────────────────────────── */

/** Pull the first number out of a price string like "€320 / night"
 *  or "150.00" → 320 / 150. Returns 0 when nothing parses. */
function parseMoney(input: unknown): number {
  if (typeof input === "number") return input;
  if (typeof input !== "string") return 0;
  const m = input.replace(/,/g, "").match(/\d+(\.\d+)?/);
  return m ? Math.round(parseFloat(m[0])) : 0;
}

/** Guests dropdown label → head count for per-person pricing. */
const PAX_BY_GUESTS: Record<string, number> = {
  "1 adult": 1,
  "2 adults": 2,
  "2 adults, 1 child": 3,
  "2 adults, 2 children": 4,
  "Family (5+)": 5,
};

/** Private-transfer price per vehicle, keyed "from|to". Mirrors the
 *  published routes on the transportation pages. */
const TRANSFER_PRICES: Record<string, number> = {
  "cairo|siwa": 180,
  "alexandria|siwa": 140,
  "cairo|north-coast": 80,
  "alexandria|north-coast": 45,
};

const euro = (n: number) => `€${n.toLocaleString()}`;

/** Vehicle options for the private transfer. Flight is arranged and
 *  quoted separately by the team, so it carries no road price. */
const VEHICLES = [
  { id: "Limousine", label: "Limousine", Icon: Car },
  { id: "Minivan", label: "Minivan", Icon: CarFront },
  { id: "Van", label: "Van", Icon: Bus },
  { id: "Flight", label: "Flight", Icon: Plane },
] as const;

export default function PlanPage() {
  useReveal();
  const search = useSearch();
  const [, setLocation] = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  /* ── Hotel (pre-filled from the detail page) ─────────────── */
  const propertySlug = params.get("property") || "";
  const hotelDestination =
    params.get("destination") === "north-coast" ? "north-coast" : "siwa";
  const hotelOverlay = useHotelOverlay(propertySlug);
  const hotelName =
    hotelOverlay?.name ||
    (propertySlug && HOTEL_DETAILS[propertySlug]?.name) ||
    "Your selected stay";

  /* ── Step state ──────────────────────────────────────────── */
  const [step, setStep] = useState(0);

  // Stay
  const [checkin, setCheckin] = useState(params.get("checkin") || "");
  const [checkout, setCheckout] = useState(params.get("checkout") || "");
  const [guests, setGuests] = useState(params.get("guests") || "2 adults");
  const room = params.get("room") || "";

  // Transport — "to" defaults to the hotel's destination
  const [trFrom, setTrFrom] = useState("cairo");
  const [trTo, setTrTo] = useState(hotelDestination);
  const [trDate, setTrDate] = useState(params.get("checkin") || "");
  const [trPassengers, setTrPassengers] = useState("");
  const [trVehicle, setTrVehicle] = useState("");
  const [trIncluded, setTrIncluded] = useState(false);

  // Experiences — multi-select; every picked tour goes on the enquiry.
  const expOptions = useExperienceOptions(hotelDestination);
  const [expSlugs, setExpSlugs] = useState<string[]>([]);
  const [expDate, setExpDate] = useState("");
  const expIncluded = expSlugs.length > 0;

  // Details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [ref, setRef] = useState("");

  /* ── Live price estimate ─────────────────────────────────────
     This is an enquiry, not a checkout, so the total is indicative —
     it recomputes as the stay, transfer, and experience change. */
  const pax = PAX_BY_GUESTS[guests] ?? 2;

  const nights = useMemo(() => {
    if (!checkin || !checkout) return 0;
    const diff =
      (new Date(checkout).getTime() - new Date(checkin).getTime()) / 86_400_000;
    return diff > 0 ? Math.round(diff) : 0;
  }, [checkin, checkout]);

  const perNight = useMemo(() => {
    const rooms = hotelOverlay?.details?.rooms?.length
      ? hotelOverlay.details.rooms
      : HOTEL_DETAILS[propertySlug]?.rooms;
    const picked = room ? rooms?.find((r) => r.name === room) : undefined;
    if (picked?.price) return picked.price;
    const fromOverlay = parseMoney(hotelOverlay?.pricePerNight);
    if (fromOverlay) return fromOverlay;
    return HOTEL_DETAILS[propertySlug]?.basePrice ?? 0;
  }, [hotelOverlay, propertySlug, room]);

  const selectedExps = useMemo(
    () => expOptions.filter((e) => expSlugs.includes(e.slug)),
    [expOptions, expSlugs],
  );

  // Flights are quoted by the team, so the road price only applies to
  // road vehicles (or when no vehicle preference was picked).
  const transferPrice =
    trIncluded && trVehicle !== "Flight"
      ? TRANSFER_PRICES[`${trFrom}|${trTo}`] ?? 0
      : 0;

  const estimate = useMemo(() => {
    const items: { label: string; detail: string; amount: number }[] = [];
    if (perNight) {
      items.push({
        label: hotelName,
        detail:
          nights > 0
            ? `${nights} night${nights === 1 ? "" : "s"} × ${euro(perNight)}`
            : `${euro(perNight)} / night — add dates`,
        amount: nights > 0 ? nights * perNight : 0,
      });
    }
    if (trIncluded && trVehicle === "Flight") {
      items.push({
        label: "Flight",
        detail: `${destLabel(trFrom)} → ${destLabel(trTo)} · quoted by our team`,
        amount: 0,
      });
    } else if (trIncluded && transferPrice) {
      items.push({
        label: trVehicle ? `Private transfer · ${trVehicle}` : "Private transfer",
        detail: `${destLabel(trFrom)} → ${destLabel(trTo)} · per vehicle`,
        amount: transferPrice,
      });
    }
    for (const exp of selectedExps) {
      items.push({
        label: exp.name,
        detail: `${euro(exp.pricePerPerson)} pp × ${pax} guest${pax === 1 ? "" : "s"}`,
        amount: exp.pricePerPerson * pax,
      });
    }
    const total = items.reduce((s, i) => s + i.amount, 0);
    return { items, total };
  }, [
    perNight, nights, hotelName, trIncluded, transferPrice, trFrom, trTo,
    trVehicle, selectedExps, pax,
  ]);

  /* If they somehow reach /plan with no property, send them to the
     Siwa hub to pick one. */
  useEffect(() => {
    if (!propertySlug) {
      const t = setTimeout(() => setLocation("/siwa-oasis/accommodation"), 50);
      return () => clearTimeout(t);
    }
  }, [propertySlug, setLocation]);

  useEffect(() => {
    return () => {
      if (typeof document !== "undefined") document.body.style.overflow = "";
    };
  }, []);

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const expName = (slug: string) =>
    expOptions.find((e) => e.slug === slug)?.name || slug;

  const buildSummaryLines = () => {
    const lines: { label: string; value: string }[] = [];
    lines.push({ label: "Stay", value: hotelName });
    lines.push({ label: "Destination", value: destLabel(hotelDestination) });
    if (room) lines.push({ label: "Room", value: room });
    if (checkin) lines.push({ label: "Check-in", value: fmtDate(checkin) });
    if (checkout) lines.push({ label: "Check-out", value: fmtDate(checkout) });
    if (guests) lines.push({ label: "Guests", value: guests });

    if (trIncluded && (trFrom || trTo)) {
      lines.push({ label: "Transfer", value: `${destLabel(trFrom)} → ${destLabel(trTo)}` });
      if (trVehicle) lines.push({ label: "Vehicle", value: trVehicle });
      if (trDate) lines.push({ label: "Transfer date", value: fmtDate(trDate) });
      if (trPassengers) lines.push({ label: "Passengers", value: trPassengers });
    }
    if (expIncluded) {
      lines.push({
        label: expSlugs.length === 1 ? "Experience" : "Experiences",
        value: expSlugs.map(expName).join(", "),
      });
      if (expDate) lines.push({ label: "Experience date", value: fmtDate(expDate) });
    }
    if (estimate.total > 0) {
      lines.push({ label: "Estimated total", value: `${euro(estimate.total)} (indicative)` });
    }
    return lines.filter((l) => l.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (!name || !email) {
      setErrorMsg("Please add your name and email.");
      return;
    }
    setErrorMsg(null);
    setSending(true);
    const reference = buildRef();
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
          source: "Guided plan",
          summaryLines: buildSummaryLines(),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        throw new Error(json?.message || "Could not send your enquiry.");
      }
      setRef(reference);
      setSubmitted(true);
      if (typeof document !== "undefined") document.body.style.overflow = "hidden";
    } catch (err: any) {
      setErrorMsg(err?.message || "Something went wrong — please try again.");
    } finally {
      setSending(false);
    }
  };

  const closeSuccess = () => {
    setSubmitted(false);
    if (typeof document !== "undefined") document.body.style.overflow = "";
    setLocation("/");
  };

  return (
    <>
      <SEO
        title="Plan your stay — Soléi"
        description="Add transportation and experiences to your stay, then send your enquiry. The Soléi team confirms within 24 hours."
        path="/plan"
      />
      <Nav darkHero={false} />

      <main className="bg-cream min-h-screen pb-32 md:pb-36">
        {/* HEADER */}
        <section className="relative overflow-hidden bg-navy px-6 md:px-12 lg:px-20 pt-28 pb-10 md:pt-32 md:pb-12">
          <div className="absolute inset-0 textile-bg pointer-events-none" />
          <div className="relative z-[2] max-w-4xl mx-auto">
            <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-4">
              <span className="block w-[22px] h-px bg-gold opacity-50" />
              Plan your journey
            </p>
            <h1
              className="font-display font-normal leading-[1.12] text-white"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              {hotelName}
            </h1>
            <p className="text-[0.86rem] text-white/45 mt-3">
              {destLabel(hotelDestination)} · Add transport and experiences, or
              skip straight to sending your enquiry.
            </p>
          </div>
        </section>

        {/* PROGRESS RAIL */}
        <div className="sticky top-[60px] z-30 bg-cream/95 backdrop-blur border-b border-sand">
          <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 flex">
            {STEPS.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => i <= step && setStep(i)}
                  disabled={i > step}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-[0.58rem] tracking-[0.18em] uppercase border-b-2 -mb-px transition-colors ${
                    active
                      ? "border-gold text-navy"
                      : done
                        ? "border-gold/40 text-navy/60 hover:text-navy"
                        : "border-transparent text-ink-soft/40"
                  }`}
                >
                  <span
                    className={`font-display italic ${active || done ? "text-gold" : "text-ink-soft/40"}`}
                  >
                    {i + 1}.
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <section className="px-6 md:px-12 lg:px-20 pt-10 md:pt-14">
          <div className="max-w-4xl mx-auto">
            {/* ── STEP 1 — STAY ─────────────────────────────── */}
            {step === 0 && (
              <StepShell
                eyebrow="Step 01"
                title="Your stay"
                desc="We've carried over your selection. Adjust the dates or guests if you need to, then continue."
              >
                <div className="bg-white border border-sand p-6 md:p-7">
                  <p className="text-[0.55rem] tracking-[0.22em] uppercase text-gold mb-1">
                    {destLabel(hotelDestination)}
                  </p>
                  <h3 className="font-display text-[1.4rem] text-navy mb-1">{hotelName}</h3>
                  {room && (
                    <p className="text-[0.8rem] text-ink-soft mb-5">{room}</p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <Field label="Check-in">
                      <input type="date" value={checkin} onChange={(e) => setCheckin(e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Check-out">
                      <input type="date" value={checkout} min={checkin || undefined} onChange={(e) => setCheckout(e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Guests">
                      <select value={guests} onChange={(e) => setGuests(e.target.value)} className={inputCls}>
                        <option>1 adult</option>
                        <option>2 adults</option>
                        <option>2 adults, 1 child</option>
                        <option>2 adults, 2 children</option>
                        <option>Family (5+)</option>
                      </select>
                    </Field>
                  </div>
                </div>
                <StepNav onContinue={next} continueLabel="Continue to transport" />
              </StepShell>
            )}

            {/* ── STEP 2 — TRANSPORT ────────────────────────── */}
            {step === 1 && (
              <StepShell
                eyebrow="Step 02"
                title="Getting there"
                desc={`How would you like to reach ${destLabel(hotelDestination)}? We arrange private transfers — or skip this if you've got it covered.`}
              >
                <div className="bg-white border border-sand p-6 md:p-7">
                  {/* Vehicle preference — compact chip row; 2×2 on
                      mobile, one row on larger screens. */}
                  <Field label="How would you like to travel?">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {VEHICLES.map(({ id, label, Icon }) => {
                        const active = trVehicle === id;
                        return (
                          <button
                            key={id}
                            type="button"
                            aria-pressed={active}
                            onClick={() => {
                              const nextVehicle = active ? "" : id;
                              setTrVehicle(nextVehicle);
                              if (nextVehicle) setTrIncluded(true);
                            }}
                            className={`flex items-center justify-center gap-1.5 px-2 py-2.5 border text-[0.6rem] tracking-[0.14em] uppercase transition-colors ${
                              active
                                ? "border-gold bg-gold/10 text-navy"
                                : "border-sand text-ink-soft hover:border-gold/50"
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? "text-gold" : "text-ink-soft/50"}`} strokeWidth={2} />
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                    <Field label="From">
                      <select value={trFrom} onChange={(e) => { setTrFrom(e.target.value); setTrIncluded(true); }} className={inputCls}>
                        <option value="cairo">Cairo</option>
                        <option value="alexandria">Alexandria</option>
                      </select>
                    </Field>
                    <Field label="To">
                      <select value={trTo} onChange={(e) => { setTrTo(e.target.value); setTrIncluded(true); }} className={inputCls}>
                        <option value="siwa">Siwa Oasis</option>
                        <option value="north-coast">North Coast</option>
                      </select>
                    </Field>
                    <Field label="Travel date">
                      <input type="date" value={trDate} onChange={(e) => { setTrDate(e.target.value); setTrIncluded(true); }} className={inputCls} />
                    </Field>
                    <Field label="Passengers">
                      <select value={trPassengers} onChange={(e) => { setTrPassengers(e.target.value); setTrIncluded(true); }} className={inputCls}>
                        <option value="">Select</option>
                        <option>1 passenger</option>
                        <option>2 passengers</option>
                        <option>3 passengers</option>
                        <option>4 passengers</option>
                        <option>5+ passengers</option>
                      </select>
                    </Field>
                  </div>
                  <label className="flex items-center gap-2 mt-5 text-[0.78rem] text-ink-soft">
                    <input type="checkbox" checked={trIncluded} onChange={(e) => setTrIncluded(e.target.checked)} />
                    Include a private transfer in my enquiry
                  </label>
                </div>
                <StepNav
                  onBack={back}
                  onContinue={next}
                  onSkip={() => { setTrIncluded(false); next(); }}
                  continueLabel="Continue to experiences"
                />
              </StepShell>
            )}

            {/* ── STEP 3 — EXPERIENCES ──────────────────────── */}
            {step === 2 && (
              <StepShell
                eyebrow="Step 03"
                title="Things to do"
                desc="Add as many experiences as you like — desert nights, salt lakes, sunset sailing. Optional, and never required."
              >
                {expOptions.length === 0 ? (
                  <div className="bg-white border border-sand p-6 md:p-7">
                    <p className="text-[0.82rem] text-ink-soft/65 italic">
                      No experiences available for this destination right now.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {expOptions.map((x) => (
                        <TourCard
                          key={x.slug}
                          exp={x}
                          selected={expSlugs.includes(x.slug)}
                          hubPath={hotelDestination === "north-coast" ? "north-coast" : "siwa-oasis"}
                          onSelect={() => {
                            // Multi-select: clicking toggles this tour
                            // without touching the others.
                            setExpSlugs((prev) =>
                              prev.includes(x.slug)
                                ? prev.filter((s) => s !== x.slug)
                                : [...prev, x.slug],
                            );
                          }}
                        />
                      ))}
                    </div>
                    {expIncluded && (
                      <div className="bg-white border border-sand p-5 md:p-6 mt-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                          <Field label="Preferred date">
                            <input type="date" value={expDate} onChange={(e) => { setExpDate(e.target.value); }} className={inputCls} />
                          </Field>
                          <p className="text-[0.72rem] text-ink-soft/60 leading-[1.6] pb-1">
                            {expSlugs.length === 1
                              ? `Added to your enquiry — ${euro(selectedExps[0]?.pricePerPerson ?? 0)} per person, for ${pax} guest${pax === 1 ? "" : "s"}.`
                              : `${expSlugs.length} experiences added — ${euro(selectedExps.reduce((s, e) => s + e.pricePerPerson, 0))} per person combined, for ${pax} guest${pax === 1 ? "" : "s"}.`}{" "}
                            Final pricing confirmed by our team.
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <StepNav
                  onBack={back}
                  onContinue={next}
                  onSkip={() => { setExpSlugs([]); next(); }}
                  continueLabel="Continue to your details"
                />
              </StepShell>
            )}

            {/* ── STEP 4 — DETAILS + SUMMARY ────────────────── */}
            {step === 3 && (
              <StepShell
                eyebrow="Step 04"
                title="Your details"
                desc="Last step. Leave us a way to reach you and we'll confirm everything within 24 hours."
              >
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-6">
                  {/* Summary */}
                  <div className="bg-white border border-sand p-6 md:p-7">
                    <p className="text-[0.55rem] tracking-[0.28em] uppercase text-gold mb-4">
                      Your journey so far
                    </p>
                    <dl className="divide-y divide-sand-light">
                      {buildSummaryLines().map((l, i) => (
                        <div key={i} className="flex justify-between gap-4 py-3">
                          <dt className="text-[0.6rem] tracking-[0.18em] uppercase text-ink-soft/55">{l.label}</dt>
                          <dd className="text-[0.86rem] text-navy text-right">{l.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  {/* Contact form */}
                  <form onSubmit={handleSubmit} className="bg-white border border-sand p-6 md:p-7 space-y-4">
                    <Field label="Full name"><input value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} /></Field>
                    <Field label="Email"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputCls} /></Field>
                    <Field label="Phone (with country code)"><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+20 1XX XXX XXXX" className={inputCls} /></Field>
                    <Field label="Anything else? (optional)">
                      <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className={`${inputCls} resize-none`} />
                    </Field>
                    {errorMsg && (
                      <p className="text-[0.78rem] text-rose-600 border border-rose-200 bg-rose-50 px-3 py-2">{errorMsg}</p>
                    )}
                    <button
                      type="submit"
                      disabled={!name || !email || sending}
                      className="w-full bg-gold text-navy text-[0.65rem] tracking-[0.22em] uppercase font-medium py-4 hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {sending ? "Sending…" : "Send my enquiry"}
                    </button>
                    <button type="button" onClick={back} className="w-full text-[0.6rem] tracking-[0.2em] uppercase text-ink-soft/65 hover:text-navy transition-colors">
                      ← Back
                    </button>
                  </form>
                </div>
              </StepShell>
            )}
          </div>
        </section>
      </main>

      {/* LIVE ESTIMATE BAR — persistent running total while planning */}
      {!submitted && <EstimateBar items={estimate.items} total={estimate.total} />}

      <Footer />

      {/* SUCCESS MODAL */}
      {submitted && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-navy-deep/85 backdrop-blur-sm px-6">
          <div className="bg-cream max-w-md w-full p-10 text-center border border-gold/30">
            <p className="text-[0.55rem] tracking-[0.32em] uppercase text-gold mb-4">Sent</p>
            <h3 className="font-display font-normal text-navy leading-[1.2] mb-4" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>
              Thank you, {name.split(" ")[0] || "traveller"}.
            </h3>
            <p className="text-[0.88rem] text-ink-soft leading-[1.9] mb-5">
              Your enquiry for <strong className="text-navy">{hotelName}</strong> is in. We'll be in touch within 24 hours at{" "}
              <strong className="text-navy">{email}</strong>.
            </p>
            <p className="text-[0.62rem] tracking-[0.22em] uppercase text-ink-soft/55 mb-7">Reference · {ref}</p>
            <button type="button" onClick={closeSuccess} className="text-[0.62rem] tracking-[0.22em] uppercase text-navy bg-gold px-8 py-3 hover:bg-gold-light transition-colors">
              Back to home
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────── */

const inputCls =
  "w-full px-3 py-3 bg-cream/40 border border-sand text-[0.95rem] sm:text-[0.86rem] text-navy font-body focus:border-gold outline-none appearance-none";

function StepShell({
  eyebrow,
  title,
  desc,
  children,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="reveal">
      <div className="pb-5 mb-6 border-b border-sand">
        <p className="text-[0.55rem] tracking-[0.3em] uppercase text-gold mb-1.5">{eyebrow}</p>
        <h2 className="font-display font-normal text-navy leading-[1.2]" style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)" }}>{title}</h2>
        <p className="text-[0.84rem] text-ink-soft mt-2 max-w-[64ch] leading-[1.8]">{desc}</p>
      </div>
      {children}
    </div>
  );
}

function StepNav({
  onBack,
  onContinue,
  onSkip,
  continueLabel,
}: {
  onBack?: () => void;
  onContinue: () => void;
  onSkip?: () => void;
  continueLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 mt-6">
      <div>
        {onBack && (
          <button type="button" onClick={onBack} className="text-[0.6rem] tracking-[0.2em] uppercase text-ink-soft/65 hover:text-navy transition-colors">
            ← Back
          </button>
        )}
      </div>
      <div className="flex items-center gap-5">
        {onSkip && (
          <button type="button" onClick={onSkip} className="text-[0.6rem] tracking-[0.2em] uppercase text-ink-soft/55 hover:text-navy transition-colors">
            Skip this step
          </button>
        )}
        <button
          type="button"
          onClick={onContinue}
          className="bg-navy text-cream text-[0.62rem] tracking-[0.2em] uppercase px-6 py-3.5 hover:bg-navy-deep transition-colors"
        >
          {continueLabel} →
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[0.58rem] tracking-[0.22em] uppercase text-ink/55 mb-2 block">{label}</label>
      {children}
    </div>
  );
}

/* ── Tour card — image + short detail + select + link to the tour ── */

function TourCard({
  exp,
  selected,
  hubPath,
  onSelect,
}: {
  exp: ExperienceOption;
  selected: boolean;
  hubPath: string;
  onSelect: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`group relative flex gap-0 bg-white border cursor-pointer overflow-hidden transition-all active:scale-[0.99] ${
        selected ? "border-gold shadow-[0_2px_18px_rgba(184,154,91,0.18)]" : "border-sand hover:border-gold/50"
      }`}
    >
      {/* Image */}
      <div className="relative w-[38%] min-h-[128px] flex-shrink-0 overflow-hidden bg-navy">
        {exp.imageUrl ? (
          <img
            src={exp.imageUrl}
            alt={exp.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 textile-bg" />
        )}
        {selected && (
          <span className="absolute top-2 left-2 z-[2] bg-gold text-navy rounded-full p-1">
            <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0 p-4 flex flex-col">
        {exp.category && (
          <p className="text-[0.5rem] tracking-[0.22em] uppercase text-gold/90 mb-1 truncate">
            {exp.category}
          </p>
        )}
        <h4 className="font-display text-[1rem] text-navy leading-tight mb-1.5 truncate">
          {exp.name}
        </h4>
        <div className="flex items-center gap-3 text-[0.62rem] text-ink-soft/70 mb-2">
          {exp.duration && (
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3 text-gold/70" strokeWidth={2} />
              {exp.duration}
            </span>
          )}
        </div>
        <p className="text-[0.72rem] text-ink-soft leading-[1.55] line-clamp-2 mb-3">
          {exp.summary}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="leading-none">
            {exp.pricePerPerson > 0 ? (
              <>
                <span className="text-[0.55rem] text-ink-soft/50 uppercase tracking-wider">From </span>
                <span className="font-display text-[0.95rem] text-navy">{euro(exp.pricePerPerson)}</span>
                <span className="text-[0.6rem] text-ink-soft/55"> pp</span>
              </>
            ) : (
              <span className="text-[0.68rem] text-ink-soft/55">On request</span>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <a
              href={`/${hubPath}/experiences/${exp.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-0.5 text-[0.56rem] tracking-[0.14em] uppercase text-coastal hover:text-navy transition-colors"
            >
              View <ArrowUpRight className="w-3 h-3" strokeWidth={2} />
            </a>
            <span
              className={`text-[0.56rem] tracking-[0.14em] uppercase px-3 py-1.5 transition-colors ${
                selected ? "bg-gold text-navy" : "border border-sand text-navy group-hover:border-gold"
              }`}
            >
              {selected ? "Added" : "Add"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Live estimate bar — fixed at the bottom, expands to a breakdown ── */

function EstimateBar({
  items,
  total,
}: {
  items: { label: string; detail: string; amount: number }[];
  total: number;
}) {
  const [open, setOpen] = useState(false);
  const hasItems = items.length > 0;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40">
      {/* Breakdown sheet */}
      {open && hasItems && (
        <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="bg-white border border-sand border-b-0 shadow-[0_-8px_30px_rgba(9,24,32,0.08)] p-5">
            <p className="text-[0.55rem] tracking-[0.28em] uppercase text-gold mb-3">
              Estimate breakdown
            </p>
            <dl className="divide-y divide-sand-light">
              {items.map((it, i) => (
                <div key={i} className="flex items-start justify-between gap-4 py-2.5">
                  <dt className="min-w-0">
                    <span className="block text-[0.84rem] text-navy truncate">{it.label}</span>
                    <span className="block text-[0.66rem] text-ink-soft/60">{it.detail}</span>
                  </dt>
                  <dd className="font-display text-[0.9rem] text-navy whitespace-nowrap">
                    {it.amount > 0 ? euro(it.amount) : "—"}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="text-[0.64rem] text-ink-soft/55 leading-[1.6] mt-3 pt-3 border-t border-sand-light">
              Indicative only — transfers are priced per vehicle, experiences per person. Our team confirms exact pricing with your enquiry.
            </p>
          </div>
        </div>
      )}

      {/* Bar */}
      <div className="bg-navy border-t border-gold/20">
        <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 py-3 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => hasItems && setOpen((o) => !o)}
            className={`flex items-center gap-2.5 text-left ${hasItems ? "cursor-pointer" : "cursor-default"}`}
            aria-expanded={open}
          >
            <div>
              <p className="text-[0.52rem] tracking-[0.24em] uppercase text-gold/80">
                Estimated total
              </p>
              <p className="font-display text-[1.35rem] text-white leading-none mt-0.5">
                {total > 0 ? euro(total) : "—"}
                <span className="text-[0.6rem] text-white/40 tracking-wide ml-1.5 font-body">indicative</span>
              </p>
            </div>
            {hasItems && (
              <ChevronUp
                className={`w-4 h-4 text-gold/70 transition-transform duration-300 ${open ? "" : "rotate-180"}`}
                strokeWidth={2}
              />
            )}
          </button>
          <p className="hidden sm:block text-[0.66rem] text-white/40 leading-[1.5] max-w-[38%] text-right">
            {total > 0
              ? "Updates as you add transfer & experiences"
              : "Add your dates to see the full estimate"}
          </p>
        </div>
      </div>
    </div>
  );
}
