import {
  asc,
  desc,
  eq,
  count,
  between,
  getTableColumns,
  sql,
} from "drizzle-orm";

import { db } from "../index";
import { users, scores } from "../schema";

/** Find one or more users by their userName. */
export async function getUserByName(name: string) {
  return db.select().from(users).where(eq(users.userName, name));
}

/** Return every user, ordered by ID. */
export async function getAllUsers() {
  return db.select().from(users).orderBy(asc(users.id));
}

/** Return every score, newest first. */
export async function getAllScores() {
  return db.select().from(scores).orderBy(desc(scores.createdAt));
}

/** All scores belonging to a given user. */
export async function getScoresByUserId(userId: number) {
  return db.select().from(scores).where(eq(scores.userId, userId));
}

/** Top N scores with the user who earned them (default 5). */
export async function getTopScores(limit = 5) {
  return db
    .select({
      name: users.userName,
      score: scores.value,
    })
    .from(scores)
    .innerJoin(users, eq(scores.userId, users.id))
    .orderBy(desc(scores.value))
    .limit(limit);
}

/** Scores created in the last 24 hours. */
export async function getScoresFromLast24Hours() {
  return db
    .select({
      id: scores.id,
      value: scores.value,
    })
    .from(scores)
    .where(between(scores.createdAt, sql`now() - interval '1 day'`, sql`now()`))
    .orderBy(desc(scores.value));
}

/** Users plus an aggregate count of their scores. */
export async function getUsersWithScoresCount() {
  return db
    .select({
      ...getTableColumns(users),
      scoresCount: count(scores.id),
    })
    .from(users)
    .leftJoin(scores, eq(users.id, scores.userId))
    .groupBy(users.id)
    .orderBy(asc(users.id));
}
