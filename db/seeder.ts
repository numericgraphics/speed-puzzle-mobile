// db/seed.ts
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

function makeSeedData(count = 15) {
  return Array.from({ length: count }, (_, i) => ({
    user_name: `user_${i + 1}`,
    password: "password",
    score: (i + 1) * 10,
  }));
}

export async function main(count = 15) {
  await withClient(async (client) => {
    const tx = await client.transaction("write");
    try {
      for (const u of makeSeedData(count)) {
        const res = await tx.execute({
          sql: "INSERT INTO users (user_name, password) VALUES (?, ?)",
          args: [u.user_name, u.password],
        });
        // libSQL returns the last inserted rowid on inserts:
        const userId = Number(res.lastInsertRowid);
        await tx.execute({
          sql: "INSERT INTO scores (value, user_id) VALUES (?, ?)",
          args: [u.score, userId],
        });
      }
      await tx.commit();
      console.log(`✅ Seeded ${count} users with scores.`);
    } catch (err) {
      await tx.rollback();
      console.error("❌ Seed failed, rolled back.", err);
      process.exit(1);
    }
  });
}

if (require.main === module) {
  const n = Number(process.argv[2]) || 15;
  main(n).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
