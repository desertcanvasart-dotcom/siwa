import { useMemo } from "react";
import { useExperiencesRaw } from "./useExperiencesRaw";

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
  // Shares the raw cache entry with every other /api/experiences
  // consumer, then derives this shape locally.
  const { data } = useExperiencesRaw();

  return useMemo(() => {
    const map = new Map<string, ExperienceOverlay>();
    for (const e of data) {
      if (!e.slug) continue;
      map.set(e.slug, {
        title: e.title ?? undefined,
        summary: e.summary ?? undefined,
        description: e.description ?? undefined,
        category: e.category ?? undefined,
        duration: e.duration ?? undefined,
        pricePerPerson: e.pricePerPerson ?? undefined,
        imageUrl: e.imageUrl ?? undefined,
        destination: e.destination ?? undefined,
      });
    }
    return map;
  }, [data]);
}
