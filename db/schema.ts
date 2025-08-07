import { pgTable, serial, bigint, text, integer } from "drizzle-orm/pg-core";
// ---------- Drizzle ORM table definitions ----------

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
  updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
  userName: text("user_name").notNull(),
  password: text("password").notNull(),
});

// Scores table
export const scores = pgTable("scores", {
  id: serial("id").primaryKey(),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
  value: integer("value").notNull(),
  userId: integer("user_id").references(() => users.id),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertScore = typeof scores.$inferInsert;
export type SelectScore = typeof scores.$inferSelect;
