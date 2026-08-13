import { useMemo, useState } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { useReveal } from "@/components/home/useReveal";
import { Arch } from "@/components/ui/Arch";
import { blogPosts, type BlogPost } from "@/lib/blog-data";
import { useBlogPostsBySlug } from "@/lib/useBlogPostsBySlug";

/* ──────────────────────────────────────────────────────────────
 *  /journal
 *
 *  Editorial index. Cream header (no dark hero), sticky filter
 *  bar (All / Siwa / NC / Guides / Experiences), one featured
 *  piece full-width, then two grouped grids by destination,
 *  newsletter section, navy closing.
 * ────────────────────────────────────────────────────────────── */

type Filter = "all" | "siwa" | "north-coast" | "guide" | "experience";

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Siwa Oasis", value: "siwa" },
  { label: "North Coast", value: "north-coast" },
  { label: "Guides", value: "guide" },
  { label: "Experiences", value: "experience" },
];

function matches(post: BlogPost, f: Filter): boolean {
  if (f === "all") return true;
  if (f === "siwa" || f === "north-coast") return post.destination === f;
  if (f === "guide" || f === "experience") return post.articleType === f;
  return false;
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function destLabel(d?: "siwa" | "north-coast"): string {
  if (d === "siwa") return "Siwa Oasis";
  if (d === "north-coast") return "North Coast";
  return "Journal";
}

const GRADIENTS = {
  siwa: [
    "bg-[linear-gradient(155deg,#0F2436_0%,#1a3a52_100%)]",
    "bg-[linear-gradient(155deg,#1a3040_0%,#0F2436_100%)]",
    "bg-[linear-gradient(155deg,#1a3a52_0%,#0F2436_100%)]",
  ],
  "north-coast": [
    "bg-[linear-gradient(155deg,#2F6F8F_0%,#1a4a6a_100%)]",
    "bg-[linear-gradient(155deg,#1a4060_0%,#0F2436_100%)]",
    "bg-[linear-gradient(155deg,#235570_0%,#2F6F8F_100%)]",
  ],
  other: [
    "bg-[linear-gradient(155deg,#2a1a0a_0%,#0F2436_100%)]",
    "bg-[linear-gradient(155deg,#1a2a0a_0%,#0a1a14_100%)]",
    "bg-[linear-gradient(155deg,#0F2436_0%,#1a1a2a_100%)]",
  ],
};

function gradientFor(post: BlogPost, idx: number): string {
  const pool = post.destination
    ? GRADIENTS[post.destination]
    : GRADIENTS.other;
  return pool[idx % pool.length];
}

export default function Journal() {
  useReveal();
  const [filter, setFilter] = useState<Filter>("all");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const overlays = useBlogPostsBySlug();

  const overlayedPosts = useMemo(() => {
    const inlineBySlug = new Map(blogPosts.map((p) => [p.slug, p]));
    // Only include inline posts that the API still returns as
    // published — drafted ones drop out of the listing entirely.
    const merged: BlogPost[] = blogPosts
      .filter((p) => overlays.has(p.slug))
      .map((p) => {
        const o = overlays.get(p.slug)!;
        return {
          ...p,
          title: o.title || p.title,
          excerpt: o.excerpt || p.excerpt,
          coverImage: o.coverImage || p.coverImage,
          category: (o.category as BlogPost["category"]) || p.category,
          author: o.author || p.author,
          readTime: typeof o.readTime === "number" && o.readTime > 0 ? o.readTime : p.readTime,
          featured: typeof o.featured === "boolean" ? o.featured : p.featured,
          tags: o.tags && o.tags.length > 0 ? o.tags : p.tags,
        };
      });

    // Append API-only posts (newly-created via admin) that aren't in the inline list.
    overlays.forEach((o, slug) => {
      if (!slug || inlineBySlug.has(slug)) return;
      const dest = (o as any).destination as BlogPost["destination"];
      merged.unshift({
        slug,
        title: o.title || slug,
        excerpt: o.excerpt || "",
        content: (o as any).content || [],
        category: (o.category as BlogPost["category"]) || "Siwa",
        coverImage: o.coverImage || "",
        author: o.author || "Soléi Editorial",
        publishedAt: (o as any).publishedAt || new Date().toISOString(),
        readTime: typeof o.readTime === "number" && o.readTime > 0 ? o.readTime : 5,
        featured: !!o.featured,
        tags: o.tags || [],
        destination: dest === "siwa" || dest === "north-coast" ? dest : undefined,
      });
    });

    return merged;
  }, [overlays]);

  const visible = useMemo(
    () => overlayedPosts.filter((p) => matches(p, filter)),
    [filter, overlayedPosts],
  );
  const featured = visible.find((p) => p.featured);
  // Only remove the single featured post we're displaying — other posts
  // flagged `featured: true` still appear in the grid.
  const rest = visible.filter((p) => p !== featured);
  const siwaPosts = rest.filter((p) => p.destination === "siwa");
  const ncPosts = rest.filter((p) => p.destination === "north-coast");
  const otherPosts = rest.filter((p) => !p.destination);

  // Stats must describe the SAME set the listing renders. They used to
  // count the bundled blogPosts array while the listing merged in
  // admin-created posts too, so the header said "6 articles" above a
  // list reporting "Showing 7 articles".
  const totalReadTime = overlayedPosts.reduce((a, p) => a + p.readTime, 0);
  const avgRead = overlayedPosts.length ? Math.round(totalReadTime / overlayedPosts.length) : 0;
  const destinationsCount = new Set(
    overlayedPosts.map((p) => p.destination).filter(Boolean),
  ).size;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setErrorMsg(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubscribed(true);
        setEmail("");
      } else {
        setErrorMsg(
          "Something went wrong — try again or contact us directly.",
        );
      }
    } catch {
      setErrorMsg(
        "Something went wrong — try again or contact us directly.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="The Soléi Journal"
        description="Stories from the field — written from the inside of Siwa Oasis and Egypt's North Coast. Not a travel blog, a journal."
        path="/journal"
      />
      <Nav darkHero={false} />

      <main>
        {/* ── HEADER ──────────────────────────────────────────── */}
        <section className="bg-cream px-6 md:px-12 lg:px-20 pt-32 pb-16 border-b border-sand">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-end">
            <div>
              <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-5 animate-fade-up animation-delay-200">
                <span className="block w-[22px] h-px" style={{ backgroundColor: '#D7C6A1' }} />
                The Soléi Journal
              </p>
              <h1
                className="font-display font-normal leading-[1.04] text-navy animate-fade-up animation-delay-400"
                style={{ fontSize: "clamp(2.6rem, 7vw, 6rem)" }}
              >
                Stories from
                <br />
                the <em className="italic text-coastal">field.</em>
              </h1>
            </div>
            <div className="animate-fade-up animation-delay-600">
              <p className="text-[0.9rem] text-ink-soft leading-[1.95] mb-8">
                Not a travel blog. Not a guide. A journal — written from the
                inside of the places we know best. Every piece here is
                written because we had something worth saying, not because
                the calendar required it.
              </p>
              <div className="flex gap-10 border-t border-sand pt-5">
                {[
                  { num: String(overlayedPosts.length), label: "Articles" },
                  { num: String(destinationsCount), label: "Destinations" },
                  { num: `~${avgRead}`, label: "Min avg read" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-[1.8rem] font-normal text-gold leading-none">
                      {s.num}
                    </div>
                    <div className="text-[0.6rem] tracking-[0.18em] uppercase text-ink-soft/65 mt-1">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FILTER BAR ──────────────────────────────────────── */}
        <div className="sticky top-[64px] z-[40] bg-white border-b border-sand">
          <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4">
            <div className="flex overflow-x-auto -mx-2 md:mx-0">
              {FILTERS.map((f) => {
                const active = filter === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFilter(f.value)}
                    className={`px-5 py-4 text-[0.62rem] tracking-[0.18em] uppercase font-body whitespace-nowrap border-b-2 transition-colors -mb-px ${
                      active
                        ? "text-navy border-gold"
                        : "text-ink-soft border-transparent hover:text-coastal"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
            <div className="text-[0.62rem] text-ink-soft tracking-wide py-2 md:py-0">
              Showing{" "}
              <span className="text-navy font-medium">{visible.length}</span>{" "}
              {visible.length === 1 ? "article" : "articles"}
            </div>
          </div>
        </div>

        {/* ── FEATURED ────────────────────────────────────────── */}
        {featured && (
          <section className="bg-cream px-6 md:px-12 lg:px-20 pt-16">
            <div className="max-w-5xl mx-auto">
              <FeaturedArticle post={featured} />
            </div>
          </section>
        )}

        {/* ── ARTICLE GRIDS ───────────────────────────────────── */}
        <section className="bg-cream px-6 md:px-12 lg:px-20 pb-24 pt-[2px]">
          <div className="max-w-5xl mx-auto">
            {siwaPosts.length > 0 && (
              <>
                <DestinationDivider label="Siwa" italic="Oasis" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]">
                  {siwaPosts.map((p, i) => (
                    <ArticleCard key={p.slug} post={p} index={i} />
                  ))}
                </div>
              </>
            )}

            {ncPosts.length > 0 && (
              <>
                <DestinationDivider label="North" italic="Coast" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]">
                  {ncPosts.map((p, i) => (
                    <ArticleCard key={p.slug} post={p} index={i} />
                  ))}
                </div>
              </>
            )}

            {otherPosts.length > 0 && (
              <>
                <DestinationDivider label="Other" italic="writing" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]">
                  {otherPosts.map((p, i) => (
                    <ArticleCard key={p.slug} post={p} index={i} />
                  ))}
                </div>
              </>
            )}

            {visible.length === 0 && (
              <p className="text-center text-ink-soft py-16">
                No articles match this filter.
              </p>
            )}
          </div>
        </section>

        {/* ── NEWSLETTER ──────────────────────────────────────── */}
        <section className="bg-sand-light px-6 md:px-12 lg:px-20 py-20 md:py-28">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
            <div className="reveal">
              <h2
                className="font-display font-normal text-navy leading-[1.2] mb-4"
                style={{ fontSize: "clamp(1.4rem, 3vw, 2.4rem)" }}
              >
                The Soléi letter.
                <br />
                Once a month,{" "}
                <em className="italic text-coastal">when it's ready.</em>
              </h2>
              <p className="text-[0.88rem] text-ink-soft leading-[1.95]">
                Not a newsletter in the traditional sense. A letter —
                written when we have something worth sharing. A new place
                we've discovered, a piece of writing we're proud of, or
                something about Egypt that most travellers never find out.
              </p>
            </div>

            <div className="reveal reveal-d1">
              {subscribed ? (
                <div className="bg-white border border-sand px-6 py-5">
                  <p className="font-display text-[1rem] text-navy mb-2">
                    Subscribed.
                  </p>
                  <p className="text-[0.82rem] text-ink-soft leading-[1.7]">
                    We'll write when we have something worth saying.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-[2px]">
                  <input
                    type="email"
                    required
                    disabled={submitting}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="flex-1 px-5 py-4 bg-white border border-sand text-[0.84rem] text-navy font-body font-light focus:border-coastal outline-none placeholder:text-ink-soft/65 disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="text-[0.62rem] tracking-[0.18em] uppercase text-navy bg-gold px-7 py-4 font-body font-medium whitespace-nowrap hover:bg-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Sending…" : "Subscribe"}
                  </button>
                </form>
              )}
              {!subscribed && errorMsg && (
                <p className="text-[0.72rem] text-[#b3362b] leading-[1.6] mt-3">
                  {errorMsg}
                </p>
              )}
              {!subscribed && !errorMsg && (
                <p className="text-[0.68rem] text-ink-soft/65 leading-[1.6] mt-3">
                  No frequency promises. No marketing. Unsubscribe whenever
                  you like. We write when we have something worth saying.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ── CLOSING ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-navy px-6 md:px-12 lg:px-20 py-24 md:py-28 text-center">
          <div className="absolute inset-0 textile-bg pointer-events-none" />
          <div className="relative z-[2] max-w-xl mx-auto">
            <div className="flex justify-center mb-10">
              <Arch className="w-14" />
            </div>
            <h2
              className="reveal font-display font-normal leading-[1.2] text-white mb-5"
              style={{ fontSize: "clamp(1.7rem, 4vw, 3rem)" }}
            >
              Reading is the start.
              <br />
              <em className="italic text-gold">The stay is the point.</em>
            </h2>
            <p className="reveal text-[0.88rem] text-white/40 leading-[1.95] mb-10">
              Every piece in the Journal is written from somewhere real. If
              something here made you want to go — we're ready when you are.
            </p>
            <div className="reveal flex gap-4 justify-center flex-wrap">
              <Link
                href="/enquire"
                className="text-[0.65rem] tracking-[0.2em] uppercase text-navy bg-gold px-10 py-4 hover:bg-gold-light transition-colors"
              >
                Begin your stay
              </Link>
              <Link
                href="/siwa-oasis"
                className="text-[0.65rem] tracking-[0.2em] uppercase text-white border border-white/20 px-10 py-4 hover:border-gold hover:text-gold transition-colors"
              >
                Explore Siwa
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
 *  Featured article
 * ────────────────────────────────────────────────────────────── */

function FeaturedArticle({ post }: { post: BlogPost }) {
  const gradient = gradientFor(post, 0);
  return (
    <Link
      href={`/journal/${post.slug}`}
      className="reveal grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-[2px] group"
    >
      <div
        className={`relative min-h-[320px] md:min-h-[480px] overflow-hidden ${gradient}`}
      >
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 textile-bg--strong pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(9,24,32,0.6) 0%, transparent 50%)",
          }}
        />
        <div className="absolute bottom-8 left-8 z-[2]">
          <span className="inline-block text-[0.54rem] tracking-[0.22em] uppercase text-gold bg-navy-deep/70 px-3 py-1 backdrop-blur-md">
            {destLabel(post.destination)}
            {post.articleType && ` · ${post.articleType === "experience" ? "Experiences" : "Guides"}`}
          </span>
        </div>
      </div>
      <div className="bg-white border border-sand p-8 md:p-10 flex flex-col justify-between group-hover:border-coastal transition-colors">
        <div>
          <p className="flex items-center gap-2 text-[0.58rem] tracking-[0.3em] uppercase text-gold mb-4">
            <span className="block w-[16px] h-px" style={{ backgroundColor: '#DBCAA8' }} />
            Featured · {post.readTime} min read
          </p>
          <h2
            className="font-display font-normal leading-[1.25] text-navy mb-4"
            style={{ fontSize: "clamp(1.4rem, 2.8vw, 2.4rem)" }}
          >
            {post.title}
          </h2>
          <p className="text-[0.88rem] text-ink-soft leading-[1.95] mb-6">
            {post.excerpt}
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 pt-5 border-t border-sand-light">
          <div className="flex gap-3 flex-wrap text-[0.65rem] text-ink-soft/65">
            <span>{post.readTime} min read</span>
            <span>·</span>
            <span>{destLabel(post.destination)}</span>
            <span>·</span>
            <span>{fmtDate(post.publishedAt)}</span>
          </div>
          <span className="text-[0.6rem] tracking-[0.2em] uppercase text-gold whitespace-nowrap group-hover:pl-2 transition-all">
            Read the piece →
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ──────────────────────────────────────────────────────────────
 *  Section divider + article card
 * ────────────────────────────────────────────────────────────── */

function DestinationDivider({
  label,
  italic,
}: {
  label: string;
  italic: string;
}) {
  return (
    <div className="reveal flex items-center justify-between py-10 mt-[2px] border-t border-sand">
      <h3 className="font-display text-[1.3rem] md:text-[1.4rem] text-navy">
        {label} <em className="italic text-coastal">{italic}</em>
      </h3>
    </div>
  );
}

function ArticleCard({ post, index }: { post: BlogPost; index: number }) {
  const gradient = gradientFor(post, index);
  return (
    <Link
      href={`/journal/${post.slug}`}
      className={`reveal ${index % 3 === 1 ? "reveal-d1" : index % 3 === 2 ? "reveal-d2" : ""} bg-white border border-sand flex flex-col overflow-hidden hover:border-coastal transition-colors group`}
    >
      <div className={`relative h-[200px] overflow-hidden ${gradient}`}>
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 textile-bg--strong pointer-events-none" />
        <span className="absolute top-4 left-4 text-[0.52rem] tracking-[0.2em] uppercase text-gold bg-navy-deep/75 px-3 py-1 backdrop-blur-md">
          {destLabel(post.destination)}
        </span>
        <span className="absolute bottom-4 right-4 text-[0.5rem] tracking-[0.15em] uppercase text-white/55">
          {post.readTime} min
        </span>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <p className="text-[0.56rem] tracking-[0.26em] uppercase text-gold mb-3">
          {post.articleType === "experience"
            ? "Experiences"
            : post.articleType === "guide"
              ? "Guide"
              : post.category}
        </p>
        <h3 className="font-display text-[1.05rem] font-normal leading-snug text-navy mb-3 flex-1">
          {post.title}
        </h3>
        <p className="text-[0.8rem] text-ink-soft leading-[1.8] mb-4">
          {post.excerpt}
        </p>
        <div className="flex justify-between items-center pt-3 border-t border-sand-light mt-auto">
          <span className="text-[0.62rem] text-ink-soft/65">
            {post.readTime} min read · {fmtDate(post.publishedAt)}
          </span>
          <span className="text-[0.58rem] tracking-[0.14em] uppercase text-coastal/70 group-hover:text-coastal transition-colors">
            Read →
          </span>
        </div>
      </div>
    </Link>
  );
}
