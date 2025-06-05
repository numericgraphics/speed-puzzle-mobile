import { DB_NAME } from "@/constants";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";

const expo = SQLite.openDatabaseSync(DB_NAME, {
  libSQLOptions: {
    url: process.env.EXPO_PUBLIC_TURSO_DB_URL!,
    authToken: process.env.EXPO_PUBLIC_TURSO_DB_AUTH_TOKEN!,
  },
});

export const db = drizzle(expo);

// export const db = drizzle({
//   connection: {
//     url: process.env.EXPO_PUBLIC_TURSO_DB_URL!,
//     authToken: process.env.EXPO_PUBLIC_TURSO_DB_AUTH_TOKEN!,
//   },
// });
