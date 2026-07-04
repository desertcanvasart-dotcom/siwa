import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { useReveal } from "@/components/home/useReveal";
import {
  blogPosts,
  getBlogPost,
  type BlogPost,
} from "@/lib/blog-data";
import { getExperience } from "@/lib/experience-data";
import { useBlogOverlay, useBlogOverlayQuery } from "@/lib/useBlogOverlay";

/* ──────────────────────────────────────────────────────────────
 *  /journal/:slug
 *
 *  Editorial article template. Gold 2px reading progress bar
 *  pinned above the nav. Navy hero with tag chips. 3-column
 *  reading grid with content centred in min(680px). Italic
 *  Playfair lede, body in Raleway, optional pull quote.
 *  Optional inline experience CTA (when linkedExperience set).
 *  Author bio + related articles.
 * ────────────────────────────────────────────────────────────── */

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function destLabel(d?: "siwa" | "north-coast"): string {
  if (d === "siwa") return "Siwa Oasis";
  if (d === "north-coast") return "North Coast";
  return "Journal";
}

const HERO_GRADIENT = {
  siwa: "bg-[linear-gradient(155deg,#1a3a52_0%,#0F2436_50%,#2a5a7a_100%)]",
  "north-coast":
    "bg-[linear-gradient(155deg,#0F2436_0%,#2F6F8F_55%,#1a5a7a_100%)]",
  other: "bg-[linear-gradient(155deg,#1a3a52_0%,#0F2436_100%)]",
};

function heroGradientFor(post: BlogPost): string {
  return post.destination ? HERO_GRADIENT[post.destination] : HERO_GRADIENT.other;
}

const CARD_GRADIENT = {
  siwa: "bg-[linear-gradient(155deg,#0F2436_0%,#1a3040_100%)]",
  "north-coast":
    "bg-[linear-gradient(155deg,#2F6F8F_0%,#1a4060_100%)]",
  other: "bg-[linear-gradient(155deg,#2a1a0a_0%,#0F2436_100%)]",
};

function cardGradientFor(post: BlogPost): string {
  return post.destination ? CARD_GRADIENT[post.destination] : CARD_GRADIENT.other;
}

export default function BlogPostPage() {
  useReveal();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/journal/:slug");
  const slug = (match && params?.slug) || "";
  const basePostFromTs = useMemo(() => getBlogPost(slug), [slug]);
  const { isLoading: overlayLoading, isFetched: overlayFetched } = useBlogOverlayQuery(slug);
  const overlay = useBlogOverlay(slug);

  // If the slug isn't in the inline blog-data.ts file, synthesize a
  // minimal BlogPost from the API overlay so admin-created posts can
  // still render on the live site.
  const basePost = useMemo<BlogPost | null>(() => {
    if (basePostFromTs) return basePostFromTs;
    if (!overlay) return null;
    const dest = (overlay as any).destination;
    return {
      slug,
      title: overlay.title || slug,
      excerpt: overlay.excerpt || "",
      content: (overlay as any).content || [],
      category: (overlay.category as BlogPost["category"]) || "Siwa",
      coverImage: overlay.coverImage || "",
      author: overlay.author || "Soléi Editorial",
      publishedAt: (overlay as any).publishedAt || new Date().toISOString(),
      readTime: typeof overlay.readTime === "number" && overlay.readTime > 0 ? overlay.readTime : 5,
      featured: !!overlay.featured,
      tags: overlay.tags || [],
      destination: dest === "siwa" || dest === "north-coast" ? dest : undefined,
    };
  }, [basePostFromTs, overlay, slug]);

  // Merge editable fields from API on top of the TS file. Empty arrays
  // and null/undefined fields fall through to the base TS post so we
  // never blank out content.
  const post = useMemo<BlogPost | null>(() => {
    if (!basePost) return null;
    if (!overlay) return basePost;
    return {
      ...basePost,
      title: overlay.title || basePost.title,
      excerpt: overlay.excerpt || basePost.excerpt,
      coverImage: overlay.coverImage || basePost.coverImage,
      category: (overlay.category as BlogPost["category"]) || basePost.category,
      author: overlay.author || basePost.author,
      readTime:
        typeof overlay.readTime === "number" && overlay.readTime > 0
          ? overlay.readTime
          : basePost.readTime,
      featured:
        typeof overlay.featured === "boolean" ? overlay.featured : basePost.featured,
      tags:
        overlay.tags && overlay.tags.length > 0 ? overlay.tags : basePost.tags,
      content:
        overlay.content && overlay.content.length > 0
          ? overlay.content
          : basePost.content,
    };
  }, [basePost, overlay]);

  // Redirect to /journal when the API has no published post for this
  // slug. The API is the source of truth — drafted posts disappear
  // from the public site even when the inline TS file still has them.
  useEffect(() => {
    if (!slug) return;
    if (overlayLoading || !overlayFetched) return;
    if (overlay) return;
    setLocation("/journal");
  }, [slug, overlay, overlayLoading, overlayFetched, setLocation]);

  /* ── Gold reading progress bar ── */
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const pct = total > 0 ? (doc.scrollTop / total) * 100 : 0;
      setProgress(Math.max(0, Math.min(100, pct)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (overlayLoading || !overlayFetched) return null;
  if (!overlay) return null;
  if (!post) return null;

  const linkedExp = post.linkedExperience
    ? getExperience(post.linkedExperience)
    : undefined;

  const related = blogPosts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      const aMatch = a.destination === post.destination ? 1 : 0;
      const bMatch = b.destination === post.destination ? 1 : 0;
      if (bMatch !== aMatch) return bMatch - aMatch;
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    })
    .slice(0, 3);

  // Choose a mid-article paragraph to render as a pull quote
  const pullQuoteIndex = post.content.length >= 4
    ? Math.floor(post.content.length / 2)
    : -1;

  return (
    <>
      <SEO
        title={
          (overlay && overlay.metaTitle) ||
          `${post.title} — The Soléi Journal`
        }
        description={
          (overlay && overlay.metaDescription) || post.excerpt
        }
        path={`/journal/${post.slug}`}
      />

      {/* Gold 2px reading progress bar — pinned above the nav */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-gold z-[300] transition-[width] duration-100 ease-linear"
        style={{ width: `${progress}%` }}
        aria-hidden
      />

      <Nav />

      <main>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section
          className={`relative overflow-hidden flex flex-col justify-end min-h-[70vh] mt-[64px] px-6 md:px-12 lg:px-20 pt-16 pb-16 ${heroGradientFor(post)}`}
        >
          <div className="absolute inset-0 textile-bg--strong pointer-events-none" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(9,24,32,0.9) 0%, rgba(9,24,32,0.2) 60%, rgba(9,24,32,0.05) 100%)",
            }}
          />

          <div className="relative z-[2] max-w-[680px] mx-auto w-full">
            <p className="flex items-center gap-3 text-[0.56rem] tracking-[0.25em] uppercase text-white/25 mb-6 animate-fade-up animation-delay-200">
              <Link href="/" className="hover:text-gold transition-colors">
                Soléi
              </Link>
              <span className="opacity-40">/</span>
              <Link href="/journal" className="hover:text-gold transition-colors">
                Journal
              </Link>
              <span className="opacity-40">/</span>
              <span>{post.title.split("—")[0].trim().slice(0, 50)}</span>
            </p>

            <div className="flex flex-wrap gap-2 mb-6 animate-fade-up animation-delay-400">
              {post.destination && (
                <span className="text-[0.54rem] tracking-[0.2em] uppercase text-gold border border-gold/40 px-3 py-1">
                  {destLabel(post.destination)}
                </span>
              )}
              {post.articleType && (
                <span className="text-[0.54rem] tracking-[0.2em] uppercase text-white/45 border border-white/15 px-3 py-1">
                  {post.articleType === "experience" ? "Experiences" : "Guides"}
                </span>
              )}
              <span className="text-[0.54rem] tracking-[0.2em] uppercase text-white/45 border border-white/15 px-3 py-1">
                {post.readTime} min read
              </span>
              <span className="text-[0.54rem] tracking-[0.2em] uppercase text-white/45 border border-white/15 px-3 py-1">
                {fmtDate(post.publishedAt)}
              </span>
            </div>

            <h1
              className="font-display font-normal leading-[1.18] text-white mb-6 animate-fade-up animation-delay-600"
              style={{ fontSize: "clamp(1.9rem, 5vw, 3.8rem)" }}
            >
              {post.title}
            </h1>

            <div className="flex items-center gap-4 flex-wrap text-[0.72rem] text-white/35 animate-fade-up animation-delay-800">
              <span>{post.author}</span>
              <span className="w-[3px] h-[3px] rounded-full bg-gold opacity-40" />
              <span>Soléi</span>
              <span className="w-[3px] h-[3px] rounded-full bg-gold opacity-40" />
              <span>{fmtDate(post.publishedAt)}</span>
            </div>
          </div>
        </section>

        {/* ── ARTICLE BODY — centred 680px reading column ─────── */}
        <section className="bg-cream grid grid-cols-[1rem_minmax(0,680px)_1rem] md:grid-cols-[minmax(2.5rem,1fr)_minmax(0,680px)_minmax(2.5rem,1fr)] pt-14 md:pt-20 pb-12">
          <div className="col-start-2 reveal">
            {/* If the admin saved rich HTML via the wizard, render that
                instead of the legacy paragraph-based layout. The
                prose-journal class lives in styles/tokens.css and
                matches the editorial typography of the legacy layout. */}
            {overlay && overlay.bodyHtml ? (
              <div
                className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-normal prose-headings:text-navy prose-p:text-ink-soft prose-p:leading-[2] prose-a:text-coastal prose-blockquote:border-l-gold prose-blockquote:bg-white prose-blockquote:not-italic prose-blockquote:font-display prose-blockquote:text-navy prose-img:my-8"
                dangerouslySetInnerHTML={{ __html: overlay.bodyHtml }}
              />
            ) : (
              <>
            <p
              className="font-display italic font-normal leading-[1.65] text-navy mb-10 pb-10 border-b border-sand"
              style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)" }}
            >
              {post.content[0]}
            </p>

            {/* Body paragraphs with optional pull quote in the middle */}
            {post.content.slice(1).map((p, i) => {
              const bodyIdx = i + 1;
              const isPullQuote = bodyIdx === pullQuoteIndex;
              return (
                <div key={i}>
                  {isPullQuote && (
                    <blockquote className="my-10 py-7 px-6 md:px-8 border-l-2 border-gold bg-white">
                      <p
                        className="font-display italic font-normal leading-[1.65] text-navy mb-3"
                        style={{ fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)" }}
                      >
                        "{post.content[pullQuoteIndex]}"
                      </p>
                      <span className="text-[0.62rem] tracking-[0.2em] uppercase text-ink-soft/50">
                        Soléi Journal
                      </span>
                    </blockquote>
                  )}
                  {!isPullQuote && (
                    <p
                      className="text-ink-soft mb-6"
                      style={{ fontSize: "1rem", lineHeight: 2 }}
                    >
                      {p}
                    </p>
                  )}
                </div>
              );
            })}
              </>
            )}

            {/* Article end mark */}
            <div className="flex items-center gap-6 mt-14 pt-10 border-t border-sand">
              <div className="flex-1 h-px bg-sand" />
              <span className="font-display italic text-[0.85rem] text-gold/60 whitespace-nowrap">
                — {post.author}
              </span>
              <div className="flex-1 h-px bg-sand" />
            </div>
          </div>
        </section>

        {/* ── INLINE EXPERIENCE CTA — only when linkedExperience set ── */}
        {linkedExp && (
          <section className="bg-cream grid grid-cols-[1rem_minmax(0,680px)_1rem] md:grid-cols-[minmax(2.5rem,1fr)_minmax(0,680px)_minmax(2.5rem,1fr)] pb-14">
            <div className="col-start-2">
              <Link
                href={`/${linkedExp.destination}/experiences/${linkedExp.slug}`}
                className="relative overflow-hidden bg-navy flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8 p-8 md:p-10 group hover:opacity-95 transition-opacity"
              >
                <div className="absolute inset-0 textile-bg pointer-events-none" />
                <div className="relative z-[2]">
                  <p className="text-[0.56rem] tracking-[0.28em] uppercase text-gold/75 mb-2">
                    Book the experience
                  </p>
                  <p className="font-display text-[1.15rem] md:text-[1.3rem] text-white font-normal leading-tight">
                    {linkedExp.name}{" "}
                    <em className="italic text-gold">
                      — from €{linkedExp.price} per person
                    </em>
                  </p>
                </div>
                <span className="relative z-[2] text-[0.6rem] tracking-[0.18em] uppercase text-navy bg-gold px-7 py-3 whitespace-nowrap flex-shrink-0 group-hover:bg-gold-light transition-colors">
                  {linkedExp.destination === "north-coast"
                    ? "Enquire to book →"
                    : "Book now →"}
                </span>
              </Link>
            </div>
          </section>
        )}

        {/* ── AUTHOR BIO ──────────────────────────────────────── */}
        <section className="bg-cream grid grid-cols-[1rem_minmax(0,680px)_1rem] md:grid-cols-[minmax(2.5rem,1fr)_minmax(0,680px)_minmax(2.5rem,1fr)] pb-20">
          <div className="col-start-2">
            <div className="bg-white border border-sand p-8 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-[60px] h-[60px] rounded-full bg-[linear-gradient(155deg,#0F2436_0%,#1a3a52_100%)] border border-gold opacity-80 flex-shrink-0" />
              <div>
                <h3 className="font-display text-[1rem] text-navy mb-1">
                  {post.author}
                </h3>
                <p className="text-[0.62rem] tracking-[0.1em] uppercase text-ink-soft/50 mb-3">
                  Soléi Editorial
                </p>
                <p className="text-[0.82rem] text-ink-soft leading-[1.8]">
                  Written by the Soléi editorial team — travellers, guides,
                  and local collaborators who write about the places we
                  know from the inside.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── RELATED ─────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="bg-sand-light px-6 md:px-12 lg:px-20 py-20">
            <div className="max-w-5xl mx-auto">
              <div className="reveal flex flex-col md:flex-row justify-between items-start md:items-end gap-3 mb-10">
                <h2 className="font-display font-normal text-navy leading-[1.2] text-[1.5rem] md:text-[1.8rem]">
                  More from the{" "}
                  <em className="italic text-coastal">Journal</em>
                </h2>
                <Link
                  href="/journal"
                  className="text-[0.6rem] tracking-[0.2em] uppercase text-navy opacity-35 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
                >
                  All articles →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
                {related.map((r, i) => (
                  <Link
                    key={r.slug}
                    href={`/journal/${r.slug}`}
                    className={`reveal ${i > 0 ? `reveal-d${i}` : ""} bg-white border border-sand overflow-hidden block hover:border-gold transition-colors`}
                  >
                    <div
                      className={`relative h-[160px] overflow-hidden ${cardGradientFor(r)}`}
                    >
                      <div className="absolute inset-0 textile-bg--strong pointer-events-none" />
                      <span className="absolute top-3 left-3 text-[0.52rem] tracking-[0.2em] uppercase text-gold bg-navy-deep/75 px-3 py-1">
                        {destLabel(r.destination)}
                      </span>
                    </div>
                    <div className="p-6">
                      <p className="text-[0.56rem] tracking-[0.2em] uppercase text-gold mb-2">
                        {r.articleType === "experience"
                          ? "Experiences"
                          : r.articleType === "guide"
                            ? "Guide"
                            : r.category}
                      </p>
                      <h3 className="font-display text-[0.95rem] text-navy leading-snug mb-3">
                        {r.title}
                      </h3>
                      <div className="flex justify-between items-center pt-3 border-t border-sand-light">
                        <span className="text-[0.62rem] text-ink-soft/40">
                          {r.readTime} min read
                        </span>
                        <span className="text-[0.58rem] tracking-[0.14em] uppercase text-coastal/70">
                          Read →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
