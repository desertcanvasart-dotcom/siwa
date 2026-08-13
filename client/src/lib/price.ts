/**
 * One canonical "from" price per property.
 *
 * Prices used to be derived independently in three places — the
 * homepage card (raw `pricePerNight` text), the detail hero (hard-coded
 * "€" + lowest room rate), and the booking panel — so the same hotel
 * could read "$70 / night" on the homepage and "€70 per night" on its
 * own page, and a stored value of "From $620 / night" rendered as
 * "From From $620 / night".
 *
 * Rules, in order:
 *   1. Amount: the lowest room rate when the property has rooms (those
 *      are what the admin actually maintains), otherwise the number in
 *      the free-text `pricePerNight` field.
 *   2. Currency: whatever symbol the admin typed in `pricePerNight`.
 *      Never converted — showing "€70" for a stored "$70" would
 *      misstate the price.
 *   3. Label: the admin's trailing words ("/ night · breakfast
 *      included"), with any leading "From" stripped so callers can add
 *      their own prefix without doubling it.
 */

export interface PriceParts {
  /** Numeric amount, 0 when nothing could be parsed. */
  amount: number;
  /** Currency symbol as entered by the admin. */
  currency: string;
  /** Trailing qualifier, e.g. "/ night · breakfast included". */
  label: string;
  /** Ready to render, e.g. "€145 / night". Empty when amount is 0. */
  display: string;
}

const DEFAULT_CURRENCY = "€";
const DEFAULT_LABEL = "/ night";

/** First number in a string: "From $620 / night" → 620. */
export function parseAmount(input: unknown): number {
  if (typeof input === "number") return Number.isFinite(input) ? input : 0;
  if (typeof input !== "string") return 0;
  const m = input.replace(/,/g, "").match(/\d+(\.\d+)?/);
  return m ? Math.round(parseFloat(m[0])) : 0;
}

/** Currency symbol in a string, or null. */
export function detectCurrency(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const m = input.match(/[€$£]/);
  return m ? m[0] : null;
}

/**
 * Everything after the amount, minus any leading "From" — so
 * "From $620 / night" yields "/ night".
 */
function extractLabel(input: unknown): string {
  if (typeof input !== "string") return "";
  const afterAmount = input.replace(/^\s*from\s*/i, "").replace(/^[^\d]*\d+(\.\d+)?/, "");
  return afterAmount.trim();
}

export interface PriceSource {
  /** Admin free-text field, e.g. "From $620 / night". */
  pricePerNight?: string | null;
  /** Room rates; the lowest positive one wins. */
  rooms?: Array<{ price?: number | null }> | null;
  /** Bundled fallback when the API has nothing. */
  fallbackAmount?: number;
  fallbackLabel?: string;
}

export function resolvePrice(src: PriceSource): PriceParts {
  const roomPrices = (src.rooms ?? [])
    .map((r) => r?.price)
    .filter((p): p is number => typeof p === "number" && p > 0);

  const fromText = parseAmount(src.pricePerNight);
  const amount =
    roomPrices.length > 0
      ? Math.min(...roomPrices)
      : fromText > 0
        ? fromText
        : (src.fallbackAmount ?? 0);

  const currency = detectCurrency(src.pricePerNight) ?? DEFAULT_CURRENCY;
  const label = extractLabel(src.pricePerNight) || src.fallbackLabel || DEFAULT_LABEL;

  return {
    amount,
    currency,
    label,
    display: amount > 0 ? `${currency}${amount.toLocaleString()} ${label}`.trim() : "",
  };
}
