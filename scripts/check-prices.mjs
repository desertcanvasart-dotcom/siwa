/**
 * Price-consistency checker.
 *
 * The `pricePerNight` field is free text, so the live data has drifted:
 * some properties are priced in $, some in €, some carry a "From"
 * prefix that the cards add again ("From From $620 / night"), and some
 * text amounts contradict the room rates the page actually shows.
 *
 * The rendering code now normalises all of that (see client/src/lib/
 * price.ts), but this reports the underlying DATA problems, which only
 * the owner can decide about — a stored "$70" is a different amount of
 * money from "€70" and must never be auto-converted.
 *
 * Usage:  node scripts/check-prices.mjs [baseUrl]
 * Exits 1 on hard inconsistencies (mixed currencies / duplicated From),
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

if (currencies.size > 1) {
  const summary = [...currencies.entries()].map(([c, n]) => `${c}×${n}`).join(", ");
  errors.push(
    `Mixed currencies across properties (${summary}). Pick one canonical currency — a stored "$70" is not "€70".`,
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
