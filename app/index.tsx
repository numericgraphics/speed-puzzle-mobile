"use client";

import { StatusMessage } from "@/components/message-display";
import { PlaySection } from "@/modules/puzzle/play-section";
import PuzzleClient from "@/modules/puzzle/puzzle-client";
import { StartPuzzle } from "@/modules/puzzle/start-screen";
import { buildChallenges } from "@/actions/puzzle-actions";
import { router, useLocalSearchParams } from "expo-router";
import React, { Suspense, use } from "react";
import { View, Text, StyleSheet } from "react-native";

// function Page({ searchParams }: PageProps) {
function Page({ searchParams }) {
  const playing = useLocalSearchParams().play === "true";
  console.log("Puzzle Page Search Params:", playing);
  console.log("Puzzle Page Search Params:", searchParams);
  const onStart = () => {
    console.log("Start button pressed");
    router.push("/?play=true");
  };

  if (playing) {
    return (
      <Suspense fallback={<StatusMessage message="Loading..." />}>
        <PlaySection />
      </Suspense>
    );
  }

  return <StartPuzzle onStart={onStart} />;
}

export default Page;
