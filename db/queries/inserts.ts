import { db } from "../index";
import { InsertScore, InsertUser, scores, users } from "../schema";

export async function createUser(data: InsertUser) {
  console.log("Creating user", data);
  await db.insert(users).values(data);
  console.log("Creating user done");
}

export async function createScore(data: InsertScore) {
  console.log("Creating score", data);
  await db.insert(scores).values(data);
  console.log("Creating score done");
}
