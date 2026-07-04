import { useQuery } from "@tanstack/react-query";

/**
 * Phase 1B data hook for blog posts.
 *
 * Same pattern as useHotelOverlay — fetches the editable thin
 * fields from /api/blog/:slug and returns them so the page can
 * merge them on top of the rich shape it already loaded from
 * client/src/lib/blog-data.ts. Falls back to the TS file
 * silently when the API has no record or errors.
 */

export interface BlogOverlay {
  title?: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  author?: string;
  readTime?: number;
  featured?: boolean;
  tags?: string[];
  destination?: string;
  publishedAt?: string;
  /** Body paragraphs — only override when the array is non-empty so
   *  we never wipe TS content with an empty seed array. */
  content?: string[];
  /** Rich HTML body (TipTap output from the admin wizard). When set,
   *  takes precedence over `content[]` on the public article page. */
  bodyHtml?: string;
  metaTitle?: string;
  metaDescription?: string;
}

function blogOverlayQueryOptions(slug: string | undefined) {
  return {
    queryKey: ["/api/blog", slug] as const,
    queryFn: async (): Promise<BlogOverlay | null> => {
      if (!slug) return null;
      const res = await fetch(`/api/blog/${slug}`);
      if (!res.ok) return null;
      const json = await res.json();
      const content = Array.isArray(json.content) ? json.content : undefined;
      return {
        title: json.title ?? undefined,
        excerpt: json.excerpt ?? undefined,
        coverImage: json.coverImage ?? undefined,
        category: json.category ?? undefined,
        author: json.author ?? undefined,
        readTime: typeof json.readTime === "number" ? json.readTime : undefined,
        featured: typeof json.featured === "boolean" ? json.featured : undefined,
        tags: Array.isArray(json.tags) ? json.tags : undefined,
        destination: json.destination ?? undefined,
        publishedAt: json.publishedAt ?? undefined,
        content: content && content.length > 0 ? content : undefined,
      };
    },
    enabled: !!slug,
    staleTime: 60_000,
    retry: false,
  };
}

export function useBlogOverlayQuery(slug: string | undefined) {
  return useQuery<BlogOverlay | null>(blogOverlayQueryOptions(slug));
}

export function useBlogOverlay(slug: string | undefined): BlogOverlay | null {
  const { data } = useQuery<BlogOverlay | null>({
    queryKey: ["/api/blog", slug],
    queryFn: async () => {
      if (!slug) return null;
      const res = await fetch(`/api/blog/${slug}`);
      if (!res.ok) return null;
      const json = await res.json();
      const content = Array.isArray(json.content) ? json.content : undefined;
      return {
        title: json.title ?? undefined,
        excerpt: json.excerpt ?? undefined,
        coverImage: json.coverImage ?? undefined,
        category: json.category ?? undefined,
        author: json.author ?? undefined,
        readTime: typeof json.readTime === "number" ? json.readTime : undefined,
        featured: typeof json.featured === "boolean" ? json.featured : undefined,
        tags: Array.isArray(json.tags) ? json.tags : undefined,
        destination: json.destination ?? undefined,
        publishedAt: json.publishedAt ?? undefined,
        content: content && content.length > 0 ? content : undefined,
        bodyHtml: json.bodyHtml ?? undefined,
        metaTitle: json.metaTitle ?? undefined,
        metaDescription: json.metaDescription ?? undefined,
      };
    },
    enabled: !!slug,
    staleTime: 60_000,
    retry: false,
  });
  return data ?? null;
}
