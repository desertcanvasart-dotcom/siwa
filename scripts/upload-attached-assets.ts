/**
 * Mirror the attached_assets folder into the bucket under the
 * attached_assets/ prefix, preserving filenames so every existing
 * "/attached_assets/<file>" reference maps 1:1 to
 * "<OBJECT_STORAGE_PUBLIC_URL>/attached_assets/<file>".
 *
 * After running this, set ATTACHED_ASSETS_FROM_BUCKET=true on the
 * server and /attached_assets/* requests redirect to the bucket
 * instead of being served from the deployed filesystem.
 *
 * Requires the OBJECT_STORAGE_* env vars. Safe to re-run (uploads are
 * idempotent overwrites of identical content).
 *
 *   npm run migrate:assets
 */
import "dotenv/config";
import fs from "fs";
import path from "path";
import { objectStorageEnabled, putObject } from "../server/object-storage";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".heic": "image/heic",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

async function main() {
  if (!objectStorageEnabled()) {
    console.error("Object storage is not configured — see .env.example.");
    process.exit(1);
  }
  const dir = path.resolve(process.cwd(), "attached_assets");
  const files = fs
    .readdirSync(dir)
    .filter((f) => fs.statSync(path.join(dir, f)).isFile());
  console.log(`${files.length} file(s) to upload from attached_assets/.`);

  let done = 0;
  let bytes = 0;
  for (const file of files) {
    const buffer = fs.readFileSync(path.join(dir, file));
    const mime = MIME[path.extname(file).toLowerCase()] || "application/octet-stream";
    try {
      const url = await putObject(`attached_assets/${file}`, buffer, mime);
      done += 1;
      bytes += buffer.length;
      if (done % 25 === 0 || done === files.length) {
        console.log(`  ${done}/${files.length} uploaded… (last: ${url})`);
      }
    } catch (err) {
      console.error(`  ${file} FAILED:`, err);
    }
  }
  console.log(`Done: ${done}/${files.length} files, ${(bytes / 1e6).toFixed(1)} MB.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
