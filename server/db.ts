import pkg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const { Pool } = pkg;

const hasDatabase = !!process.env.DATABASE_URL;

export const pool = hasDatabase
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;
export const db = pool ? drizzle(pool, { schema }) : null;
