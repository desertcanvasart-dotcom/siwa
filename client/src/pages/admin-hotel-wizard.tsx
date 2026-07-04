import { useEffect, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MediaField, MediaGalleryField } from "@/components/admin/MediaPicker";

/**
 * /admin/hotels/new  and  /admin/hotels/:id/edit
 *
 * Multi-step hotel wizard. Replaces the cramped edit dialog with a
 * full page that walks the editor through 5 focused steps:
 *   1. Basics
 *   2. Detail page content
 *   3. Rooms (with per-room image)
 *   4. Facts · Location · Reviews
 *   5. Review & save
 */

const STEPS = [
  { id: 1, label: "Basics" },
  { id: 2, label: "Detail content" },
  { id: 3, label: "Rooms" },
  { id: 4, label: "Facts & extras" },
  { id: 5, label: "Review & save" },
];

type Fact = { label: string; value: string };
type Room = {
  name: string;
  type: string;
  desc: string;
  sqm: string;
  beds: string;
  occupancy: string;
  price: number;
  image?: string;
};
type Review = { name: string; origin: string; text: string };

const emptyForm = {
  name: "",
  slug: "",
  destination: "siwa",
  category: "",
  blurb: "",
  description: "",
  imageUrl: "",
  gallery: [] as string[],
  pricePerNight: "",
  amenities: "",
  eco: false,
  luxury: false,
  isActive: true,
  // Detail
  tagLine: "",
  heroTag: "",
  heroMeta: "",
  eyebrow: "",
  headline: "",
  headlineItalic: "",
  intro: "",
  priceLabel: "",
  facts: [] as Fact[],
  rooms: [] as Room[],
  location: [] as Fact[],
  reviews: [] as Review[],
};

export default function AdminHotelWizardPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/hotels/:id/edit");
  const idStr = params?.id;
  const id = idStr ? parseInt(idStr, 10) : null;
  const isEditing = id !== null && !Number.isNaN(id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Auth gate
  useEffect(() => {
    if (!localStorage.getItem("adminToken")) setLocation("/admin/login");
  }, [setLocation]);

  // Load existing record when editing
  const { data: existing, isLoading } = useQuery<any>({
    queryKey: ["/api/admin/hotels", id],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/admin/hotels`);
      const all = await res.json();
      return Array.isArray(all) ? all.find((h: any) => h.id === id) : null;
    },
    enabled: isEditing,
    retry: false,
  });

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [hydrated, setHydrated] = useState(!isEditing);

  // Hydrate the form from the DB record once it loads
  useEffect(() => {
    if (!isEditing || !existing || hydrated) return;
    const d = existing.details ?? {};
    setForm({
      name: existing.name ?? "",
      slug: existing.slug ?? "",
      destination: existing.destination ?? "siwa",
      category: existing.category ?? "",
      blurb: existing.blurb ?? "",
      description: existing.description ?? "",
      imageUrl: existing.imageUrl ?? "",
      gallery: Array.isArray(d.gallery) ? d.gallery : [],
      pricePerNight: existing.pricePerNight ?? "",
      amenities: Array.isArray(existing.amenities) ? existing.amenities.join(", ") : "",
      eco: !!existing.eco,
      luxury: !!existing.luxury,
      isActive: existing.isActive !== false,
      tagLine: d.tagLine ?? "",
      heroTag: d.heroTag ?? "",
      heroMeta: Array.isArray(d.heroMeta) ? d.heroMeta.join("\n") : "",
      eyebrow: d.eyebrow ?? "",
      headline: d.headline ?? "",
      headlineItalic: d.headlineItalic ?? "",
      intro: Array.isArray(d.intro) ? d.intro.join("\n\n") : "",
      priceLabel: d.priceLabel ?? "",
      facts: Array.isArray(d.facts) ? d.facts : [],
      rooms: Array.isArray(d.rooms) ? d.rooms : [],
      location: Array.isArray(d.location) ? d.location : [],
      reviews: Array.isArray(d.reviews) ? d.reviews : [],
    });
    setHydrated(true);
  }, [existing, isEditing, hydrated]);

  // Auto-slug from name on create
  useEffect(() => {
    if (isEditing || !form.name || form.slug) return;
    const slug = form.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    if (slug) setForm((f) => ({ ...f, slug }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.name]);

  const buildPayload = () => {
    const amenities = form.amenities
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);
    const details = {
      tagLine: form.tagLine || undefined,
      heroTag: form.heroTag || undefined,
      heroMeta: form.heroMeta.split("\n").map((s) => s.trim()).filter(Boolean),
      eyebrow: form.eyebrow || undefined,
      headline: form.headline || undefined,
      headlineItalic: form.headlineItalic || undefined,
      intro: form.intro.split(/\n\n+/).map((p) => p.trim()).filter(Boolean),
      priceLabel: form.priceLabel || undefined,
      facts: form.facts.filter((f) => f.label.trim() || f.value.trim()),
      rooms: form.rooms.filter((r) => r.name.trim()),
      location: form.location.filter((l) => l.label.trim() || l.value.trim()),
      reviews: form.reviews.filter((r) => r.text.trim()),
      gallery: form.gallery.filter(Boolean),
    };
    return {
      name: form.name,
      slug: form.slug,
      destination: form.destination,
      category: form.category || "Hotel",
      blurb: form.blurb,
      description: form.description || null,
      imageUrl: form.imageUrl || null,
      pricePerNight: form.pricePerNight || null,
      amenities,
      eco: form.eco,
      luxury: form.luxury,
      isActive: form.isActive,
      details,
    };
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = buildPayload();
      const url = isEditing ? `/api/admin/hotels/${id}` : `/api/admin/hotels`;
      const method = isEditing ? "PUT" : "POST";
      const res = await apiRequest(method, url, payload);
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hotels"] });
      queryClient.invalidateQueries({ queryKey: ["/api/hotels"] });
      toast({
        title: isEditing ? "Hotel updated" : "Hotel created",
        description: `${form.name} saved successfully`,
      });
      setLocation("/admin/dashboard");
    },
    onError: (err: any) => {
      toast({ title: "Save failed", description: err?.message ?? "Could not save", variant: "destructive" });
    },
  });

  // ── helpers ──
  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));
  const updateFact = (key: "facts" | "location", i: number, patch: Partial<Fact>) =>
    set({ [key]: form[key].map((f, idx) => (idx === i ? { ...f, ...patch } : f)) } as any);
  const addFact = (key: "facts" | "location") =>
    set({ [key]: [...form[key], { label: "", value: "" }] } as any);
  const removeFact = (key: "facts" | "location", i: number) =>
    set({ [key]: form[key].filter((_, idx) => idx !== i) } as any);

  const updateRoom = (i: number, patch: Partial<Room>) =>
    set({ rooms: form.rooms.map((r, idx) => (idx === i ? { ...r, ...patch } : r)) });
  const addRoom = () =>
    set({ rooms: [...form.rooms, { name: "", type: "", desc: "", sqm: "", beds: "", occupancy: "", price: 0, image: "" }] });
  const removeRoom = (i: number) =>
    set({ rooms: form.rooms.filter((_, idx) => idx !== i) });

  const updateReview = (i: number, patch: Partial<Review>) =>
    set({ reviews: form.reviews.map((r, idx) => (idx === i ? { ...r, ...patch } : r)) });
  const addReview = () =>
    set({ reviews: [...form.reviews, { name: "", origin: "", text: "" }] });
  const removeReview = (i: number) =>
    set({ reviews: form.reviews.filter((_, idx) => idx !== i) });

  const canAdvance = () => {
    if (step === 1) return !!form.name.trim() && !!form.slug.trim() && !!form.blurb.trim();
    return true;
  };

  if (isEditing && isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center font-body text-ink-soft/55">
        <p className="text-[0.6rem] tracking-[0.3em] uppercase">Loading hotel…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      {/* Top bar */}
      <header className="bg-white border-b border-sand sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 text-[0.6rem] tracking-[0.18em] uppercase text-ink-soft/65 hover:text-navy transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <span className="h-5 w-px bg-sand" />
            <div className="min-w-0">
              <p className="text-[0.52rem] tracking-[0.3em] uppercase text-ink-soft/55">
                {isEditing ? "Edit hotel" : "Add hotel"}
              </p>
              <h1 className="font-display text-[1.05rem] text-navy leading-tight truncate">
                {form.name || (isEditing ? "Untitled hotel" : "New hotel")}
              </h1>
            </div>
          </div>
        </div>
        {/* Step rail */}
        <div className="max-w-5xl mx-auto px-6 md:px-10 pb-4 flex items-center gap-2 overflow-x-auto">
          {STEPS.map((s) => {
            const active = s.id === step;
            const done = s.id < step;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(s.id)}
                className={`flex items-center gap-2 text-[0.58rem] tracking-[0.18em] uppercase px-3 py-1.5 border transition-colors whitespace-nowrap ${
                  active
                    ? "border-gold text-navy bg-gold/10"
                    : done
                    ? "border-sand text-navy/70 hover:border-gold/60"
                    : "border-sand text-ink-soft/45 hover:text-navy"
                }`}
              >
                <span className="font-display italic text-gold/80">{s.id}.</span>
                {s.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Body */}
      <main className="max-w-5xl mx-auto px-6 md:px-10 py-10 pb-32">
        {step === 1 && (
          <StepCard title="Basics" subtitle="Name, slug, image, the short blurb that shows on the card.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Hotel name *" required>
                <Input value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="Adrère Amellal" />
              </Field>
              <Field label="URL slug *" required>
                <Input
                  value={form.slug}
                  onChange={(e) => set({ slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  placeholder="adrere-amellal"
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Destination *">
                <Select value={form.destination} onValueChange={(v) => set({ destination: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="siwa">Siwa Oasis</SelectItem>
                    <SelectItem value="north-coast">North Coast</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Category">
                <Input
                  value={form.category}
                  onChange={(e) => set({ category: e.target.value })}
                  placeholder="Eco Lodge"
                />
              </Field>
            </div>
            <Field label="Short blurb *" hint="Shown on listing cards and the home page grid.">
              <Textarea
                rows={3}
                value={form.blurb}
                onChange={(e) => set({ blurb: e.target.value })}
              />
            </Field>
            <Field label="Full description" hint="Optional longer description shown on the detail page intro fallback.">
              <Textarea
                rows={4}
                value={form.description}
                onChange={(e) => set({ description: e.target.value })}
              />
            </Field>
            <Field label="Card image" hint="Shown on listing cards and as the detail-page hero background. Pick from the library or upload a new one.">
              <MediaField
                value={form.imageUrl}
                onChange={(url) => set({ imageUrl: url })}
                accept="image"
                placeholder="Pick from library, or paste a URL"
              />
            </Field>
            <Field
              label="Photo gallery"
              hint='These appear behind the "View all photos" button on the hotel page. The card image is always included first.'
            >
              <MediaGalleryField
                value={form.gallery}
                onChange={(urls) => set({ gallery: urls })}
              />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Price per night (display)">
                <Input
                  value={form.pricePerNight}
                  onChange={(e) => set({ pricePerNight: e.target.value })}
                  placeholder="€320 / night"
                />
              </Field>
              <Field label="Amenities (comma-separated)">
                <Input
                  value={form.amenities}
                  onChange={(e) => set({ amenities: e.target.value })}
                  placeholder="Pool, Spa, Restaurant, Wifi"
                />
              </Field>
            </div>
            <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-sand-light">
              <Toggle label="Eco" checked={form.eco} onChange={(v) => set({ eco: v })} />
              <Toggle label="Luxury" checked={form.luxury} onChange={(v) => set({ luxury: v })} />
              <Toggle label="Active (shown on site)" checked={form.isActive} onChange={(v) => set({ isActive: v })} />
            </div>
          </StepCard>
        )}

        {step === 2 && (
          <StepCard
            title="Detail page content"
            subtitle="The hero, tag line, intro paragraphs, and headline on the hotel's dedicated page."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Tag line">
                <Input
                  value={form.tagLine}
                  onChange={(e) => set({ tagLine: e.target.value })}
                  placeholder="Eco Lodge · No electricity · Salt lake front"
                />
              </Field>
              <Field label="Hero tag chip">
                <Input value={form.heroTag} onChange={(e) => set({ heroTag: e.target.value })} />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Eyebrow">
                <Input
                  value={form.eyebrow}
                  onChange={(e) => set({ eyebrow: e.target.value })}
                  placeholder="The property"
                />
              </Field>
              <Field label="Headline">
                <Input value={form.headline} onChange={(e) => set({ headline: e.target.value })} />
              </Field>
              <Field label="Headline italic">
                <Input value={form.headlineItalic} onChange={(e) => set({ headlineItalic: e.target.value })} />
              </Field>
            </div>
            <Field
              label="Intro paragraphs"
              hint="Separate paragraphs with a blank line."
            >
              <Textarea
                rows={7}
                className="font-mono text-sm"
                value={form.intro}
                onChange={(e) => set({ intro: e.target.value })}
              />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Hero meta (one chip per line)">
                <Textarea
                  rows={4}
                  className="font-mono text-xs"
                  value={form.heroMeta}
                  onChange={(e) => set({ heroMeta: e.target.value })}
                  placeholder={"Siwa Oasis\n36 rooms\nFrom €320 / night"}
                />
              </Field>
              <Field label="Price label">
                <Input
                  value={form.priceLabel}
                  onChange={(e) => set({ priceLabel: e.target.value })}
                  placeholder="/ night · full board"
                />
              </Field>
            </div>
          </StepCard>
        )}

        {step === 3 && (
          <StepCard
            title="Rooms"
            subtitle="Each room can have its own photograph. Image URL goes here; upload images first in the Image library."
          >
            {form.rooms.length === 0 && (
              <p className="text-sm text-ink-soft/65 italic">No rooms yet. Add the first one below.</p>
            )}
            {form.rooms.map((room, i) => (
              <div key={i} className="border border-sand bg-white p-5 space-y-3">
                <div className="flex justify-between items-start gap-3">
                  <h3 className="font-display text-[1rem] text-navy">
                    Room {i + 1}
                    {room.name && <span className="text-ink-soft/55"> · {room.name}</span>}
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeRoom(i)}
                    className="text-rose-600 border-sand"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4">
                  {/* Room image */}
                  <div>
                    <Label className="text-xs">Room photo</Label>
                    <MediaField
                      value={room.image ?? ""}
                      onChange={(url) => updateRoom(i, { image: url })}
                      accept="image"
                      placeholder="Pick from library, or paste a URL"
                    />
                  </div>
                  {/* Room fields */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Name *</Label>
                        <Input value={room.name} onChange={(e) => updateRoom(i, { name: e.target.value })} />
                      </div>
                      <div>
                        <Label className="text-xs">Type</Label>
                        <Input
                          value={room.type}
                          onChange={(e) => updateRoom(i, { type: e.target.value })}
                          placeholder="Standard · Garden view"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Description</Label>
                      <Textarea
                        rows={2}
                        value={room.desc}
                        onChange={(e) => updateRoom(i, { desc: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <Label className="text-xs">Size</Label>
                        <Input value={room.sqm} onChange={(e) => updateRoom(i, { sqm: e.target.value })} placeholder="~28 m²" />
                      </div>
                      <div>
                        <Label className="text-xs">Beds</Label>
                        <Input value={room.beds} onChange={(e) => updateRoom(i, { beds: e.target.value })} placeholder="King" />
                      </div>
                      <div>
                        <Label className="text-xs">Occupancy</Label>
                        <Input value={room.occupancy} onChange={(e) => updateRoom(i, { occupancy: e.target.value })} placeholder="2 guests" />
                      </div>
                      <div>
                        <Label className="text-xs">Price (€)</Label>
                        <Input
                          type="number"
                          value={room.price}
                          onChange={(e) => updateRoom(i, { price: Number(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addRoom} className="w-full border-dashed border-sand-light hover:border-gold hover:text-navy">
              <Plus className="w-4 h-4 mr-2" />
              Add room
            </Button>
          </StepCard>
        )}

        {step === 4 && (
          <StepCard
            title="Facts, location, reviews"
            subtitle="Optional supporting content for the detail page."
          >
            <FactRepeater
              title="Quick facts"
              hint="Label / value pairs shown in the facts grid."
              items={form.facts}
              onAdd={() => addFact("facts")}
              onUpdate={(i, p) => updateFact("facts", i, p)}
              onRemove={(i) => removeFact("facts", i)}
              labelPlaceholder="Property type"
              valuePlaceholder="Eco Lodge"
            />
            <FactRepeater
              title="Location & transfers"
              hint="How guests reach the property."
              items={form.location}
              onAdd={() => addFact("location")}
              onUpdate={(i, p) => updateFact("location", i, p)}
              onRemove={(i) => removeFact("location", i)}
              labelPlaceholder="From Cairo"
              valuePlaceholder="~8 hours by private vehicle"
            />
            {/* Reviews */}
            <div className="space-y-3 pt-3 border-t border-sand-light">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-[1rem] text-navy">Guest reviews</h3>
                  <p className="text-xs text-ink-soft/65">Optional testimonials shown near the bottom of the page.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addReview}>
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  Add review
                </Button>
              </div>
              {form.reviews.length === 0 && (
                <p className="text-sm text-ink-soft/65 italic">No reviews yet.</p>
              )}
              {form.reviews.map((review, i) => (
                <div key={i} className="border border-sand-light p-3 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Guest name</Label>
                      <Input value={review.name} onChange={(e) => updateReview(i, { name: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs">Origin & date</Label>
                      <Input
                        value={review.origin}
                        onChange={(e) => updateReview(i, { origin: e.target.value })}
                        placeholder="France · Stayed October 2024"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Quote</Label>
                    <Textarea rows={2} value={review.text} onChange={(e) => updateReview(i, { text: e.target.value })} />
                  </div>
                  <div className="flex justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={() => removeReview(i)} className="text-rose-600">
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </StepCard>
        )}

        {step === 5 && (
          <StepCard
            title="Review & save"
            subtitle={isEditing ? "Confirm and update the live record." : "Confirm and create the hotel."}
          >
            <ReviewRow label="Name" value={form.name || "—"} />
            <ReviewRow label="Slug" value={form.slug || "—"} />
            <ReviewRow label="Destination" value={form.destination === "siwa" ? "Siwa Oasis" : "North Coast"} />
            <ReviewRow label="Category" value={form.category || "—"} />
            <ReviewRow label="Card image" value={form.imageUrl || "—"} />
            <ReviewRow label="Gallery" value={`${form.gallery.length} photo${form.gallery.length === 1 ? "" : "s"}`} />
            <ReviewRow label="Price" value={form.pricePerNight || "—"} />
            <ReviewRow label="Rooms" value={`${form.rooms.length} room${form.rooms.length === 1 ? "" : "s"}`} />
            <ReviewRow label="Facts" value={`${form.facts.length}`} />
            <ReviewRow label="Reviews" value={`${form.reviews.length}`} />
            <ReviewRow label="Status" value={form.isActive ? "Active" : "Hidden"} />
          </StepCard>
        )}
      </main>

      {/* Sticky bottom bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-sand">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="border-sand text-ink-soft hover:text-navy"
          >
            ← Back
          </Button>
          <p className="text-[0.58rem] tracking-[0.2em] uppercase text-ink-soft/55 hidden md:block">
            Step {step} of {STEPS.length} · {STEPS[step - 1]?.label}
          </p>
          {step < STEPS.length ? (
            <Button
              type="button"
              disabled={!canAdvance()}
              onClick={() => setStep(step + 1)}
              className="bg-navy hover:bg-navy/90 text-white rounded-none px-6"
            >
              Continue →
            </Button>
          ) : (
            <Button
              type="button"
              disabled={saveMutation.isPending || !form.name.trim() || !form.slug.trim()}
              onClick={() => saveMutation.mutate()}
              className="bg-gold hover:bg-gold-light text-navy rounded-none px-6"
            >
              <Save className="w-4 h-4 mr-2" />
              {saveMutation.isPending ? "Saving…" : isEditing ? "Update hotel" : "Create hotel"}
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}

/* ───────────────────────── small UI helpers ───────────────────────── */

function StepCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-sand">
      <div className="px-6 md:px-8 pt-7 pb-5 border-b border-sand-light">
        <p className="text-[0.55rem] tracking-[0.3em] uppercase text-gold mb-2">This step</p>
        <h2 className="font-display text-[1.4rem] text-navy leading-tight">{title}</h2>
        {subtitle && <p className="text-[0.85rem] text-ink-soft mt-2 leading-relaxed">{subtitle}</p>}
      </div>
      <div className="p-6 md:p-8 space-y-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="text-[0.7rem] flex items-center gap-1.5">
        <span>{label}</span>
        {required && <span className="text-gold">·</span>}
      </Label>
      {children}
      {hint && <p className="text-[0.65rem] text-ink-soft/55 mt-1.5 leading-[1.5]">{hint}</p>}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4"
      />
      <span>{label}</span>
    </label>
  );
}

function FactRepeater({
  title,
  hint,
  items,
  labelPlaceholder,
  valuePlaceholder,
  onAdd,
  onUpdate,
  onRemove,
}: {
  title: string;
  hint?: string;
  items: Fact[];
  labelPlaceholder: string;
  valuePlaceholder: string;
  onAdd: () => void;
  onUpdate: (i: number, patch: Partial<Fact>) => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-[1rem] text-navy">{title}</h3>
          {hint && <p className="text-xs text-ink-soft/65">{hint}</p>}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add
        </Button>
      </div>
      {items.length === 0 && (
        <p className="text-sm text-ink-soft/65 italic">None yet.</p>
      )}
      {items.map((it, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-2 items-center">
          <Input value={it.label} onChange={(e) => onUpdate(i, { label: e.target.value })} placeholder={labelPlaceholder} />
          <Input value={it.value} onChange={(e) => onUpdate(i, { value: e.target.value })} placeholder={valuePlaceholder} />
          <Button type="button" variant="outline" size="sm" onClick={() => onRemove(i)} className="text-rose-600">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ))}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 py-2 border-b border-sand-light text-sm">
      <span className="text-[0.6rem] tracking-[0.2em] uppercase text-ink-soft/55">{label}</span>
      <span className="text-navy">{value}</span>
    </div>
  );
}
