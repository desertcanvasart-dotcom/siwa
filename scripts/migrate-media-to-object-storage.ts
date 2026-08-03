/**
 * One-time migration: move every base64 blob in uploaded_images out of
 * Postgres into the S3-compatible bucket, then clear the blob column.
 *
 * Requires DATABASE_URL and all OBJECT_STORAGE_* env vars (see
 * .env.example). Safe to re-run — rows already migrated (data IS NULL)
 * are skipped, and the row is only updated after a successful upload.
 *
 *   npm run migrate:media
 */
import "dotenv/config";
import path from "path";
import { db } from "../server/db";
import { uploadedImages } from "../shared/schema";
import { eq, isNotNull } from "drizzle-orm";
import { objectStorageEnabled, putObject, mediaKey } from "../server/object-storage";

async function main() {
  if (!db) {
    console.error("DATABASE_URL is not set — nothing to migrate.");
    process.exit(1);
  }
  if (!objectStorageEnabled()) {
    console.error(
      "Object storage is not configured. Set OBJECT_STORAGE_ENDPOINT, " +
        "OBJECT_STORAGE_BUCKET, OBJECT_STORAGE_ACCESS_KEY_ID, " +
        "OBJECT_STORAGE_SECRET_ACCESS_KEY and OBJECT_STORAGE_PUBLIC_URL.",
    );
    process.exit(1);
  }

  const rows = await db
    .select({ id: uploadedImages.id })
    .from(uploadedImages)
    .where(isNotNull(uploadedImages.data));
  console.log(`${rows.length} media row(s) to migrate.`);

  let moved = 0;
  let bytes = 0;
  for (const { id } of rows) {
    // One row at a time — blobs can be large, don't hold them all.
    const [row] = await db.select().from(uploadedImages).where(eq(uploadedImages.id, id));
    if (!row || !row.data) continue;
    try {
      const buffer = Buffer.from(row.data, "base64");
      const ext =
        path.extname(row.filename || "").toLowerCase() ||
        ((row.mimeType || "").startsWith("image/") ? ".jpg" : ".bin");
      const url = await putObject(mediaKey(row.filename || `media-${id}`, ext), buffer, row.mimeType);
      await db
        .update(uploadedImages)
        .set({ path: url, data: null })
        .where(eq(uploadedImages.id, id));
      moved += 1;
      bytes += buffer.length;
      console.log(`  #${id} → ${url} (${(buffer.length / 1e6).toFixed(2)} MB)`);
    } catch (err) {
      console.error(`  #${id} FAILED (row left untouched):`, err);
    }
  }

  console.log(
    `Done: ${moved}/${rows.length} moved, ${(bytes / 1e6).toFixed(1)} MB freed from Postgres.`,
  );
  console.log(
    "Old /media/:id URLs keep working — they now 301-redirect to the bucket.",
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
