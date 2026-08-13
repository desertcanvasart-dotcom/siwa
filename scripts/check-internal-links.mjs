/**
 * Internal-link checker.
 *
 * Greps every hard-coded internal href out of client/src, then asks a
 * running server whether each one resolves to real content — catching
 * the class of bug where a card promises a detail page that silently
 * redirects to an index (or 404s).
 *
 * Because the app is a SPA, every path returns index.html with HTTP
 * 200. So instead of trusting the status code, entity paths are
 * validated against the APIs that back them (hotels, experiences,
 * journal posts). Static routes are checked against the route table in
 * App.tsx.
 *
 * Usage:  node scripts/check-internal-links.mjs [baseUrl]
 * Exits 1 when any link is broken, so CI can gate a deploy on it.
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const BASE = process.argv[2] || "http://localhost:5001";
const SRC = "client/src";

// Orphaned components kept in the tree but imported by nothing, so
// their links can't be reached by a visitor. Verified unreferenced —
// re-check with `grep -rn "<name>" client/src` before trusting this.
const UNREACHABLE = [
  "client/src/components/archive/",
  "client/src/components/layout/legacy-footer.tsx",
  "client/src/components/layout/legacy-header.tsx",
];

/** Recursively collect .ts/.tsx files, skipping unreachable ones. */
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (UNREACHABLE.some((u) => full.startsWith(u))) continue;
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if ([".ts", ".tsx"].includes(extname(full))) out.push(full);
  }
  return out;
}

// Literal internal hrefs only — template literals with ${} are
// dynamic and get validated through their backing API instead.
const HREF_RE = /href[=:]\s*\{?["'`](\/[^"'`${}\s]*)["'`]/g;

const files = walk(SRC);
const links = new Map(); // path -> Set of files

for (const file of files) {
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(HREF_RE)) {
    const path = m[1].split("#")[0].split("?")[0];
    if (!path || path === "/") continue;
    if (!links.has(path)) links.set(path, new Set());
    links.get(path).add(file);
  }
}

async function json(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) return null;
  return res.json().catch(() => null);
}

const [hotels, experiences, posts] = await Promise.all([
  json("/api/hotels"),
  json("/api/experiences"),
  json("/api/blog"),
]);

if (!hotels || !experiences || !posts) {
  console.error(`Could not reach the site APIs at ${BASE}. Start the server first.`);
  process.exit(2);
}

const hotelSlugs = new Set(hotels.map((h) => h.slug));
const expSlugs = new Set(experiences.map((e) => e.slug).filter(Boolean));
const postSlugs = new Set(posts.map((p) => p.slug));

// Static routes declared in App.tsx (path="/…" without params).
const appSrc = readFileSync("client/src/App.tsx", "utf8");
const staticRoutes = new Set(
  [...appSrc.matchAll(/path="(\/[^"]*)"/g)]
    .map((m) => m[1])
    .filter((p) => !p.includes(":")),
);
const paramRoutes = [...appSrc.matchAll(/path="(\/[^"]*:[^"]*)"/g)].map((m) => m[1]);

/** Does a path match a parameterised route like /journal/:slug ? */
function matchesParamRoute(path) {
  return paramRoutes.some((route) => {
    const rx = new RegExp(
      "^" + route.replace(/:[^/]+/g, "[^/]+").replace(/\//g, "\\/") + "$",
    );
    return rx.test(path);
  });
}

const broken = [];
for (const [path, sources] of links) {
  const seg = path.split("/").filter(Boolean);
  let ok = null;

  // Entity paths: validate the slug against its backing API.
  if (seg.length === 3 && seg[1] === "accommodation") ok = hotelSlugs.has(seg[2]);
  else if (seg.length === 3 && seg[1] === "experiences") ok = expSlugs.has(seg[2]);
  else if (seg.length === 2 && seg[0] === "journal") ok = postSlugs.has(seg[1]);
  else ok = staticRoutes.has(path) || matchesParamRoute(path);

  if (!ok) broken.push({ path, sources: [...sources] });
}

console.log(`Checked ${links.size} distinct internal links across ${files.length} files.`);
if (broken.length === 0) {
  console.log("✓ No broken internal links.");
  process.exit(0);
}
console.error(`\n✗ ${broken.length} broken internal link(s):\n`);
for (const b of broken) {
  console.error(`  ${b.path}`);
  for (const s of b.sources) console.error(`      ← ${s}`);
}
process.exit(1);
