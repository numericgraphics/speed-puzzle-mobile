import { useQuery } from "@tanstack/react-query";

import PuzzleClient from "./puzzle-client";
import { StatusMessage } from "@/components/message-display";
import { buildChallenges } from "@/helpers/challenges";

export function PlaySection() {
  const {
    data: challenges,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["challenges"],
    queryFn: buildChallenges,
  });

  if (isLoading) {
    return <StatusMessage message="Loading..." />;
  }
  if (isError) {
    throw error;
  }

  return <PuzzleClient challenges={challenges} />;
}

PlaySection.displayName = "PlaySection";
