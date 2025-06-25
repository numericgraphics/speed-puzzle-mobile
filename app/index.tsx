import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { PlaySection } from "@/modules/puzzle/play-section";
import { ResultSection } from "@/modules/puzzle/result-section";
import { StartSession } from "@/modules/puzzle/start-section";
import { useGameStoreActions } from "@/stores/game";

function Index() {
  const playing = useLocalSearchParams().play === "true";
  const finished = useLocalSearchParams().finished === "true";
  const { restartGame } = useGameStoreActions();
  const { styles } = useTheme();
  const { containers } = styles;

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
        <PlaySection />
      ) : finished ? (
        <ResultSection onRestart={onRestart} />
      ) : (
        <StartSession onStart={onStart} />
      )}
    </SafeAreaView>
  );
}

export default Index;
