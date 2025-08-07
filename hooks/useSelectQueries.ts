import {
  getUserByName,
  getAllUsers,
  getAllScores,
  getScoresByUserId,
  getTopScores,
} from "@/db/queries/select";
import { User } from "@/db/types";

export function useSelectQueries() {
  return {
    getAllUsers: async () => getAllUsers() as Promise<User[]>,
    getAllScores,
    getScoresByUserId,
    getTopScores,
  };
}
