import { useEffect } from "react";
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
  const { url } = image;
  const { checkPuzzleOrderMobile, getCurrentChallenge, triggerNextChallenge } =
    useGameStoreActions();
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
    runOnJS(checkPuzzleOrderMobile)(event.value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.wrapper, animatedStyle]}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // width: "100%",
    backgroundColor: "black",
  },
  wrapper: {
    // flexDirection: "row",
    // flexWrap: "wrap",
    width: "100%",
    height: IMAGE_HEIGHT,
    padding: 16,
    backgroundColor: "black",
  },
});
