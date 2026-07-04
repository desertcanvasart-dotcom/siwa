import { useQuery } from "@tanstack/react-query";

/**
 * Phase 3 — site-wide editable content.
 *
 * One fetch of /api/site-content returns a flat Map<dotted-key, value>
 * that public components look up to overlay their hard-coded copy.
 * If the API has no entry for a key, components fall back to whatever
 * default they ship with — same safety pattern used for hotels and
 * tours.
 */

export type SiteContentMap = Record<string, any>;

export function useSiteContent(): SiteContentMap {
  const { data } = useQuery<SiteContentMap>({
    queryKey: ["/api/site-content"],
    queryFn: async () => {
      const res = await fetch(`/api/site-content`);
      if (!res.ok) return {};
      return res.json();
    },
    staleTime: 60_000,
    retry: false,
  });
  return data ?? {};
}

/**
 * Resolve a single key with fallback. Type defaults to string for the
 * common case but any JSON shape works.
 */
export function pickContent<T = string>(
  map: SiteContentMap,
  key: string,
  fallback: T,
): T {
  const v = map[key];
  if (v === undefined || v === null) return fallback;
  return v as T;
}
