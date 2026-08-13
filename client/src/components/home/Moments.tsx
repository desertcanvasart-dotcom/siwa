import { Link } from "wouter";
import { useSiteContent, pickContent } from "@/lib/useSiteContent";

const moments = [
  {
    n: "I.",
    title: "The salt lakes at sunset",
    body: "When the light softens and the water turns the colour of the sky. You stop being a tourist.",
    href: "/siwa-oasis/experiences/salt-and-spring-escape",
  },
  {
    n: "II.",
    title: "An evening without a schedule",
    body: "Nothing planned, nothing guided. Something unexpected becomes the best part of the trip.",
    href: "/siwa-oasis/experiences/desert-night-experience",
  },
  {
    n: "III.",
    title: "The stillness of the oasis",
    body: "Waking up in Siwa with nowhere to be. The quiet that belongs only to this place.",
    href: "/siwa-oasis/experiences/siwa-essential-experience",
  },
];

/**
 * Moments — white background editorial grid of three "states of being".
 * Each is a link to an experience; hover reveals the gold CTA arrow.
 */
export function Moments() {
  const c = useSiteContent();
  const eyebrow = pickContent(c, "home.moments.eyebrow", "The Soléi difference");
  const title = pickContent(c, "home.moments.title", "States of being,");
  const titleLine2 = pickContent(c, "home.moments.title_2", "not");
  const italic = pickContent(c, "home.moments.italic", "itineraries.");
  const subhead = pickContent(
    c,
    "home.moments.subhead",
    "These aren't activities. They're what happens when you stop trying to see everything — and start letting a place find you.",
  );
  return (
    <section className="bg-white px-6 md:px-12 lg:px-20 py-32">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-end mb-16">
          <div>
            <p className="reveal flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-6">
              <span className="block w-6 h-px bg-gold opacity-50" />
              {eyebrow}
            </p>
            <h2
              className="reveal font-display font-normal text-navy leading-[1.2]"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
            >
              {title}
              <br />
              {titleLine2} <em className="italic text-coastal">{italic}</em>
            </h2>
          </div>
          <p className="reveal text-[0.88rem] text-ink-soft leading-[1.95]">
            {subhead}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
          {moments.map((m, i) => (
            <Link
              key={m.n}
              href={m.href}
              className={`reveal reveal-d${i + 1} group border border-sand p-10 md:p-11 bg-white hover:border-gold hover:bg-cream transition-[border-color,background-color] duration-500 block`}
            >
              <span className="font-display italic text-[0.82rem] text-gold/70 mb-7 block">
                {m.n}
              </span>
              <h3 className="font-display text-[1.35rem] font-normal leading-[1.3] text-navy mb-3">
                {m.title}
              </h3>
              <p className="text-[0.84rem] text-ink-soft leading-[1.9] mb-6">
                {m.body}
              </p>
              <span className="inline-flex items-center gap-2 group-hover:gap-3 text-[0.58rem] tracking-[0.2em] uppercase text-gold opacity-60 group-hover:opacity-100 transition-all duration-300">
                Experience this →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Moments;
