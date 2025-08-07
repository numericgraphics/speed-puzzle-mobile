// scripts/seed.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { seed } from "drizzle-seed";
import { faker } from "@faker-js/faker";

import { users, scores } from "./schema";

const url = ""; // Replace with your database URL, e.g., from .env

async function main() {
  // 1️⃣  connect through Supavisor (port 6543) — good for serverless jobs
  const client = postgres(url, { prepare: false });
  const db = drizzle(client);

  // 2️⃣  make the run reproducible (same seed → same rows)
  faker.seed(42);

  // 3️⃣  Generate 15 users and 1 score per user
  await seed(db, { users, scores }).refine((f) => ({
    users: {
      count: 15,
      with: { scores: 1 }, // one-to-many relation ✔︎  [oai_citation:0‡orm.drizzle.team](https://orm.drizzle.team/docs/guides/seeding-using-with-option?utm_source=chatgpt.com)
      columns: {
        createdAt: f.int({
          // generator helpers ✔︎  [oai_citation:1‡orm.drizzle.team](https://orm.drizzle.team/docs/seed-functions?utm_source=chatgpt.com)
          minValue: 1_600_000_000_000, // Sep 2020
          maxValue: 1_700_000_000_000, // Nov 2023
        }),
        updatedAt: f.int({
          minValue: 1_600_000_000_000,
          maxValue: 1_700_000_000_000,
        }),
        userName: f.string({}),
        password: f.string({}),
      },
    },
    scores: {
      columns: {
        createdAt: f.int({
          minValue: 1_600_000_000_000,
          maxValue: 1_700_000_000_000,
        }),
        value: f.int({ minValue: 0, maxValue: 1000 }),
      },
    },
  }));

  await client.end(); // optional tidy-up
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
