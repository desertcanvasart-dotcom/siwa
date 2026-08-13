import { useQuery } from "@tanstack/react-query";

/**
 * The single source of truth for GET /api/experiences.
 *
 * Several surfaces need this list in different shapes (the plan flow
 * wants `name`, the tour overlay wants `title`, the journeys page wants
 * the raw record). They all used to declare their own useQuery with the
 * SAME key `["/api/experiences"]` but different transforms — so
 * whichever mounted first won the cache and the others silently read
 * fields that didn't exist. That's what made a journey's name vanish
 * from an enquiry after the visitor had passed through /plan.
 *
 * Fix: the cache holds the RAW server response under this key, and each
 * consumer derives its own shape locally (useMemo / select).
 */
export interface RawExperience {
  id?: number;
  slug?: string | null;
  title?: string;
  destination?: string | null;
  category?: string;
  duration?: string;
  pricePerPerson?: string;
  maxGuests?: number;
  summary?: string;
  description?: string;
  imageUrl?: string | null;
  isActive?: boolean;
  details?: unknown;
}

export const EXPERIENCES_QUERY_KEY = ["/api/experiences"] as const;

export function useExperiencesRaw(): { data: RawExperience[]; isLoading: boolean } {
  const { data = [], isLoading } = useQuery<RawExperience[]>({
    queryKey: EXPERIENCES_QUERY_KEY,
    queryFn: async () => {
      const res = await fetch("/api/experiences");
      if (!res.ok) return [];
      const json = await res.json();
      return Array.isArray(json) ? json : [];
    },
    staleTime: 60_000,
  });
  return { data, isLoading };
}
