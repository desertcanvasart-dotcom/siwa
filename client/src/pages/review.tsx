import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { useReveal } from "@/components/home/useReveal";

/**
 * /review
 *
 * Lands here from the home-page BookingBar. Shows an editorial
 * overview of what the visitor picked across the three steps
 * (Accommodation / Experiences / Transportation), with a single
 * contact form below and one Confirm button. No re-entry of the
 * details they already provided.
 */

type SectionKey = "accommodation" | "experience" | "transport";

function fmtDate(iso: string | null): string {
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

function destLabel(slug: string | null): string {
  if (slug === "siwa") return "Siwa Oasis";
  if (slug === "north-coast") return "North Coast";
  if (slug === "cairo") return "Cairo";
  if (slug === "alexandria") return "Alexandria";
  return slug ?? "";
}

function expName(slug: string | null): string {
  if (!slug) return "";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function buildRef(): string {
  const year = new Date().getFullYear();
  const n = String(Math.floor(Math.random() * 9000) + 1000);
  return `SL-${year}-${n}`;
}

export default function ReviewPage() {
  useReveal();
  const search = useSearch();
  const [, setLocation] = useLocation();

  const p = useMemo(() => new URLSearchParams(search), [search]);

  /* Pull every field the BookingBar might have set */
  const data = useMemo(
    () => ({
      destination: p.get("destination"),
      checkin: p.get("checkin"),
      checkout: p.get("checkout"),
      guests: p.get("guests"),
      exp: p.get("exp"),
      date: p.get("date"),
      route: p.get("route"),
    }),
    [p],
  );

  const accomFilled = !!(
    data.destination ||
    data.checkin ||
    data.checkout ||
    data.guests
  );
  const expFilled = !!(data.exp || data.date);
  const transportFilled = !!data.route;

  const transportFrom = data.route ? data.route.split("-")[0] : "";
  const transportTo = data.route
    ? data.route.split("-").slice(1).join("-")
    : "";

  const filledCount = [accomFilled, expFilled, transportFilled].filter(
    Boolean,
  ).length;

  /* Contact form */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [ref, setRef] = useState("");

  // Build the "label: value" summary lines that go into the email.
  const buildSummaryLines = () => {
    const lines: { label: string; value: string }[] = [];
    if (accomFilled) {
      lines.push({ label: "Accommodation — destination", value: destLabel(data.destination) });
      lines.push({ label: "Check-in", value: fmtDate(data.checkin) });
      lines.push({ label: "Check-out", value: fmtDate(data.checkout) });
      lines.push({ label: "Guests", value: data.guests ?? "" });
    }
    if (expFilled) {
      lines.push({ label: "Experience", value: expName(data.exp) });
      lines.push({ label: "Experience date", value: fmtDate(data.date) });
    }
    if (transportFilled) {
      lines.push({ label: "Transfer from", value: destLabel(transportFrom) });
      lines.push({ label: "Transfer to", value: destLabel(transportTo) });
    }
    return lines.filter((l) => l.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
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
          source: "Review page",
          summaryLines: buildSummaryLines(),
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

  useEffect(() => {
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, []);

  /* If somebody hits /review with no params at all, send them home */
  useEffect(() => {
    if (filledCount === 0) {
      const t = setTimeout(() => setLocation("/"), 50);
      return () => clearTimeout(t);
    }
  }, [filledCount, setLocation]);

  const closeSuccess = () => {
    setSubmitted(false);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
    setLocation("/");
  };

  return (
    <>
      <SEO
        title="Review your journey — Soléi"
        description="Review what you've selected and confirm your enquiry. The Soléi team will be in touch within 24 hours."
        path="/review"
      />
      <Nav darkHero={false} />

      <main>
        {/* ── HEADER ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-navy px-6 md:px-12 lg:px-20 pt-32 pb-16 md:pb-20">
          <div className="absolute inset-0 textile-bg pointer-events-none" />
          <div className="relative z-[2] max-w-5xl mx-auto">
            <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-5 animate-fade-up animation-delay-200">
              <span className="block w-[22px] h-px bg-gold opacity-50" />
              Almost there
            </p>
            <h1
              className="font-display font-normal leading-[1.1] text-white mb-5 animate-fade-up animation-delay-400 max-w-[28ch]"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.8rem)" }}
            >
              Here's the trip{" "}
              <em className="italic text-gold">you've shaped.</em>
            </h1>
            <p className="text-[0.95rem] text-white/55 max-w-[58ch] leading-[1.9] animate-fade-up animation-delay-600">
              Take a look. Confirm the details below, leave us a way to reach
              you, and our team will come back within 24 hours with
              availability and a secure payment link.
            </p>
          </div>
        </section>

        {/* ── SUMMARY + FORM ─────────────────────────────────── */}
        <section className="bg-cream px-6 md:px-12 lg:px-20 py-16 md:py-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16">
            {/* LEFT — summary cards */}
            <div className="space-y-4">
              <div className="reveal">
                <p className="text-[0.6rem] tracking-[0.32em] uppercase text-gold mb-2">
                  Your selection · {filledCount}{" "}
                  {filledCount === 1 ? "section" : "sections"}
                </p>
                <h2
                  className="font-display font-normal text-navy leading-[1.2]"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)" }}
                >
                  What you picked
                </h2>
              </div>

              {accomFilled && (
                <SummaryCard
                  step="01"
                  label="Accommodation"
                  editHref="/"
                  rows={[
                    {
                      label: "Destination",
                      value: destLabel(data.destination),
                    },
                    {
                      label: "Check-in",
                      value: fmtDate(data.checkin),
                    },
                    {
                      label: "Check-out",
                      value: fmtDate(data.checkout),
                    },
                    { label: "Guests", value: data.guests ?? "" },
                  ].filter((r) => r.value)}
                />
              )}

              {expFilled && (
                <SummaryCard
                  step="02"
                  label="Experience"
                  editHref="/"
                  rows={[
                    {
                      label: "Experience",
                      value: expName(data.exp),
                    },
                    { label: "Date", value: fmtDate(data.date) },
                    { label: "Guests", value: data.guests ?? "" },
                  ].filter((r) => r.value)}
                />
              )}

              {transportFilled && (
                <SummaryCard
                  step="03"
                  label="Transportation"
                  editHref="/"
                  rows={[
                    { label: "From", value: destLabel(transportFrom) },
                    { label: "To", value: destLabel(transportTo) },
                    { label: "Date", value: fmtDate(data.date) },
                    { label: "Passengers", value: data.guests ?? "" },
                  ].filter((r) => r.value)}
                />
              )}

              {filledCount === 0 && (
                <div className="bg-white border border-sand p-8 text-center">
                  <p className="text-[0.86rem] text-ink-soft mb-5 leading-[1.85]">
                    You haven't picked anything yet — start at the home page
                    booking bar to shape your trip.
                  </p>
                  <Link
                    href="/"
                    className="inline-block text-[0.62rem] tracking-[0.2em] uppercase text-navy bg-gold px-6 py-3 hover:bg-gold-light transition-colors"
                  >
                    Start here
                  </Link>
                </div>
              )}

              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[0.62rem] tracking-[0.22em] uppercase text-ink-soft/65 hover:text-navy transition-colors pt-3"
              >
                ← Change my selection
              </Link>
            </div>

            {/* RIGHT — contact form */}
            <aside className="reveal reveal-d1">
              <div className="bg-white border border-sand p-7 md:p-9 sticky top-24">
                <p className="text-[0.6rem] tracking-[0.32em] uppercase text-gold mb-2">
                  Last step
                </p>
                <h3 className="font-display text-[1.5rem] text-navy leading-[1.25] mb-1">
                  How can we reach you?
                </h3>
                <p className="text-[0.8rem] text-ink-soft leading-[1.85] mb-7">
                  We'll send availability + a secure payment link within 24
                  hours. No charge until you confirm.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Field
                    label="Full name"
                    value={name}
                    onChange={setName}
                    required
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    required
                  />
                  <Field
                    label="Phone (with country code)"
                    type="tel"
                    value={phone}
                    onChange={setPhone}
                    placeholder="+20 1XX XXX XXXX"
                  />
                  <div>
                    <label className="text-[0.58rem] tracking-[0.22em] uppercase text-ink/55 mb-2 block">
                      Anything we should know? (optional)
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Dietary preferences, special occasions, accessibility needs…"
                      className="w-full bg-cream/40 border border-sand px-3 py-2.5 text-[0.95rem] sm:text-[0.88rem] text-ink font-body focus:outline-none focus:border-gold transition-colors resize-none"
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-[0.78rem] text-rose-600 border border-rose-200 bg-rose-50 px-3 py-2">
                      {errorMsg}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={!name || !email || filledCount === 0 || sending}
                    className="w-full bg-gold text-navy text-[0.65rem] tracking-[0.22em]
                      uppercase font-medium py-4 hover:bg-gold-light transition-colors
                      font-body disabled:opacity-40 disabled:cursor-not-allowed mt-2"
                  >
                    {sending ? "Sending…" : "Confirm & send enquiry"}
                  </button>
                  <p className="text-[0.62rem] text-ink-soft/55 text-center leading-[1.7]">
                    Response within 24 hours · No charge until you confirm
                  </p>
                </form>
              </div>
            </aside>
          </div>
        </section>

        {/* ── REASSURANCE STRIP ──────────────────────────────── */}
        <section className="bg-sand-light px-6 md:px-12 lg:px-20 py-14">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
            {[
              {
                title: "Personally handled",
                body: "Every enquiry goes to a real person on our team — no auto-replies.",
              },
              {
                title: "Within 24 hours",
                body: "We confirm availability and send a secure Tab.travel payment link.",
              },
              {
                title: "Free to ask",
                body: "Nothing is booked until you review the quote and approve it.",
              },
            ].map((b) => (
              <div key={b.title} className="reveal">
                <p className="text-[0.55rem] tracking-[0.32em] uppercase text-gold mb-3">
                  {b.title}
                </p>
                <p className="text-[0.84rem] text-ink-soft leading-[1.9]">
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* ── SUCCESS MODAL ───────────────────────────────────── */}
      {submitted && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-navy-deep/85 backdrop-blur-sm px-6">
          <div className="bg-cream max-w-md w-full p-10 text-center border border-gold/30">
            <p className="text-[0.55rem] tracking-[0.32em] uppercase text-gold mb-4">
              Sent
            </p>
            <h3
              className="font-display font-normal text-navy leading-[1.2] mb-4"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
            >
              Thank you, {name.split(" ")[0] || "traveller"}.
            </h3>
            <p className="text-[0.88rem] text-ink-soft leading-[1.9] mb-5">
              Your enquiry has been sent. We'll be in touch within 24 hours at{" "}
              <strong className="text-navy">{email}</strong> with availability
              and a secure payment link.
            </p>
            <p className="text-[0.62rem] tracking-[0.22em] uppercase text-ink-soft/55 mb-7">
              Reference · {ref}
            </p>
            <button
              type="button"
              onClick={closeSuccess}
              className="text-[0.62rem] tracking-[0.22em] uppercase text-navy bg-gold px-8 py-3 hover:bg-gold-light transition-colors"
            >
              Back to home
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
 * Helpers
 * ────────────────────────────────────────────────────────────── */

function SummaryCard({
  step,
  label,
  editHref,
  rows,
}: {
  step: string;
  label: string;
  editHref: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="reveal bg-white border border-sand">
      <div className="flex items-center justify-between px-6 md:px-7 py-4 border-b border-sand-light">
        <div className="flex items-baseline gap-3">
          <span className="font-display italic text-[0.95rem] text-gold/70">
            {step}.
          </span>
          <h3 className="font-display text-[1.05rem] text-navy">{label}</h3>
        </div>
        <Link
          href={editHref}
          className="text-[0.55rem] tracking-[0.22em] uppercase text-ink-soft/65 hover:text-navy transition-colors"
        >
          Edit
        </Link>
      </div>
      <dl className="divide-y divide-sand-light">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex justify-between items-baseline px-6 md:px-7 py-3.5 gap-4"
          >
            <dt className="text-[0.6rem] tracking-[0.22em] uppercase text-ink-soft/55 font-body">
              {r.label}
            </dt>
            <dd className="text-[0.88rem] text-navy font-body text-right">
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-[0.58rem] tracking-[0.22em] uppercase text-ink/55 mb-2 block">
        {label}
        {required && <span className="text-gold ml-1">·</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-cream/40 border border-sand px-3 py-2.5 text-[0.95rem] sm:text-[0.88rem] text-ink font-body focus:outline-none focus:border-gold transition-colors"
      />
    </div>
  );
}
