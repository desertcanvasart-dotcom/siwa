/**
 * Normalise the stored `pricePerNight` text on every hotel.
 *
 * The field is free text and has drifted: some values carry a leading
 * "From" (which the UI adds again), some use "€" though every Soléi
 * price is quoted in USD, and some have stray whitespace. The site
 * already renders correctly regardless — this just makes the stored
 * data match what visitors see, so the admin screens aren't confusing.
 *
 * What it changes, per value:
 *   • strips a leading "From"          "From $120 / night " → "$120 / night"
 *   • normalises the symbol to USD     "€650 / night"       → "$650 / night"
 *   • collapses whitespace
 *
 * What it deliberately does NOT change:
 *   • the AMOUNT — never converted, never recalculated. Where the text
 *     amount disagrees with the room rates (the pages show the lowest
 *     room rate), that's a business decision and is only reported.
 *
 * Dry run by default — prints the exact before/after and writes nothing.
 * Re-run with --apply to save. Idempotent: running twice changes
 * nothing the second time. Keep the printed "before" values; they are
 * your undo.
 *
 * Usage:
 *   node scripts/normalize-prices.mjs [baseUrl]            # preview
 *   node scripts/normalize-prices.mjs [baseUrl] --apply    # write
 *
 * Auth (only needed with --apply) — set in your shell, not in a file:
 *   ADMIN_USERNAME=... ADMIN_PASSWORD=... node scripts/normalize-prices.mjs https://xn--soli-dpa.com --apply
 */

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const BASE = args.find((a) => !a.startsWith("--")) || "http://localhost:5001";
const CURRENCY = "$";

/** "From €60 / night – breakfast  included " → "$60 / night – breakfast included" */
function normalize(value) {
  if (typeof value !== "string") return value;
  let out = value.replace(/\s+/g, " ").trim();
  out = out.replace(/^from\s+/i, "");
  out = out.replace(/[€£]/g, CURRENCY);
  return out.trim();
}

const res = await fetch(`${BASE}/api/hotels`);
if (!res.ok) {
  console.error(`Could not reach ${BASE}/api/hotels`);
  process.exit(2);
}
const hotels = await res.json();

const changes = [];
const amountNotes = [];
for (const h of hotels) {
  const before = h.pricePerNight ?? "";
  const after = normalize(before);
  if (after !== before) changes.push({ id: h.id, slug: h.slug, before, after });

  const rooms = (h.details?.rooms ?? [])
    .map((r) => r?.price)
    .filter((p) => typeof p === "number" && p > 0);
  const lowest = rooms.length ? Math.min(...rooms) : undefined;
  const textAmount = (after.match(/\d+(\.\d+)?/) || [])[0];
  if (lowest !== undefined && textAmount !== undefined && Number(textAmount) !== lowest) {
    amountNotes.push(
      `${h.slug}: text says ${textAmount} but the lowest room rate is ${lowest} (pages show ${lowest}). Left alone — your call.`,
    );
  }
}

console.log(`${hotels.length} properties at ${BASE}\n`);
if (changes.length === 0) {
  console.log("✓ Nothing to normalise — stored values are already clean.");
} else {
  console.log(`${changes.length} value(s) to normalise:\n`);
  for (const c of changes) {
    console.log(`  ${c.slug}`);
    console.log(`      before: ${JSON.stringify(c.before)}`);
    console.log(`      after:  ${JSON.stringify(c.after)}`);
  }
}
if (amountNotes.length) {
  console.log(`\nAmount mismatches (NOT changed):`);
  for (const n of amountNotes) console.log(`  • ${n}`);
}

if (!APPLY) {
  console.log(`\nDry run — nothing written. Re-run with --apply to save.`);
  process.exit(0);
}
if (changes.length === 0) process.exit(0);

const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;
if (!username || !password) {
  console.error(
    "\n--apply needs ADMIN_USERNAME and ADMIN_PASSWORD in the environment.",
  );
  process.exit(2);
}

const login = await fetch(`${BASE}/api/admin/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password }),
});
if (!login.ok) {
  console.error(`\nLogin failed (${login.status}). Check the credentials.`);
  process.exit(2);
}
const { token } = await login.json();

let ok = 0;
for (const c of changes) {
  const put = await fetch(`${BASE}/api/admin/hotels/${c.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    // Only this one field is sent, so nothing else can be disturbed.
    body: JSON.stringify({ pricePerNight: c.after }),
  });
  if (put.ok) {
    ok++;
    console.log(`  ✓ ${c.slug}`);
  } else {
    console.error(`  ✗ ${c.slug} — ${put.status}`);
  }
}
console.log(`\nUpdated ${ok}/${changes.length}.`);
process.exit(ok === changes.length ? 0 : 1);
