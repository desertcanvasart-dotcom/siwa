#!/usr/bin/env node
/**
 * Fails if any email address other than the one Soléi mailbox appears in
 * the source. Owner decision (Nov 2026): hello@darsolei.com is the only
 * address used anywhere. Runs automatically before `npm run build`.
 *
 * Allowed: hello@darsolei.com, and form placeholders on example.com.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ALLOWED = new Set(["hello@darsolei.com"]);
const ALLOWED_DOMAINS = ["example.com"];
const ROOTS = ["client/src", "server", "shared", "client/index.html", ".env.example"];
const EXTS = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".html", ".md", ".css", ""]);
const EMAIL_RE =
  /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.(?!(?:png|jpe?g|webp|gif|svg|avif|mp4|webm)\b)[A-Za-z]{2,}\b/g;

function* walk(p) {
  let st;
  try { st = statSync(p); } catch { return; }
  if (st.isDirectory()) {
    for (const f of readdirSync(p)) if (f !== "node_modules") yield* walk(join(p, f));
  } else if (EXTS.has(extname(p)) || p.endsWith(".env.example")) {
    yield p;
  }
}

const problems = [];
for (const root of ROOTS) {
  for (const file of walk(root)) {
    readFileSync(file, "utf8").split("\n").forEach((line, i) => {
      for (const m of line.matchAll(EMAIL_RE)) {
        const addr = m[0].toLowerCase();
        if (ALLOWED.has(addr) || ALLOWED_DOMAINS.some((d) => addr.endsWith("@" + d))) continue;
        problems.push(`${file}:${i + 1}  ${m[0]}`);
      }
    });
  }
}

if (problems.length) {
  console.error("✖ Email check failed — only hello@darsolei.com may be used (shared/contact.ts):");
  for (const p of problems) console.error("  " + p);
  process.exit(1);
}
console.log("✓ Email check: only hello@darsolei.com in use");
