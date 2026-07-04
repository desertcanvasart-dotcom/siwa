import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Arch } from "@/components/ui/Arch";
import { useReveal } from "@/components/home/useReveal";
import { useSiteContent, pickContent } from "@/lib/useSiteContent";

/**
 * /our-story — the brand manifesto & founder story.
 *
 * Rhythm (dark/light alternation, per spec):
 *   Hero (navy) → Origin (cream) → Moments (navy) → Philosophy (sand-light)
 *   → Lodge (navy) → Closing (cream) → Footer (navy-deep)
 *
 * All copy is lifted directly from the approved brand-story reference.
 */
export default function OurStory() {
  useReveal();
  const content = useSiteContent();
  // Hero
  const heroEyebrow = pickContent(content, "our_story.hero.eyebrow", "Our Story");
  const heroTitle = pickContent(
    content,
    "our_story.hero.title",
    "We don't show you Egypt. We create the conditions for you to",
  );
  const heroItalic = pickContent(content, "our_story.hero.italic", "feel it.");
  // Origin
  const originLabel = pickContent(content, "our_story.origin.label", "Where this began");
  const originIntro = pickContent(
    content,
    "our_story.origin.intro",
    "I grew up in Siwa. As a child, I watched tourists move through the oasis — guided by people who didn't know it the way I did.",
  );
  const originP1 = pickContent(
    content,
    "our_story.origin.p1",
    "They were telling the surface of the story. The obvious places, the rehearsed descriptions. The true beauty — the hidden corners, the quality of light at certain hours, the feeling of the place when it's finally quiet — stayed untouched behind them as they left.",
  );
  const originP2 = pickContent(
    content,
    "our_story.origin.p2",
    "I went to Cairo for college. When I finished, I came back. Not to visit. To stay. And to share what I'd always known was here.",
  );
  const originP3 = pickContent(
    content,
    "our_story.origin.p3",
    "Soléi is the result of that decision — built for the traveler who wants to feel somewhere, not just see it.",
  );
  // Moments
  const momentsEyebrow = pickContent(
    content,
    "our_story.moments.eyebrow",
    "The moments most travelers never reach",
  );
  // Philosophy
  const philosophyEyebrow = pickContent(content, "our_story.philosophy.eyebrow", "What we believe");
  const philosophyTitle = pickContent(
    content,
    "our_story.philosophy.title",
    "These aren't activities. They're",
  );
  const philosophyAccent = pickContent(content, "our_story.philosophy.accent", "states of being.");
  const philosophyBody = pickContent(
    content,
    "our_story.philosophy.body",
    "Most travel is about arrival — the destination checked, the photo taken, the experience confirmed. Soléi exists for something different. We're built for the traveler who wants to feel somewhere, not just see it.",
  );
  // Lodge
  const lodgeEyebrow = pickContent(content, "our_story.lodge.eyebrow", "Where you sleep");
  const lodgeTitle = pickContent(content, "our_story.lodge.title", "A Siwa that extends into");
  const lodgeItalic = pickContent(content, "our_story.lodge.italic", "every room.");
  const lodgeP1 = pickContent(
    content,
    "our_story.lodge.p1",
    "We built our eco-lodges in Siwa from the ground up. Stone and palm, warm light through small windows, the smell of the desert just outside.",
  );
  const lodgeP2 = pickContent(
    content,
    "our_story.lodge.p2",
    "Beds you sink into. Courtyards that hold the evening cool. Spaces that feel handmade — because they are — with the kind of care that doesn't announce itself but settles around you quietly, like the place itself.",
  );
  const lodgeP3 = pickContent(
    content,
    "our_story.lodge.p3",
    "This is not a hotel that happens to be in Siwa.",
  );
  // Closing
  const closingQuote = pickContent(
    content,
    "our_story.closing.quote",
    `"We've spent years learning which moments make Egypt feel like it belongs to you — even briefly."`,
  );
  const closingBody = pickContent(
    content,
    "our_story.closing.body",
    "Everything we build around your stay is personal, unhurried, and made to fit you specifically. A conversation that begins before you arrive and continues until you're ready to leave.",
  );
  const closingCta = pickContent(content, "our_story.closing.cta", "Come as you are");

  return (
    <>
      <SEO
        title="Our Story — Soléi"
        description="We don't show you Egypt. We create the conditions for you to feel it. The founder story, the moments, and the philosophy behind Soléi."
        path="/our-story"
      />
      <Nav darkHero={false} />

      <main>
        {/* ── 1. Hero ─────────────────────────────────────────── */}
        <section className="relative min-h-screen bg-navy overflow-hidden flex flex-col justify-end px-6 md:px-12 lg:px-20 pb-20 pt-32">
          {/* Coastal-blue radial glow top-right */}
          <div
            className="absolute top-0 right-0 w-[60vw] h-[60vw] pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 80% 20%, rgba(47,111,143,0.35) 0%, rgba(47,111,143,0) 55%)",
            }}
          />

          {/* Textile pattern */}
          <div className="absolute inset-0 textile-bg pointer-events-none" />

          {/* Arch motif top-center */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1]">
            <Arch className="w-40 md:w-56 h-auto opacity-70" />
          </div>

          <div className="relative z-[2] max-w-6xl mx-auto w-full">
            <p className="flex items-center gap-3 text-[0.6rem] tracking-[0.42em] uppercase text-gold mb-8 animate-fade-up animation-delay-400">
              <span className="block w-7 h-px bg-gold opacity-60" />
              {heroEyebrow}
            </p>
            <h1
              className="font-display font-normal leading-[1.06] text-white max-w-[22ch] animate-fade-up animation-delay-600"
              style={{
                fontSize: "clamp(2.6rem, 7vw, 6rem)",
                textShadow: "0 2px 40px rgba(9,24,32,0.4)",
              }}
            >
              {heroTitle}{" "}
              <em className="italic text-gold">{heroItalic}</em>
            </h1>
            <div
              className="w-px h-16 bg-gold/60 mt-14 animate-fade-up"
              style={{ animationDelay: "1.1s" }}
            />
          </div>

          {/* Scroll indicator bottom-right */}
          <div
            className="hidden md:flex absolute bottom-10 right-20 flex-col items-center gap-2.5 animate-fade-up z-[2]"
            style={{ animationDelay: "1.4s" }}
          >
            <div className="w-px h-14 bg-gradient-to-b from-gold/70 to-transparent animate-scroll-pulse" />
            <span className="text-[0.55rem] tracking-[0.3em] uppercase text-white/35 [writing-mode:vertical-rl]">
              Scroll
            </span>
          </div>
        </section>

        {/* ── 2. Origin ───────────────────────────────────────── */}
        <section className="bg-cream px-6 md:px-12 lg:px-20 py-28 md:py-36">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-24 items-start">
            <aside className="md:sticky md:top-40">
              <div
                className="font-display font-normal text-sand leading-[1] select-none reveal"
                style={{ fontSize: "clamp(4rem, 10vw, 7rem)" }}
              >
                01
              </div>
              <p className="reveal reveal-d1 text-[0.62rem] tracking-[0.3em] uppercase text-coastal mt-3">
                {originLabel}
              </p>
            </aside>

            <div>
              <p
                className="reveal font-display font-normal text-navy leading-[1.4] mb-7"
                style={{ fontSize: "clamp(1.4rem, 2.6vw, 2.1rem)" }}
              >
                {originIntro}
              </p>
              <p className="reveal reveal-d1 text-[0.95rem] text-ink-soft leading-[1.95] mb-6">
                {originP1}
              </p>

              <div className="reveal reveal-d2 w-10 h-px bg-gold/50 my-10" />

              <p className="reveal reveal-d2 text-[0.95rem] text-ink-soft leading-[1.95] mb-6">
                {originP2}
              </p>
              <p className="reveal reveal-d3 text-[0.95rem] text-ink-soft leading-[1.95]">
                {originP3}
              </p>
            </div>
          </div>
        </section>

        {/* ── 3. Three Moments ────────────────────────────────── */}
        <section className="relative bg-navy px-6 md:px-12 lg:px-20 py-28 md:py-36 overflow-hidden">
          <div className="absolute inset-0 textile-bg pointer-events-none" />
          <div className="relative z-[2] max-w-6xl mx-auto">
            <p className="reveal flex items-center gap-3 text-[0.62rem] tracking-[0.32em] uppercase text-gold mb-16">
              <span className="block w-7 h-px bg-gold opacity-60" />
              {momentsEyebrow}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
              {[
                {
                  n: "I.",
                  title: "The salt lakes at sunset",
                  body: "A silent swim when the light softens and the world feels paused. The water turns the colour of the sky. You stop being a tourist.",
                },
                {
                  n: "II.",
                  title: "An evening without a schedule",
                  body: "Nothing planned, nothing guided, nothing rushed. Something unexpected unfolds — and becomes the best part of the trip.",
                },
                {
                  n: "III.",
                  title: "The stillness of the oasis",
                  body: "Waking up in Siwa with nowhere to be. The particular quiet that belongs only to a place this old, this unhurried, this untouched.",
                },
              ].map((m, i) => (
                <div
                  key={m.n}
                  className={`reveal reveal-d${i + 1} border-t border-gold/25 pt-9`}
                >
                  <span className="font-display italic text-[0.95rem] text-gold/80 block mb-5 tracking-wide">
                    {m.n}
                  </span>
                  <h3 className="font-display text-[1.5rem] md:text-[1.65rem] font-normal leading-[1.25] text-white mb-4">
                    {m.title}
                  </h3>
                  <p className="text-[0.88rem] text-white/55 leading-[1.85]">
                    {m.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. Philosophy ───────────────────────────────────── */}
        <section className="bg-sand-light px-6 md:px-12 lg:px-20 py-28 md:py-40 text-center">
          <div className="max-w-[820px] mx-auto">
            <p className="reveal flex justify-center items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-12">
              <span className="block w-6 h-px bg-gold opacity-50" />
              {philosophyEyebrow}
              <span className="block w-6 h-px bg-gold opacity-50" />
            </p>
            <div className="reveal w-10 h-px bg-gold/50 mx-auto my-10" />
            <h2
              className="reveal font-display font-normal italic text-navy leading-[1.2] max-w-[22ch] mx-auto"
              style={{ fontSize: "clamp(1.9rem, 4.8vw, 3.6rem)" }}
            >
              {philosophyTitle}{" "}
              <span className="not-italic text-coastal">{philosophyAccent}</span>
            </h2>
            <div className="reveal w-10 h-px bg-gold/50 mx-auto my-10" />
            <p className="reveal text-[0.95rem] text-ink-soft leading-[2] max-w-[54ch] mx-auto">
              {philosophyBody}
            </p>
          </div>
        </section>

        {/* ── 5. The Lodge ────────────────────────────────────── */}
        <section className="relative bg-navy px-6 md:px-12 lg:px-20 py-28 md:py-36 overflow-hidden text-sand">
          <div className="absolute inset-0 textile-bg pointer-events-none" />
          <div className="relative z-[2] max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-28 items-start">
            <div>
              <p className="reveal flex items-center gap-3 text-[0.62rem] tracking-[0.32em] uppercase text-gold-light mb-7">
                <span className="block w-7 h-px bg-gold-light opacity-60" />
                {lodgeEyebrow}
              </p>
              <h2
                className="reveal font-display font-normal leading-[1.2] text-white mb-8"
                style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)" }}
              >
                {lodgeTitle}{" "}
                <em className="italic text-gold-light">{lodgeItalic}</em>
              </h2>
              <p className="reveal text-[0.95rem] text-sand/75 leading-[2] mb-6">
                {lodgeP1}
              </p>
              <p className="reveal reveal-d1 text-[0.95rem] text-sand/75 leading-[2] mb-6">
                {lodgeP2}
              </p>
              <p className="reveal reveal-d2 text-[0.95rem] text-sand/75 leading-[2]">
                {lodgeP3}
              </p>
            </div>

            <div className="md:border-l border-sand/15 md:pl-12">
              {[
                {
                  label: "Material",
                  text: "Local stone, palm wood, earthen walls that keep the desert heat outside",
                },
                {
                  label: "Atmosphere",
                  text: "Warm, unhurried — built to hold the landscape, not compete with it",
                },
                {
                  label: "Philosophy",
                  text: "Soft luxury that earns its quietness rather than announcing it",
                },
                {
                  label: "Location",
                  text: "Siwa Oasis, Egypt — within walking distance of the salt lakes",
                },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className={`reveal reveal-d${Math.min(i + 1, 3)} py-7 border-b border-sand/10 last:border-b-0 first:pt-0`}
                >
                  <p className="text-[0.62rem] tracking-[0.28em] uppercase text-gold-light mb-2">
                    {item.label}
                  </p>
                  <p className="font-display text-[1.08rem] text-sand/85 leading-[1.6]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. Closing ──────────────────────────────────────── */}
        <section className="bg-cream px-6 md:px-12 lg:px-20 py-28 md:py-40 text-center">
          <div className="max-w-[780px] mx-auto">
            <div className="flex justify-center mb-10">
              <Arch className="w-14 h-auto" />
            </div>
            <p
              className="reveal font-display font-normal italic text-navy leading-[1.35] mb-12"
              style={{ fontSize: "clamp(1.7rem, 3.8vw, 2.8rem)" }}
            >
              {closingQuote}
            </p>
            <div className="reveal w-px h-14 bg-gold/50 mx-auto mb-10" />
            <p className="reveal text-[0.92rem] text-ink-soft leading-[2] mb-12 max-w-[52ch] mx-auto">
              {closingBody}
            </p>
            <Link
              href="/enquire"
              className="reveal inline-block text-[0.65rem] tracking-[0.25em] uppercase text-white bg-navy px-10 py-4 hover:bg-navy-mid transition-colors"
            >
              {closingCta}
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
