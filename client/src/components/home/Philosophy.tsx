import { SmartLink } from "@/components/ui/SmartLink";
import { useSiteContent, pickContent } from "@/lib/useSiteContent";

/**
 * Philosophy — centered pull-quote on sand-light background.
 */
export function Philosophy() {
  const c = useSiteContent();
  const eyebrow = pickContent(c, "home.philosophy.eyebrow", "What we believe");
  const quote = pickContent(
    c,
    "home.philosophy.quote",
    "We don't show you Egypt. We create the conditions for you to",
  );
  const accent = pickContent(c, "home.philosophy.accent", "feel");
  const quoteEnd = pickContent(c, "home.philosophy.quote_end", "it.");
  const body = pickContent(
    c,
    "home.philosophy.body",
    "Soléi was built around the moments most travelers never reach — not because they're hidden, but because reaching them takes someone who knows where to go.",
  );
  const ctaLabel = pickContent(c, "home.philosophy.cta", "Our story");
  const ctaHref = pickContent(c, "home.philosophy.cta_href", "/our-story");
  return (
    <section className="bg-sand-light px-6 md:px-12 lg:px-20 py-28 text-center">
      <div className="max-w-[720px] mx-auto">
        <p className="reveal inline-flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-10 mx-auto">
          <span className="block w-6 h-px bg-gold opacity-50" />
          {eyebrow}
          <span className="block w-6 h-px bg-gold opacity-50" />
        </p>
        <div className="reveal w-9 h-px bg-gold opacity-40 mx-auto my-10" />
        <p
          className="reveal font-display font-normal italic text-navy leading-[1.35]"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
        >
          "{quote}{" "}
          {accent && <em className="not-italic text-coastal">{accent}</em>}
          {quoteEnd && ` ${quoteEnd}`}"
        </p>
        <div className="reveal w-9 h-px bg-gold opacity-40 mx-auto my-10" />
        <p className="reveal text-[0.84rem] text-ink-soft leading-[1.95]">
          {body}
        </p>
        {ctaLabel && ctaHref && (
          <SmartLink
            href={ctaHref}
            className="reveal inline-block mt-7 text-[0.6rem] tracking-[0.22em] uppercase text-coastal border-b border-coastal/25 pb-[3px] hover:text-navy hover:border-navy transition-colors"
          >
            {ctaLabel}
          </SmartLink>
        )}
      </div>
    </section>
  );
}

export default Philosophy;
