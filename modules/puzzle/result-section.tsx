"use client";

import { router } from "expo-router";
import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getResultScore } from "@/actions/result-actions";
import { CompletedPuzzle } from "./complete-screen";
import { StatusMessage } from "@/components/message-display";
import { useGameStoreActions } from "@/stores/game";

/**
 * Suspense-ready section that fetches the final score
 * then renders the <CompletedPuzzle /> screen.
 */
export function ResultSection() {
  // Fetch score using React-Query to stay consistent with PlaySection
  const {
    data: score,
    isFetching,
    error,
  } = useSuspenseQuery({
    queryKey: ["final-score"],
    queryFn: getResultScore,
  });

  if (error && !isFetching) {
    throw error;
  }

  const { restartGame } = useGameStoreActions();

  const onRestart = () => {
    restartGame(); // reset all stores
    router.push("/?play=true");
  };

  return isFetching ? (
    <StatusMessage message="Calculating score…" />
  ) : (
    <CompletedPuzzle onRestart={onRestart} score={score ?? 0} />
  );
}

ResultSection.displayName = "ResultSection";
