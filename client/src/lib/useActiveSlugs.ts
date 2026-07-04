import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

/**
 * Returns the set of slugs the public API still publishes for an
 * endpoint (/api/hotels or /api/experiences). Drafted records are
 * filtered out server-side, so any inline/hardcoded list can be
 * intersected with this set to hide drafts:
 *
 *   const liveHotels = useActiveSlugs("/api/hotels");
 *   hotels.filter((h) => liveHotels.has(h.slug))
 *
 * While the query is loading the set is empty — callers should treat
 * "empty set" as "don't hide anything yet" if they want to avoid a
 * flash of an empty grid, OR "hide everything" to fail safe. Most
 * listing surfaces prefer fail-safe (hide until confirmed active).
 */
export function useActiveSlugs(endpoint: "/api/hotels" | "/api/experiences"): {
  slugs: Set<string>;
  loaded: boolean;
} {
  const { data, isSuccess } = useQuery<string[]>({
    queryKey: [endpoint, "slugs"],
    queryFn: async () => {
      const res = await fetch(endpoint);
      if (!res.ok) return [];
      const json = await res.json();
      if (!Array.isArray(json)) return [];
      return json.map((r: any) => r.slug).filter(Boolean);
    },
    staleTime: 60_000,
  });

  return useMemo(
    () => ({ slugs: new Set(data ?? []), loaded: isSuccess }),
    [data, isSuccess],
  );
}
