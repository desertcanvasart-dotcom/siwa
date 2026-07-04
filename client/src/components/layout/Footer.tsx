import { Link } from "wouter";
import { useSiteContent, pickContent } from "@/lib/useSiteContent";

const siwaLinks = [
  { label: "Destination", href: "/siwa-oasis" },
  { label: "Accommodation", href: "/siwa-oasis/accommodation" },
  { label: "Experiences", href: "/siwa-oasis/experiences" },
  { label: "Transportation", href: "/siwa-oasis/transportation" },
  { label: "Travel tips", href: "/siwa-travel-tips" },
  { label: "FAQ", href: "/siwa-faq" },
];

const ncLinks = [
  { label: "Destination", href: "/north-coast" },
  { label: "Accommodation", href: "/north-coast/accommodation" },
  { label: "Experiences", href: "/north-coast/experiences" },
  { label: "Transportation", href: "/north-coast/transportation" },
  { label: "Travel tips", href: "/north-coast-travel-tips" },
  { label: "FAQ", href: "/north-coast-faq" },
];

const soleiLinks = [
  { label: "Our Story", href: "/our-story" },
  { label: "Journal", href: "/journal" },
  { label: "Begin your stay", href: "/enquire" },
];

const columns = [
  { title: "Siwa Oasis", links: siwaLinks },
  { title: "North Coast", links: ncLinks },
  { title: "Soléi", links: soleiLinks },
];

export function Footer() {
  const c = useSiteContent();
  const brand = pickContent(c, "footer.brand", "Soléi");
  const tagline = pickContent(c, "footer.tagline", "From Sea to Sands");
  const desc = pickContent(
    c,
    "footer.description",
    "Curated accommodation, experiences, and private transportation across Siwa Oasis and Egypt's North Coast.",
  );
  const col1Title = pickContent(c, "footer.col1.title", "Siwa Oasis");
  const col2Title = pickContent(c, "footer.col2.title", "North Coast");
  const col3Title = pickContent(c, "footer.col3.title", "Soléi");
  const copyright = pickContent(c, "footer.copyright", "© 2025 Soléi · Siwa Oasis, Egypt");
  const termsLabel = pickContent(c, "footer.terms_label", "Terms");
  const privacyLabel = pickContent(c, "footer.privacy_label", "Privacy");
  const overlayLinks = (group: string, defaults: { label: string; href: string }[]) =>
    defaults.map((l, i) => ({
      label: pickContent(c, `footer.${group}.${i}.label`, l.label),
      href: pickContent(c, `footer.${group}.${i}.href`, l.href),
    }));
  const dynamicColumns = [
    { title: col1Title, links: overlayLinks("siwa", siwaLinks) },
    { title: col2Title, links: overlayLinks("nc", ncLinks) },
    { title: col3Title, links: overlayLinks("solei", soleiLinks) },
  ];
  const termsHref = pickContent(c, "footer.terms_href", "/terms-of-service");
  const privacyHref = pickContent(c, "footer.privacy_href", "/privacy");
  return (
    <footer className="bg-navy-deep pt-16 pb-10 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-16 pb-12 border-b border-white/5">

          {/* Brand mark */}
          <div>
            <p className="font-body font-medium tracking-[0.4em] uppercase text-gold text-sm mb-3">
              {brand}
            </p>
            {/* Tagline — Tier 3 secondary */}
            <p className="font-display italic text-white/40 text-base mb-5">
              {tagline}
            </p>
            {/* Description — Tier 3 body */}
            <p className="text-xs text-white/45 leading-relaxed max-w-[28ch]">
              {desc}
            </p>
          </div>

          {/* Link columns */}
          {dynamicColumns.map((col) => (
            <div key={col.title}>
              {/* Tier 1 — section heading */}
              <p className="text-[0.57rem] tracking-[0.28em] uppercase text-white/75 mb-5">
                {col.title}
              </p>
              {/* Tier 2 — navigation links */}
              <ul className="space-y-2.5">
                {col.links.map((l, i) => (
                  <li key={`${l.href}-${i}`}>
                    <Link
                      href={l.href}
                      className="relative inline-block text-[0.78rem] text-white/60 hover:text-white/90 transition-colors after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:w-0 after:h-px after:bg-gold after:transition-[width] after:duration-300 after:ease-[ease] hover:after:w-full"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row — dimmest tier */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8">
          <p className="text-[0.65rem] text-white/35">
            {copyright}
          </p>
          <div className="flex gap-8">
            <Link
              href={termsHref}
              className="text-[0.65rem] text-white/35 hover:text-white/90 transition-colors"
            >
              {termsLabel}
            </Link>
            <Link
              href={privacyHref}
              className="text-[0.65rem] text-white/35 hover:text-white/90 transition-colors"
            >
              {privacyLabel}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
