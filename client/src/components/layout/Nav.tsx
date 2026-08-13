import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useSiteContent, pickContent } from "@/lib/useSiteContent";

interface NavProps {
  /**
   * true  — page opens with a dark/navy hero directly under the nav.
   *         Nav starts transparent with white links, transitions to
   *         cream background with dark links on scroll.
   *
   * false — page has no dark hero (journal, FAQ, enquire, etc.).
   *         Nav starts immediately in the light state — cream bg,
   *         dark links, no transparency at any scroll position.
   */
  darkHero?: boolean;
}

export function Nav({ darkHero = true }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const closeRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  const c = useSiteContent();
  const brand = pickContent(c, "nav.brand", "Soléi");
  const linkSiwa = pickContent(c, "nav.link_siwa", "Siwa Oasis");
  const linkSiwaHref = pickContent(c, "nav.link_siwa_href", "/siwa-oasis");
  const linkNc = pickContent(c, "nav.link_nc", "North Coast");
  const linkNcHref = pickContent(c, "nav.link_nc_href", "/north-coast");
  const linkJournal = pickContent(c, "nav.link_journal", "Journal");
  const linkJournalHref = pickContent(c, "nav.link_journal_href", "/journal");
  const linkStory = pickContent(c, "nav.link_story", "Our Story");
  const linkStoryHref = pickContent(c, "nav.link_story_href", "/our-story");
  const cta = pickContent(c, "nav.cta", "Begin your stay");
  const ctaHref = pickContent(c, "nav.cta_href", "/enquire");

  useEffect(() => {
    if (!darkHero) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [darkHero]);

  // Lock body scroll while the mobile drawer is open, close on Escape,
  // and move focus into the drawer (returning it to the hamburger on
  // close) so keyboard and screen-reader users aren't left behind.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKeyDown);
      openRef.current?.focus();
    };
  }, [open]);

  // Close the drawer whenever the route changes — otherwise it can stay
  // mounted over the new page with body scroll still locked.
  useEffect(() => {
    setOpen(false);
  }, [location]);

  /** Marks the link for the page you're on (exact match, or a section
   *  parent like /siwa-oasis for /siwa-oasis/accommodation). */
  const isCurrent = (href: string) =>
    href === "/"
      ? location === "/"
      : location === href || location.startsWith(`${href}/`);

  const light = !darkHero || scrolled;

  const linkBase = "text-[0.65rem] tracking-[0.2em] uppercase transition-colors";
  const linkLight = !darkHero
    ? "text-ink/70 hover:text-coastal"
    : "text-ink hover:text-coastal";
  const linkTransparent = "text-white/75 hover:text-coastal";

  const desktopLinks: Array<{ label: string; href: string }> = [
    { label: linkSiwa, href: linkSiwaHref },
    { label: linkNc, href: linkNcHref },
    { label: "Journeys", href: "/journeys" },
    { label: linkJournal, href: linkJournalHref },
    { label: linkStory, href: linkStoryHref },
    { label: "Ask Soléi", href: "/chat" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[300] flex justify-between items-center
          px-5 sm:px-6 md:px-12 lg:px-20 transition-all duration-[400ms]
          ${
            light
              ? "py-3 md:py-4 bg-[rgba(253,250,245,0.96)] backdrop-blur-md border-b border-sand"
              : "py-5 md:py-7 bg-transparent"
          }`}
      >
        <Link
          href="/"
          className={`font-body font-medium tracking-[0.32em] sm:tracking-[0.4em] uppercase text-[0.78rem] sm:text-sm transition-colors
            ${light ? "text-gold" : "text-white"}`}
        >
          {brand}
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {desktopLinks.map((l) => (
            <Link
              key={l.href + l.label}
              href={l.href}
              aria-current={isCurrent(l.href) ? "page" : undefined}
              className={`${linkBase} ${light ? linkLight : linkTransparent} ${
                isCurrent(l.href) ? "text-coastal" : ""
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={ctaHref}
            className="text-[0.65rem] tracking-[0.18em] uppercase
              bg-gold text-navy px-5 py-2.5 hover:bg-gold-light transition-colors"
          >
            {cta}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          ref={openRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className={`md:hidden -mr-2 w-11 h-11 inline-flex items-center justify-center transition-colors ${
            light ? "text-navy" : "text-white"
          }`}
        >
          <Menu className="w-6 h-6" strokeWidth={1.5} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 z-[400] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-navy-deep/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        {/* Panel */}
        <aside
          className={`absolute top-0 right-0 h-[100dvh] w-[86%] max-w-sm bg-navy text-cream
            flex flex-col transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)]
            ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-white/8">
            <span className="font-body font-medium tracking-[0.32em] uppercase text-[0.78rem] text-gold">
              {brand}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="-mr-2 w-11 h-11 inline-flex items-center justify-center text-cream/70 hover:text-gold transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-1">
            {desktopLinks.map((l, i) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-4 py-4 border-b border-white/8 last:border-b-0"
              >
                <span className="font-display italic text-[0.7rem] text-gold/55 w-5">
                  0{i + 1}
                </span>
                <span className="font-display text-[1.6rem] leading-none text-cream group-hover:text-gold transition-colors">
                  {l.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="px-6 pb-8 pt-4 border-t border-white/8">
            <Link
              href={ctaHref}
              onClick={() => setOpen(false)}
              className="block w-full text-center text-[0.7rem] tracking-[0.2em] uppercase
                bg-gold text-navy py-4 hover:bg-gold-light transition-colors"
            >
              {cta}
            </Link>
            <p className="text-[0.55rem] tracking-[0.28em] uppercase text-cream/40 text-center mt-5">
              Soléi · From Sea to Sands
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

export default Nav;
