import { Link } from "wouter";
import saltLakeImage from "@assets/floating-in-spring_1753576589836.jpeg";
import northCoastQuietImage from "@assets/Pristine Beaches_1764585387661.jpg";
import desertEveningImage from "@assets/siwa-desert-at-night_1752963245791.jpg";

/**
 * Journal — three articles on a sand-light background.
 * Lead article (large) + two side articles (stacked or row on narrow).
 */
export function Journal() {
  return (
    <section className="bg-sand-light px-6 md:px-12 lg:px-20 py-32">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <p className="reveal flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-4">
              <span className="block w-6 h-px bg-gold opacity-50" />
              The Soléi Journal
            </p>
            <h2
              className="reveal font-display font-normal text-navy leading-[1.2]"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
            >
              Stories from <em className="italic text-coastal">the field</em>
            </h2>
          </div>
          <Link
            href="/journal"
            className="reveal text-[0.6rem] tracking-[0.2em] uppercase text-navy opacity-40 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
          >
            Read all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-[2px] mt-12">
          {/* Lead article */}
          <Link
            href="/journal/siwa-salt-lakes"
            className="reveal bg-white border border-sand hover:border-gold transition-colors overflow-hidden block group"
          >
            <div className="relative h-[240px] overflow-hidden bg-[linear-gradient(150deg,#0F2436_0%,#1a3a52_100%)]">
              <img
                src={saltLakeImage}
                alt="Siwa salt lakes"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-7">
              <p className="text-[0.56rem] tracking-[0.26em] uppercase text-gold mb-3">
                Siwa Oasis
              </p>
              <h3 className="font-display text-[1.05rem] font-normal leading-[1.35] text-navy mb-3">
                Why Siwa's salt lakes feel like the end of the world — in the
                best possible way
              </h3>
              <p className="text-[0.8rem] text-ink-soft leading-[1.8] mb-3">
                There is a moment, just before the sun touches the water, when
                everything becomes a reflection. You can't tell where the lake
                ends and the sky begins.
              </p>
              <p className="text-[0.65rem] text-ink-soft/40 flex gap-4">
                <span>8 min read</span>
                <span>Experiences</span>
              </p>
            </div>
          </Link>

          {/* Side articles */}
          <div className="flex flex-col gap-[2px]">
            <Link
              href="/journal/north-coast-quiet"
              className="reveal reveal-d1 bg-white border border-sand hover:border-gold transition-colors overflow-hidden block"
            >
              <div className="relative h-[130px] overflow-hidden bg-[linear-gradient(150deg,#1a3a52_0%,#2F6F8F_100%)]">
                <img
                  src={northCoastQuietImage}
                  alt="North Coast"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <p className="text-[0.56rem] tracking-[0.26em] uppercase text-gold mb-2">
                  North Coast
                </p>
                <h3 className="font-display text-[0.9rem] font-normal leading-[1.35] text-navy mb-2">
                  The quiet side of Egypt's North Coast that nobody talks about
                </h3>
                <p className="text-[0.65rem] text-ink-soft/40">5 min read</p>
              </div>
            </Link>
          </div>
          <div className="flex flex-col gap-[2px]">
            <Link
              href="/journal/desert-evening"
              className="reveal reveal-d2 bg-white border border-sand hover:border-gold transition-colors overflow-hidden block"
            >
              <div className="relative h-[130px] overflow-hidden bg-[linear-gradient(150deg,#2F6F8F_0%,#0F2436_100%)]">
                <img
                  src={desertEveningImage}
                  alt="Desert at night"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <p className="text-[0.56rem] tracking-[0.26em] uppercase text-gold mb-2">
                  Siwa · Experiences
                </p>
                <h3 className="font-display text-[0.9rem] font-normal leading-[1.35] text-navy mb-2">
                  What an unscheduled evening in the desert actually feels like
                </h3>
                <p className="text-[0.65rem] text-ink-soft/40">6 min read</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Journal;
