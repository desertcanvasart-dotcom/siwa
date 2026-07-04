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
import { MediaField } from "@/components/admin/MediaPicker";

/**
 * /admin/tours/new  and  /admin/tours/:id/edit
 *
 * Five-step tour wizard mirroring the hotel one:
 *   1. Basics (title, slug, destination, price, image…)
 *   2. Overview
 *   3. Includes · Excludes · What to bring
 *   4. Itinerary & FAQs
 *   5. Review & save
 */

const STEPS = [
  { id: 1, label: "Basics" },
  { id: 2, label: "Overview" },
  { id: 3, label: "Includes / What to bring" },
  { id: 4, label: "Itinerary & FAQs" },
  { id: 5, label: "Review & save" },
];

type ItineraryStep = { time: string; title: string; body: string };
type Faq = { q: string; a: string };

const emptyForm = {
  title: "",
  slug: "",
  destination: "siwa",
  category: "",
  duration: "",
  pricePerPerson: "0",
  maxGuests: 8,
  summary: "",
  description: "",
  imageUrl: "",
  isActive: true,
  // Details JSONB
  overview: "",
  includes: "",
  excludes: "",
  whatToBring: "",
  itinerary: [] as ItineraryStep[],
  faqs: [] as Faq[],
  meetingPoint: "",
  cancellationPolicy: "",
};

export default function AdminTourWizardPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/tours/:id/edit");
  const idStr = params?.id;
  const id = idStr ? parseInt(idStr, 10) : null;
  const isEditing = id !== null && !Number.isNaN(id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) setLocation("/admin/login");
  }, [setLocation]);

  const { data: existing, isLoading } = useQuery<any>({
    queryKey: ["/api/admin/experiences", id],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/experiences");
      const all = await res.json();
      return Array.isArray(all) ? all.find((e: any) => e.id === id) : null;
    },
    enabled: isEditing,
    retry: false,
  });

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [hydrated, setHydrated] = useState(!isEditing);

  useEffect(() => {
    if (!isEditing || !existing || hydrated) return;
    const d = existing.details ?? {};
    setForm({
      title: existing.title ?? "",
      slug: existing.slug ?? "",
      destination: existing.destination ?? "siwa",
      category: existing.category ?? "",
      duration: existing.duration ?? "",
      pricePerPerson: String(existing.pricePerPerson ?? "0"),
      maxGuests: existing.maxGuests ?? 8,
      summary: existing.summary ?? "",
      description: existing.description ?? "",
      imageUrl: existing.imageUrl ?? "",
      isActive: existing.isActive !== false,
      overview: Array.isArray(d.overview) ? d.overview.join("\n\n") : "",
      includes: Array.isArray(d.includes) ? d.includes.join("\n") : "",
      excludes: Array.isArray(d.excludes) ? d.excludes.join("\n") : "",
      whatToBring: Array.isArray(d.whatToBring) ? d.whatToBring.join("\n") : "",
      itinerary: Array.isArray(d.itinerary) ? d.itinerary : [],
      faqs: Array.isArray(d.faqs) ? d.faqs : [],
      meetingPoint: d.meetingPoint ?? "",
      cancellationPolicy: d.cancellationPolicy ?? "",
    });
    setHydrated(true);
  }, [existing, isEditing, hydrated]);

  // Auto-slug
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

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));
  const addStep = () => set({ itinerary: [...form.itinerary, { time: "", title: "", body: "" }] });
  const updateStep = (i: number, patch: Partial<ItineraryStep>) =>
    set({ itinerary: form.itinerary.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
  const removeStep = (i: number) =>
    set({ itinerary: form.itinerary.filter((_, idx) => idx !== i) });

  const addFaq = () => set({ faqs: [...form.faqs, { q: "", a: "" }] });
  const updateFaq = (i: number, patch: Partial<Faq>) =>
    set({ faqs: form.faqs.map((f, idx) => (idx === i ? { ...f, ...patch } : f)) });
  const removeFaq = (i: number) =>
    set({ faqs: form.faqs.filter((_, idx) => idx !== i) });

  const buildPayload = () => ({
    title: form.title,
    slug: form.slug,
    destination: form.destination,
    category: form.category || "Tour",
    duration: form.duration || "Half day",
    pricePerPerson: String(form.pricePerPerson),
    maxGuests: Number(form.maxGuests) || 8,
    minAge: existing?.minAge ?? 6,
    difficulty: existing?.difficulty ?? "Easy",
    summary: form.summary,
    description: form.description || "",
    imageUrl: form.imageUrl || null,
    mediaType: existing?.mediaType ?? "image",
    eco: existing?.eco ?? false,
    luxury: existing?.luxury ?? false,
    wellness: existing?.wellness ?? false,
    isActive: form.isActive,
    details: {
      overview: form.overview.split(/\n\n+/).map((p) => p.trim()).filter(Boolean),
      includes: form.includes.split("\n").map((s) => s.trim()).filter(Boolean),
      excludes: form.excludes.split("\n").map((s) => s.trim()).filter(Boolean),
      whatToBring: form.whatToBring.split("\n").map((s) => s.trim()).filter(Boolean),
      itinerary: form.itinerary.filter((s) => s.title.trim() || s.body.trim() || s.time.trim()),
      faqs: form.faqs.filter((f) => f.q.trim() || f.a.trim()),
      meetingPoint: form.meetingPoint || undefined,
      cancellationPolicy: form.cancellationPolicy || undefined,
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = buildPayload();
      // Tours don't have a create endpoint yet — admin/experiences only
      // supports PUT for now. Show a clear error if attempted on new.
      if (!isEditing) {
        const res = await apiRequest("POST", "/api/admin/experiences", payload);
        if (!res.ok) throw new Error("Failed to create tour");
        return res.json();
      }
      const res = await apiRequest("PUT", `/api/admin/experiences/${id}`, payload);
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/experiences"] });
      queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
      queryClient.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          typeof q.queryKey[0] === "string" &&
          (q.queryKey[0] as string).startsWith("/api/experiences/by-slug"),
      });
      toast({
        title: isEditing ? "Tour updated" : "Tour created",
        description: `${form.title} saved successfully`,
      });
      setLocation("/admin/dashboard");
    },
    onError: (err: any) => {
      toast({ title: "Save failed", description: err?.message ?? "Could not save", variant: "destructive" });
    },
  });

  const canAdvance = () => {
    if (step === 1) return !!form.title.trim() && !!form.slug.trim() && !!form.summary.trim();
    return true;
  };

  if (isEditing && isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center font-body text-ink-soft/55">
        <p className="text-[0.6rem] tracking-[0.3em] uppercase">Loading tour…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream font-body text-ink">
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
                {isEditing ? "Edit tour" : "Add tour"}
              </p>
              <h1 className="font-display text-[1.05rem] text-navy leading-tight truncate">
                {form.title || (isEditing ? "Untitled tour" : "New tour")}
              </h1>
            </div>
          </div>
        </div>
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

      <main className="max-w-5xl mx-auto px-6 md:px-10 py-10 pb-32">
        {step === 1 && (
          <StepCard title="Basics" subtitle="The card content — title, slug, image, destination, price.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Tour title *">
                <Input value={form.title} onChange={(e) => set({ title: e.target.value })} placeholder="Desert Sunset Experience" />
              </Field>
              <Field label="URL slug *">
                <Input
                  value={form.slug}
                  onChange={(e) => set({ slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  placeholder="desert-sunset-experience"
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Destination">
                <Select value={form.destination} onValueChange={(v) => set({ destination: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="siwa">Siwa Oasis</SelectItem>
                    <SelectItem value="north-coast">North Coast</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Category">
                <Input value={form.category} onChange={(e) => set({ category: e.target.value })} placeholder="Desert" />
              </Field>
              <Field label="Duration">
                <Input value={form.duration} onChange={(e) => set({ duration: e.target.value })} placeholder="Sunset · 3 hours" />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Price per person (€)">
                <Input
                  type="number"
                  value={form.pricePerPerson}
                  onChange={(e) => set({ pricePerPerson: e.target.value })}
                />
              </Field>
              <Field label="Max guests">
                <Input
                  type="number"
                  value={form.maxGuests}
                  onChange={(e) => set({ maxGuests: Number(e.target.value) || 8 })}
                />
              </Field>
              <Field label="Active">
                <div className="flex items-center h-9">
                  <Toggle
                    label={form.isActive ? "Shown on site" : "Hidden"}
                    checked={form.isActive}
                    onChange={(v) => set({ isActive: v })}
                  />
                </div>
              </Field>
            </div>
            <Field label="Summary *" hint="Shown on listing cards and in the detail-page hero.">
              <Textarea rows={2} value={form.summary} onChange={(e) => set({ summary: e.target.value })} />
            </Field>
            <Field label="Description" hint="Used as overview fallback when the rich overview is empty.">
              <Textarea rows={3} value={form.description} onChange={(e) => set({ description: e.target.value })} />
            </Field>
            <Field label="Card image" hint="Pick from the library or upload a new one — no URL needed.">
              <MediaField
                value={form.imageUrl}
                onChange={(url) => set({ imageUrl: url })}
                accept="image"
                placeholder="Pick from library, or paste a URL"
              />
            </Field>
          </StepCard>
        )}

        {step === 2 && (
          <StepCard title="Overview" subtitle="The story paragraphs shown above the includes list on the detail page.">
            <Field label="Overview paragraphs" hint="Separate paragraphs with a blank line.">
              <Textarea
                rows={9}
                value={form.overview}
                onChange={(e) => set({ overview: e.target.value })}
                className="font-mono text-sm"
              />
            </Field>
          </StepCard>
        )}

        {step === 3 && (
          <StepCard
            title="Includes, excludes, what to bring"
            subtitle="Bulleted lists shown on the detail page. One item per line."
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Includes" hint="What's in the price.">
                <Textarea
                  rows={7}
                  value={form.includes}
                  onChange={(e) => set({ includes: e.target.value })}
                  className="font-mono text-sm"
                />
              </Field>
              <Field label="Excludes" hint="What's explicitly not.">
                <Textarea
                  rows={7}
                  value={form.excludes}
                  onChange={(e) => set({ excludes: e.target.value })}
                  className="font-mono text-sm"
                />
              </Field>
              <Field label="What to bring" hint="Practical packing items.">
                <Textarea
                  rows={7}
                  value={form.whatToBring}
                  onChange={(e) => set({ whatToBring: e.target.value })}
                  className="font-mono text-sm"
                />
              </Field>
            </div>
          </StepCard>
        )}

        {step === 4 && (
          <StepCard title="Itinerary & FAQs" subtitle="Timeline of how the tour unfolds, plus questions guests commonly ask.">
            {/* Itinerary */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-[1rem] text-navy">Itinerary</h3>
                  <p className="text-xs text-ink-soft/65">Each step has a time, title, and body.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addStep}>
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  Add step
                </Button>
              </div>
              {form.itinerary.length === 0 && (
                <p className="text-sm text-ink-soft/65 italic">No steps yet.</p>
              )}
              {form.itinerary.map((s, i) => (
                <div key={i} className="border border-sand-light p-3 space-y-2">
                  <div className="flex gap-3 items-end">
                    <div className="w-32">
                      <Label className="text-xs">Time</Label>
                      <Input value={s.time} onChange={(e) => updateStep(i, { time: e.target.value })} placeholder="3:30 PM" />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs">Title</Label>
                      <Input value={s.title} onChange={(e) => updateStep(i, { title: e.target.value })} placeholder="Pickup" />
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => removeStep(i)} className="text-rose-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div>
                    <Label className="text-xs">Body</Label>
                    <Textarea rows={2} value={s.body} onChange={(e) => updateStep(i, { body: e.target.value })} />
                  </div>
                </div>
              ))}
            </section>

            {/* FAQs */}
            <section className="space-y-3 pt-3 border-t border-sand-light">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-[1rem] text-navy">FAQs</h3>
                  <p className="text-xs text-ink-soft/65">Q / A pairs shown after the itinerary.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addFaq}>
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  Add FAQ
                </Button>
              </div>
              {form.faqs.length === 0 && (
                <p className="text-sm text-ink-soft/65 italic">No FAQs yet.</p>
              )}
              {form.faqs.map((f, i) => (
                <div key={i} className="border border-sand-light p-3 space-y-2">
                  <div>
                    <Label className="text-xs">Question</Label>
                    <Input value={f.q} onChange={(e) => updateFaq(i, { q: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs">Answer</Label>
                    <Textarea rows={2} value={f.a} onChange={(e) => updateFaq(i, { a: e.target.value })} />
                  </div>
                  <div className="flex justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={() => removeFaq(i)} className="text-rose-600">
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </section>

            <section className="pt-3 border-t border-sand-light space-y-3">
              <div>
                <Label>Meeting point</Label>
                <Input
                  value={form.meetingPoint}
                  onChange={(e) => set({ meetingPoint: e.target.value })}
                  placeholder="Pickup from your hotel."
                />
              </div>
              <div>
                <Label>Cancellation policy</Label>
                <Input
                  value={form.cancellationPolicy}
                  onChange={(e) => set({ cancellationPolicy: e.target.value })}
                  placeholder="Free cancellation up to 24 hours before."
                />
              </div>
            </section>
          </StepCard>
        )}

        {step === 5 && (
          <StepCard title="Review & save" subtitle="Confirm and create the tour.">
            <ReviewRow label="Title" value={form.title || "—"} />
            <ReviewRow label="Slug" value={form.slug || "—"} />
            <ReviewRow label="Destination" value={form.destination === "siwa" ? "Siwa Oasis" : "North Coast"} />
            <ReviewRow label="Duration" value={form.duration || "—"} />
            <ReviewRow label="Price" value={`€${form.pricePerPerson || 0} / guest`} />
            <ReviewRow label="Max guests" value={String(form.maxGuests)} />
            <ReviewRow label="Image" value={form.imageUrl || "—"} />
            <ReviewRow label="Itinerary" value={`${form.itinerary.length} step${form.itinerary.length === 1 ? "" : "s"}`} />
            <ReviewRow label="FAQs" value={`${form.faqs.length}`} />
            <ReviewRow label="Status" value={form.isActive ? "Active" : "Hidden"} />
          </StepCard>
        )}
      </main>

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
              disabled={saveMutation.isPending || !form.title.trim() || !form.slug.trim()}
              onClick={() => saveMutation.mutate()}
              className="bg-gold hover:bg-gold-light text-navy rounded-none px-6"
            >
              <Save className="w-4 h-4 mr-2" />
              {saveMutation.isPending ? "Saving…" : isEditing ? "Update tour" : "Create tour"}
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}

/* shared bits */

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

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-[0.7rem]">{label}</Label>
      {children}
      {hint && <p className="text-[0.65rem] text-ink-soft/55 mt-1.5 leading-[1.5]">{hint}</p>}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4" />
      <span>{label}</span>
    </label>
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
