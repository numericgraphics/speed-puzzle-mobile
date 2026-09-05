import React, { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CompletedPuzzle } from "./complete-screen";
import { StatusMessage } from "@/components/message-display";
import { useScores } from "@/hooks/use-scores";
import { useRegistration } from "@/hooks/use-registration";

interface ResultSectionProps {
  onRestart: () => void;
  onGoHome: () => void;
}

export function ResultSection({ onRestart, onGoHome }: ResultSectionProps) {
  const { getScoresForResultSection } = useScores();
  const { open, user, openScoreConfirm, state, resetScoreRegistration } =
    useRegistration();
  const queryClient = useQueryClient();
  const {
    data: score,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["scores-result-section"],
    queryFn: getScoresForResultSection,
    refetchOnMount: "always",
  });

  console.log(
    "[score-debug] ResultSection render",
    JSON.stringify({ isLoading, isFetching, score })
  );

  useEffect(() => {
    if (state.scoreRegisteredForRun) {
      console.log("[score-debug] ResultSection invalidating for scoreRegisteredForRun");
      queryClient.invalidateQueries({ queryKey: ["scores-result-section"] });
    }
  }, [state.scoreRegisteredForRun, queryClient]);

  if (isLoading) {
    return <StatusMessage message="Calculating score…" />;
  }
  if (isError) {
    // TODO: handle backend errors (e.g. 500) gracefully instead of throwing —
    // let the user see their local result and keep playing even if the
    // score couldn't be fetched/registered.
    throw error;
  }
  const register = () => {
    if (!user) {
      open();
    } else {
      openScoreConfirm();
    }
  };

  return (
    <CompletedPuzzle
      onRestart={() => {
        queryClient.removeQueries({ queryKey: ["scores-result-section"] });
        resetScoreRegistration();
        onRestart();
      }}
      onGoHome={() => {
        queryClient.removeQueries({ queryKey: ["scores-result-section"] });
        resetScoreRegistration();
        onGoHome();
      }}
      score={score.result ?? 0}
      scores={score.topScores || []}
      compareResult={score.compareResult}
      register={register}
      registered={state.scoreRegisteredForRun}
      user={user}
    />
  );
}

ResultSection.displayName = "ResultSection";
