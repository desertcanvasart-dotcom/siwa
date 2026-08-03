/**
 * server/object-storage.ts
 *
 * S3-compatible object storage for uploaded media (Cloudflare R2,
 * AWS S3, Backblaze B2, MinIO — anything speaking the S3 API).
 *
 * Env vars (all five required to enable):
 *   OBJECT_STORAGE_ENDPOINT           e.g. https://<account>.r2.cloudflarestorage.com
 *   OBJECT_STORAGE_BUCKET             bucket name, e.g. solei-media
 *   OBJECT_STORAGE_ACCESS_KEY_ID      from the provider's API token page
 *   OBJECT_STORAGE_SECRET_ACCESS_KEY  from the provider's API token page
 *   OBJECT_STORAGE_PUBLIC_URL         public base URL of the bucket,
 *                                     e.g. https://pub-xxxx.r2.dev or a
 *                                     custom domain — no trailing slash
 *   OBJECT_STORAGE_REGION             optional, defaults to "auto" (R2)
 *
 * When unconfigured, callers fall back to the legacy behavior
 * (media bytes stored base64 in Postgres, served from /media/:id) so
 * nothing breaks on an environment without credentials.
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import path from "path";

const endpoint = process.env.OBJECT_STORAGE_ENDPOINT;
const bucket = process.env.OBJECT_STORAGE_BUCKET;
const accessKeyId = process.env.OBJECT_STORAGE_ACCESS_KEY_ID;
const secretAccessKey = process.env.OBJECT_STORAGE_SECRET_ACCESS_KEY;
const publicBaseUrl = (process.env.OBJECT_STORAGE_PUBLIC_URL || "").replace(/\/+$/, "");

export function objectStorageEnabled(): boolean {
  return !!(endpoint && bucket && accessKeyId && secretAccessKey && publicBaseUrl);
}

let client: S3Client | null = null;
function getClient(): S3Client {
  if (!client) {
    client = new S3Client({
      region: process.env.OBJECT_STORAGE_REGION || "auto",
      endpoint,
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
      },
      // Path-style URLs work everywhere (R2, MinIO, s3-compatible mocks);
      // virtual-hosted style doesn't.
      forcePathStyle: true,
    });
  }
  return client;
}

/** Build a collision-proof object key that keeps a readable filename. */
export function mediaKey(originalName: string, ext: string): string {
  const base = path
    .basename(originalName, path.extname(originalName))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "file";
  const suffix = crypto.randomBytes(4).toString("hex");
  return `media/${Date.now()}-${suffix}-${base}${ext}`;
}

/** Upload a buffer; returns the public URL it will be served from. */
export async function putObject(key: string, body: Buffer, contentType: string): Promise<string> {
  await getClient().send(
    new PutObjectCommand({
      Bucket: bucket!,
      Key: key,
      Body: body,
      ContentType: contentType,
      // Media URLs are immutable (keys are unique per upload), so
      // downstream caches can hold them forever.
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return `${publicBaseUrl}/${key}`;
}

/**
 * Best-effort delete of an object by its public URL. No-op for URLs
 * outside our bucket (legacy /media/:id or /uploads paths).
 */
export async function deleteObjectByUrl(url: string): Promise<void> {
  if (!objectStorageEnabled() || !url.startsWith(`${publicBaseUrl}/`)) return;
  const key = url.slice(publicBaseUrl.length + 1);
  if (!key) return;
  try {
    await getClient().send(new DeleteObjectCommand({ Bucket: bucket!, Key: key }));
  } catch (err) {
    console.warn("Object storage delete failed (continuing):", err);
  }
}
