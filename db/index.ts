import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.EXPO_PUBLIC_SUPABASE_URL!, {
  prepare: false,
});
export const db = drizzle({ client });