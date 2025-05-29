import { useEffect, useMemo, useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, View } from "react-native";
import {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";

import Draggable from "../../components/draggable";
import Slide from "../../components/slide/image-slide";
import { PuzzlePieceType, UnsplashImageData } from "@/types";
import { PUZZLE_SLIDE_NUMBER } from "@/constants";
import { useGameStoreActions } from "@/stores/game";
import { useTheme } from "@/hooks/useTheme";
import PuzzlePieces from "@/helpers/puzzle";
import { useChallengeStore } from "@/stores/challenges";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SLIDE_HEIGHT = 120; // Height of each slide
const IMAGE_HEIGHT = SLIDE_HEIGHT * PUZZLE_SLIDE_NUMBER; // Image height should cover all slides

export interface SlideType {
  id: string;
  index: number;
  url: string;
  slideWidth: number;
  slideHeight: number;
  imageHeight: number;
  backgroundColor?: string;
}

export interface PuzzleContainerProps {
  url: string;
  pieces: PuzzlePieceType[];
}

export default function PuzzleContainer({ url, pieces }: PuzzleContainerProps) {
  const { theme, styles, isDark } = useTheme();
  const { containers } = styles;
  const { triggerNextChallenge, incrementChallengeMove } =
    useGameStoreActions();
  // const currentChallenge = getCurrentChallenge();
  // const timerValue = useTimerValue();
  const positions = useSharedValue(
    Object.assign(
      {},
      ...pieces?.map((item: PuzzlePieceType, index) => ({
        [index]: item.index,
      }))
    )
  );
  const opacity = useSharedValue(0); // fully opaque
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    positions.value = Object.assign(
      {},
      ...pieces.map((item: PuzzlePieceType, index) => ({ [index]: item.index }))
    );
    opacity.value = withDelay(500, withTiming(1, { duration: 500 }));
  }, [pieces, positions]);

  function onVerifyOrder(positions: Record<string, number>) {
    const ordered = PuzzlePieces.checkPuzzleOrderMobile(positions);
    if (ordered) {
      useChallengeStore.getState().markCompleted();
      opacity.value = withDelay(
        1200,
        withTiming(0, { duration: 500 }, (done) => {
          if (done) runOnJS(triggerNextChallenge)();
        })
      );
    }
  }

  const onDragEnd = (event: SharedValue<Record<string, number>>) => {
    "worklet";
    runOnJS(incrementChallengeMove)();
    runOnJS(onVerifyOrder)(event.value);
  };

  return (
    <Animated.View
      style={[
        containers.fullWidth,
        {
          height: IMAGE_HEIGHT,
          padding: theme.spacer[3].x,
        },
        animatedStyle,
      ]}
    >
      {[...Array(PUZZLE_SLIDE_NUMBER)].map((_, index) => {
        return (
          <Draggable
            key={index}
            id={index}
            positions={positions}
            itemHeight={SLIDE_HEIGHT}
            onDragEnd={onDragEnd}
          >
            <Slide
              key={index}
              id={index.toString()}
              index={index}
              url={url}
              slideWidth={SCREEN_WIDTH}
              slideHeight={SLIDE_HEIGHT}
              imageHeight={IMAGE_HEIGHT}
            />
          </Draggable>
        );
      })}
    </Animated.View>
  );
}
/* <PuzzleLegend image={image} />
    </SafeAreaView> */
