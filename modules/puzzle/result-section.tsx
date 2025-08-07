import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getResultScore } from "@/actions/result-actions";
import { useSelectQueries } from "@/hooks/useSelectQueries";
import { CompletedPuzzle } from "./complete-screen";
import { StatusMessage } from "@/components/message-display";
import { useScoresHelpers } from "@/hooks/useScoresHelpers";

interface ResultSectionProps {
  onRestart: () => void;
}

export function ResultSection({ onRestart }: ResultSectionProps) {
  const { getTopScores, getAllScores } = useSelectQueries();
  const { isScoreInTop10 } = useScoresHelpers();
  const {
    data: score,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["result-section-data"],
    queryFn: async () => {
      const [result, topScores, allScores] = await Promise.all([
        getResultScore(),
        getTopScores(),
        getAllScores(),
      ]);
      return { result, topScores, allScores } as const;
    },
  });

  useEffect(() => {
    async function checkIfScoreInTop10() {
      const scoreIsPrintable = await isScoreInTop10(score.result);
      console.log("isScoreInTop10", scoreIsPrintable);
    }

    if (score?.result) {
      checkIfScoreInTop10();
    }
  }, [score]);

  useEffect(() => {
    console.log("All scores fetched:", score?.allScores);
  }, [score?.allScores]);

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
      scores={score.topScores.reverse() || []}
    />
  );
}

ResultSection.displayName = "ResultSection";
