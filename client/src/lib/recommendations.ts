import { getHotelDetail } from "@/lib/hotel-data";
import { resolvePrice } from "@/lib/price";
import type { HotelOverlay } from "@/lib/useHotelOverlay";
import type { RawExperience } from "@/lib/useExperiencesRaw";

/**
 * "Recommendations" block at the bottom of hotel pages.
 *
 * Configured per destination in the admin (Site content → Hotel pages —
 * recommendations) as `hotel_recs.<siwa|nc>.cards`: an ordered list of
 * slots, each a published hotel, a published experience/journey, or a
 * custom card (restaurant, spa, offer…). Hotels and experiences always
 * use their live name, photo and price, and silently drop out when
 * unpublished — so the block never shows a card for something that
 * isn't on sale.
 *
 * With no slots saved, the block fills itself: the hotel's own related
 * list, then other published hotels in the destination, then published
 * experiences there.
 */

export type RecDestination = "siwa" | "north-coast";

export interface RecSlot {
  kind: "hotel" | "experience" | "custom";
  /** Slug of the hotel / experience for those kinds. */
  ref?: string;
  // Custom card fields
  image?: string;
  title?: string;
  subtitle?: string;
  price?: string;
  href?: string;
}

export interface RecCard {
  key: string;
  href: string;
  title: string;
  subtitle: string;
  /** Full price line, e.g. "From $70 / night" — empty to hide. */
  price: string;
  image?: string;
}

export const REC_MAX = 4;

/** site_content key prefix for a destination. */
export const recPrefix = (d: RecDestination) => `hotel_recs.${d === "siwa" ? "siwa" : "nc"}`;

const hotelDestOf = (o: HotelOverlay): RecDestination =>
  (o as any).destination === "north-coast" ? "north-coast" : "siwa";

export function hotelCard(slug: string, hotelsMap: Map<string, HotelOverlay>): RecCard | null {
  const o = hotelsMap.get(slug);
  if (!o) return null; // not published → never recommend it
  const ts = getHotelDetail(slug);
  const dest = hotelDestOf(o);
  const price = resolvePrice({
    pricePerNight: o.pricePerNight,
    rooms: (o as any).details?.rooms,
    fallbackAmount: ts?.basePrice ?? 0,
    fallbackLabel: ts?.priceLabel,
  });
  return {
    key: `hotel:${slug}`,
    href: `/${dest === "siwa" ? "siwa-oasis" : "north-coast"}/accommodation/${slug}`,
    title: o.name || ts?.name || slug,
    subtitle: ts?.tagLine || o.blurb || "",
    price: price.amount > 0 ? `From ${price.display}` : "",
    image: o.imageUrl || ts?.coverImage,
  };
}

export const isJourney = (e: RawExperience) => e.category === "Curated Journey";

export function experienceCard(e: RawExperience): RecCard | null {
  if (!e.slug || !e.title) return null;
  const amount = Number(e.pricePerPerson);
  const href = isJourney(e)
    ? `/journeys/${e.slug}`
    : `/${e.destination === "north-coast" ? "north-coast" : "siwa-oasis"}/experiences/${e.slug}`;
  return {
    key: `experience:${e.slug}`,
    href,
    title: e.title,
    subtitle: [isJourney(e) ? "Curated journey" : e.category, e.duration].filter(Boolean).join(" · "),
    price: amount > 0 ? `From $${amount.toFixed(0)} per person` : "",
    image: e.imageUrl || undefined,
  };
}

export function buildRecCards({
  slots,
  currentSlug,
  destination,
  relatedSlugs,
  hotelsMap,
  experiences,
}: {
  slots: unknown;
  currentSlug: string;
  destination: RecDestination;
  relatedSlugs: string[];
  hotelsMap: Map<string, HotelOverlay>;
  experiences: RawExperience[];
}): RecCard[] {
  const expBySlug = new Map(experiences.filter((e) => e.slug).map((e) => [e.slug!, e]));
  const cards: RecCard[] = [];
  const add = (c: RecCard | null) => {
    if (c && !cards.some((x) => x.key === c.key)) cards.push(c);
  };

  // Admin-chosen cards, in order.
  if (Array.isArray(slots) && slots.length > 0) {
    for (const s of slots as RecSlot[]) {
      if (!s || typeof s !== "object") continue;
      if (s.kind === "hotel" && s.ref && s.ref !== currentSlug) add(hotelCard(s.ref, hotelsMap));
      else if (s.kind === "experience" && s.ref) {
        const e = expBySlug.get(s.ref);
        add(e ? experienceCard(e) : null);
      } else if (s.kind === "custom" && s.title?.trim()) {
        add({
          key: `custom:${cards.length}:${s.title}`,
          href: s.href?.trim() || "",
          title: s.title.trim(),
          subtitle: s.subtitle?.trim() || "",
          price: s.price?.trim() || "",
          image: s.image?.trim() || undefined,
        });
      }
    }
    return cards.slice(0, REC_MAX);
  }

  // Automatic: related hotels → other hotels here → experiences here.
  const LIMIT = 3;
  for (const slug of relatedSlugs) {
    if (cards.length >= LIMIT) break;
    if (slug !== currentSlug) add(hotelCard(slug, hotelsMap));
  }
  hotelsMap.forEach((o, slug) => {
    if (cards.length >= LIMIT || slug === currentSlug) return;
    if (hotelDestOf(o) === destination) add(hotelCard(slug, hotelsMap));
  });
  const local = experiences.filter(
    (e) => e.destination === destination || (isJourney(e) && !e.destination),
  );
  for (const e of [...local.filter((e) => !isJourney(e)), ...local.filter(isJourney)]) {
    if (cards.length >= LIMIT) break;
    add(experienceCard(e));
  }
  return cards;
}
