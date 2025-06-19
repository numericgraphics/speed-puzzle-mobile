import { StatusMessage } from "@/components/message-display";
import { PlaySection } from "@/modules/puzzle/play-section";
import PuzzleClient from "@/modules/puzzle/puzzle-client";
import { ResultSection } from "@/modules/puzzle/result-section";
import { StartPuzzle } from "@/modules/puzzle/start-screen";
import { router, useLocalSearchParams } from "expo-router";
import React, { Suspense } from "react";

function Index({ searchParams }) {
  const playing = useLocalSearchParams().play === "true";
  const finished = useLocalSearchParams().finished === "true";
  console.log("Puzzle Page Search Params:", playing);
  console.log("Puzzle Page Search Params:", searchParams);

  const onStart = () => {
    console.log("Start button pressed");
    router.push("/?play=true");
  };

  const onRestart = () => {
    console.log("Restart button pressed");
    router.push("/?play=true");
  };

  if (playing) {
    return (
      <Suspense fallback={<StatusMessage message="Loading..." />}>
        <PlaySection />
      </Suspense>
    );
  }

  if (finished) {
    return (
      <Suspense fallback={<StatusMessage message="Get result..." />}>
        <ResultSection />
      </Suspense>
    );
  }

  return <StartPuzzle onStart={onStart} />;
}

export default Index;
