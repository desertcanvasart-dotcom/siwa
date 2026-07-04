import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { BlogOverlay } from "./useBlogOverlay";

/**
 * Phase 1B (listings). Single fetch of /api/blog returning a
 * Map<slug, BlogOverlay> so the Journal index can overlay
 * editable fields on top of the inline blogPosts array.
 */
export function useBlogPostsBySlug(): Map<string, BlogOverlay> {
  const { data } = useQuery<Array<BlogOverlay & { slug?: string }>>({
    queryKey: ["/api/blog"],
    queryFn: async () => {
      const res = await fetch(`/api/blog`);
      if (!res.ok) return [];
      const json = await res.json();
      if (!Array.isArray(json)) return [];
      return json.map((p: any) => ({
        slug: p.slug,
        title: p.title ?? undefined,
        excerpt: p.excerpt ?? undefined,
        coverImage: p.coverImage ?? undefined,
        category: p.category ?? undefined,
        author: p.author ?? undefined,
        readTime: typeof p.readTime === "number" ? p.readTime : undefined,
        featured: typeof p.featured === "boolean" ? p.featured : undefined,
        tags: Array.isArray(p.tags) ? p.tags : undefined,
        destination: p.destination ?? undefined,
        publishedAt: p.publishedAt ?? undefined,
        content: Array.isArray(p.content) && p.content.length > 0 ? p.content : undefined,
      }));
    },
    staleTime: 60_000,
    retry: false,
  });

  return useMemo(() => {
    const map = new Map<string, BlogOverlay>();
    if (!data) return map;
    for (const p of data) {
      if (p.slug) map.set(p.slug, p);
    }
    return map;
  }, [data]);
}
