import React, { useEffect } from "react";
import { Dimensions, SafeAreaView, View } from "react-native";
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { PuzzlePieceType, UnsplashImageData } from "@/types";
import { PUZZLE_SLIDE_NUMBER } from "@/constants";

import RectangleLogo from "@/components/logo/rectangles";
import { PuzzleLegend } from "@/components/image-legend";
import TimeDisplay from "@/components/timer-display";
import { useTheme } from "@/hooks/useTheme";
import { useGameStoreActions } from "@/stores/game";

import { DraggableHorizontal } from "@/components/draggable/horizontal";
import SlideVertical from "@/components/slide/image-slide-vertical";

/* layout constants */
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
const SLICE_WIDTH = SCREEN_WIDTH / PUZZLE_SLIDE_NUMBER; // Width of each slice
const SLIDE_HEIGHT = 120; // Height of each slide
const IMAGE_HEIGHT = SLIDE_HEIGHT * PUZZLE_SLIDE_NUMBER;

export default function PuzzleContainerVertical({
  image,
  pieces,
}: {
  image: UnsplashImageData;
  pieces: PuzzlePieceType[];
}) {
  const { theme, styles, isDark } = useTheme();
  const { containers } = styles;
  const { url } = image;

  console.log("PuzzleContainerVertical", pieces);

  //   return null;

  const {
    checkChallengeValidity,
    getCurrentChallenge,
    triggerNextChallenge,
    incrementChallengeMove,
  } = useGameStoreActions();

  const currentChallenge = getCurrentChallenge();
  const timerValue = 0; //useTimerValue();

  /* shared positions map (columnIndex -> logicalPosition) */
  const positions = useSharedValue(
    Object.assign({}, ...pieces.map((item, idx) => ({ [idx]: item.index })))
  );

  /* fade-in animation */
  const opacity = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  useEffect(() => {
    positions.value = Object.assign(
      {},
      ...pieces.map((item, idx) => ({ [idx]: item.index }))
    );
    opacity.value = withDelay(500, withTiming(1, { duration: 500 }));
  }, [pieces, positions]);

  /**/
  useEffect(() => {
    if (currentChallenge?.completed) {
      opacity.value = withDelay(
        1000,
        withTiming(0, { duration: 500 }, (done) => {
          if (done) runOnJS(triggerNextChallenge)();
        })
      );
    }
  }, [currentChallenge]);

  const onDragEnd = (event: SharedValue<Record<string, number>>) => {
    "worklet";
    runOnJS(incrementChallengeMove)();
    runOnJS(checkChallengeValidity)(event.value);
  };

  return (
    <SafeAreaView
      style={[containers.centeredFullScreen, { backgroundColor: "yellow" }]}
    >
      {/* logo */}
      <RectangleLogo
        width={30}
        height={30}
        style={{ marginBottom: theme.spacer[3].y }}
        color={isDark ? theme.color.white : theme.color.black}
      />

      {/* timer */}
      <View
        style={[
          containers.fullWidth,
          {
            alignItems: "flex-end",
            paddingHorizontal: theme.spacer[3].x,
            marginBottom: theme.spacer[2].y,
          },
        ]}
      >
        <TimeDisplay
          completed={currentChallenge?.completed}
          timerValue={timerValue}
        />
      </View>

      {/* puzzle columns */}
      <Animated.View
        style={[
          {
            width: SCREEN_WIDTH,
            height: IMAGE_HEIGHT,
            paddingVertical: theme.spacer[3].y,
            opacity: 1,
          },
          //   animatedStyle,
        ]}
      >
        {[...Array(PUZZLE_SLIDE_NUMBER)].map((_, index) => (
          <DraggableHorizontal
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
          </DraggableHorizontal>
        ))}
      </Animated.View>

      {/* legend */}
      <PuzzleLegend image={image} />
    </SafeAreaView>
  );
}
