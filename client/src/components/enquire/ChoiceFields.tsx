import { useEffect, useMemo, useRef, useState } from "react";

/* Shared bits for the Enquire page's experience tab. Styled to match
 * the page's existing fields: square corners, sand borders, gold for
 * the active state, small uppercase labels. */

const LABEL = "block text-[0.56rem] tracking-[0.22em] uppercase mb-2";

function FieldLabel({ label, optional }: { label: string; optional?: boolean }) {
  return (
    <>
      <span className={optional ? "text-ink-soft/35" : "text-ink-soft/55"}>{label}</span>
      {optional && <span className="normal-case tracking-normal ml-1.5 text-ink-soft/35">(optional)</span>}
    </>
  );
}

/**
 * Row of toggle buttons. `multiple` lets several be on at once
 * (destinations); otherwise it behaves like a radio group and a second
 * tap on the active option clears it.
 */
export function ChoiceButtons({
  label,
  options,
  value,
  onChange,
  multiple,
  optional,
  columns = "grid-cols-2",
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string[];
  onChange: (next: string[]) => void;
  multiple?: boolean;
  optional?: boolean;
  columns?: string;
}) {
  const toggle = (v: string) => {
    const on = value.includes(v);
    if (multiple) onChange(on ? value.filter((x) => x !== v) : [...value, v]);
    else onChange(on ? [] : [v]);
  };
  return (
    <fieldset className="mb-4">
      <legend className={LABEL}>
        <FieldLabel label={label} optional={optional} />
      </legend>
      <div className={`grid ${columns} gap-[2px]`}>
        {options.map((o) => {
          const active = value.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(o.value)}
              className={`px-3 py-3.5 border text-[0.62rem] tracking-[0.15em] uppercase font-body transition-colors ${
                active
                  ? "border-gold bg-cream text-navy"
                  : "border-sand bg-white text-ink-soft hover:bg-cream"
              }`}
            >
              {active && multiple && <span aria-hidden className="text-gold mr-1.5">✓</span>}
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export interface PickOption {
  slug: string;
  name: string;
  /** null = spans both destinations (e.g. a multi-region journey). */
  dest: "siwa" | "north-coast" | null;
  /** Listed under its own heading first (curated journeys). */
  featured?: boolean;
}
/** @deprecated alias kept for the experience tab. */
export type ExperienceOption = PickOption & { journey: boolean };

/**
 * Multi-select: a select-styled button opens an inline, searchable
 * checklist grouped into [featured] / Siwa Oasis / North Coast. Picks
 * show as removable tags underneath.
 */
export function MultiPicker({
  label,
  noun,
  featuredLabel = "Curated journeys",
  options,
  visible,
  value,
  onChange,
  prefilled,
}: {
  label: string;
  /** Plural noun for the button and search, e.g. "experiences". */
  noun: string;
  featuredLabel?: string;
  /** Every option — used to name the selected tags. */
  options: PickOption[];
  /** The options to list (already filtered by destination). */
  visible: PickOption[];
  value: string[];
  onChange: (next: string[]) => void;
  prefilled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  // Close when clicking elsewhere or pressing Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const byName = useMemo(() => new Map(options.map((o) => [o.slug, o.name])), [options]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? visible.filter((o) => o.name.toLowerCase().includes(q)) : visible;
    return [
      { label: featuredLabel, items: list.filter((o) => o.featured) },
      { label: "Siwa Oasis", items: list.filter((o) => !o.featured && o.dest !== "north-coast") },
      { label: "North Coast", items: list.filter((o) => !o.featured && o.dest === "north-coast") },
    ].filter((g) => g.items.length > 0);
  }, [visible, query, featuredLabel]);

  const toggle = (slug: string) =>
    onChange(value.includes(slug) ? value.filter((s) => s !== slug) : [...value, slug]);

  const summary =
    value.length === 0
      ? `Select ${noun}`
      : value.length === 1
        ? byName.get(value[0]) ?? "1 selected"
        : `${value.length} ${noun} selected`;

  return (
    <div className="mb-4" ref={boxRef}>
      <p className={LABEL}>
        <FieldLabel label={label} />
        <span className="normal-case tracking-normal ml-1.5 text-ink-soft/35">— choose as many as you like</span>
      </p>

      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`w-full px-4 py-3.5 border text-left text-[0.84rem] font-body flex items-center justify-between gap-3 transition-colors ${
          open ? "border-gold" : prefilled && value.length ? "border-gold/35" : "border-sand"
        } ${prefilled && value.length ? "bg-cream" : "bg-white"} ${value.length ? "text-navy" : "text-ink-soft/60"}`}
      >
        <span className="truncate">{summary}</span>
        <span aria-hidden className={`text-[0.6rem] text-ink-soft/50 transition-transform ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {open && (
        <div className="border border-t-0 border-gold bg-white">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${noun}`}
            aria-label={`Search ${noun}`}
            autoFocus
            className="w-full px-4 py-3 border-b border-sand-light text-[0.84rem] text-navy font-body outline-none placeholder:text-ink-soft/35"
          />
          <div className="max-h-72 overflow-y-auto py-1">
            {groups.length === 0 && (
              <p className="px-4 py-4 text-[0.8rem] text-ink-soft/60">Nothing matches.</p>
            )}
            {groups.map((g) => (
              <div key={g.label} role="group" aria-label={g.label}>
                <p className="px-4 pt-3 pb-1 text-[0.54rem] tracking-[0.22em] uppercase text-gold">{g.label}</p>
                {g.items.map((o) => (
                  <label
                    key={o.slug}
                    className="flex items-center gap-3 px-4 py-2.5 text-[0.84rem] text-navy cursor-pointer hover:bg-cream"
                  >
                    <input
                      type="checkbox"
                      checked={value.includes(o.slug)}
                      onChange={() => toggle(o.slug)}
                      className="w-4 h-4 accent-gold flex-shrink-0"
                    />
                    {o.name}
                  </label>
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-end border-t border-sand-light px-4 py-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[0.58rem] tracking-[0.18em] uppercase text-gold hover:text-navy transition-colors py-1"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-[2px] mt-2">
          {value.map((slug) => (
            <span
              key={slug}
              className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 bg-cream border border-gold/35 text-[0.75rem] text-navy"
            >
              {byName.get(slug) ?? slug}
              <button
                type="button"
                onClick={() => toggle(slug)}
                aria-label={`Remove ${byName.get(slug) ?? slug}`}
                className="text-ink-soft/50 hover:text-navy leading-none px-1"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
