import { useQuery } from "@tanstack/react-query";

/**
 * Phase 1B data hook.
 *
 * Fetches the editable fields for a hotel from /api/hotels/:slug
 * (which is backed by the server's storage layer — MemStorage now,
 * Postgres in Phase 1C). Returns only the thin fields the admin
 * dashboard surfaces directly. The detail page merges these on top
 * of the rich shape it already loads from client/src/lib/hotel-data.ts,
 * so:
 *   • If the API responds → admin edits to name / blurb / image /
 *     price / amenities show up immediately.
 *   • If the API errors or returns no record → page falls back
 *     entirely to the TS file. Nothing on the live site breaks.
 */

export interface HotelOverlay {
  name?: string;
  blurb?: string;
  description?: string;
  imageUrl?: string;
  pricePerNight?: string;
  amenities?: string[];
  destination?: string;
  category?: string;
  /** Rich detail-page content edited via the admin form. Mirrors
   *  the HotelDetail shape but with all fields optional. */
  details?: {
    tagLine?: string;
    heroTag?: string;
    heroMeta?: string[];
    eyebrow?: string;
    headline?: string;
    headlineItalic?: string;
    intro?: string[];
    facts?: Array<{ label: string; value: string }>;
    rooms?: Array<{
      name: string;
      type: string;
      desc: string;
      sqm: string;
      beds: string;
      occupancy: string;
      price: number;
    }>;
    location?: Array<{ label: string; value: string }>;
    reviews?: Array<{ name: string; origin: string; text: string }>;
    priceLabel?: string;
    /** Ordered list of gallery image URLs shown behind "View all photos". */
    gallery?: string[];
  };
}

export function useHotelOverlayQuery(slug: string | undefined) {
  return useQuery<HotelOverlay | null>({
    queryKey: ["/api/hotels", slug],
    queryFn: async () => {
      if (!slug) return null;
      const res = await fetch(`/api/hotels/${slug}`);
      if (!res.ok) return null;
      const json = await res.json();
      return {
        name: json.name ?? undefined,
        blurb: json.blurb ?? undefined,
        description: json.description ?? undefined,
        imageUrl: json.imageUrl ?? undefined,
        pricePerNight: json.pricePerNight ?? undefined,
        amenities: Array.isArray(json.amenities) ? json.amenities : undefined,
        destination: json.destination ?? undefined,
        category: json.category ?? undefined,
        details: json.details ?? undefined,
      };
    },
    enabled: !!slug,
    staleTime: 60_000,
    retry: false,
  });
}

export function useHotelOverlay(slug: string | undefined): HotelOverlay | null {
  const { data } = useQuery<HotelOverlay | null>({
    queryKey: ["/api/hotels", slug],
    queryFn: async () => {
      if (!slug) return null;
      const res = await fetch(`/api/hotels/${slug}`);
      if (!res.ok) return null;
      const json = await res.json();
      return {
        name: json.name ?? undefined,
        blurb: json.blurb ?? undefined,
        description: json.description ?? undefined,
        imageUrl: json.imageUrl ?? undefined,
        pricePerNight: json.pricePerNight ?? undefined,
        amenities: Array.isArray(json.amenities) ? json.amenities : undefined,
        destination: json.destination ?? undefined,
        category: json.category ?? undefined,
        details: json.details ?? undefined,
      };
    },
    enabled: !!slug,
    staleTime: 60_000,
    retry: false,
  });
  return data ?? null;
}
