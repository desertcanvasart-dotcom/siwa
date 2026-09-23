import { SmartLink } from "@/components/ui/SmartLink";
import { useSiteContent, pickContent } from "@/lib/useSiteContent";

/** Default rows — each is editable in the admin (Pages → Home page →
 *  Transportation) as home.transport.routes.<i>.{name,detail,tag,href}.
 *  Slot 5 ships empty so the admin can add a sixth route; a name of
 *  "-" (or blank) hides that row. */
const defaultRoutes = [
  {
    name: "Cairo → Siwa Oasis",
    detail: "~8 hours · Private vehicle · Desert road",
    tag: "Private →",
    href: "/siwa-oasis/transportation",
  },
  {
    name: "Marsa Matrouh → Siwa",
    detail: "~3 hours · Private 4×4 · Sand road",
    tag: "Private →",
    href: "/siwa-oasis/transportation",
  },
  {
    name: "Cairo → North Coast",
    detail: "~2.5 hours · Private vehicle",
    tag: "Private →",
    href: "/north-coast/transportation",
  },
  {
    name: "Alexandria → North Coast",
    detail: "~1 hour · Private vehicle",
    tag: "Private →",
    href: "/north-coast/transportation",
  },
  {
    name: "In-oasis desert drives",
    detail: "Siwa · 4×4 · Dunes, salt flats, spring pools",
    tag: "Experience →",
    href: "/siwa-oasis/transportation",
  },
  { name: "", detail: "", tag: "", href: "" },
];

/**
 * Transportation — dark navy accent section with subtle media behind.
 * Two-column: sales copy + route list. Everything is admin-editable.
 */
export function Transportation() {
  const c = useSiteContent();
  const eyebrow = pickContent(c, "home.transport.eyebrow", "Arrive the right way");
  const titleStart = pickContent(c, "home.transport.title", "Private");
  const italic = pickContent(c, "home.transport.italic", "transportation");
  const titleEnd = pickContent(c, "home.transport.title_2", "that earns its place.");
  const body = pickContent(
    c,
    "home.transport.body",
    "Getting there is part of the experience. We arrange private vehicles, desert crossings, and coastal transfers — nothing shared, nothing generic.",
  );
  const ctaLabel = pickContent(c, "home.transport.cta", "View all routes");
  const ctaHref = pickContent(c, "home.transport.cta_href", "/siwa-oasis/transportation");
  const mediaUrl = pickContent(c, "home.transport.media", "/videos/salt-lake.mp4");
  const isVideo = /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(mediaUrl);

  const routes = defaultRoutes
    .map((r, i) => ({
      name: pickContent(c, `home.transport.routes.${i}.name`, r.name),
      detail: pickContent(c, `home.transport.routes.${i}.detail`, r.detail),
      tag: pickContent(c, `home.transport.routes.${i}.tag`, r.tag),
      href: pickContent(c, `home.transport.routes.${i}.href`, r.href),
    }))
    .filter((r) => r.name.trim() && r.name.trim() !== "-");

  return (
    <section className="relative bg-navy px-6 md:px-12 lg:px-20 py-28 overflow-hidden">
      {/* Media faded behind */}
      {mediaUrl &&
        (isVideo ? (
          <video
            className="absolute inset-0 w-full h-full object-cover opacity-[0.12]"
            src={mediaUrl}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            className="absolute inset-0 w-full h-full object-cover opacity-[0.12]"
            src={mediaUrl}
            alt=""
            loading="lazy"
          />
        ))}
      {/* Textile overlay */}
      <div className="absolute inset-0 textile-bg z-[1]" />

      <div className="relative z-[2] max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-start">
        <div className="reveal">
          <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-6">
            <span className="block w-6 h-px bg-gold opacity-60" />
            {eyebrow}
          </p>
          <h2
            className="font-display font-normal text-white leading-[1.2] mb-5"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
          >
            {titleStart} <em className="italic text-gold">{italic}</em>
            <br /> {titleEnd}
          </h2>
          <p className="text-[0.85rem] text-white/40 leading-[1.95] mb-8 max-w-[48ch]">
            {body}
          </p>
          {ctaLabel && ctaHref && (
            <SmartLink
              href={ctaHref}
              className="inline-block text-[0.62rem] tracking-[0.2em] uppercase text-white border border-white/20 px-8 py-3 hover:border-gold hover:text-gold transition-colors"
            >
              {ctaLabel}
            </SmartLink>
          )}
        </div>

        <div className="reveal reveal-d1 border-t border-gold/15">
          {routes.map((r, i) => {
            const row = (
              <>
                <div>
                  <p className="font-display text-[0.95rem] text-white leading-tight">
                    {r.name}
                  </p>
                  {r.detail && <p className="text-[0.68rem] text-white/30 mt-1">{r.detail}</p>}
                </div>
                {r.tag && (
                  <span className="text-[0.56rem] tracking-[0.2em] uppercase text-gold/70 flex-shrink-0 ml-4">
                    {r.tag}
                  </span>
                )}
              </>
            );
            const cls = "flex justify-between items-center py-5 border-b border-gold/10";
            return r.href ? (
              <SmartLink key={i} href={r.href} className={`${cls} hover:opacity-60 transition-opacity`}>
                {row}
              </SmartLink>
            ) : (
              <div key={i} className={cls}>
                {row}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Transportation;
