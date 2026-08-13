import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { useReveal } from "@/components/home/useReveal";
import {
  EXPERIENCE_DETAILS,
  getExperience,
  type ExperienceDetail,
} from "@/lib/experience-data";

/**
 * /siwa-oasis/experiences/:slug  +  /north-coast/experiences/:slug
 *
 * Unified experience detail template. Siwa variants render a booking
 * panel (date + time + guest dropdown + live price calc + optional
 * private toggle). North Coast variants render a coastal-blue enquiry
 * panel (compact 3-step process + pre-enquiry form) — all NC CTAs
 * route to /enquire?exp=<slug>, never direct checkout.
 */
export default function ExperienceDetailPage() {
  useReveal();
  const [, setLocation] = useLocation();
  const [siwaMatch, siwaParams] = useRoute("/siwa-oasis/experiences/:slug");
  const [ncMatch, ncParams] = useRoute("/north-coast/experiences/:slug");
  const slug =
    (siwaMatch && siwaParams?.slug) ||
    (ncMatch && ncParams?.slug) ||
    "";
  const exp = useMemo(() => getExperience(slug), [slug]);

  // Redirect unknown slugs back to the right archive
  useEffect(() => {
    if (!exp && slug) {
      const fallback = ncMatch
        ? "/north-coast/experiences"
        : "/siwa-oasis/experiences";
      setLocation(fallback);
    }
  }, [exp, slug, setLocation, ncMatch]);

  if (!exp) return null;

  const isNC = exp.destination === "north-coast";
  const destHub = isNC ? "/north-coast" : "/siwa-oasis";
  const destLabel = isNC ? "North Coast" : "Siwa Oasis";

  return (
    <>
      <SEO
        title={`${exp.name} — ${destLabel} | Soléi`}
        description={`${exp.heroTags.join(" · ")}. ${exp.description[0].slice(0, 160)}`}
        path={`${destHub}/experiences/${exp.slug}`}
      />
      <Nav />

      <main>
        {/* ── HERO ────────────────────────────────────────────── */}
        <section
          className={`relative overflow-hidden flex flex-col justify-end min-h-[85vh] px-6 md:px-12 lg:px-20 pt-32 pb-16 ${exp.gradient}`}
        >
          <div className="absolute inset-0 textile-bg pointer-events-none" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(9,24,32,0.92) 0%, rgba(9,24,32,0.3) 55%, rgba(9,24,32,0.05) 100%)",
            }}
          />

          <button
            type="button"
            className="absolute bottom-16 right-6 md:right-12 lg:right-20 z-[5] text-[0.6rem] tracking-[0.2em] uppercase text-white/50 bg-navy-deep/55 border border-white/15 px-5 py-2.5 backdrop-blur-md hover:text-gold hover:border-gold/40 transition-colors font-body"
          >
            View photos → {exp.gallerySize}
          </button>

          <div className="relative z-[2] max-w-[820px]">
            <p className="flex items-center gap-3 text-[0.56rem] tracking-[0.25em] uppercase text-white/20 mb-6 animate-fade-up animation-delay-200">
              <Link href="/" className="hover:text-gold transition-colors">
                Soléi
              </Link>
              <span className="opacity-35">/</span>
              <Link href={destHub} className="hover:text-gold transition-colors">
                {destLabel}
              </Link>
              <span className="opacity-35">/</span>
              <Link href={`${destHub}/experiences`} className="hover:text-gold transition-colors">
                Experiences
              </Link>
              <span className="opacity-35">/</span>
              <span>{exp.name}</span>
            </p>

            <div className="flex flex-wrap gap-2 mb-5 animate-fade-up animation-delay-400">
              {exp.heroTagGold && (
                <span
                  className={
                    isNC
                      ? "text-[0.54rem] tracking-[0.2em] uppercase text-[#B8D4E6]/90 border border-coastal/50 bg-coastal/20 px-3 py-1"
                      : "text-[0.54rem] tracking-[0.2em] uppercase text-gold border border-gold/40 px-3 py-1"
                  }
                >
                  {exp.heroTagGold}
                </span>
              )}
              {exp.heroTags.map((tag) => (
                <span
                  key={tag}
                  className="text-[0.54rem] tracking-[0.2em] uppercase text-white/55 border border-white/15 px-3 py-1 backdrop-blur-[4px]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1
              className="font-display font-normal leading-[1.08] text-white mb-5 animate-fade-up animation-delay-600"
              style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)" }}
            >
              {exp.titleMain} <em className="italic text-gold">{exp.titleItalic}</em>
            </h1>

            <div className="flex items-center gap-6 flex-wrap animate-fade-up animation-delay-800">
              {exp.heroMeta.map((m, i) => (
                <span
                  key={m}
                  className="flex items-center gap-2 text-[0.72rem] text-white/35"
                >
                  {i > 0 && (
                    <span className="block w-[3px] h-[3px] rounded-full bg-gold opacity-50" />
                  )}
                  {m}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── STICKY BAR ──────────────────────────────────────── */}
        <div className="sticky top-[64px] z-[40] bg-white border-b border-sand shadow-[0_2px_20px_rgba(9,24,32,0.06)]">
          <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 min-h-[58px] py-2 md:py-0">
            <div className="font-display text-[0.95rem] text-navy">
              {exp.name}
            </div>
            <div className="text-[0.75rem] text-ink-soft">
              From{" "}
              <strong className="font-display text-[1rem] text-navy font-normal">
                ${exp.price}
              </strong>{" "}
              {exp.priceSuffix} ·{" "}
              {exp.heroTags[1] ?? exp.timeSlots[0]}
            </div>
            <a
              href="#booking-panel"
              className={`text-[0.62rem] tracking-[0.18em] uppercase px-6 py-2.5 transition-colors whitespace-nowrap ${
                isNC
                  ? "text-white bg-coastal hover:bg-[#266080]"
                  : "text-navy bg-gold hover:bg-gold-light"
              }`}
            >
              {isNC ? "Enquire to book" : "Book this experience"}
            </a>
          </div>
        </div>

        {/* ── BODY ────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-20 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16 items-start">
          {/* ── LEFT COLUMN ── */}
          <div>
            {/* Description */}
            <BlockSection
              eyebrow="The experience"
              headline={exp.blockHeadline}
              headlineItalic={exp.blockHeadlineItalic}
            >
              {exp.description.map((p, i) => (
                <p
                  key={i}
                  className="text-[0.9rem] text-ink-soft leading-[1.95] mb-5 last:mb-0"
                >
                  {p}
                </p>
              ))}
            </BlockSection>

            {/* At a glance */}
            <BlockSection eyebrow="At a glance">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]">
                {exp.facts.map((f) => (
                  <div
                    key={f.label}
                    className="bg-white border border-sand px-4 py-4"
                  >
                    <p className="text-[0.54rem] tracking-[0.22em] uppercase text-ink-soft/50 mb-1">
                      {f.label}
                    </p>
                    <p className="font-display text-[0.92rem] text-navy leading-[1.3]">
                      {f.value}
                    </p>
                  </div>
                ))}
              </div>
            </BlockSection>

            {/* What's included */}
            <BlockSection
              eyebrow="What's included"
              headline="Everything you"
              headlineItalic="need."
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                {exp.includes.map((item, i, arr) => {
                  // match legacy behaviour: the last two items have no bottom border
                  const lastRow =
                    arr.length % 2 === 0
                      ? i >= arr.length - 2
                      : i === arr.length - 1;
                  return (
                    <div
                      key={item}
                      className={`flex items-start gap-3 py-3 text-[0.82rem] text-ink-soft ${
                        lastRow ? "" : "border-b border-sand-light"
                      }`}
                    >
                      <span className="w-[5px] h-[5px] rounded-full bg-gold opacity-60 flex-shrink-0 mt-[9px]" />
                      {item}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 bg-sand-light border border-sand px-5 py-4">
                <p className="text-[0.56rem] tracking-[0.22em] uppercase text-ink-soft/50 mb-2">
                  Not included
                </p>
                <p className="text-[0.8rem] text-ink-soft leading-[1.8]">
                  {exp.notIncluded}
                </p>
              </div>
            </BlockSection>

            {/* Schedule */}
            <BlockSection
              eyebrow="How the evening unfolds"
              headline="A"
              headlineItalic="rough sequence."
            >
              {exp.scheduleIntro && (
                <p className="text-[0.9rem] text-ink-soft leading-[1.95] mb-6">
                  {exp.scheduleIntro}
                </p>
              )}
              <div className="border-t border-sand-light">
                {exp.schedule.map((s, i, arr) => (
                  <div
                    key={s.title}
                    className={`grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 md:gap-6 py-5 ${
                      i === arr.length - 1 ? "" : "border-b border-sand-light"
                    }`}
                  >
                    <div className="font-display text-[0.82rem] text-gold/75 pt-0.5">
                      {s.time}
                    </div>
                    <div className="text-[0.84rem] text-ink-soft leading-[1.75]">
                      <strong className="block text-navy font-normal mb-0.5">
                        {s.title}
                      </strong>
                      {s.body}
                    </div>
                  </div>
                ))}
              </div>
            </BlockSection>

            {/* Notes */}
            <BlockSection
              eyebrow={isNC ? "Before you enquire" : "Before you book"}
              headline="Good to"
              headlineItalic="know."
            >
              <ul className="list-none">
                {exp.notes.map((n, i, arr) => (
                  <li
                    key={i}
                    className={`flex gap-4 items-start py-3.5 text-[0.84rem] text-ink-soft leading-[1.75] ${
                      i === arr.length - 1 ? "" : "border-b border-sand-light"
                    }`}
                  >
                    <span className="font-display italic text-[0.85rem] text-gold/70 min-w-4">
                      —
                    </span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </BlockSection>

            {/* Reviews */}
            <BlockSection
              eyebrow="Guest reflections"
              headline="What guests"
              headlineItalic="remember."
              last
            >
              <div className="flex flex-col">
                {exp.reviews.map((r, i, arr) => (
                  <div
                    key={r.name}
                    className={`py-7 ${
                      i === arr.length - 1 ? "" : "border-b border-sand-light"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-display text-[0.95rem] text-navy leading-tight">
                          {r.name}
                        </p>
                        <p className="text-[0.65rem] text-ink-soft/50 mt-0.5">
                          {r.origin}
                        </p>
                      </div>
                      <div className="flex gap-[3px]">
                        {[0, 1, 2, 3, 4].map((n) => (
                          <span key={n} className="text-gold/75">
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-[0.82rem] italic text-ink-soft leading-[1.85]">
                      "{r.text}"
                    </p>
                  </div>
                ))}
              </div>
            </BlockSection>
          </div>

          {/* ── RIGHT COLUMN — BOOKING / ENQUIRY ── */}
          <aside id="booking-panel" className="lg:sticky lg:top-[140px]">
            {isNC ? <EnquiryPanel exp={exp} /> : <BookingPanel exp={exp} />}

            <SidebarCard
              title="Staying with"
              titleItalic="Soléi?"
              desc={
                isNC
                  ? "If you've booked accommodation through us, we'll coordinate timing and marina transport automatically with your property."
                  : "If you've already booked one of our properties, we'll coordinate the timing of this experience with your accommodation team automatically."
              }
              href={`${destHub}/accommodation`}
              linkLabel={`View ${destLabel} accommodation`}
            />

            <SidebarCard
              title="Need"
              titleItalic="transportation?"
              desc={
                isNC
                  ? "Private transfer from your resort to the experience location and back. Add it to your enquiry or arrange separately."
                  : "We arrange private transfers to and from the experience location. Add transportation to your booking or arrange separately."
              }
              href={`${destHub}/transportation`}
              linkLabel="View transport routes"
            />

            <SidebarCard
              title="Have a"
              titleItalic="question?"
              desc={
                isNC
                  ? "Ask us anything — whether this suits your group, sea conditions at your travel time, or how to combine experiences during your stay."
                  : "Ask us anything — whether this experience suits your group, what to wear, or how to combine it with other Siwa experiences."
              }
              href="/enquire"
              linkLabel="Ask our team"
            />
          </aside>
        </section>

        {/* ── RELATED ─────────────────────────────────────────── */}
        <section className="bg-sand-light px-6 md:px-12 lg:px-20 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="reveal flex flex-col md:flex-row justify-between items-start md:items-end gap-3 mb-10">
              <h2
                className="font-display font-normal text-navy leading-[1.2]"
                style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)" }}
              >
                Other {isNC ? "North Coast" : "Siwa"}{" "}
                <em className="italic text-coastal">experiences</em>
              </h2>
              <Link
                href={`${destHub}/experiences`}
                className="text-[0.6rem] tracking-[0.2em] uppercase text-navy opacity-35 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
              {exp.related
                .map((s) => getExperience(s))
                .filter((x): x is ExperienceDetail => !!x)
                .map((r, i) => (
                  <Link
                    key={r.slug}
                    href={`/${r.destination}/experiences/${r.slug}`}
                    className={`reveal ${i > 0 ? `reveal-d${i}` : ""} bg-white border border-sand hover:border-gold transition-colors block overflow-hidden`}
                  >
                    <div className={`relative h-[160px] ${r.gradient}`}>
                      <div className="absolute inset-0 textile-bg--strong pointer-events-none" />
                      <span className="absolute bottom-3 left-3 text-[0.52rem] tracking-[0.18em] uppercase text-gold bg-navy-deep/75 px-2.5 py-1">
                        {r.heroTags[1] ?? r.timeSlots[0]}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-[0.95rem] text-navy leading-tight mb-1">
                        {r.name}
                      </h3>
                      <p className="text-[0.75rem] text-ink-soft leading-[1.7] mb-3">
                        {r.description[0].slice(0, 90)}…
                      </p>
                      <div className="flex justify-between items-center pt-3 border-t border-sand-light">
                        <div className="flex items-baseline gap-1">
                          <span className="text-[0.6rem] text-ink-soft/45">
                            From
                          </span>
                          <span className="font-display text-[0.9rem] text-navy">
                            ${r.price} pp
                          </span>
                        </div>
                        <span
                          className={`text-[0.56rem] tracking-[0.14em] uppercase ${
                            r.destination === "north-coast"
                              ? "text-coastal"
                              : "text-gold"
                          }`}
                        >
                          {r.destination === "north-coast" ? "Enquire →" : "Book →"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* ── CLOSING ─────────────────────────────────────────── */}
        <section className="bg-cream px-6 md:px-12 lg:px-20 py-24 text-center">
          <div className="max-w-[580px] mx-auto">
            <p className="text-[0.6rem] tracking-[0.3em] uppercase text-gold mb-4 font-body">
              {isNC ? "Ready to experience the coast?" : "Ready to experience Siwa?"}
            </p>
            <h2
              className="reveal font-display font-normal text-navy leading-[1.2] mb-5"
              style={{ fontSize: "clamp(1.7rem, 4vw, 2.8rem)" }}
            >
              Make it part
              <br />
              <em className="italic text-coastal">of your stay.</em>
            </h2>
            <p className="reveal text-[0.88rem] text-ink-soft leading-[1.95] mb-10 font-body">
              {isNC
                ? "Once your accommodation is arranged, we'll coordinate timing and logistics with your property automatically."
                : "Once your accommodation is confirmed, we'll coordinate the timing of this experience with your property team — nothing required, everything included."}
            </p>
            <div className="reveal flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/enquire"
                className="btn-cta-primary text-[0.65rem] tracking-[0.2em] uppercase text-navy bg-gold px-10 py-4 hover:bg-gold-light font-body"
              >
                Begin your stay
              </Link>
              <Link
                href={`${destHub}/accommodation`}
                className="btn-cta-outline text-[0.65rem] tracking-[0.2em] uppercase text-navy border border-sand px-10 py-4 font-body"
              >
                {isNC ? "North Coast properties" : "Siwa properties"}
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
 *  Block wrapper
 * ────────────────────────────────────────────────────────────── */

function BlockSection({
  eyebrow,
  headline,
  headlineItalic,
  last,
  children,
}: {
  eyebrow: string;
  headline?: string;
  headlineItalic?: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`reveal ${last ? "" : "mb-16 pb-16 border-b border-sand-light"}`}
    >
      <p className="flex items-center gap-3 text-[0.58rem] tracking-[0.35em] uppercase text-gold mb-4">
        <span className="block w-[18px] h-px bg-gold opacity-50" />
        {eyebrow}
      </p>
      {(headline || headlineItalic) && (
        <h2 className="font-display text-[1.4rem] font-normal text-navy mb-6 leading-[1.25]">
          {headline}{" "}
          {headlineItalic && (
            <em className="italic text-coastal">{headlineItalic}</em>
          )}
        </h2>
      )}
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
 *  Booking panel
 * ────────────────────────────────────────────────────────────── */

function BookingPanel({ exp }: { exp: ExperienceDetail }) {
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [isPrivate, setIsPrivate] = useState(false);

  const hasPrivateOption = exp.privatePrice !== undefined;
  const total = isPrivate && hasPrivateOption
    ? exp.privatePrice!
    : guests * exp.price;
  const rowLabel = isPrivate
    ? `Private — up to ${exp.maxGuests} guests`
    : `${guests} guest${guests > 1 ? "s" : ""} × $${exp.price}`;

  const showSummary = date.length > 0;

  // Interim booking URL — routes to /enquire until Tab.travel / Stripe
  // direct payment is configured for the experience inventory.
  const bookHref = useMemo(() => {
    const params = new URLSearchParams({
      type: "experience",
      destination: "siwa",
      exp: exp.slug,
      guests: String(guests),
    });
    if (date) params.set("date", date);
    if (isPrivate) params.set("private", "1");
    return `/enquire?${params.toString()}`;
  }, [exp.slug, date, guests, isPrivate]);

  return (
    <div className="bg-white border border-sand mb-[2px]">
      <div className="relative bg-navy p-6 overflow-hidden">
        <div className="absolute inset-0 textile-bg pointer-events-none" />
        <div className="relative z-[2]">
          <p className="text-[0.56rem] tracking-[0.28em] uppercase text-gold/75 mb-1">
            Book this experience
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-[0.72rem] text-white/35">From</span>
            <span className="font-display text-[1.8rem] text-white font-normal">
              ${exp.price}
            </span>
            <span className="text-[0.72rem] text-white/35">
              {exp.priceSuffix}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3 bg-sand-light border border-sand px-4 py-3 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#1D9E75] flex-shrink-0" />
          <p className="text-[0.75rem] text-ink-soft leading-[1.5]">
            <strong className="text-navy font-normal">Available this season.</strong>{" "}
            {exp.availabilityNotice.replace(/^Available[^.]*\.\s*/, "")}
          </p>
        </div>

        <Field label="Date">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none cursor-pointer"
          />
        </Field>

        <Field label="Time">
          <select className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer">
            {exp.timeSlots.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>

        <Field label="Guests">
          <select
            disabled={isPrivate}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className={`w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-gold outline-none appearance-none cursor-pointer ${isPrivate ? "opacity-40" : ""}`}
          >
            {Array.from({ length: exp.maxGuests }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "person" : "people"} — ${n * exp.price}
              </option>
            ))}
          </select>
        </Field>

        {showSummary && (
          <div className="border-t border-sand-light pt-3 mb-3">
            <div className="flex justify-between text-[0.78rem] text-ink-soft py-1">
              <span>{rowLabel}</span>
              <span>${total}</span>
            </div>
            <div className="flex justify-between text-[0.78rem] text-ink-soft py-1">
              <span>Booking fee</span>
              <span>Included</span>
            </div>
            <div className="flex justify-between items-baseline text-[0.88rem] text-navy border-t border-sand mt-2 pt-3">
              <span>Total</span>
              <strong className="font-display text-[1.1rem] font-normal">
                ${total}
              </strong>
            </div>
          </div>
        )}

        {hasPrivateOption && (
          <button
            type="button"
            onClick={() => setIsPrivate((v) => !v)}
            className="w-full flex items-center justify-between py-3 border-t border-sand-light mt-1 text-left"
          >
            <div className="text-[0.78rem] text-ink-soft">
              <strong className="text-navy font-normal block">
                Book privately?
              </strong>
              Exclusive group — up to {exp.maxGuests} guests
            </div>
            <span
              className={`text-[0.55rem] tracking-[0.15em] uppercase px-3 py-1 border whitespace-nowrap ${
                isPrivate
                  ? "text-coastal border-coastal/40 bg-coastal/10"
                  : "text-coastal border-coastal/30"
              }`}
            >
              {isPrivate ? "✓ Private selected" : `$${exp.privatePrice} flat`}
            </span>
          </button>
        )}

        <a
          href={bookHref}
          className="block w-full text-[0.65rem] tracking-[0.2em] uppercase text-navy bg-gold py-4 mt-4 text-center font-body font-medium hover:bg-gold-light transition-colors"
        >
          Book now
        </a>
        <p className="text-[0.7rem] text-ink-soft/55 text-center mt-3 leading-[1.6]">
          Free cancellation up to 48 hours before. Secure payment on site.
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
 *  Enquiry panel (North Coast) — coastal blue, no direct booking
 * ────────────────────────────────────────────────────────────── */

function EnquiryPanel({ exp }: { exp: ExperienceDetail }) {
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [stayingAt, setStayingAt] = useState("");
  const [requests, setRequests] = useState("");

  const enquiryHref = useMemo(() => {
    const params = new URLSearchParams({
      type: "experience",
      destination: "north-coast",
      exp: exp.slug,
    });
    if (date) params.set("date", date);
    if (guests) params.set("guests", String(guests));
    if (stayingAt) params.set("staying", stayingAt);
    if (requests) params.set("notes", requests);
    return `/enquire?${params.toString()}`;
  }, [exp.slug, date, guests, stayingAt, requests]);

  return (
    <div className="bg-white border border-sand mb-[2px]">
      <div className="relative bg-coastal p-6 overflow-hidden">
        <div className="relative z-[2]">
          <p className="text-[0.56rem] tracking-[0.28em] uppercase text-white/60 mb-1">
            Enquire to book
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-[0.72rem] text-white/40">From</span>
            <span className="font-display text-[1.8rem] text-white font-normal">
              ${exp.price}
            </span>
            <span className="text-[0.72rem] text-white/40">
              {exp.priceSuffix}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <ul className="mb-5 border-t border-sand-light list-none">
          {[
            { n: "1.", strong: "Submit this form", rest: " — dates, guests, notes" },
            { n: "2.", strong: "We confirm availability", rest: " — within 24 hours" },
            { n: "3.", strong: "Payment link sent", rest: " — via WhatsApp or email" },
          ].map((s) => (
            <li
              key={s.n}
              className="flex gap-3 items-start py-2 border-b border-sand-light last:border-b-0"
            >
              <span className="font-display italic text-[0.8rem] text-gold/70 min-w-4 pt-0.5">
                {s.n}
              </span>
              <p className="text-[0.75rem] text-ink-soft leading-[1.65]">
                <strong className="text-navy font-normal">{s.strong}</strong>
                {s.rest}
              </p>
            </li>
          ))}
        </ul>

        <Field label="Preferred date">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-coastal outline-none cursor-pointer"
          />
        </Field>

        <Field label="Guests">
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-coastal outline-none appearance-none cursor-pointer"
          >
            {Array.from({ length: exp.maxGuests }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "person" : "people"}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Staying at">
          <input
            type="text"
            value={stayingAt}
            onChange={(e) => setStayingAt(e.target.value)}
            placeholder="Resort or property name"
            className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-coastal outline-none"
          />
        </Field>

        <Field label="Any requests">
          <input
            type="text"
            value={requests}
            onChange={(e) => setRequests(e.target.value)}
            placeholder="e.g. marina transfer, dietary needs"
            className="w-full px-3 py-3 bg-cream border border-sand text-[0.84rem] text-navy font-body focus:border-coastal outline-none"
          />
        </Field>

        <a
          href={enquiryHref}
          className="block w-full text-[0.65rem] tracking-[0.2em] uppercase text-white bg-coastal py-4 mt-2 text-center font-body font-medium hover:bg-[#266080] transition-colors"
        >
          Send enquiry
        </a>
        <p className="text-[0.7rem] text-ink-soft/55 text-center mt-3 leading-[1.6]">
          No payment until we confirm availability. We respond within 24 hours.
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
 *  Helpers
 * ────────────────────────────────────────────────────────────── */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <label className="block text-[0.56rem] tracking-[0.22em] uppercase text-ink-soft/55 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function SidebarCard({
  title,
  titleItalic,
  desc,
  href,
  linkLabel,
}: {
  title: string;
  titleItalic: string;
  desc: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="bg-white border border-sand p-5 mt-[2px]">
      <h3 className="font-display text-[0.95rem] text-navy leading-tight mb-2">
        {title} <em className="italic text-coastal">{titleItalic}</em>
      </h3>
      <p className="text-[0.78rem] text-ink-soft leading-[1.75] mb-3">{desc}</p>
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 text-[0.58rem] tracking-[0.18em] uppercase text-gold hover:gap-2.5 transition-all"
      >
        {linkLabel} →
      </Link>
    </div>
  );
}

/* Re-export the list so the router / archive can iterate */
export { EXPERIENCE_DETAILS };
