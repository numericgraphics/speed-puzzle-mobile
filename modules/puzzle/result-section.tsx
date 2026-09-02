import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CompletedPuzzle } from "./complete-screen";
import { StatusMessage } from "@/components/message-display";
import { useScores } from "@/hooks/use-scores";
import { useRegistration } from "@/hooks/use-registration";

interface ResultSectionProps {
  onRestart: () => void;
}

export function ResultSection({ onRestart }: ResultSectionProps) {
  const { getScoresForResultSection } = useScores();
  const { open, user, submitScoreWithoutModal } = useRegistration();
  const queryClient = useQueryClient();
  const {
    data: score,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["scores-result-section"],
    queryFn: getScoresForResultSection,
    refetchOnMount: "always",
  });

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
    console.log("register user", user);
    if (!user) {
      open();
    } else {
      submitScoreWithoutModal();
    }
  };

  return (
    <CompletedPuzzle
      onRestart={() => {
        queryClient.removeQueries({ queryKey: ["scores-result-section"] });
        onRestart();
      }}
      score={score.result ?? 0}
      scores={score.topScores || []}
      compareResult={score.compareResult}
      register={register}
      user={user}
    />
  );
}

ResultSection.displayName = "ResultSection";
