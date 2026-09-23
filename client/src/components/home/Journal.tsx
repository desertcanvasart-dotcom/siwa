import { SmartLink } from "@/components/ui/SmartLink";
import { useSiteContent, pickContent } from "@/lib/useSiteContent";
import saltLakeImage from "@assets/floating-in-spring_1753576589836.jpeg";
import northCoastQuietImage from "@assets/Pristine Beaches_1764585387661.jpg";
import desertEveningImage from "@assets/siwa-desert-at-night_1752963245791.jpg";

/** Default cards — editable in the admin (Pages → Home page → Journal)
 *  as home.journal.articles.<i>.{href,tag,title,excerpt,meta,image}.
 *  Card 0 is the large lead; only it shows the excerpt. */
const defaultArticles = [
  {
    href: "/journal/healing-waters-of-siwa-salt-lake-therapy",
    tag: "Siwa Oasis",
    title:
      "Why Siwa's salt lakes feel like the end of the world — in the best possible way",
    excerpt:
      "There is a moment, just before the sun touches the water, when everything becomes a reflection. You can't tell where the lake ends and the sky begins.",
    meta: "8 min read · Experiences",
    image: saltLakeImage,
    gradient: "bg-[linear-gradient(150deg,#0F2436_0%,#1a3a52_100%)]",
  },
  {
    href: "/journal/ultimate-guide-to-egypts-north-coast",
    tag: "North Coast",
    title: "The quiet side of Egypt's North Coast that nobody talks about",
    excerpt: "",
    meta: "5 min read",
    image: northCoastQuietImage,
    gradient: "bg-[linear-gradient(150deg,#1a3a52_0%,#2F6F8F_100%)]",
  },
  {
    href: "/journal/stargazing-in-siwa-guide-to-desert-night-sky",
    tag: "Siwa · Experiences",
    title: "What an unscheduled evening in the desert actually feels like",
    excerpt: "",
    meta: "6 min read",
    image: desertEveningImage,
    gradient: "bg-[linear-gradient(150deg,#2F6F8F_0%,#0F2436_100%)]",
  },
];

/**
 * Journal — three articles on a sand-light background.
 * Lead article (large) + two side articles (stacked or row on narrow).
 */
export function Journal() {
  const c = useSiteContent();
  const eyebrow = pickContent(c, "home.journal.eyebrow", "The Soléi Journal");
  const title = pickContent(c, "home.journal.title", "Stories from");
  const italic = pickContent(c, "home.journal.italic", "the field");
  const allLabel = pickContent(c, "home.journal.all_label", "Read all →");
  const allHref = pickContent(c, "home.journal.all_href", "/journal");

  const articles = defaultArticles.map((a, i) => {
    const k = `home.journal.articles.${i}`;
    return {
      href: pickContent(c, `${k}.href`, a.href),
      tag: pickContent(c, `${k}.tag`, a.tag),
      title: pickContent(c, `${k}.title`, a.title),
      excerpt: pickContent(c, `${k}.excerpt`, a.excerpt),
      meta: pickContent(c, `${k}.meta`, a.meta),
      image: pickContent(c, `${k}.image`, a.image),
      gradient: a.gradient,
    };
  });
  const [lead, ...side] = articles;

  return (
    <section className="bg-sand-light px-6 md:px-12 lg:px-20 py-32">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <p className="reveal flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-4">
              <span className="block w-6 h-px bg-gold opacity-50" />
              {eyebrow}
            </p>
            <h2
              className="reveal font-display font-normal text-navy leading-[1.2]"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
            >
              {title} <em className="italic text-coastal">{italic}</em>
            </h2>
          </div>
          {allLabel && allHref && (
            <SmartLink
              href={allHref}
              className="reveal text-[0.6rem] tracking-[0.2em] uppercase text-navy opacity-40 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
            >
              {allLabel}
            </SmartLink>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-[2px] mt-12">
          {/* Lead article */}
          <SmartLink
            href={lead.href}
            className="reveal bg-white border border-sand hover:border-gold transition-colors overflow-hidden block group"
          >
            <div className={`relative h-[240px] overflow-hidden ${lead.gradient}`}>
              {lead.image && (
                <img
                  src={lead.image}
                  alt={lead.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              )}
            </div>
            <div className="p-7">
              <p className="text-[0.56rem] tracking-[0.26em] uppercase text-gold mb-3">
                {lead.tag}
              </p>
              <h3 className="font-display text-[1.05rem] font-normal leading-[1.35] text-navy mb-3">
                {lead.title}
              </h3>
              {lead.excerpt && (
                <p className="text-[0.8rem] text-ink-soft leading-[1.8] mb-3">
                  {lead.excerpt}
                </p>
              )}
              <p className="text-[0.65rem] text-ink-soft/40 flex gap-4">
                {lead.meta.split("·").map((part) => part.trim()).filter(Boolean).map((part) => (
                  <span key={part}>{part}</span>
                ))}
              </p>
            </div>
          </SmartLink>

          {/* Side articles */}
          {side.map((a, i) => (
            <div key={i} className="flex flex-col gap-[2px]">
              <SmartLink
                href={a.href}
                className={`reveal reveal-d${i + 1} bg-white border border-sand hover:border-gold transition-colors overflow-hidden block`}
              >
                <div className={`relative h-[130px] overflow-hidden ${a.gradient}`}>
                  {a.image && (
                    <img
                      src={a.image}
                      alt={a.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="p-5">
                  <p className="text-[0.56rem] tracking-[0.26em] uppercase text-gold mb-2">
                    {a.tag}
                  </p>
                  <h3 className="font-display text-[0.9rem] font-normal leading-[1.35] text-navy mb-2">
                    {a.title}
                  </h3>
                  <p className="text-[0.65rem] text-ink-soft/40">{a.meta}</p>
                </div>
              </SmartLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Journal;
