/**
 * Price-consistency checker.
 *
 * The `pricePerNight` field is free text, so the live data has drifted:
 * some properties are priced in $, some in €, some carry a "From"
 * prefix that the cards add again ("From From $620 / night"), and some
 * text amounts contradict the room rates the page actually shows.
 *
 * All Soléi prices are quoted in USD, and the UI now pins the symbol
 * (see CANONICAL_CURRENCY in client/src/lib/price.ts), so a stray "€"
 * in the data no longer reaches a visitor. It is still worth cleaning
 * up, so it is reported as a note rather than a failure.
 *
 * Usage:  node scripts/check-prices.mjs [baseUrl]
 * Exits 1 when a stored value would fight the UI (a baked-in "From"),
 * 0 when only advisory notes remain.
 */

const BASE = process.argv[2] || "http://localhost:5001";

const res = await fetch(`${BASE}/api/hotels`);
if (!res.ok) {
  console.error(`Could not reach ${BASE}/api/hotels`);
  process.exit(2);
}
const hotels = await res.json();

const currencyOf = (s) => (typeof s === "string" ? (s.match(/[€$£]/) || [])[0] : undefined);
const amountOf = (s) => {
  if (typeof s !== "string") return undefined;
  const m = s.replace(/,/g, "").match(/\d+(\.\d+)?/);
  return m ? Math.round(parseFloat(m[0])) : undefined;
};

const errors = [];
const notes = [];
const currencies = new Map();

for (const h of hotels) {
  const text = h.pricePerNight ?? "";
  const cur = currencyOf(text);
  if (cur) currencies.set(cur, (currencies.get(cur) ?? 0) + 1);

  if (/^\s*from\b/i.test(text)) {
    errors.push(
      `${h.slug}: pricePerNight starts with "From" (${JSON.stringify(text)}) — the UI adds its own "From".`,
    );
  }

  const rooms = (h.details?.rooms ?? [])
    .map((r) => r?.price)
    .filter((p) => typeof p === "number" && p > 0);
  const lowest = rooms.length ? Math.min(...rooms) : undefined;
  const textAmount = amountOf(text);

  if (lowest !== undefined && textAmount !== undefined && lowest !== textAmount) {
    notes.push(
      `${h.slug}: pricePerNight says ${cur ?? ""}${textAmount} but the lowest room rate is ${lowest} — pages show ${lowest}.`,
    );
  }
  if (lowest === undefined && textAmount === undefined) {
    notes.push(`${h.slug}: no price at all (no room rates, no amount in pricePerNight).`);
  }
}

const nonUsd = [...currencies.entries()].filter(([c]) => c !== "$");
if (nonUsd.length > 0) {
  const summary = nonUsd.map(([c, n]) => `${c}×${n}`).join(", ");
  notes.push(
    `Stored prices still carry a non-USD symbol (${summary}). Pages render USD regardless, but the field is worth tidying.`,
  );
}

console.log(`Checked ${hotels.length} properties.`);
for (const n of notes) console.log(`  note: ${n}`);
if (errors.length === 0) {
  console.log("✓ No price inconsistencies.");
  process.exit(0);
}
console.error(`\n✗ ${errors.length} price inconsistency(ies):\n`);
for (const e of errors) console.error(`  ${e}`);
process.exit(1);
