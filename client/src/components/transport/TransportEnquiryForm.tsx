import { useState, type FormEvent, type ReactNode } from "react";
import type { ResolvedTransportPage } from "@/lib/transport-content";

/**
 * Booking form for the transportation pages. Sends through the same
 * /api/enquiry pipeline as the Enquire page (owner email + visitor
 * confirmation), and only shows "Request received" once that succeeds.
 *
 * Route and vehicle choices are built from the page's (admin-editable)
 * routes, cards and fleet, so renaming or adding one in the dashboard
 * updates the dropdowns too.
 */

type Accent = "gold" | "coastal";

const ACCENT = {
  gold: {
    focus: "focus:border-gold",
    button: "text-navy bg-gold hover:bg-gold-light",
    link: "text-gold hover:text-gold-light",
  },
  coastal: {
    focus: "focus:border-coastal",
    button: "text-white bg-coastal hover:bg-[#266080]",
    link: "text-coastal hover:text-[#266080]",
  },
} as const;

const PASSENGERS = ["1 passenger", "2 passengers", "3 passengers", "4 passengers", "5–6 passengers", "7–8 passengers"];

function routeLabel(r: { from: string; via: string; to: string }) {
  return [r.from, r.via, r.to].filter(Boolean).join(" → ");
}

function buildRef(): string {
  return `TR-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;
}

export function TransportEnquiryForm({
  t,
  destination,
  accent,
  routesGroupLabel,
  cardsGroupLabel,
  showDropoff,
  pickupPlaceholder,
  departurePlaceholder,
  notesPlaceholder,
}: {
  t: ResolvedTransportPage;
  destination: string;
  accent: Accent;
  routesGroupLabel: string;
  cardsGroupLabel: string;
  showDropoff?: boolean;
  pickupPlaceholder: string;
  departurePlaceholder: string;
  notesPlaceholder: string;
}) {
  const a = ACCENT[accent];
  const input = `w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body ${a.focus} outline-none`;
  const select = `${input} appearance-none cursor-pointer`;

  const routes = [t.featured, ...t.routeItems].map(routeLabel).filter(Boolean);
  const cards = t.cardItems.map((c) => c.title).filter(Boolean);
  const vehicles = t.fleetItems.map((v) => v.name).filter(Boolean);

  const [submitted, setSubmitted] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const get = (name: string) =>
      String(new FormData(form).get(name) ?? "").trim();

    const email = get("email");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please add a valid email address so we can reply.");
      form.querySelector<HTMLElement>('[name="email"]')?.focus();
      return;
    }

    setError(null);
    setSending(true);
    const reference = buildRef();
    const summaryLines = [
      { label: "Request", value: `${destination} transportation` },
      { label: "Route", value: get("route") },
      { label: "Trip", value: get("trip") },
      { label: "Travel date", value: get("date") },
      { label: "Departure time", value: get("time") },
      { label: "Passengers", value: get("passengers") },
      { label: "Vehicle preference", value: get("vehicle") },
      { label: "Pickup", value: get("pickup") },
      { label: "Drop-off", value: get("dropoff") },
    ].filter((l) => l.value);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: get("name"),
          email,
          phone: get("phone"),
          notes: get("notes"),
          reference,
          source: `${destination} transportation page`,
          summaryLines,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        throw new Error(json?.message || "Could not send your request.");
      }
      setSubmitted(reference);
    } catch (err: any) {
      setError(
        `${err?.message || "Something went wrong."} Your details are still in the form — please try again.`,
      );
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white border border-sand p-8">
        <h3 className="font-display text-[1.2rem] text-navy mb-3">Request received.</h3>
        <p className="text-[0.85rem] text-ink-soft leading-[1.8] mb-2">
          Thank you. Our team will confirm vehicle and driver within 24 hours
          and send a secure payment link via WhatsApp or email. A confirmation
          is on its way to your inbox.
        </p>
        <p className="text-[0.75rem] text-ink-soft/60 mb-6">Reference: {submitted}</p>
        <button
          type="button"
          onClick={() => setSubmitted(null)}
          className={`text-[0.58rem] tracking-[0.18em] uppercase transition-colors ${a.link}`}
        >
          Submit another request →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-sand p-7">
      <Field label="Route">
        <select name="route" required defaultValue="" className={select}>
          <option value="" disabled>
            Select your route
          </option>
          {routes.length > 0 && (
            <optgroup label={routesGroupLabel}>
              {routes.map((r, i) => (
                <option key={i}>{r}</option>
              ))}
            </optgroup>
          )}
          {cards.length > 0 && (
            <optgroup label={cardsGroupLabel}>
              {cards.map((c, i) => (
                <option key={i}>{c}</option>
              ))}
            </optgroup>
          )}
          <option>Something else (describe in notes)</option>
        </select>
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-3">
        <Field label="Trip">
          <select name="trip" defaultValue="One way" className={select}>
            <option>One way</option>
            <option>Return</option>
          </select>
        </Field>
        <Field label="Travel date">
          <input name="date" type="date" required className={`${input} cursor-pointer`} />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-3">
        <Field label="Departure time (approx.)">
          <input name="time" type="text" placeholder={departurePlaceholder} className={input} />
        </Field>
        <Field label="Passengers">
          <select name="passengers" defaultValue="2 passengers" className={select}>
            {PASSENGERS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Vehicle preference">
        <select name="vehicle" defaultValue="Let Soléi decide" className={select}>
          <option>Let Soléi decide</option>
          {vehicles.map((v, i) => (
            <option key={i}>{v}</option>
          ))}
        </select>
      </Field>

      <Field label="Pickup location">
        <input name="pickup" type="text" placeholder={pickupPlaceholder} className={input} />
      </Field>

      {showDropoff && (
        <Field label="Drop-off location">
          <input
            name="dropoff"
            type="text"
            placeholder="Property name or destination on the coast"
            className={input}
          />
        </Field>
      )}

      <Field label="Any notes or special requests">
        <textarea name="notes" rows={4} placeholder={notesPlaceholder} className={`${input} resize-y`} />
      </Field>

      <div className="border-t border-sand-light mt-5 pt-5">
        <Field label="Your name">
          <input name="name" type="text" required autoComplete="name" className={input} />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-3">
          <Field label="Email">
            <input name="email" type="email" required autoComplete="email" className={input} />
          </Field>
          <Field label="WhatsApp / phone (optional)">
            <input name="phone" type="tel" autoComplete="tel" className={input} />
          </Field>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-[0.78rem] text-rose-700 leading-[1.6] mb-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className={`block w-full mt-3 text-[0.65rem] tracking-[0.2em] uppercase py-4 font-body font-medium transition-colors disabled:opacity-60 ${a.button}`}
      >
        {sending ? "Sending…" : "Send transportation request"}
      </button>
      <p className="text-[0.68rem] text-ink-soft/50 text-center mt-3 leading-[1.6]">
        We respond within 24 hours. No payment until vehicle and driver are confirmed.
      </p>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block mb-3">
      <span className="block text-[0.56rem] tracking-[0.22em] uppercase text-ink-soft/55 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
