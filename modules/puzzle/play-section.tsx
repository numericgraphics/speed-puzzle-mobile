"use client";

import { buildChallenges } from "@/actions/puzzle-actions";
import { Text } from "react-native";
import PuzzleClient from "./puzzle-client";
import { use, useEffect, useMemo, useRef } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { GameChallengeType, useGameStore } from "@/stores/game";

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

  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current && challenges?.length) {
      useGameStore.setState((state) => ({
        ...state,
        challenges: challenges as GameChallengeType[],
      }));
      hydrated.current = true;
    }
  }, [challenges]);

  return <PuzzleClient challenges={challenges} />;
}

PlaySection.displayName = "PlaySection";
