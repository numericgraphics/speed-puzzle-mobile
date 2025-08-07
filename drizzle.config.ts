import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./supabase/migrations",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL!,
  },
});
