import { useEffect, useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { RichEditor } from "@/components/admin/RichEditor";
import { MediaField } from "@/components/admin/MediaPicker";

/**
 * /admin/blog/new and /admin/blog/:id/edit
 *
 * Full-page blog post composer:
 *   1. Basics — title, slug, category, destination, author, cover image
 *   2. Body  — TipTap WYSIWYG editor
 *   3. SEO   — meta title, meta description, tags
 *   4. Review & publish
 */

const STEPS = [
  { id: 1, label: "Basics" },
  { id: 2, label: "Body" },
  { id: 3, label: "SEO & tags" },
  { id: 4, label: "Review & save" },
];

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  coverImage: "",
  category: "Siwa",
  author: "Soléi Editorial",
  readTime: 5,
  featured: false,
  isPublished: true,
  destination: "",
  articleType: "",
  linkedExperience: "",
  tags: "",
  bodyHtml: "",
  metaTitle: "",
  metaDescription: "",
};

export default function AdminBlogWizardPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/blog/:id/edit");
  const idStr = params?.id;
  const id = idStr ? parseInt(idStr, 10) : null;
  const isEditing = id !== null && !Number.isNaN(id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) setLocation("/admin/login");
  }, [setLocation]);

  const { data: existing, isLoading } = useQuery<any>({
    queryKey: ["/api/admin/blog", id],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/blog");
      const all = await res.json();
      return Array.isArray(all) ? all.find((p: any) => p.id === id) : null;
    },
    enabled: isEditing,
    retry: false,
  });

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [hydrated, setHydrated] = useState(!isEditing);

  useEffect(() => {
    if (!isEditing || !existing || hydrated) return;
    const bodyFromHtml = existing.bodyHtml || "";
    const bodyFromParagraphs = Array.isArray(existing.content) && existing.content.length > 0
      ? existing.content.map((p: string) => `<p>${p}</p>`).join("")
      : "";
    setForm({
      title: existing.title ?? "",
      slug: existing.slug ?? "",
      excerpt: existing.excerpt ?? "",
      coverImage: existing.coverImage ?? "",
      category: existing.category ?? "Siwa",
      author: existing.author ?? "Soléi Editorial",
      readTime: existing.readTime ?? 5,
      featured: !!existing.featured,
      isPublished: existing.isPublished !== false,
      destination: existing.destination ?? "",
      articleType: existing.articleType ?? "",
      linkedExperience: existing.linkedExperience ?? "",
      tags: Array.isArray(existing.tags) ? existing.tags.join(", ") : "",
      bodyHtml: bodyFromHtml || bodyFromParagraphs,
      metaTitle: existing.metaTitle ?? "",
      metaDescription: existing.metaDescription ?? "",
    });
    setHydrated(true);
  }, [existing, isEditing, hydrated]);

  // Auto-slug on create
  useEffect(() => {
    if (isEditing || !form.title || form.slug) return;
    const slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    if (slug) setForm((f) => ({ ...f, slug }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.title]);

  const set = <K extends keyof typeof emptyForm>(
    key: K,
    value: (typeof emptyForm)[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  // Derive plain-text paragraphs from HTML for backwards compat with
  // the existing `content` JSONB array used by the public renderer.
  const paragraphsFromHtml = useMemo(() => {
    if (!form.bodyHtml) return [] as string[];
    const div = document.createElement("div");
    div.innerHTML = form.bodyHtml;
    return Array.from(div.querySelectorAll("p, h1, h2, h3, li, blockquote"))
      .map((el) => (el.textContent || "").trim())
      .filter(Boolean);
  }, [form.bodyHtml]);

  const buildPayload = () => ({
    title: form.title,
    slug: form.slug,
    excerpt: form.excerpt,
    coverImage: form.coverImage || null,
    category: form.category,
    author: form.author,
    readTime: Number(form.readTime) || 5,
    featured: form.featured,
    isPublished: form.isPublished,
    destination: form.destination || null,
    articleType: form.articleType || null,
    linkedExperience: form.linkedExperience || null,
    tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
    content: paragraphsFromHtml,
    bodyHtml: form.bodyHtml || null,
    metaTitle: form.metaTitle || null,
    metaDescription: form.metaDescription || null,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = buildPayload();
      if (!isEditing) {
        const res = await apiRequest("POST", "/api/admin/blog", payload);
        if (!res.ok) throw new Error("Failed to create post");
        return res.json();
      }
      const res = await apiRequest("PUT", `/api/admin/blog/${id}`, payload);
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      queryClient.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          typeof q.queryKey[0] === "string" &&
          (q.queryKey[0] as string).startsWith("/api/blog"),
      });
      toast({
        title: isEditing ? "Post updated" : "Post created",
        description: `${form.title || "Untitled"} saved successfully`,
      });
      setLocation("/admin/dashboard");
    },
    onError: (err: any) => {
      toast({
        title: "Save failed",
        description: err?.message ?? "Could not save",
        variant: "destructive",
      });
    },
  });

  const canContinue = (s: number) => {
    if (s === 1) return form.title.trim() && form.slug.trim() && form.excerpt.trim();
    return true;
  };

  if (isEditing && isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-[0.78rem] text-ink-soft tracking-[0.2em] uppercase">
          Loading post…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream font-body text-ink pb-32">
      {/* Top header + step rail */}
      <div className="sticky top-0 z-40 bg-navy text-cream">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setLocation("/admin/dashboard")}
            className="flex items-center gap-2 text-[0.6rem] tracking-[0.2em] uppercase text-cream/65 hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to dashboard
          </button>
          <p className="text-[0.55rem] tracking-[0.3em] uppercase text-gold">
            {isEditing ? "Editing blog post" : "New blog post"}
          </p>
        </div>
        <div className="max-w-5xl mx-auto px-6 md:px-12 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {STEPS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(s.id)}
                className={`flex items-center gap-2 px-3 py-2 text-[0.58rem] tracking-[0.2em] uppercase whitespace-nowrap border ${
                  step === s.id
                    ? "border-gold text-gold"
                    : "border-cream/15 text-cream/55 hover:text-cream"
                }`}
              >
                <span className="opacity-70">{String(s.id).padStart(2, "0")}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-10">
        {/* Step 1 — Basics */}
        {step === 1 && (
          <section className="space-y-6">
            <SectionHeader
              eyebrow="Step 01"
              title="Basics"
              description="Title, slug, cover, and the editorial classification."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Title">
                <Input
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="Why Siwa Oasis Should Be Your Next Escape"
                />
              </Field>
              <Field label="Slug">
                <Input
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  placeholder="why-siwa-oasis-should-be-your-next-escape"
                />
              </Field>
            </div>

            <Field label="Excerpt — shown on the index card and below the title">
              <Textarea
                rows={3}
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                placeholder="A short paragraph teasing the article."
              />
            </Field>

            <Field label="Cover image">
              <MediaField
                value={form.coverImage}
                onChange={(url) => set("coverImage", url)}
                accept="image"
                placeholder="Pick from library, or paste a URL"
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Field label="Category">
                <Select value={form.category} onValueChange={(v) => set("category", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Siwa">Siwa</SelectItem>
                    <SelectItem value="North Coast">North Coast</SelectItem>
                    <SelectItem value="Wellness">Wellness</SelectItem>
                    <SelectItem value="Culture">Culture</SelectItem>
                    <SelectItem value="Travel Tips">Travel Tips</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Destination">
                <Select
                  value={form.destination || "none"}
                  onValueChange={(v) => set("destination", v === "none" ? "" : v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— None —</SelectItem>
                    <SelectItem value="siwa">Siwa</SelectItem>
                    <SelectItem value="north-coast">North Coast</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Article type">
                <Select
                  value={form.articleType || "none"}
                  onValueChange={(v) => set("articleType", v === "none" ? "" : v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— None —</SelectItem>
                    <SelectItem value="guide">Guide</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Field label="Author">
                <Input
                  value={form.author}
                  onChange={(e) => set("author", e.target.value)}
                />
              </Field>
              <Field label="Read time (minutes)">
                <Input
                  type="number"
                  min={1}
                  value={form.readTime}
                  onChange={(e) => set("readTime", Number(e.target.value))}
                />
              </Field>
              <Field label="Linked experience slug">
                <Input
                  value={form.linkedExperience}
                  onChange={(e) => set("linkedExperience", e.target.value)}
                  placeholder="optional"
                />
              </Field>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-[0.78rem]">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                />
                Featured (full-width hero on /journal)
              </label>
              <label className="flex items-center gap-2 text-[0.78rem]">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => set("isPublished", e.target.checked)}
                />
                Published (visible on live site)
              </label>
            </div>
          </section>
        )}

        {/* Step 2 — Body */}
        {step === 2 && (
          <section className="space-y-6">
            <SectionHeader
              eyebrow="Step 02"
              title="Body"
              description="What you see is what you get. Use headings, lists, quotes, links, and images — the live article will render exactly this content."
            />
            <RichEditor
              value={form.bodyHtml}
              onChange={(html) => set("bodyHtml", html)}
              placeholder="Start writing the article…"
            />
          </section>
        )}

        {/* Step 3 — SEO */}
        {step === 3 && (
          <section className="space-y-6">
            <SectionHeader
              eyebrow="Step 03"
              title="SEO & tags"
              description="Search-engine and social-share metadata. When empty, the title and excerpt are used."
            />
            <Field label={`Meta title — ${form.metaTitle.length}/60`}>
              <Input
                value={form.metaTitle}
                onChange={(e) => set("metaTitle", e.target.value)}
                placeholder={form.title || "Defaults to the post title"}
              />
            </Field>
            <Field label={`Meta description — ${form.metaDescription.length}/160`}>
              <Textarea
                rows={3}
                value={form.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
                placeholder={form.excerpt || "Defaults to the post excerpt"}
              />
            </Field>
            <Field label="Tags (comma-separated)">
              <Input
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="oasis, desert, slow-travel"
              />
            </Field>

            {/* Search preview */}
            <div className="border border-sand bg-white p-5">
              <p className="text-[0.55rem] tracking-[0.2em] uppercase text-ink-soft/60 mb-3">
                Search result preview
              </p>
              <p className="text-[1.05rem] text-[#1a0dab] leading-tight truncate">
                {form.metaTitle || form.title || "Untitled post"}
              </p>
              <p className="text-[0.78rem] text-[#006621] mt-0.5">
                solei.travel/journal/{form.slug || "your-slug"}
              </p>
              <p className="text-[0.82rem] text-ink-soft mt-1 line-clamp-2">
                {form.metaDescription || form.excerpt || "—"}
              </p>
            </div>
          </section>
        )}

        {/* Step 4 — Review */}
        {step === 4 && (
          <section className="space-y-6">
            <SectionHeader
              eyebrow="Step 04"
              title="Review & save"
              description="Final pass before publishing."
            />
            <div className="border border-sand bg-white">
              {form.coverImage && (
                <img
                  src={form.coverImage}
                  alt={form.title}
                  className="w-full max-h-72 object-cover"
                />
              )}
              <div className="p-6">
                <p className="text-[0.55rem] tracking-[0.22em] uppercase text-gold mb-2">
                  {form.category} · {form.readTime} min read
                </p>
                <h1 className="font-display text-[1.6rem] text-navy mb-2 leading-tight">
                  {form.title || "Untitled post"}
                </h1>
                <p className="text-[0.88rem] text-ink-soft leading-[1.85] mb-4">
                  {form.excerpt || "—"}
                </p>
                {form.bodyHtml ? (
                  <div
                    className="prose prose-sm md:prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: form.bodyHtml }}
                  />
                ) : (
                  <p className="text-[0.78rem] text-ink-soft/65 italic">
                    No body content yet — go to step 2 to write the article.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Sticky footer — Back / Continue / Save */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-sand z-40">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="rounded-none border-sand text-[0.62rem] tracking-[0.2em] uppercase"
          >
            ← Back
          </Button>
          <p className="text-[0.6rem] tracking-[0.2em] uppercase text-ink-soft/65 hidden md:block">
            Step {step} of {STEPS.length}
          </p>
          {step < STEPS.length ? (
            <Button
              type="button"
              onClick={() => setStep(Math.min(STEPS.length, step + 1))}
              disabled={!canContinue(step)}
              className="rounded-none bg-navy hover:bg-navy-deep text-cream text-[0.62rem] tracking-[0.2em] uppercase px-6"
            >
              Continue →
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !form.title || !form.slug}
              className="rounded-none bg-gold hover:bg-gold-light text-navy text-[0.62rem] tracking-[0.2em] uppercase px-6"
            >
              <Save className="w-3.5 h-3.5 mr-2" />
              {isEditing ? "Save changes" : "Publish post"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="pb-3 border-b border-sand">
      <p className="text-[0.55rem] tracking-[0.3em] uppercase text-gold mb-1.5">
        {eyebrow}
      </p>
      <h2 className="font-display text-[1.6rem] text-navy">{title}</h2>
      {description && (
        <p className="text-[0.82rem] text-ink-soft mt-2 max-w-[68ch]">{description}</p>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-[0.62rem] tracking-[0.2em] uppercase text-ink-soft mb-1.5 block">
        {label}
      </Label>
      {children}
    </div>
  );
}
