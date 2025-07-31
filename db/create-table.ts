// db/create-tables.ts
import { createClient, type Client } from "@libsql/client";
import { config } from "dotenv";
config({ path: ".env" });

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

async function withClient<T>(fn: (c: Client) => Promise<T>) {
  const client = createClient({
    url: env("EXPO_PUBLIC_TURSO_DB_URL"),
    authToken: env("EXPO_PUBLIC_TURSO_DB_AUTH_TOKEN"),
  });
  try {
    return await fn(client);
  } finally {
    await client.close?.();
  }
}

const DDL = [
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at INTEGER DEFAULT (strftime('%s','now') * 1000),
    updated_at INTEGER DEFAULT (strftime('%s','now') * 1000),
    user_name TEXT NOT NULL,
    password TEXT NOT NULL,
    CONSTRAINT user_user_name_idx UNIQUE (user_name)
  )`,
  `CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at INTEGER DEFAULT (strftime('%s','now') * 1000),
    value INTEGER NOT NULL,
    user_id INTEGER REFERENCES users(id)
  )`,
];

export async function main() {
  await withClient(async (client) => {
    // Atomic DDL: libSQL's batch runs statements inside a transaction.
    await client.batch(
      DDL.map((sql) => ({ sql })),
      "write"
    );
    console.log("✅ Tables created (if not present).");
  });
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
