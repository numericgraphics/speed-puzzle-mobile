import { pgTable, integer, text } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/libsql";
import { seed } from "drizzle-seed";
import { config } from "dotenv";
import * as schema from "./schema";
config({ path: ".env" });

async function main() {
  const db = drizzle({
    connection: {
      url: process.env.EXPO_PUBLIC_TURSO_DB_URL!,
      authToken: process.env.EXPO_PUBLIC_TURSO_DB_AUTH_TOKEN!,
    },
  });

  await seed(db, schema).refine((funcs) => {
    // Build an array [10, 20, 30, ..., 100]
    const tenToHundred = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);

    return {
      // 1) Generate 10 users
      users: {
        count: 10,
        // 2) Each user has exactly one score
        with: {
          scores: 1,
        },
      },

      // 3) Override the `value` column on `scores`:
      //    Use 'valuesFromArray' so that exactly the ten values [10..100] appear once each
      scores: {
        columns: {
          value: funcs.valuesFromArray({
            values: tenToHundred,
            isUnique: true,
          }),
        },
      },
    };
  });

  console.log("✅ Seed completed with incremental scores.");
}

main().catch((err) => {
  console.error("Seed script error:", err);
  process.exit(1);
});

// async function main() {
//   const db = drizzle({
//     connection: {
//       url: process.env.EXPO_PUBLIC_TURSO_DB_URL!,
//       authToken: process.env.EXPO_PUBLIC_TURSO_DB_AUTH_TOKEN!,
//     },
//   });
//   await seed(db, schema).refine((f) => ({
//     users: {
//       count: 10,
//       with: {
//         scores: 1,
//       },
//     },
//   }));
// }
// main();
