// import { drizzle } from "drizzle-orm/expo-sqlite";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { seed } from "drizzle-seed";
// import * as SQLite from "expo-sqlite";
// import { SQLiteDatabase } from "expo-sqlite";
import { config } from "dotenv";
import * as schema from "./schema";
config({ path: ".env" });

/*
async function main() {
  // const expo = SQLite.openDatabaseSync("my-db", {
  //   libSQLOptions: {
  //     url: process.env.EXPO_PUBLIC_TURSO_DB_URL!,
  //     authToken: process.env.EXPO_PUBLIC_TURSO_DB_AUTH_TOKEN!,
  //   },
  // });
  const client = createClient({
    url: process.env.EXPO_PUBLIC_TURSO_DB_URL!,
    authToken: process.env.EXPO_PUBLIC_TURSO_DB_AUTH_TOKEN!,
  });
  const db = drizzle(client);
  //   },
  // });

  await seed(db, schema).refine((funcs) => {
    // Build an array [10, 20, 30, ..., 100]
    const tenToHundred = Array.from({ length: 15 }, (_, i) => (i + 1) * 10);

    return {
      // 1) Generate 10 users
      users: {
        count: 15,
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
  // Close the underlying HTTP/WS connection once seeding is done
  await client.close?.();
}

*/

async function main() {
  const client = createClient({
    url: process.env.EXPO_PUBLIC_TURSO_DB_URL!,
    authToken: process.env.EXPO_PUBLIC_TURSO_DB_AUTH_TOKEN!,
  });

  // Open an interactive write‑transaction
  await client.transaction("write");
  const db = drizzle(client);

  await seed(db, schema).refine((fns) => {
    const values = Array.from({ length: 15 }, (_, i) => (i + 1) * 10);
    return {
      users: {
        count: 15,
        with: { scores: 1 },
      },
      scores: {
        columns: {
          value: fns.valuesFromArray({ values }),
        },
      },
    };
  });

  await client.close();
  console.log("✅ Done seeding without locks.");
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
