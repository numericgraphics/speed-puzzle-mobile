import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getResultScore } from "@/actions/result-actions";
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
    queryKey: ["final-score"],
    queryFn: getResultScore,
  });

  if (isLoading) {
    return <StatusMessage message="Calculating score…" />;
  }
  if (isError) {
    throw error;
  }

  return <CompletedPuzzle onRestart={onRestart} score={score ?? 0} />;
}

ResultSection.displayName = "ResultSection";
