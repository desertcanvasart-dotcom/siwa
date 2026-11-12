/**
 * Render-time clean-up for free text that comes from the CMS.
 *
 * Editors paste bullet lists from documents, so list items arrive as
 * "- Gratuities", "* Swimwear", ".Yes — …" or "…atmosphere..". The page
 * already draws its own bullet, so leading bullet characters are
 * stripped and accidental double full stops collapsed. Nothing here
 * changes wording — it only removes formatting debris.
 */

/** Leading bullet debris: "-", "*", "•", "·", "–", "—", "." / "..". */
const LEADING_BULLET = /^\s*(?:[-*•·–—]+|\.+)\s*/;

/** "..": a doubled full stop that isn't an ellipsis ("..."). */
const DOUBLE_STOP = /(?<!\.)\.\.(?!\.)/g;

/** Clean one paragraph / sentence. */
export function cleanText(input: string | null | undefined): string {
  if (typeof input !== "string") return "";
  return input.replace(LEADING_BULLET, "").replace(DOUBLE_STOP, ".").trim();
}

/** Clean every item in a list and drop the ones left empty. */
export function cleanList(items: readonly (string | null | undefined)[] | null | undefined): string[] {
  if (!Array.isArray(items)) return [];
  return items.map(cleanText).filter((s) => s.length > 0);
}

/**
 * "1 guests" → "1 guest", "1 bedrooms" → "1 bedroom" (CMS occupancy /
 * spec strings are free text).
 */
export function fixSingulars(input: string | null | undefined): string {
  if (typeof input !== "string") return "";
  return input.replace(/\b1 (guest|adult|child|person|bedroom|room|bed|night)s\b/gi, "1 $1");
}

/** Known spelling slips in CMS copy. "Paddle court" → "Padel court";
 *  "paddleboarding" is left alone. */
export function fixKnownTypos(input: string): string {
  return input.replace(/\bPaddle\b(?!\s*board)/g, "Padel").replace(/\bpaddle(?=\s+courts?\b)/g, "padel");
}

/**
 * A price label must be the trailing qualifier only ("/ night · private
 * villa"). Admin-entered labels sometimes repeat the amount
 * ("$650/ night · private villa"), which rendered as "$650 $650/ night".
 */
export function cleanPriceLabel(input: string | null | undefined): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/^\s*from\s*/i, "")
    .replace(/^[$€£]\s?\d[\d,.]*\s*/, "")
    .trim();
}

/**
 * Amenities are stored as a list, but an editor once typed a paragraph
 * into the comma-separated field and it was split at every comma.
 * When the list looks like a split paragraph, rejoin it and return the
 * paragraphs so the page can render prose instead of a broken list.
 * Returns null for a normal amenities list.
 */
export function amenitiesAsProse(items: readonly string[]): string[] | null {
  if (items.length === 0) return null;
  const long = items.some((a) => a.length > 80);
  const fragments = items.filter((a) => /^[a-z]/.test(a.trim())).length;
  if (!long && fragments < Math.max(2, items.length / 2)) return null;
  return items
    .join(", ")
    .split(/\s{2,}|\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Admin amenities field → list. One amenity per line, or comma-separated
 * on a single line. If the text is a paragraph (what an editor typed for
 * Soléi Desert Retreat), it is kept whole instead of being cut at every
 * comma — the detail page then renders it as prose.
 */
export function parseAmenitiesInput(text: string): string[] {
  const raw = text.trim();
  if (!raw) return [];
  if (raw.includes("\n")) {
    return raw.split(/\n+/).map((a) => a.trim()).filter(Boolean);
  }
  const parts = raw.split(",").map((a) => a.trim()).filter(Boolean);
  return amenitiesAsProse(parts) ? [raw] : parts;
}

/** List → admin amenities field (inverse of parseAmenitiesInput). */
export function formatAmenitiesInput(items: readonly string[]): string {
  return items.some((a) => a.includes(",")) ? items.join("\n") : items.join(", ");
}
