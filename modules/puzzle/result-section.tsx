import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getResultScore, getResultSessionData } from "@/actions/result-actions";
import { CompletedPuzzle } from "./complete-screen";
import { StatusMessage } from "@/components/message-display";

interface ResultSectionProps {
  onRestart: () => void;
}

export function ResultSection({ onRestart }: ResultSectionProps) {
  const {
    data: score,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["result-section-data"],
    queryFn: getResultSessionData,
  });

  if (isLoading) {
    return <StatusMessage message="Calculating score…" />;
  }
  if (isError) {
    throw error;
  }

  return (
    <CompletedPuzzle
      onRestart={onRestart}
      score={score.result ?? 0}
      scores={score.topScores}
    />
  );
}

ResultSection.displayName = "ResultSection";
