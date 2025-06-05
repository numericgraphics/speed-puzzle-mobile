import { db } from "../index";
import { InsertScore, InsertUser, scores, users } from "../schema";

export async function createUser(data: InsertUser) {
  await db.insert(users).values(data);
}

export async function createPost(data: InsertScore) {
  await db.insert(scores).values(data);
}
