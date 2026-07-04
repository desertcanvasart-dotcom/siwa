import { Link } from "wouter";
import { Arch } from "@/components/ui/Arch";
import { useSiteContent, pickContent } from "@/lib/useSiteContent";

/**
 * ClosingCTA — dark navy section, centered invitation.
 * Sits between Journal and the global Footer.
 */
export function ClosingCTA() {
  const c = useSiteContent();
  const title = pickContent(c, "home.closing.title", "Come as you are.");
  const italic = pickContent(c, "home.closing.italic", "We'll take care of the rest.");
  const body = pickContent(
    c,
    "home.closing.body",
    "Every stay begins with a conversation. Tell us who you are, when you're coming, and what kind of stillness you're looking for.",
  );
  const primaryCta = pickContent(c, "home.closing.primary_cta", "Begin your stay");
  const secondaryCta = pickContent(c, "home.closing.secondary_cta", "Our story");
  return (
    <section className="relative bg-navy px-6 md:px-12 lg:px-20 py-36 text-center overflow-hidden">
      <div className="absolute inset-0 textile-bg pointer-events-none" />
      <div className="relative z-[2] max-w-[680px] mx-auto">
        <div className="flex justify-center mb-10">
          <Arch className="w-14 h-auto" />
        </div>
        <h2
          className="reveal font-display font-normal text-white leading-[1.2] mb-6"
          style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)" }}
        >
          {title}
          <br />
          <em className="italic text-gold">{italic}</em>
        </h2>
        <p className="reveal text-[0.88rem] text-white/40 leading-[1.95] mb-12">
          {body}
        </p>
        <div className="reveal flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/enquire"
            className="text-[0.65rem] tracking-[0.2em] uppercase text-navy bg-gold px-10 py-4 hover:bg-gold-light transition-colors"
          >
            {primaryCta}
          </Link>
          <Link
            href="/our-story"
            className="text-[0.65rem] tracking-[0.2em] uppercase text-white border border-white/20 px-10 py-4 hover:border-gold hover:text-gold transition-colors"
          >
            {secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ClosingCTA;
