import { StatusMessage } from "@/components/message-display";
import { PlaySection } from "@/modules/puzzle/play-section";
import PuzzleClient from "@/modules/puzzle/puzzle-client";
import { StartPuzzle } from "@/modules/puzzle/start-screen";
import { router, useLocalSearchParams } from "expo-router";
import React, { Suspense, use } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function Index({ searchParams }) {
  const playing = useLocalSearchParams().play === "true";
  console.log("Puzzle Page Search Params:", playing);
  console.log("Puzzle Page Search Params:", searchParams);
  const onStart = () => {
    console.log("Start button pressed");
    router.push("/?play=true");
  };

  if (playing) {
    return (
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<StatusMessage message="Loading..." />}>
          <PlaySection />
        </Suspense>
      </QueryClientProvider>
    );
  }

  return <StartPuzzle onStart={onStart} />;
}

export default Index;
