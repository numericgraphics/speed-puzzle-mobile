import React from "react";
import { SafeAreaView } from "react-native";
import { useTheme } from "@/hooks/useTheme";

import PuzzleContainer from "@/modules/puzzle/puzzle-container";
import RectangleLogo from "@/components/logo/rectangles";
//import TimeDisplay from "@/components/timer-display";
import { PuzzleLegend } from "@/components/image-legend";

import { usePuzzle } from "@/hooks/use-puzzle";

function PuzzleClient({ challenges }) {
  const { theme, styles, isDark } = useTheme();
  const { containers } = styles;
  const { image, pieces } = usePuzzle(challenges);

  return (
    <SafeAreaView style={containers.centeredFullScreen}>
      <RectangleLogo
        width={30}
        height={30}
        style={{ marginBottom: theme.spacer[3].y }}
        color={isDark ? theme.color.white : theme.color.black}
      />

      <PuzzleContainer url={image?.url} pieces={pieces} />

      <PuzzleLegend image={image} />
    </SafeAreaView>
  );
}

export default PuzzleClient;

PuzzleClient.displayName = "PuzzleClient";
