import { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";

import Draggable from "../../components/draggable";
import Slide from "../../components/slide/image-slide";
import { PuzzlePieceType } from "@/types";
import { PUZZLE_SLIDE_NUMBER } from "@/constants";
import { useGameStoreActions } from "@/stores/game";
import { useTheme } from "@/hooks/useTheme";
import PuzzlePieces from "@/helpers/puzzle";
import { useChallengeStore } from "@/stores/challenges";

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
  ready: boolean;
}

export default function PuzzleContainer({ url, pieces, ready }: PuzzleContainerProps) {
  const { theme, styles } = useTheme();
  const { containers } = styles;
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const SLIDE_HEIGHT = 120; // Height of each slide
  const IMAGE_HEIGHT = SLIDE_HEIGHT * PUZZLE_SLIDE_NUMBER; // Image height should cover all slides
  const { triggerNextChallenge, incrementChallengeMove } =
    useGameStoreActions();
  if (!pieces || pieces.length === 0) {
    throw new Error("No pieces provided to PuzzleContainer");
  }
  const positions = useSharedValue(
    Object.assign(
      {},
      ...pieces?.map((item: PuzzlePieceType, index) => ({
        [index]: item.index,
      })),
    ),
  );
  const opacity = useSharedValue(0); // fully opaque
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    positions.value = Object.assign(
      {},
      ...pieces.map((item: PuzzlePieceType, index) => ({
        [index]: item.index,
      })),
    );
  }, [pieces, positions]);

  useEffect(() => {
    if (!ready) return;
    opacity.value = withDelay(200, withTiming(1, { duration: 500 }));
  }, [ready, opacity]);

  function onVerifyOrder(currentPositions: Record<string, number>) {
    const ordered = PuzzlePieces.checkPuzzleOrderMobile(currentPositions);
    if (ordered) {
      useChallengeStore.getState().markCompleted();
      opacity.value = withDelay(
        1200,
        withTiming(0, { duration: 500 }, (done) => {
          if (done) runOnJS(triggerNextChallenge)();
        }),
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
PuzzleContainer.displayName = "PuzzleContainer";
