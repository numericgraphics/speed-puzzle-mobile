import {
  sqliteTable,
  integer,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

/* ---------- User table ----------

export const users = sqliteTable("users", {
    id: int(),
}, (t) => ({
    idx: index('custom_name').on(t.id)
}));
New API:

export const users = sqliteTable("users", {
    id: int(),
}, (t) => [
    index('custom_name').on(t.id)
]);


*/
// src/db/schema.ts

/* ---------- User table ---------- */
export const users = sqliteTable(
  "user",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    createdAt: integer("created_at", { mode: "timestamp_ms" }).default(
      // ms-since-epoch
      sql`(strftime('%s','now') * 1000)`
    ),

    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).default(
      sql`(strftime('%s','now') * 1000)`
    ),

    userName: text("user_name").notNull(),
    password: text("password").notNull(),
  },
  /* NEW API: return an array, not an object  */
  (t) => [uniqueIndex("user_user_name_idx").on(t.userName)]
);

/* ---------- Score table ---------- */
export const scores = sqliteTable(
  "score",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    createdAt: integer("created_at", { mode: "timestamp_ms" }).default(
      sql`(strftime('%s','now') * 1000)`
    ),

    value: text("value").notNull(),

    userId: integer("user_id").references(() => users.id),
  },
  /* empty array keeps the compiler happy with v0.38+ */
  () => []
);

/* ---------- Relation helpers ---------- */
export const usersRelations = relations(users, ({ many }) => ({
  scores: many(scores),
}));

export const scoresRelations = relations(scores, ({ one }) => ({
  user: one(users, {
    fields: [scores.userId],
    references: [users.id],
  }),
}));

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertScore = typeof scores.$inferInsert;
export type SelectScore = typeof scores.$inferSelect;
