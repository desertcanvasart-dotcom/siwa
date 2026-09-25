import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { useReveal } from "@/components/home/useReveal";
import { Arch } from "@/components/ui/Arch";
import { AccentTitle, withBreaks } from "@/components/ui/AccentTitle";
import { SmartLink } from "@/components/ui/SmartLink";
import { TransportEnquiryForm } from "@/components/transport/TransportEnquiryForm";
import { useSiteContent } from "@/lib/useSiteContent";
import {
  NC_TRANSPORT,
  parseLines,
  parsePairs,
  resolveTransportPage,
  romanNumeral,
  type TransportRoute,
} from "@/lib/transport-content";

/* ──────────────────────────────────────────────────────────────
 *  /north-coast/transportation
 *
 *  Coastal-blue hub. No desert drives (the NC has no equivalent)
 *  — replaced with six within-coast transfer types. Fleet drops
 *  4×4 and adds a Premium Sedan for airport runs. Comparison
 *  panel flips the framing: NC is "you are here", Siwa is the
 *  crosslink.
 *
 *  All copy is admin-editable (Site content → North Coast
 *  transportation); defaults live in lib/transport-content.ts.
 * ────────────────────────────────────────────────────────────── */

const WAVE_TEX_HERO =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23FDFAF5' stroke-opacity='0.04' stroke-width='0.5'%3E%3Cpath d='M0 30 Q15 20 30 30 Q45 40 60 30'/%3E%3Cpath d='M0 45 Q15 35 30 45 Q45 55 60 45'/%3E%3Cpath d='M0 15 Q15 5 30 15 Q45 25 60 15'/%3E%3C/g%3E%3C/svg%3E\")";

const WAVE_TEX_BG =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23FDFAF5' stroke-opacity='0.06' stroke-width='0.5'%3E%3Cpath d='M0 30 Q15 20 30 30 Q45 40 60 30'/%3E%3C/g%3E%3C/svg%3E\")";

// Vehicle image panels cycle through these.
const VEHICLE_GRADIENTS = [
  "bg-[linear-gradient(155deg,#2F6F8F_0%,#1a4a6a_100%)]",
  "bg-[linear-gradient(155deg,#1a4a6a_0%,#0F2436_100%)]",
  "bg-[linear-gradient(155deg,#1a3a52_0%,#2F6F8F_100%)]",
];

function RouteName({ r, arrowClassName }: { r: TransportRoute; arrowClassName: string }) {
  return (
    <>
      {r.from} <em className={arrowClassName}>→</em>{" "}
      {r.via && (
        <>
          {r.via} <em className={arrowClassName}>→</em>{" "}
        </>
      )}
      {r.to}
    </>
  );
}

export default function NorthCoastTransportationPage() {
  useReveal();
  const t = resolveTransportPage(useSiteContent(), "nc_transport", NC_TRANSPORT);
  const compare = t.compare!;

  return (
    <>
      <SEO
        title={t.seo.title}
        description={t.seo.description}
        path="/north-coast/transportation"
      />
      <Nav />

      <main>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-coastal px-6 md:px-12 lg:px-20 pt-32 pb-20">
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
              <p className="flex items-center gap-3 text-[0.58rem] tracking-[0.28em] uppercase text-white/25 mb-6 animate-fade-up animation-delay-200">
                <Link href="/" className="hover:text-gold transition-colors">
                  Soléi
                </Link>
                <span className="opacity-40">/</span>
                <Link href="/north-coast" className="hover:text-gold transition-colors">
                  North Coast
                </Link>
                <span className="opacity-40">/</span>
                <span>Transportation</span>
              </p>

              <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-5 animate-fade-up animation-delay-400">
                <span className="block w-[22px] h-px bg-gold opacity-50" />
                {t.hero.eyebrow}
              </p>

              <h1
                className="font-display font-normal leading-[1.1] text-white animate-fade-up animation-delay-600"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)" }}
              >
                <AccentTitle
                  before={t.hero.title}
                  italic={t.hero.italic}
                  after={t.hero.title_2}
                  emClassName="italic text-gold"
                />
              </h1>
            </div>

            <div className="animate-fade-up animation-delay-800 pb-2">
              <p className="text-[0.9rem] text-white/40 leading-[1.95] mb-8">
                {t.hero.body}
              </p>
              <div className="flex flex-col gap-[2px]">
                {parseLines(t.hero.principles).map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-5 py-3 border border-white/10 text-[0.8rem] text-white/45"
                  >
                    <span className="w-[5px] h-[5px] rounded-full bg-gold opacity-60 flex-shrink-0" />
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── ROUTES TO NC ────────────────────────────────────── */}
        <section className="bg-cream px-6 md:px-12 lg:px-20 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <p className="reveal flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-10">
              <span className="block w-[22px] h-px bg-gold opacity-50" />
              {t.routes.eyebrow}
            </p>
            <h2
              className={`reveal font-display font-normal text-navy leading-[1.2] ${t.routes.body ? "mb-4" : "mb-10"}`}
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.4rem)" }}
            >
              <AccentTitle before={t.routes.title} italic={t.routes.italic} emClassName="italic text-coastal" />
            </h2>
            {t.routes.body && (
              <p className="reveal text-[0.88rem] text-ink-soft leading-[1.95] max-w-[60ch] mb-10">
                {t.routes.body}
              </p>
            )}

            {/* Featured */}
            <a
              href="#enquiry-form"
              className="reveal grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-[2px] group"
            >
              <div className="relative bg-[linear-gradient(155deg,#0F2436_0%,#2F6F8F_60%,#1a4a6a_100%)] min-h-[220px] md:min-h-[300px] overflow-hidden flex flex-col justify-end p-6 md:p-8">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ backgroundImage: WAVE_TEX_BG }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(9,24,32,0.88) 0%, transparent 55%)",
                  }}
                />
                <div className="relative z-[2]">
                  <p className="text-[0.56rem] tracking-[0.28em] uppercase text-gold/80 mb-2">
                    {t.routes.featured_label}
                  </p>
                  <div className="font-display text-[1.8rem] font-normal text-white leading-tight">
                    {t.featured.from}{" "}
                    <span className="text-gold mx-1">→</span>{" "}
                    <em className="italic text-gold">{t.featured.to}</em>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-sand p-8 md:p-10 flex flex-col justify-between group-hover:border-gold transition-colors">
                <div>
                  <p className="font-display italic text-[0.78rem] text-gold/65 mb-3">
                    {t.featured.num}
                  </p>
                  <div className="font-display text-[1.5rem] font-normal text-navy leading-tight mb-3">
                    <RouteName r={t.featured} arrowClassName="italic text-coastal/70 mx-1" />
                  </div>
                  <p className="text-[0.88rem] text-ink-soft leading-[1.95] mb-6">
                    {t.featured.desc}
                  </p>
                  <div className="flex flex-col mb-2">
                    {parsePairs(t.featured.facts).map((f, i, arr) => (
                      <div
                        key={i}
                        className={`flex justify-between items-center py-2 text-[0.78rem] ${
                          i === arr.length - 1 ? "" : "border-b border-sand-light"
                        }`}
                      >
                        <span className="text-ink-soft/60">{f.key}</span>
                        <span className="text-navy text-right ml-4">{f.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-sand-light mt-6">
                  <div>
                    <div className="text-[0.62rem] text-ink-soft/45">{t.routes.price_label}</div>
                    <div className="font-display text-[1.05rem] text-navy">
                      {t.featured.price}
                    </div>
                  </div>
                  <span className="text-[0.58rem] tracking-[0.16em] uppercase text-white bg-coastal px-5 py-2.5 whitespace-nowrap group-hover:bg-[#266080] transition-colors">
                    {t.routes.featured_cta}
                  </span>
                </div>
              </div>
            </a>

            {/* Routes grid */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]"
              style={{ marginTop: "2px" }}
            >
              {t.routeItems.map((r, i) => (
                <a
                  key={i}
                  href="#enquiry-form"
                  className={`reveal ${i % 3 === 1 ? "reveal-d1" : i % 3 === 2 ? "reveal-d2" : ""} bg-white border border-sand p-7 flex flex-col hover:border-gold hover:bg-cream transition-colors group`}
                >
                  <p className="font-display italic text-[0.78rem] text-gold/65 mb-3">
                    {r.num}
                  </p>
                  <h3 className="font-display text-[1.15rem] font-normal text-navy leading-snug mb-2">
                    <RouteName r={r} arrowClassName="italic text-coastal/70 mx-0.5" />
                  </h3>
                  <p className="text-[0.82rem] text-ink-soft leading-[1.85] mb-5 flex-1">
                    {r.desc}
                  </p>
                  <div className="flex flex-col mb-5">
                    {parsePairs(r.facts).map((f, j, arr) => (
                      <div
                        key={j}
                        className={`flex justify-between items-center py-2 text-[0.78rem] ${
                          j === arr.length - 1 ? "" : "border-b border-sand-light"
                        }`}
                      >
                        <span className="text-ink-soft/60">{f.key}</span>
                        <span className="text-navy text-right ml-4">{f.val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-sand-light mt-auto">
                    <div>
                      <div className="text-[0.62rem] text-ink-soft/45">{t.routes.price_label}</div>
                      <div className="font-display text-[1.05rem] text-navy">
                        {r.price}
                      </div>
                    </div>
                    <span className="text-[0.58rem] tracking-[0.16em] uppercase text-white bg-coastal px-4 py-2 whitespace-nowrap group-hover:bg-[#266080] transition-colors">
                      {t.routes.card_cta}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── WITHIN-COAST TRANSFERS ──────────────────────────── */}
        <section className="bg-white px-6 md:px-12 lg:px-20 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <p className="reveal flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-10">
              <span className="block w-[22px] h-px bg-gold opacity-50" />
              {t.cards.eyebrow}
            </p>
            <h2
              className="reveal font-display font-normal text-navy leading-[1.2] mb-4"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.4rem)" }}
            >
              <AccentTitle before={t.cards.title} italic={t.cards.italic} emClassName="italic text-coastal" />
            </h2>
            <p className="reveal text-[0.88rem] text-ink-soft leading-[1.95] max-w-[60ch] mb-10">
              {t.cards.body}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]">
              {t.cardItems.map((c, i) => (
                <a
                  key={i}
                  href="#enquiry-form"
                  className={`reveal ${i % 3 === 1 ? "reveal-d1" : i % 3 === 2 ? "reveal-d2" : ""} border border-sand px-8 py-10 block hover:border-gold hover:bg-cream transition-colors`}
                >
                  <span className="block font-display italic text-[0.78rem] text-coastal/65 mb-4">
                    {c.num}
                  </span>
                  <h3 className="font-display text-[1.1rem] font-normal text-navy leading-snug mb-3">
                    {c.title}
                  </h3>
                  <p className="text-[0.82rem] text-ink-soft leading-[1.85] mb-5">
                    {c.desc}
                  </p>
                  <div className="text-[0.7rem] text-ink-soft/55 leading-[1.8] mb-5">
                    <strong className="block text-navy font-normal mb-0.5 text-[0.62rem] tracking-[0.12em] uppercase">
                      {c.includes_label}
                    </strong>
                    {c.includes}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-sand-light">
                    <div className="text-[0.68rem] text-ink-soft/50">
                      {c.duration}
                    </div>
                    <div className="font-display text-[0.95rem] text-navy">
                      {c.price}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── VEHICLES ────────────────────────────────────────── */}
        <section className="bg-sand-light px-6 md:px-12 lg:px-20 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-end mb-10">
              <div>
                <p className="reveal flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-5">
                  <span className="block w-[22px] h-px bg-gold opacity-50" />
                  {t.fleet.eyebrow}
                </p>
                <h2
                  className="reveal font-display font-normal text-navy leading-[1.2]"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2.4rem)" }}
                >
                  <AccentTitle before={t.fleet.title} italic={t.fleet.italic} emClassName="italic text-coastal" />
                </h2>
              </div>
              <p className="reveal reveal-d1 text-[0.88rem] text-ink-soft leading-[1.95]">
                {t.fleet.body}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]">
              {t.fleetItems.map((v, i) => (
                <div
                  key={i}
                  className={`reveal ${i % 3 === 1 ? "reveal-d1" : i % 3 === 2 ? "reveal-d2" : ""} bg-white border border-sand p-7`}
                >
                  <div className={`relative h-[110px] overflow-hidden mb-5 ${VEHICLE_GRADIENTS[i % VEHICLE_GRADIENTS.length]}`}>
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ backgroundImage: WAVE_TEX_BG }}
                    />
                  </div>
                  <h3 className="font-display text-[1.05rem] text-navy mb-1">
                    {v.name}
                  </h3>
                  <p className="text-[0.62rem] tracking-[0.1em] uppercase text-ink-soft/50 mb-3">
                    {v.type}
                  </p>
                  <p className="text-[0.8rem] text-ink-soft leading-[1.8] mb-4">
                    {v.desc}
                  </p>
                  <div className="border-t border-sand-light pt-3">
                    {parsePairs(v.specs).map((s, j, arr) => (
                      <div
                        key={j}
                        className={`flex justify-between py-1.5 text-[0.75rem] ${
                          j === arr.length - 1 ? "" : "border-b border-sand-light"
                        }`}
                      >
                        <span className="text-ink-soft/55">{s.key}</span>
                        <span className="text-navy">{s.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── VS SIWA COMPARISON ──────────────────────────────── */}
        <section className="relative overflow-hidden bg-coastal px-6 md:px-12 lg:px-20 py-16 md:py-20">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: WAVE_TEX_HERO }}
          />
          <div className="relative z-[2] max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-[2px]">
            <div className="reveal border border-white/15 p-8 md:p-10">
              <p className="flex items-center gap-2 text-[0.58rem] tracking-[0.3em] uppercase text-gold/70 mb-4">
                <span className="block w-[14px] h-px bg-gold opacity-50" />
                {compare.here.eyebrow}
              </p>
              <h3 className="font-display text-[1.5rem] font-normal leading-[1.2] text-white mb-3">
                <AccentTitle before={compare.here.title} italic={compare.here.italic} emClassName="italic text-gold" />
              </h3>
              <p className="text-[0.84rem] text-white/40 leading-[1.85] mb-6">
                {compare.here.body}
              </p>
              <ul className="list-none border-t border-white/10">
                {parsePairs(compare.here.facts).map(({ key: k, val: v }, i, arr) => (
                  <li
                    key={i}
                    className={`flex justify-between items-baseline py-3 text-[0.8rem] ${
                      i === arr.length - 1 ? "" : "border-b border-white/5"
                    }`}
                  >
                    <span className="text-white/30">{k}</span>
                    <span className="text-white/65 text-right ml-4">{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <SmartLink
              href={compare.other.href}
              className="reveal reveal-d1 bg-navy-deep/5 border border-white/10 p-8 md:p-10 block hover:bg-navy-deep/20 transition-colors group"
            >
              <p className="flex items-center gap-2 text-[0.58rem] tracking-[0.3em] uppercase text-gold/70 mb-4">
                <span className="block w-[14px] h-px bg-gold opacity-50" />
                {compare.other.eyebrow}
              </p>
              <h3 className="font-display text-[1.5rem] font-normal leading-[1.2] text-white mb-3">
                <AccentTitle before={compare.other.title} italic={compare.other.italic} emClassName="italic text-gold" />
              </h3>
              <p className="text-[0.84rem] text-white/40 leading-[1.85] mb-6">
                {compare.other.body}
              </p>
              <ul className="list-none border-t border-white/10">
                {parsePairs(compare.other.facts).map(({ key: k, val: v }, i, arr) => (
                  <li
                    key={i}
                    className={`flex justify-between items-baseline py-3 text-[0.8rem] ${
                      i === arr.length - 1 ? "" : "border-b border-white/5"
                    }`}
                  >
                    <span className="text-white/30">{k}</span>
                    <span className="text-white/65 text-right ml-4">{v}</span>
                  </li>
                ))}
              </ul>
              <span className="inline-flex items-center gap-2 text-[0.6rem] tracking-[0.2em] uppercase text-gold/70 mt-6 group-hover:gap-3 transition-all">
                {compare.other.cta}
              </span>
            </SmartLink>
          </div>
        </section>

        {/* ── HOW IT WORKS ────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-navy px-6 md:px-12 lg:px-20 py-20 md:py-28">
          <div className="absolute inset-0 textile-bg pointer-events-none" />
          <div className="relative z-[2] max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">
            <div className="reveal">
              <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-5">
                <span className="block w-[22px] h-px bg-gold opacity-50" />
                {t.how.eyebrow}
              </p>
              <h2
                className="font-display font-normal leading-[1.25] text-white mb-5"
                style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)" }}
              >
                <AccentTitle before={t.how.title} italic={t.how.italic} emClassName="italic text-gold" />
              </h2>
              <p className="text-[0.88rem] text-white/40 leading-[1.95]">
                {t.how.body}
              </p>
            </div>
            <ul className="reveal reveal-d1 list-none border-t border-gold/15">
              {t.howItems.map((s, i) => (
                <li
                  key={i}
                  className={`flex gap-4 items-start py-4 ${
                    i === t.howItems.length - 1 ? "" : "border-b border-white/5"
                  }`}
                >
                  <span className="font-display italic text-[0.9rem] text-gold/70 min-w-5 pt-0.5">
                    {i + 1}.
                  </span>
                  <div className="text-[0.84rem] text-white/50 leading-[1.75]">
                    <strong className="block text-white font-normal mb-0.5">
                      {s.title}
                    </strong>
                    {s.text}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── PRACTICAL INFO ──────────────────────────────────── */}
        <section className="bg-cream px-6 md:px-12 lg:px-20 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <p className="reveal flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-5">
              <span className="block w-[22px] h-px bg-gold opacity-50" />
              {t.practical.eyebrow}
            </p>
            <h2
              className="reveal font-display font-normal text-navy leading-[1.2] mb-10"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.4rem)" }}
            >
              <AccentTitle before={t.practical.title} italic={t.practical.italic} emClassName="italic text-coastal" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]">
              {t.practicalItems.map((item, i) => (
                <div
                  key={i}
                  className={`reveal ${i % 3 === 1 ? "reveal-d1" : i % 3 === 2 ? "reveal-d2" : ""} bg-white border border-sand px-7 py-8`}
                >
                  <div className="w-8 h-8 rounded-full border border-gold flex items-center justify-center mb-4">
                    <span className="font-display italic text-[0.8rem] text-gold">
                      {romanNumeral(i)}
                    </span>
                  </div>
                  <h3 className="font-display text-[1rem] text-navy mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[0.8rem] text-ink-soft leading-[1.85]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ENQUIRY FORM ────────────────────────────────────── */}
        <section
          id="enquiry-form"
          className="bg-sand-light px-6 md:px-12 lg:px-20 py-20 md:py-28 scroll-mt-24"
        >
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">
            <div className="reveal">
              <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-5">
                <span className="block w-[22px] h-px bg-gold opacity-50" />
                {t.enquiry.eyebrow}
              </p>
              <h2
                className="font-display font-normal text-navy leading-[1.25] mb-4"
                style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)" }}
              >
                <AccentTitle before={t.enquiry.title} italic={t.enquiry.italic} emClassName="italic text-coastal" />
              </h2>
              <p className="text-[0.88rem] text-ink-soft leading-[1.95] mb-6">
                {t.enquiry.body}
              </p>
              {t.enquiry.note && (
                <div className="bg-white border border-sand px-5 py-4 text-[0.78rem] text-ink-soft/80 leading-[1.7]">
                  {t.enquiry.note}
                </div>
              )}
            </div>

            <TransportEnquiryForm
              t={t}
              destination="North Coast"
              accent="coastal"
              routesGroupLabel="Routes to and from the North Coast"
              cardsGroupLabel="Within the North Coast"
              showDropoff
              pickupPlaceholder="Hotel name, address, or area (e.g. Marassi marina)"
              departurePlaceholder="e.g. 7:00am"
              notesPlaceholder="Flight number for airport pickups, child seats, luggage, accessibility needs…"
            />
          </div>
        </section>

        {/* ── CLOSING ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-navy px-6 md:px-12 lg:px-20 py-24 md:py-32 text-center">
          <div className="absolute inset-0 textile-bg pointer-events-none" />
          <div className="relative z-[2] max-w-xl mx-auto">
            <div className="flex justify-center mb-10">
              <Arch className="w-14" />
            </div>
            <h2
              className="reveal font-display font-normal leading-[1.2] text-white mb-5"
              style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}
            >
              <AccentTitle before={t.closing.title} italic={t.closing.italic} emClassName="italic text-gold" />
            </h2>
            <p className="reveal text-[0.88rem] text-white/40 leading-[1.95] mb-10">
              {withBreaks(t.closing.body)}
            </p>
            <div className="reveal flex gap-4 justify-center flex-wrap">
              <a
                href="#enquiry-form"
                className="text-[0.65rem] tracking-[0.2em] uppercase text-navy bg-gold px-10 py-4 hover:bg-gold-light transition-colors"
              >
                {t.closing.cta}
              </a>
              {t.closing.cta_2 && t.closing.cta_2_href && (
                <SmartLink
                  href={t.closing.cta_2_href}
                  className="text-[0.65rem] tracking-[0.2em] uppercase text-white border border-white/20 px-10 py-4 hover:border-gold hover:text-gold transition-colors"
                >
                  {t.closing.cta_2}
                </SmartLink>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
