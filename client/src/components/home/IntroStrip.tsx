import { Link } from "wouter";
import { useSiteContent, pickContent } from "@/lib/useSiteContent";

/**
 * Intro strip — cream background, two-column editorial layout.
 * Lives directly below the hero + booking bar.
 */
export function IntroStrip() {
  const c = useSiteContent();
  const eyebrow = pickContent(c, "home.intro.eyebrow", "A different kind of Egypt");
  const title1 = pickContent(c, "home.intro.title", "Built around the moments");
  const title2 = pickContent(c, "home.intro.title_2", "most travelers");
  const italic = pickContent(c, "home.intro.italic", "never reach.");
  const body = pickContent(
    c,
    "home.intro.body",
    "We don't show you Egypt. We create the conditions for you to feel it — deeply, quietly, and in your own way. Soléi was founded by someone who grew up in Siwa Oasis and came back to share what he always knew was there.",
  );
  const cta = pickContent(c, "home.intro.cta", "Read our story");
  return (
    <section className="bg-cream pt-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24 items-end pb-20 border-b border-sand">
        <div>
          <p className="reveal flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-6">
            <span className="block w-6 h-px bg-gold opacity-50" />
            {eyebrow}
          </p>
          <h2
            className="reveal font-display font-normal text-navy leading-[1.2]"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
          >
            {title1}
            <br />
            {title2}{" "}
            <em className="italic text-coastal">{italic}</em>
          </h2>
        </div>
        <div className="reveal reveal-d1">
          <p className="text-[0.9rem] text-ink-soft leading-[1.95]">
            {body}
          </p>
          <Link
            href="/our-story"
            className="inline-block mt-6 text-[0.62rem] tracking-[0.2em] uppercase text-navy border-b border-sand pb-[3px] hover:text-gold hover:border-gold transition-colors"
          >
            {cta}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default IntroStrip;
