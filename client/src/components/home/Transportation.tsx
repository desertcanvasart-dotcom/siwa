import { Link } from "wouter";

const routes = [
  {
    name: "Cairo → Siwa Oasis",
    detail: "~8 hours · Private vehicle · Desert road",
    type: "Private →",
    href: "/siwa-oasis/transportation",
  },
  {
    name: "Marsa Matrouh → Siwa",
    detail: "~3 hours · Private 4×4 · Sand road",
    type: "Private →",
    href: "/siwa-oasis/transportation",
  },
  {
    name: "Cairo → North Coast",
    detail: "~2.5 hours · Private vehicle",
    type: "Private →",
    href: "/north-coast/transportation",
  },
  {
    name: "Alexandria → North Coast",
    detail: "~1 hour · Private vehicle",
    type: "Private →",
    href: "/north-coast/transportation",
  },
  {
    name: "In-oasis desert drives",
    detail: "Siwa · 4×4 · Dunes, salt flats, spring pools",
    type: "Experience →",
    href: "/siwa-oasis/transportation",
  },
];

/**
 * Transportation — dark navy accent section with subtle video behind.
 * Two-column: sales copy + route list.
 */
export function Transportation() {
  return (
    <section className="relative bg-navy px-6 md:px-12 lg:px-20 py-28 overflow-hidden">
      {/* Video faded behind */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-[0.12]"
        src="/videos/salt-lake.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Textile overlay */}
      <div className="absolute inset-0 textile-bg z-[1]" />

      <div className="relative z-[2] max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-start">
        <div className="reveal">
          <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-6">
            <span className="block w-6 h-px bg-gold opacity-60" />
            Arrive the right way
          </p>
          <h2
            className="font-display font-normal text-white leading-[1.2] mb-5"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
          >
            Private <em className="italic text-gold">transportation</em>
            <br /> that earns its place.
          </h2>
          <p className="text-[0.85rem] text-white/40 leading-[1.95] mb-8 max-w-[48ch]">
            Getting there is part of the experience. We arrange private
            vehicles, desert crossings, and coastal transfers — nothing shared,
            nothing generic.
          </p>
          <Link
            href="/siwa-oasis/transportation"
            className="inline-block text-[0.62rem] tracking-[0.2em] uppercase text-white border border-white/20 px-8 py-3 hover:border-gold hover:text-gold transition-colors"
          >
            View all routes
          </Link>
        </div>

        <div className="reveal reveal-d1 border-t border-gold/15">
          {routes.map((r) => (
            <Link
              key={r.name}
              href={r.href}
              className="flex justify-between items-center py-5 border-b border-gold/10 hover:opacity-60 transition-opacity"
            >
              <div>
                <p className="font-display text-[0.95rem] text-white leading-tight">
                  {r.name}
                </p>
                <p className="text-[0.68rem] text-white/30 mt-1">{r.detail}</p>
              </div>
              <span className="text-[0.56rem] tracking-[0.2em] uppercase text-gold/70 flex-shrink-0 ml-4">
                {r.type}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Transportation;
