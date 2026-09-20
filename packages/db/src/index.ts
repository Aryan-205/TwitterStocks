import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import type { DB } from "./types.js";

let pool: Pool | null = null;
let db: Kysely<DB> | null = null;

export function getPool(): Pool {
  if (!pool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL not set");
    pool = new Pool({ connectionString: url, max: Number(process.env.DATABASE_POOL_MAX ?? 10) });
  }
  return pool;
}
export function getDb(): Kysely<DB> {
  if (!db) db = new Kysely<DB>({ dialect: new PostgresDialect({ pool: getPool() }) });
  return db;
}
