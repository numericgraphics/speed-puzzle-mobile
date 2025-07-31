// providers/UserProvider.tsx
import React, { createContext, useContext, ReactNode, useEffect } from "react";

// import {
//   getAllUsers,
//   getUserByName,
//   getAllScores,
//   getScoresByUserId,
//   getTopScores as fetchTopScores,
// } from "@/db/queries/select";
// import { createUser as dbCreateUser, createScore } from "@/db/queries/inserts";
import { useDatabase } from "@/providers/data-base";
import { useInsertQueries } from "@/hooks/useInsertQueries";
import { useSelectQueries } from "@/hooks/useSelectQueries";
import { useSQLiteContext } from "expo-sqlite";

type UserContextValue = {
  getUsers: () => Promise<any[]>;
  createUser: (params: { userName: string; password: string }) => Promise<void>;
  addScoreForUser: (userName: string, value: number) => Promise<void>;
  getScoresByUserName: (userName: string) => Promise<number | null>;
  getTopScores: () => Promise<any[]>;
  getAllData: () => Promise<{ users: any[]; scores: any[] }>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { createUser: dbCreateUser, createScore } = useInsertQueries();
  const {
    getAllUsers,
    getUserByName,
    getAllScores,
    getScoresByUserId,
    getTopScores: fetchTopScores,
  } = useSelectQueries();
  const db = useSQLiteContext();
  useEffect(() => {
    console.log("dbReady --> getAllData ");
    if (db) {
      getAllData();
    }
  }, [db]);
  // Fetch all users
  const getUsers = async (): Promise<any[]> => {
    const users = await getAllUsers();
    // console.log("fetchAllUsers : ", users);
    return users;
  };

  // Create a new user
  const createUser = async ({
    userName,
    password,
  }: {
    userName: string;
    password: string;
  }): Promise<void> => {
    await dbCreateUser({ userName, password });
  };

  // Add a score for a specific user by username
  const addScoreForUser = async (
    userName: string,
    value: number
  ): Promise<void> => {
    const users = await getUserByName(userName);
    const user = users[0];
    if (!user) {
      throw new Error("User not found");
    }
    await createScore({ userId: user.id, value });
  };

  // Get the latest score for a user by username
  const getScoresByUserName = async (
    userName: string
  ): Promise<number | null> => {
    const users = await getUserByName(userName);
    const user = users[0];
    if (!user) {
      throw new Error("User not found");
    }
    const scores = await getScoresByUserId(user.id);
    return scores.length > 0 ? scores[0].value : null;
  };

  // Fetch top scores
  const getTopScores = async (): Promise<any[]> => {
    const scores = await fetchTopScores();
    console.log("getTopScores : ", scores);
    return scores;
  };

  // Combined fetch of all users and all scores
  const getAllData = async (): Promise<{ users: any[]; scores: any[] }> => {
    const users = await getUsers();
    const scores = await getAllScores();
    return { users, scores };
  };

  const value: UserContextValue = {
    getUsers,
    createUser,
    addScoreForUser,
    getScoresByUserName,
    getTopScores,
    getAllData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
