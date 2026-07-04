import { Link } from "wouter";
import siwaHeroImage from "@assets/salt-lake_1752975614632.jpg";
import northCoastHeroImage from "@assets/Pristine Beaches_1764585387661.jpg";
import { useSiteContent, pickContent } from "@/lib/useSiteContent";

/**
 * Two destination cards — Siwa (video) + North Coast (static).
 * Cream section. Siwa uses the looping salt-lake video; NC uses
 * a coastal-blue background with a decorative circle motif.
 */
export function Destinations() {
  const c = useSiteContent();
  const eyebrow = pickContent(c, "home.destinations.eyebrow", "Two destinations");
  const siwaTag = pickContent(c, "home.destinations.siwa.tag", "Primary destination");
  const siwaName = pickContent(c, "home.destinations.siwa.name", "Siwa");
  const siwaItalic = pickContent(c, "home.destinations.siwa.italic", "Oasis");
  const siwaBody = pickContent(
    c,
    "home.destinations.siwa.body",
    "Salt lakes that mirror the sky. Desert evenings with no schedule. An oasis that rewards patience with something rare — stillness.",
  );
  const siwaCta = pickContent(c, "home.destinations.siwa.cta", "Explore Siwa →");
  const ncTag = pickContent(c, "home.destinations.nc.tag", "North Coast");
  const ncName = pickContent(c, "home.destinations.nc.name", "The");
  const ncItalic = pickContent(c, "home.destinations.nc.italic", "Coast");
  const ncBody = pickContent(
    c,
    "home.destinations.nc.body",
    "Egypt's quieter shore. Open sea, unhurried space, and resorts that know when to leave you alone.",
  );
  const ncCta = pickContent(c, "home.destinations.nc.cta", "Explore the Coast →");
  return (
    <section className="bg-cream px-6 md:px-12 lg:px-20 pt-20 pb-32">
      <div className="max-w-6xl mx-auto">
        <p className="reveal flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase text-gold mb-8">
          <span className="block w-6 h-px bg-gold opacity-50" />
          {eyebrow}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[1.65fr_1fr] gap-[2px] mt-10">
          {/* Siwa card — video */}
          <Link
            href="/siwa-oasis"
            className="dest-card reveal relative overflow-hidden min-h-[420px] md:min-h-[520px] flex flex-col justify-end p-8 md:p-12 bg-navy group"
          >
            <img
              src={siwaHeroImage}
              alt="Siwa Oasis salt lake"
              className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-85 transition-opacity duration-500"
              loading="lazy"
            />
            {/* Scrim */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(9,24,32,0.9) 0%, rgba(9,24,32,0.05) 55%, transparent 100%)",
              }}
            />

            <div className="relative z-[2]">
              <p className="flex items-center gap-2 text-[0.56rem] tracking-[0.3em] uppercase text-gold mb-3">
                <span className="block w-5 h-px bg-gold opacity-60" />
                {siwaTag}
              </p>
              <h3
                className="font-display font-normal leading-[1.1] text-white mb-3"
                style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
              >
                {siwaName} <em className="italic text-gold">{siwaItalic}</em>
              </h3>
              <p className="text-[0.84rem] text-white/50 leading-[1.85] max-w-[36ch] mb-7">
                {siwaBody}
              </p>
              <div className="flex gap-2 flex-wrap mb-7">
                {["Accommodation", "Experiences", "Transportation"].map((c) => (
                  <span
                    key={c}
                    className="text-[0.56rem] tracking-[0.15em] uppercase text-white/40 border border-white/15 px-3 py-1"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-2 group-hover:gap-4 transition-[gap] duration-300 text-[0.62rem] tracking-[0.2em] uppercase text-gold">
                {siwaCta}
              </span>
            </div>
          </Link>

          {/* North Coast card */}
          <Link
            href="/north-coast"
            className="dest-card reveal reveal-d1 relative overflow-hidden min-h-[420px] md:min-h-[520px] flex flex-col justify-end p-8 md:p-12 bg-coastal group"
          >
            <img
              src={northCoastHeroImage}
              alt="North Coast Mediterranean beach"
              className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-85 transition-opacity duration-500"
              loading="lazy"
            />
            {/* Decorative circle */}
            <div className="absolute top-8 right-8 w-20 h-20 border border-white/15 rounded-full z-[2]">
              <div className="absolute inset-[10px] rounded-full border border-white/8" />
            </div>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(9,24,32,0.9) 0%, rgba(9,24,32,0.05) 55%, transparent 100%)",
              }}
            />
            <div className="relative z-[2]">
              <p className="flex items-center gap-2 text-[0.56rem] tracking-[0.3em] uppercase text-gold mb-3">
                <span className="block w-5 h-px bg-gold opacity-60" />
                {ncTag}
              </p>
              <h3
                className="font-display font-normal leading-[1.1] text-white mb-3"
                style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
              >
                {ncName} <em className="italic text-gold">{ncItalic}</em>
              </h3>
              <p className="text-[0.84rem] text-white/50 leading-[1.85] max-w-[36ch] mb-7">
                {ncBody}
              </p>
              <div className="flex gap-2 flex-wrap mb-7">
                {["Accommodation", "Experiences", "Transportation"].map((c) => (
                  <span
                    key={c}
                    className="text-[0.56rem] tracking-[0.15em] uppercase text-white/40 border border-white/15 px-3 py-1"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-2 group-hover:gap-4 transition-[gap] duration-300 text-[0.62rem] tracking-[0.2em] uppercase text-gold">
                {ncCta}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Destinations;
