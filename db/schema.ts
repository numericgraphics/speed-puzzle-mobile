// db/schema.ts
// Plain TypeScript types — keep these in sync with the SQL below.

export type User = {
  id: number;
  createdAt: number; // ms since epoch
  updatedAt: number; // ms since epoch
  userName: string;
  password: string;
};

export type InsertUser = {
  userName: string;
  password: string;
};

export type Score = {
  id: number;
  createdAt: number; // ms since epoch
  value: number;
  userId: number | null;
};

export type InsertScore = {
  value: number;
  userId?: number | null;
};
