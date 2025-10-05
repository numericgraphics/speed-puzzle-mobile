import React, { useEffect } from "react";
import { Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";

import { PuzzlePieceType } from "@/types";
import { PUZZLE_SLIDE_NUMBER } from "@/constants";

import { useTheme } from "@/hooks/useTheme";
import { useGameStoreActions } from "@/stores/game";

import { DraggableVertical } from "@/components/draggable/vertical";
import SlideVertical from "@/components/slide/image-slide-vertical";
import { useChallengeStore } from "@/stores/challenges";
import PuzzlePieces from "@/helpers/puzzle";

/* layout constants */
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
const SLICE_WIDTH = SCREEN_WIDTH / PUZZLE_SLIDE_NUMBER; // Width of each slice
const SLIDE_HEIGHT = 120; // Height of each slide
const IMAGE_HEIGHT = SLIDE_HEIGHT * PUZZLE_SLIDE_NUMBER;

export default function PuzzleContainerVertical({
  url,
  pieces,
}: {
  url: string;
  pieces: PuzzlePieceType[];
}) {
  const { theme } = useTheme();

  const { triggerNextChallenge, incrementChallengeMove } =
    useGameStoreActions();

  /* shared positions map (columnIndex -> logicalPosition) */
  const positions = useSharedValue(
    Object.assign({}, ...pieces?.map((item, idx) => ({ [idx]: item.index })))
  );

  /* fade-in animation */
  const opacity = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  useEffect(() => {
    positions.value = Object.assign(
      {},
      ...pieces?.map((item, idx) => ({ [idx]: item.index }))
    );
    opacity.value = withDelay(500, withTiming(1, { duration: 500 }));
  }, [pieces, positions]);

  function onVerifyOrder(currentPositions: Record<string, number>) {
    const ordered = PuzzlePieces.checkPuzzleOrderMobile(currentPositions);
    if (ordered) {
      useChallengeStore.getState().markCompleted();
      opacity.value = withDelay(
        1000,
        withTiming(0, { duration: 500 }, (done) => {
          if (done) runOnJS(triggerNextChallenge)();
        })
      );
    }
  }

  const onDragEnd = (currentPositions: Record<string, number>) => {
    incrementChallengeMove();
    onVerifyOrder(currentPositions);
  };

  return (
    <Animated.View
      style={[
        {
          width: SCREEN_WIDTH,
          height: IMAGE_HEIGHT,
          paddingVertical: theme.spacer[3].y,
        },
        animatedStyle,
      ]}
    >
      {[...Array(PUZZLE_SLIDE_NUMBER)].map((_, index) => (
        <DraggableVertical
          key={index}
          id={index}
          positions={positions}
          itemWidth={SLICE_WIDTH}
          imageHeight={SCREEN_HEIGHT}
          onDragEnd={onDragEnd}
        >
          <SlideVertical
            id={index.toString()}
            index={index}
            url={url}
            slideWidth={SLICE_WIDTH}
            slideHeight={IMAGE_HEIGHT}
            imageHeight={IMAGE_HEIGHT}
          />
        </DraggableVertical>
      ))}
    </Animated.View>
  );
}
