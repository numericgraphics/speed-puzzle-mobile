"use client";

import { buildChallenges } from "@/actions/puzzle-actions";
import PuzzleClient from "./puzzle-client";
import { useSuspenseQuery } from "@tanstack/react-query";

export function PlaySection() {
  const {
    data: challenges,
    isFetching,
    error,
  } = useSuspenseQuery({
    queryKey: ["challenges"],
    queryFn: buildChallenges,
  });

  if (error && !isFetching) {
    throw error;
  }

  return <PuzzleClient challenges={challenges} />;
}

PlaySection.displayName = "PlaySection";
