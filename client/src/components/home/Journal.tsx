import { SmartLink } from "@/components/ui/SmartLink";
import { useSiteContent, pickContent } from "@/lib/useSiteContent";
import { useBlogPostsBySlug } from "@/lib/useBlogPostsBySlug";
import { blogPosts } from "@/lib/blog-data";
import saltLakeImage from "@assets/floating-in-spring_1753576589836.jpeg";
import northCoastQuietImage from "@assets/Pristine Beaches_1764585387661.jpg";
import desertEveningImage from "@assets/siwa-desert-at-night_1752963245791.jpg";

/** Posts the home page never features, even if published. */
const NEVER_FEATURE = new Set(["the-curse-of-king-tuts-tomb"]);

/** Default picks, in order, with the bundled card photo for each. The
 *  card text always comes from the real post — never invented titles.
 *  Admins can swap a card's article in Pages → Home page → Journal
 *  (home.journal.articles.<i>.href, plus optional title/excerpt/meta/
 *  image/tag overrides). Card 0 is the large lead; only it shows the
 *  excerpt. */
const DEFAULT_PICKS: Array<{ slug: string; image: string }> = [
  { slug: "healing-waters-of-siwa-salt-lake-therapy", image: saltLakeImage },
  { slug: "ultimate-guide-to-egypts-north-coast", image: northCoastQuietImage },
  { slug: "stargazing-in-siwa-guide-to-desert-night-sky", image: desertEveningImage },
];

const GRADIENTS = [
  "bg-[linear-gradient(150deg,#0F2436_0%,#1a3a52_100%)]",
  "bg-[linear-gradient(150deg,#1a3a52_0%,#2F6F8F_100%)]",
  "bg-[linear-gradient(150deg,#2F6F8F_0%,#0F2436_100%)]",
];

const slugFromHref = (href: string) => {
  const m = href.match(/^\/journal\/([^/?#]+)/);
  return m ? m[1] : "";
};

interface JournalCardData {
  slug: string;
  title: string;
  excerpt: string;
  destination?: string;
  readTime?: number;
  articleType?: string;
  coverImage?: string;
}

/**
 * Journal — three real articles on a sand-light background.
 * Lead article (large) + two side articles (stacked or row on narrow).
 */
export function Journal() {
  const c = useSiteContent();
  const livePosts = useBlogPostsBySlug();
  const eyebrow = pickContent(c, "home.journal.eyebrow", "The Soléi Journal");
  const title = pickContent(c, "home.journal.title", "Stories from");
  const italic = pickContent(c, "home.journal.italic", "the field");
  const allLabel = pickContent(c, "home.journal.all_label", "Read all →");
  const allHref = pickContent(c, "home.journal.all_href", "/journal");

  /** A post that exists: published per the API once it has answered,
   *  otherwise the bundled copy. Never one in NEVER_FEATURE. */
  const findPost = (slug: string): JournalCardData | null => {
    if (!slug || NEVER_FEATURE.has(slug)) return null;
    const ts = blogPosts.find((p) => p.slug === slug);
    if (livePosts.size > 0) {
      const live = livePosts.get(slug);
      if (!live) return null; // unpublished → never featured
      return {
        slug,
        title: live.title || ts?.title || "",
        excerpt: live.excerpt || ts?.excerpt || "",
        destination: live.destination || ts?.destination,
        readTime: live.readTime || ts?.readTime,
        articleType: ts?.articleType,
        coverImage: live.coverImage || ts?.coverImage,
      };
    }
    return ts
      ? {
          slug,
          title: ts.title,
          excerpt: ts.excerpt,
          destination: ts.destination,
          readTime: ts.readTime,
          articleType: ts.articleType,
          coverImage: ts.coverImage,
        }
      : null;
  };

  // Fill-ins when a default pick isn't published: other live posts.
  const spare = Array.from(livePosts.keys()).filter(
    (s) => !NEVER_FEATURE.has(s) && !DEFAULT_PICKS.some((d) => d.slug === s),
  );

  const used = new Set<string>();
  const articles = DEFAULT_PICKS.map((d, i) => {
    const k = `home.journal.articles.${i}`;
    const hrefOverride = pickContent<string>(c, `${k}.href`, "");
    let post =
      findPost(slugFromHref(hrefOverride)) ?? (used.has(d.slug) ? null : findPost(d.slug));
    while (!post && spare.length > 0) {
      const next = spare.shift()!;
      if (!used.has(next)) post = findPost(next);
    }
    if (!post || used.has(post.slug)) return null;
    used.add(post.slug);
    const isDefault = post.slug === d.slug;
    const tag =
      post.destination === "north-coast"
        ? "North Coast"
        : post.destination === "siwa"
          ? "Siwa Oasis"
          : "Journal";
    const meta = [
      post.readTime ? `${post.readTime} min read` : "",
      post.articleType === "experience" ? "Experiences" : post.articleType === "guide" ? "Guides" : "",
    ]
      .filter(Boolean)
      .join(" · ");
    return {
      href: `/journal/${post.slug}`,
      tag: pickContent(c, `${k}.tag`, tag),
      title: pickContent(c, `${k}.title`, post.title),
      excerpt: pickContent(c, `${k}.excerpt`, post.excerpt),
      meta: pickContent(c, `${k}.meta`, meta),
      image: pickContent(c, `${k}.image`, isDefault ? d.image : post.coverImage || ""),
      gradient: GRADIENTS[i % GRADIENTS.length],
    };
  }).filter((a): a is NonNullable<typeof a> => a !== null);

  if (articles.length === 0) return null;
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
