import { useEffect, useMemo } from "react";
import { Dimensions, SafeAreaView, StyleSheet, View } from "react-native";
import {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import Draggable from "../../components/draggable";
import Slide from "../../components/slide/image-slide";
import { PuzzlePieceType, UnsplashImageData } from "@/types";
import { PUZZLE_SLIDE_NUMBER } from "@/constants";
import { useGameStoreActions } from "@/stores/game";
import { PuzzleLegend } from "./image-legend";
import RectangleLogo from "@/components/logo/rectangles";
import { useTheme } from "@/hooks/useTheme";
import TimeDisplay from "@/components/timer-display";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SLIDE_HEIGHT = 120; // Height of each slide
const IMAGE_HEIGHT = SLIDE_HEIGHT * PUZZLE_SLIDE_NUMBER; // Image height should cover all slides
const imageUrl =
  "https://media.admagazine.fr/photos/646dcd1c261b65c3279fdfd2/16:9/w_2240,c_limit/GettyImages-1347979016%20(1).jpg";

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
  image: UnsplashImageData;
  pieces: PuzzlePieceType[];
}

export default function PuzzleContainer({
  image,
  pieces,
}: PuzzleContainerProps) {
  const { theme, styles, isDark } = useTheme();
  const { containers } = styles;
  const { url } = image;
  const {
    checkPuzzleOrderMobile,
    getCurrentChallenge,
    triggerNextChallenge,
    incrementChallengeMove,
  } = useGameStoreActions();
  const currentChallenge = getCurrentChallenge();
  const positions = useSharedValue(
    Object.assign(
      {},
      ...pieces.map((item: PuzzlePieceType, index) => ({ [index]: item.index }))
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

  useEffect(() => {
    if (currentChallenge?.completed) {
      opacity.value = withDelay(
        1000,
        withTiming(0, { duration: 500 }, (finished) => {
          if (finished) {
            // maybe run onJS -> nextChallenge or something
            runOnJS(triggerNextChallenge)();
          }
        })
      );
    }
  }, [currentChallenge, pieces, positions]);

  const onDragEnd = (event: SharedValue<Record<string, number>>) => {
    "worklet";
    runOnJS(incrementChallengeMove)();
    runOnJS(checkPuzzleOrderMobile)(event.value);
  };

  return (
    <SafeAreaView style={containers.centeredFullScreen}>
      <RectangleLogo
        width={30}
        height={30}
        style={[{ marginBottom: theme.spacer[3].y }]}
        color={isDark ? theme.color.white : theme.color.black}
      />
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
        <TimeDisplay />
      </View>
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
              positions={positions}
              id={index}
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
      <PuzzleLegend image={image} />
    </SafeAreaView>
  );
}
