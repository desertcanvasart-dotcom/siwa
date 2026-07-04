import { useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";

type StepId = "accommodation" | "experiences" | "transportation";

const steps: { id: StepId; label: string; short: string }[] = [
  { id: "accommodation", label: "Accommodation", short: "Stay" },
  { id: "experiences", label: "Experiences", short: "Tours" },
  { id: "transportation", label: "Transportation", short: "Transfers" },
];

interface ExperienceOption {
  slug: string;
  name: string;
  destination: string | null;
  category: string;
}

/**
 * Live experience list from /api/experiences. The public endpoint only
 * returns active (non-draft) records, so anything drafted in the admin
 * automatically disappears from this picker.
 */
function useExperienceOptions() {
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
      }));
    },
    staleTime: 60_000,
  });

  return useMemo(() => {
    // Single-destination experiences only (exclude multi-night journeys,
    // which have a null destination and belong on /journeys).
    const usable = data.filter(
      (e) => e.slug && (e.destination === "siwa" || e.destination === "north-coast"),
    );
    return {
      siwa: usable.filter((e) => e.destination === "siwa"),
      northCoast: usable.filter((e) => e.destination === "north-coast"),
    };
  }, [data]);
}

const fieldBase =
  "w-full bg-transparent text-[0.95rem] sm:text-[0.88rem] text-ink font-body focus:outline-none appearance-none cursor-pointer min-h-[28px]";
// Selects get a custom chevron since appearance-none strips the native one,
// which on iOS Safari makes them look like plain text and feel "broken".
const selectClass = `${fieldBase} bg-no-repeat bg-[right_0.25rem_center] pr-7 bg-[length:10px_10px]`;
const selectStyle: React.CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none' stroke='%230F2436' stroke-width='1.5'><path d='M2 4.5l4 4 4-4'/></svg>\")",
};
const inputClass = fieldBase;
// Kept as an alias so the existing input fields don't churn; selects
// use selectClass + selectStyle for the chevron affordance.
const fieldClass = inputClass;
const labelClass =
  "text-[0.58rem] sm:text-[0.55rem] tracking-[0.22em] sm:tracking-[0.25em] uppercase text-ink/55 mb-2 font-body";
const cellClass =
  "px-5 sm:px-6 py-4 sm:py-5 border-b border-sand last:border-b-0 lg:border-b-0 hover:bg-cream transition-colors";
const dividerClass = "bg-sand w-px hidden lg:block";

/**
 * Multi-step BookingBar — guests progress through Accommodation →
 * Experiences → Transportation, skipping any step they don't need.
 * Each section accumulates its own state; at the end (or on skip-all)
 * the combined params are sent to /enquire so nothing is re-entered.
 */
export function BookingBar() {
  const [stepIdx, setStepIdx] = useState(0);
  const [, setLocation] = useLocation();
  const expOptions = useExperienceOptions();

  // Per-section state
  const [accomDest, setAccomDest] = useState("");
  const [accomCheckin, setAccomCheckin] = useState("");
  const [accomCheckout, setAccomCheckout] = useState("");
  const [accomGuests, setAccomGuests] = useState("");

  const [expDest, setExpDest] = useState("");
  const [expSlug, setExpSlug] = useState("");
  const [expDate, setExpDate] = useState("");
  const [expGuests, setExpGuests] = useState("");

  const [trFrom, setTrFrom] = useState("");
  const [trTo, setTrTo] = useState("");
  const [trDate, setTrDate] = useState("");
  const [trPassengers, setTrPassengers] = useState("");

  const accomFilled = !!(accomDest || accomCheckin || accomCheckout || accomGuests);
  const expFilled = !!(expDest || expSlug || expDate || expGuests);
  const trFilled = !!(trFrom || trTo || trDate || trPassengers);

  const submitEnquiry = () => {
    const params = new URLSearchParams();

    // Determine primary type (which tab the enquire page lands on)
    const primary: StepId = accomFilled
      ? "accommodation"
      : expFilled
      ? "experiences"
      : trFilled
      ? "transportation"
      : steps[stepIdx].id;
    const typeMap = {
      accommodation: "accommodation",
      experiences: "experience",
      transportation: "transport",
    } as const;
    params.set("type", typeMap[primary]);

    // Accommodation params
    if (accomFilled) {
      if (accomDest) params.set("destination", accomDest);
      if (accomCheckin) params.set("checkin", accomCheckin);
      if (accomCheckout) params.set("checkout", accomCheckout);
      if (accomGuests) params.set("guests", accomGuests);
    }
    // Experience params (don't overwrite destination if accom already set it)
    if (expFilled) {
      if (expDest && !params.has("destination")) params.set("destination", expDest);
      if (expSlug) params.set("exp", expSlug);
      if (expDate) params.set("date", expDate);
      if (expGuests && !params.has("guests")) params.set("guests", expGuests);
    }
    // Transport params
    if (trFilled) {
      const route =
        trFrom && trTo
          ? `${trFrom.toLowerCase()}-${trTo.toLowerCase().replace(/\s+/g, "-")}`
          : "";
      if (route) params.set("route", route);
      if (trDate && !params.has("date")) params.set("date", trDate);
      if (trPassengers && !params.has("guests")) params.set("guests", trPassengers);
    }

    setLocation(`/review?${params.toString()}`);
  };

  const goNext = () => {
    if (stepIdx < steps.length - 1) {
      setStepIdx(stepIdx + 1);
    } else {
      submitEnquiry();
    }
  };
  const goBack = () => setStepIdx(Math.max(0, stepIdx - 1));
  const jumpTo = (i: number) => setStepIdx(i);

  const currentStep = steps[stepIdx].id;
  const isLastStep = stepIdx === steps.length - 1;
  const filledCount = [accomFilled, expFilled, trFilled].filter(Boolean).length;

  return (
    <div className="bg-[rgba(253,250,245,0.97)] backdrop-blur-xl border border-sand border-b-0 shadow-[0_-8px_40px_rgba(9,24,32,0.08)]">
      {/* Stepper */}
      <div className="flex border-b border-sand">
        {steps.map((s, i) => {
          const active = i === stepIdx;
          const filledFor = [accomFilled, expFilled, trFilled][i];
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => jumpTo(i)}
              className={`flex-1 px-2 sm:px-4 md:px-6 py-3.5 sm:py-4 text-[0.6rem] sm:text-[0.62rem] tracking-[0.16em] sm:tracking-[0.2em] uppercase
                border-b-2 -mb-px transition-all duration-300 font-body flex items-center justify-center gap-1.5 sm:gap-2
                ${
                  active
                    ? "text-navy border-gold opacity-100"
                    : filledFor
                    ? "text-navy/70 border-gold/40 opacity-90"
                    : "text-ink opacity-40 border-transparent hover:opacity-70"
                }`}
            >
              <span className="text-gold/80 font-display italic">{i + 1}.</span>
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{s.short}</span>
              {filledFor && !active && (
                <span className="text-gold text-[0.7rem] leading-none">·</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Fields per step — experiences has 3 cells, the others have 4 */}
      <div
        className={`grid grid-cols-1 ${
          currentStep === "experiences"
            ? "lg:grid-cols-[2fr_1px_1fr_1px_1fr]"
            : "lg:grid-cols-[1.4fr_1px_1fr_1px_1fr_1px_1fr]"
        }`}
      >
        {currentStep === "accommodation" && (
          <>
            <div className={cellClass}>
              <p className={labelClass}>Destination</p>
              <select
                value={accomDest}
                onChange={(e) => setAccomDest(e.target.value)}
                className={selectClass}
                style={selectStyle}
              >
                <option value="">Siwa or North Coast</option>
                <option value="siwa">Siwa Oasis</option>
                <option value="north-coast">North Coast</option>
              </select>
            </div>
            <div className={dividerClass} />
            <DateCell label="Check-in" value={accomCheckin} onChange={setAccomCheckin} />
            <div className={dividerClass} />
            <DateCell
              label="Check-out"
              value={accomCheckout}
              onChange={setAccomCheckout}
              min={accomCheckin || undefined}
            />
            <div className={dividerClass} />
            <div className={cellClass}>
              <p className={labelClass}>Guests</p>
              <select
                value={accomGuests}
                onChange={(e) => setAccomGuests(e.target.value)}
                className={selectClass}
                style={selectStyle}
              >
                <option value="">2 adults</option>
                <option>1 adult</option>
                <option>2 adults</option>
                <option>3 adults</option>
                <option>4 adults</option>
                <option>2 adults, 1 child</option>
                <option>2 adults, 2 children</option>
                <option>Family (5+)</option>
              </select>
            </div>
          </>
        )}

        {currentStep === "experiences" && (
          <>
            <div className={cellClass}>
              <p className={labelClass}>Experience</p>
              <select
                value={expSlug}
                onChange={(e) => {
                  const value = e.target.value;
                  setExpSlug(value);
                  // Infer destination from the chosen experience so the
                  // user never has to pick it manually first.
                  if (expOptions.siwa.some((x) => x.slug === value)) {
                    setExpDest("siwa");
                  } else if (expOptions.northCoast.some((x) => x.slug === value)) {
                    setExpDest("north-coast");
                  } else {
                    setExpDest("");
                  }
                }}
                className={selectClass}
                style={selectStyle}
              >
                <option value="">Choose an experience</option>
                {expOptions.siwa.length > 0 && (
                  <optgroup label="Siwa Oasis">
                    {expOptions.siwa.map((x) => (
                      <option key={x.slug} value={x.slug}>
                        {x.name}
                      </option>
                    ))}
                  </optgroup>
                )}
                {expOptions.northCoast.length > 0 && (
                  <optgroup label="North Coast">
                    {expOptions.northCoast.map((x) => (
                      <option key={x.slug} value={x.slug}>
                        {x.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
            <div className={dividerClass} />
            <DateCell
              label="Date"
              value={expDate}
              onChange={setExpDate}
            />
            <div className={dividerClass} />
            <div className={cellClass}>
              <p className={labelClass}>Guests</p>
              <select
                value={expGuests}
                onChange={(e) => setExpGuests(e.target.value)}
                className={selectClass}
                style={selectStyle}
              >
                <option value="">2 people</option>
                <option>1 person</option>
                <option>2 people</option>
                <option>3 people</option>
                <option>4 people</option>
                <option>5 people</option>
                <option>6 people</option>
                <option>7+ people</option>
              </select>
            </div>
          </>
        )}

        {currentStep === "transportation" && (
          <>
            <div className={cellClass}>
              <p className={labelClass}>From</p>
              <select
                value={trFrom}
                onChange={(e) => setTrFrom(e.target.value)}
                className={selectClass}
                style={selectStyle}
              >
                <option value="">Cairo or Alexandria</option>
                <option value="cairo">Cairo</option>
                <option value="alexandria">Alexandria</option>
              </select>
            </div>
            <div className={dividerClass} />
            <div className={cellClass}>
              <p className={labelClass}>To</p>
              <select
                value={trTo}
                onChange={(e) => setTrTo(e.target.value)}
                className={selectClass}
                style={selectStyle}
              >
                <option value="">Siwa or North Coast</option>
                <option value="siwa">Siwa Oasis</option>
                <option value="north-coast">North Coast</option>
              </select>
            </div>
            <div className={dividerClass} />
            <DateCell label="Date" value={trDate} onChange={setTrDate} />
            <div className={dividerClass} />
            <div className={cellClass}>
              <p className={labelClass}>Passengers</p>
              <select
                value={trPassengers}
                onChange={(e) => setTrPassengers(e.target.value)}
                className={selectClass}
                style={selectStyle}
              >
                <option value="">2 passengers</option>
                <option>1 passenger</option>
                <option>2 passengers</option>
                <option>3 passengers</option>
                <option>4 passengers</option>
                <option>5 passengers</option>
                <option>6 passengers</option>
                <option>7+ passengers</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* Footer actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 sm:px-6 py-4 border-t border-sand bg-cream/40">
        <div className="flex items-center justify-between sm:justify-start gap-4 text-[0.6rem] tracking-[0.18em] uppercase text-ink-soft/65 font-body">
          <span>
            Step <span className="text-navy font-medium">{stepIdx + 1}</span> of {steps.length}
          </span>
          {filledCount > 0 && (
            <span className="text-gold">
              {filledCount} added
            </span>
          )}
          {stepIdx > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="hover:text-navy transition-colors"
            >
              ← Back
            </button>
          )}
        </div>
        <div className="flex items-center justify-end gap-3">
          {!isLastStep && (
            <button
              type="button"
              onClick={() => setStepIdx(stepIdx + 1)}
              className="text-[0.6rem] tracking-[0.18em] uppercase text-ink-soft/65 hover:text-navy transition-colors font-body"
            >
              Skip
            </button>
          )}
          <button
            type="button"
            onClick={isLastStep ? submitEnquiry : goNext}
            disabled={isLastStep && filledCount === 0}
            className="flex-1 sm:flex-none bg-gold text-navy text-[0.62rem] tracking-[0.2em]
              uppercase font-medium px-6 sm:px-8 py-3 hover:bg-gold-light transition-colors
              whitespace-nowrap font-body disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLastStep ? "Submit Enquiry" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingBar;

/**
 * DateCell — wraps a native <input type="date"> with a clearer label,
 * placeholder-style hint when empty, and a calendar icon. The whole
 * cell is tappable on mobile (clicking anywhere opens the picker via
 * showPicker() where supported, otherwise falls back to focus).
 */
function DateCell({
  label,
  value,
  onChange,
  min,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  min?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const openPicker = () => {
    const el = ref.current;
    if (!el) return;
    // showPicker() is supported on Chrome/Edge/iOS Safari 16.4+; fall
    // back to focus() for older browsers.
    try {
      el.showPicker?.();
    } catch {
      /* fall through to focus */
    }
    el.focus();
  };

  const display = value
    ? new Date(value + "T00:00:00").toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : "";

  return (
    <button
      type="button"
      onClick={openPicker}
      className={`${cellClass} text-left w-full relative group`}
    >
      <p className={labelClass}>{label}</p>
      <div className="flex items-center justify-between gap-2 min-h-[28px]">
        <span
          className={`text-[0.95rem] sm:text-[0.88rem] font-body ${
            value ? "text-ink" : "text-ink/35"
          }`}
        >
          {display || "Add date"}
        </span>
        <Calendar
          className={`w-3.5 h-3.5 flex-shrink-0 ${
            value ? "text-gold" : "text-ink/35"
          }`}
          strokeWidth={1.5}
        />
      </div>
      <input
        ref={ref}
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer"
        aria-label={label}
      />
    </button>
  );
}
