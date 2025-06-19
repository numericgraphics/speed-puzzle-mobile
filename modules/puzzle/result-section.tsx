"use client";

import { router } from "expo-router";
import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getResultScore } from "@/actions/result-actions";
import { CompletedPuzzle } from "./complete-screen";
import { StatusMessage } from "@/components/message-display";
import { useGameStoreActions } from "@/stores/game";

interface ResultSectionProps {
  onRestart: () => void;
}

export function ResultSection({ onRestart }: ResultSectionProps) {
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

  return isFetching ? (
    <StatusMessage message="Calculating score…" />
  ) : (
    <CompletedPuzzle onRestart={onRestart} score={score ?? 0} />
  );
}

ResultSection.displayName = "ResultSection";
