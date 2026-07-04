/**
 * Slug → destination mapping for hotels and experiences.
 *
 * Used by App.tsx to:
 *   1. Emit the new canonical nested routes
 *      (e.g. /siwa-oasis/accommodation/adrere-amellal)
 *   2. Emit 301 redirects from legacy flat / `/hotel/:slug` paths
 *
 * Keep component imports in App.tsx (for code-splitting); this file
 * stays component-agnostic and only holds slug metadata.
 */

export type Destination = "siwa-oasis" | "north-coast";

export interface HotelSlug {
  slug: string;
  /** Optional alternate slug that should also redirect to this canonical. */
  aliases?: string[];
  dest: Destination;
}

export interface ExperienceSlug {
  slug: string;
  aliases?: string[];
  /** All current experiences live under Siwa. Leave extensible. */
  dest: Destination;
}

export const HOTELS: HotelSlug[] = [
  // ---------- Siwa ----------
  { slug: "adrere-amellal", dest: "siwa-oasis" },
  { slug: "taziry-ecolodge", dest: "siwa-oasis" },
  { slug: "siwa-shali-resort", dest: "siwa-oasis" },
  { slug: "solei-old-town", dest: "siwa-oasis", aliases: ["solei-old-town-heritage"] },
  { slug: "solei-royal", dest: "siwa-oasis" },
  { slug: "solei-desert-retreat", dest: "siwa-oasis" },
  { slug: "solei-salt-caves", dest: "siwa-oasis" },
  { slug: "talist-siwa", dest: "siwa-oasis" },
  { slug: "azad-siwa-hotel", dest: "siwa-oasis" },
  { slug: "ghaliet-ecolodge-spa", dest: "siwa-oasis" },

  // ---------- North Coast ----------
  { slug: "the-g-hotel-seashell", dest: "north-coast" },
  { slug: "vida-marina-resort-marassi", dest: "north-coast" },
  { slug: "al-alamein-hotel", dest: "north-coast" },
  { slug: "rixos-premium-alamein", dest: "north-coast" },
  { slug: "address-beach-resort-marassi", dest: "north-coast" },
  { slug: "casa-cook-north-coast", dest: "north-coast" },
  { slug: "jaz-almaza-beach-resort", dest: "north-coast" },
  { slug: "address-marassi-golf-resort", dest: "north-coast" },
];

export const EXPERIENCES: ExperienceSlug[] = [
  { slug: "salt-lake-float-therapy", dest: "siwa-oasis" },
  { slug: "sunset-sand-surfing", dest: "siwa-oasis" },
  { slug: "cleopatra-spring-soak", dest: "siwa-oasis" },
  { slug: "desert-breathwork-meditation", dest: "siwa-oasis" },
  { slug: "sleeping-under-stars", dest: "siwa-oasis" },
  { slug: "sunset-horseback-ride", dest: "siwa-oasis" },
  { slug: "desert-stargazing-experience", dest: "siwa-oasis" },
  { slug: "oracle-temple-pilgrimage", dest: "siwa-oasis" },
  { slug: "traditional-sand-bath-healing", dest: "siwa-oasis" },
  { slug: "premium-siwa-full-day", dest: "siwa-oasis" },
];

/** Look up the canonical destination for any slug (incl. aliases). */
export function destForHotelSlug(slug: string): Destination | null {
  const h = HOTELS.find(
    (h) => h.slug === slug || h.aliases?.includes(slug) === true,
  );
  return h?.dest ?? null;
}

/** Resolve an alias to its canonical slug; pass through if already canonical. */
export function canonicalHotelSlug(slug: string): string {
  const h = HOTELS.find(
    (h) => h.slug === slug || h.aliases?.includes(slug) === true,
  );
  return h?.slug ?? slug;
}

export function destForExperienceSlug(slug: string): Destination | null {
  const e = EXPERIENCES.find(
    (e) => e.slug === slug || e.aliases?.includes(slug) === true,
  );
  return e?.dest ?? null;
}

export function canonicalExperienceSlug(slug: string): string {
  const e = EXPERIENCES.find(
    (e) => e.slug === slug || e.aliases?.includes(slug) === true,
  );
  return e?.slug ?? slug;
}
