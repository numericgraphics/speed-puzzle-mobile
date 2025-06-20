import FilledRectangleLogo from "@/components/logo/filled-rectangles";
import AnimatedFilledRectangleLogo, {
  AnimatedLogoHandle,
} from "@/components/logo/transition-rectangles";
import { StatusMessage } from "@/components/message-display";
import { useTheme } from "@/hooks/useTheme";
import { PlaySection } from "@/modules/puzzle/play-section";
import { ResultSection } from "@/modules/puzzle/result-section";
import { StartSession } from "@/modules/puzzle/start-section";
import { useGameStoreActions } from "@/stores/game";
import { router, useLocalSearchParams } from "expo-router";
import React, { Suspense, useRef } from "react";
import { SafeAreaView } from "react-native";
import { runOnJS } from "react-native-reanimated";

function Index({ searchParams }) {
  const playing = useLocalSearchParams().play === "true";
  const finished = useLocalSearchParams().finished === "true";
  const { restartGame } = useGameStoreActions();
  const { styles, theme, isDark } = useTheme();
  const { containers } = styles;
  const animatedLogoRef = useRef<AnimatedLogoHandle>(null);

  console.log("Puzzle Page Search Params:", playing);
  console.log("Puzzle Page Search Params:", searchParams);

  const onStart = () => {
    console.log("Start button pressed");
    animatedLogoRef.current?.start();
  };

  const onStartWorklet = () => {
    "worklet";
    console.log("onStartWorklet");
    runOnJS(router.push)("/?play=true");
  };

  const onRestart = () => {
    restartGame();
    router.push("/?play=true");
  };

  return (
    <SafeAreaView style={[containers.main, containers.centeredFullScreen]}>
      <AnimatedFilledRectangleLogo
        ref={animatedLogoRef}
        width={300}
        height={300}
        color={isDark ? theme.color.white : theme.color.black}
        callback={onStartWorklet}
      />
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
