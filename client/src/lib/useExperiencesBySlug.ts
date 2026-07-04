import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

/**
 * Phase 2 data hook. Fetches /api/experiences and returns a map
 * keyed by slug so the public tour pages can overlay editable
 * thin fields (title, summary, price, image, category, duration)
 * on top of their inline card arrays. Falls back to an empty map
 * on error — the inline arrays remain the source of truth.
 */

export interface ExperienceOverlay {
  title?: string;
  summary?: string;
  description?: string;
  category?: string;
  duration?: string;
  pricePerPerson?: string;
  imageUrl?: string;
  destination?: string;
}

export function useExperiencesBySlug(): Map<string, ExperienceOverlay> {
  const { data } = useQuery<Array<ExperienceOverlay & { slug?: string }>>({
    queryKey: ["/api/experiences"],
    queryFn: async () => {
      const res = await fetch(`/api/experiences`);
      if (!res.ok) return [];
      const json = await res.json();
      if (!Array.isArray(json)) return [];
      return json.map((e: any) => ({
        slug: e.slug ?? undefined,
        title: e.title ?? undefined,
        summary: e.summary ?? undefined,
        description: e.description ?? undefined,
        category: e.category ?? undefined,
        duration: e.duration ?? undefined,
        pricePerPerson: e.pricePerPerson ?? undefined,
        imageUrl: e.imageUrl ?? undefined,
        destination: e.destination ?? undefined,
      }));
    },
    staleTime: 60_000,
    retry: false,
  });

  return useMemo(() => {
    const map = new Map<string, ExperienceOverlay>();
    if (!data) return map;
    for (const e of data) {
      if (e.slug) map.set(e.slug, e);
    }
    return map;
  }, [data]);
}
