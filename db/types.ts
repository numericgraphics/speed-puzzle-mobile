// db/types.ts ─— keep it close to schema.ts
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { users, scores } from "./schema";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Score = InferSelectModel<typeof scores>;
export type NewScore = InferInsertModel<typeof scores>;
