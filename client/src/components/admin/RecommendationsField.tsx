import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MediaField } from "@/components/admin/MediaPicker";
import { useExperiencesRaw } from "@/lib/useExperiencesRaw";
import { REC_MAX, isJourney, type RecDestination, type RecSlot } from "@/lib/recommendations";

const SELECT =
  "flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * Admin editor for the hotel-page recommendations block: an ordered
 * list of up to REC_MAX cards. Each card is a published hotel, a
 * published experience / journey, or a custom card with its own photo,
 * text and link. An empty list means "fill automatically".
 */
export function RecommendationsField({
  value,
  onChange,
  destination,
}: {
  value: RecSlot[];
  onChange: (next: RecSlot[]) => void;
  destination: RecDestination;
}) {
  const { data: hotels = [] } = useQuery<Array<{ slug: string; name: string; destination?: string }>>({
    queryKey: ["/api/hotels", "rec-picker"],
    queryFn: async () => {
      const res = await fetch("/api/hotels");
      return res.ok ? res.json() : [];
    },
  });
  const { data: experiences } = useExperiencesRaw();

  // Offer this destination's items first; the rest stay available.
  const hotelsHere = hotels.filter((h) => (h.destination === "north-coast" ? "north-coast" : "siwa") === destination);
  const hotelsElsewhere = hotels.filter((h) => !hotelsHere.includes(h));
  const expsHere = experiences.filter((e) => e.slug && (e.destination === destination || (isJourney(e) && !e.destination)));
  const expsElsewhere = experiences.filter((e) => e.slug && !expsHere.includes(e));
  const otherName = destination === "siwa" ? "North Coast" : "Siwa Oasis";
  const hereName = destination === "siwa" ? "Siwa Oasis" : "North Coast";

  const update = (i: number, patch: Partial<RecSlot>) =>
    onChange(value.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const missing = (s: RecSlot) =>
    (s.kind === "hotel" && s.ref && !hotels.some((h) => h.slug === s.ref)) ||
    (s.kind === "experience" && s.ref && !experiences.some((e) => e.slug === s.ref));

  return (
    <div className="space-y-3 mt-2">
      {value.length === 0 && (
        <p className="text-xs text-ink-soft/70 bg-cream border border-sand-light px-3 py-2">
          No cards chosen — the block fills itself automatically: other published hotels here first,
          then published experiences. Add cards to choose exactly what shows.
        </p>
      )}

      {value.map((slot, i) => (
        <div key={i} className="border border-sand-light p-3 space-y-3">
          <div className="flex gap-2 items-end">
            <div className="w-44 flex-shrink-0">
              <Label className="text-xs">Card {i + 1} — type</Label>
              <select
                value={slot.kind}
                onChange={(e) => update(i, { kind: e.target.value as RecSlot["kind"], ref: "" })}
                className={SELECT}
              >
                <option value="hotel">Hotel</option>
                <option value="experience">Experience or journey</option>
                <option value="custom">Custom card</option>
              </select>
            </div>

            {slot.kind !== "custom" && (
              <div className="flex-1 min-w-0">
                <Label className="text-xs">{slot.kind === "hotel" ? "Hotel" : "Experience or journey"}</Label>
                <select value={slot.ref ?? ""} onChange={(e) => update(i, { ref: e.target.value })} className={SELECT}>
                  <option value="">Choose…</option>
                  {slot.kind === "hotel" ? (
                    <>
                      <optgroup label={hereName}>
                        {hotelsHere.map((h) => <option key={h.slug} value={h.slug}>{h.name}</option>)}
                      </optgroup>
                      {hotelsElsewhere.length > 0 && (
                        <optgroup label={otherName}>
                          {hotelsElsewhere.map((h) => <option key={h.slug} value={h.slug}>{h.name}</option>)}
                        </optgroup>
                      )}
                    </>
                  ) : (
                    <>
                      <optgroup label={hereName}>
                        {expsHere.map((e) => (
                          <option key={e.slug!} value={e.slug!}>{isJourney(e) ? `Journey — ${e.title}` : e.title}</option>
                        ))}
                      </optgroup>
                      {expsElsewhere.length > 0 && (
                        <optgroup label={otherName}>
                          {expsElsewhere.map((e) => (
                            <option key={e.slug!} value={e.slug!}>{isJourney(e) ? `Journey — ${e.title}` : e.title}</option>
                          ))}
                        </optgroup>
                      )}
                    </>
                  )}
                  {missing(slot) && <option value={slot.ref}>{slot.ref} (not published — hidden)</option>}
                </select>
              </div>
            )}
            {slot.kind === "custom" && <div className="flex-1" />}

            <div className="flex gap-1 flex-shrink-0">
              <Button type="button" variant="outline" size="sm" disabled={i === 0} onClick={() => move(i, -1)} title="Move up">↑</Button>
              <Button type="button" variant="outline" size="sm" disabled={i === value.length - 1} onClick={() => move(i, 1)} title="Move down">↓</Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="text-rose-600"
                title="Remove"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {missing(slot) && (
            <p className="text-xs text-rose-700">
              This item isn't published right now, so the card is hidden on the site until it is.
            </p>
          )}

          {slot.kind === "custom" && (
            <div className="space-y-2">
              <div>
                <Label className="text-xs">Photo</Label>
                <MediaField value={slot.image ?? ""} onChange={(url) => update(i, { image: url })} accept="image" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Title</Label>
                  <Input value={slot.title ?? ""} onChange={(e) => update(i, { title: e.target.value })} placeholder="e.g. Abdu's Restaurant" />
                </div>
                <div>
                  <Label className="text-xs">Small line under the title</Label>
                  <Input value={slot.subtitle ?? ""} onChange={(e) => update(i, { subtitle: e.target.value })} placeholder="e.g. Siwan cuisine · Market square" />
                </div>
                <div>
                  <Label className="text-xs">Price line (optional)</Label>
                  <Input value={slot.price ?? ""} onChange={(e) => update(i, { price: e.target.value })} placeholder='e.g. From $25 per person — or leave empty' />
                </div>
                <div>
                  <Label className="text-xs">Link (optional)</Label>
                  <Input value={slot.href ?? ""} onChange={(e) => update(i, { href: e.target.value })} placeholder="/siwa-oasis/experiences or https://…" />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {value.length < REC_MAX && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...value, { kind: "hotel", ref: "" }])}
        >
          + Add card
        </Button>
      )}
    </div>
  );
}
