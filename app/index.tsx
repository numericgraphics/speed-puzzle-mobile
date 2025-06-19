import { StatusMessage } from "@/components/message-display";
import { useTheme } from "@/hooks/useTheme";
import { PlaySection } from "@/modules/puzzle/play-section";
import { ResultSection } from "@/modules/puzzle/result-section";
import { StartSession } from "@/modules/puzzle/start-section";
import { useGameStoreActions } from "@/stores/game";
import { router, useLocalSearchParams } from "expo-router";
import React, { Suspense } from "react";
import { SafeAreaView } from "react-native";

function Index({ searchParams }) {
  const playing = useLocalSearchParams().play === "true";
  const finished = useLocalSearchParams().finished === "true";
  const { restartGame } = useGameStoreActions();
  const { styles } = useTheme();
  const { containers } = styles;
  console.log("Puzzle Page Search Params:", playing);
  console.log("Puzzle Page Search Params:", searchParams);

  const onStart = () => {
    console.log("Start button pressed");
    router.push("/?play=true");
  };

  const onRestart = () => {
    restartGame();
    router.push("/?play=true");
  };

  return (
    <SafeAreaView style={[containers.main, containers.centeredFullScreen]}>
      {playing ? (
        <Suspense fallback={<StatusMessage message="Loading..." />}>
          <PlaySection />
        </Suspense>
      ) : finished ? (
        <Suspense fallback={<StatusMessage message="Get result..." />}>
          <ResultSection onRestart={onRestart} />
        </Suspense>
      ) : (
        <StartSession onStart={onStart} />
      )}
    </SafeAreaView>
  );
}

export default Index;
