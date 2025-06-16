"use server";

import { buildChallenges, mockSendPromise } from "@/actions/puzzle-actions";
import PuzzleClient from "./puzzle-client";

export async function PlaySection() {
  const challenges = await mockSendPromise(); // heavy work
  console.log("PlaySection challenges:", challenges);
  return null;
  //   return <PuzzleClient challenges={challenges} />;
}
