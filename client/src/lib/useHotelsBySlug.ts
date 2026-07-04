import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { HotelOverlay } from "./useHotelOverlay";

/**
 * Phase 1B (listings).
 *
 * Single fetch of /api/hotels returning a Map<slug, HotelOverlay>
 * the listing pages can look up by slug to overlay editable fields
 * on top of their inline card arrays. Returns an empty Map on
 * error so the existing inline arrays stay the source of truth.
 */
export function useHotelsBySlug(): Map<string, HotelOverlay> {
  const { data } = useQuery<HotelOverlay[]>({
    queryKey: ["/api/hotels"],
    queryFn: async () => {
      const res = await fetch(`/api/hotels`);
      if (!res.ok) return [];
      const json = await res.json();
      if (!Array.isArray(json)) return [];
      return json.map((h: any) => ({
        slug: h.slug,
        name: h.name ?? undefined,
        blurb: h.blurb ?? undefined,
        description: h.description ?? undefined,
        imageUrl: h.imageUrl ?? undefined,
        pricePerNight: h.pricePerNight ?? undefined,
        amenities: Array.isArray(h.amenities) ? h.amenities : undefined,
        destination: h.destination ?? undefined,
        category: h.category ?? undefined,
      })) as Array<HotelOverlay & { slug?: string }>;
    },
    staleTime: 60_000,
    retry: false,
  });

  return useMemo(() => {
    const map = new Map<string, HotelOverlay>();
    if (!data) return map;
    for (const h of data as Array<HotelOverlay & { slug?: string }>) {
      if (h.slug) map.set(h.slug, h);
    }
    return map;
  }, [data]);
}
