import { drizzle } from "drizzle-orm/libsql";

export const db = drizzle({
  connection: {
    url: process.env.EXPO_PUBLIC_TURSO_DB_URL!,
    authToken: process.env.EXPO_PUBLIC_TURSO_DB_AUTH_TOKEN!,
  },
});
