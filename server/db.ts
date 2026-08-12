import pkg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const { Pool } = pkg;

// DATABASE_PUBLIC_URL (Railway's external connection string) takes
// precedence; falls back to DATABASE_URL (Railway's internal/private
// networking string) so deploys that only set the latter still work.
const connectionString = process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL;
const hasDatabase = !!connectionString;

export const pool = hasDatabase
  ? new Pool({ connectionString })
  : null;
export const db = pool ? drizzle(pool, { schema }) : null;
