import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { useTheme } from "@/hooks/useTheme";

import PuzzleContainer from "@/modules/puzzle/puzzle-container";
import RectangleLogo from "@/components/logo/rectangles";
//import TimeDisplay from "@/components/timer-display";
import { PuzzleLegend } from "@/components/image-legend";

import { usePuzzle } from "@/hooks/use-puzzle";
import {
  AnimatedRectanglesLayer,
  AnimatedRectanglesLayerHandle,
} from "@/components/logo/advanced-animated";

function PuzzleClient({ challenges }) {
  const { theme, styles, isDark } = useTheme();
  const { containers } = styles;
  const { image, pieces, completed, onAnimationEnd } = usePuzzle(challenges);
  const animationRef = useRef<AnimatedRectanglesLayerHandle>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      animationRef.current?.handleStartX();
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    console.log("usePuzzle - completed:", completed);
    if (completed) {
      animationRef.current?.handleEndYLong(onAnimationEnd);
    }
  }, [completed]);

  return (
    <>
      <View style={{ bottom: theme.spacer[3].y }}>
        <AnimatedRectanglesLayer
          ref={animationRef}
          width={30}
          height={30}
          color={isDark ? theme.color.white : theme.color.black}
        />
      </View>

      <PuzzleContainer url={image?.url} pieces={pieces} />

      <PuzzleLegend image={image} />
    </>
  );
}

export default PuzzleClient;

PuzzleClient.displayName = "PuzzleClient";
