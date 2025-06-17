// "use client";

import React, { useEffect, useRef } from "react";
import PuzzleStage from "@/modules/puzzle"; // existing grid logic
import { View, Text, SafeAreaView } from "react-native";
import { useTheme } from "@/hooks/useTheme";

import { useUnsplashStore, useUnsplashStoreActions } from "@/stores/unsplash";

import {
  useGameStore,
  useGameStoreActions,
  useNeedNextChallenge,
  useGameStoreStarted,
  useGameStoreStartTimer,
} from "@/stores/game";
import PuzzleContainer from "@/modules/puzzle/puzzle-container";
import PuzzleContainerVertical from "@/modules/puzzle/puzzle-vertical-container";
import { StatusMessage } from "@/components/message-display";
import { useTimerActions, useTimerStore, useTimerValue } from "@/stores/timer";
import { NUMBER_OF_QUESTION } from "@/constants";
import { fetchUnsplashImage } from "@/helpers/unsplash-photo";
import RectangleLogo from "@/components/logo/rectangles";
import TimeDisplay from "@/components/timer-display";
import { PuzzleLegend } from "@/components/image-legend";

import { CompletedPuzzle } from "./complete-screen";
import { StartPuzzle } from "./start-screen";

function PuzzleClient({ challenges }) {
  const { loading, completed, currentChallengeIndex } = useGameStore();
  const { theme, styles, isDark } = useTheme();
  const { containers, typography } = styles;
  const needNextChallenge = useNeedNextChallenge();
  const [image, setImage] = React.useState(challenges?.[0]?.image || null);
  const [pieces, setPieces] = React.useState(challenges?.[0]?.pieces || null);
  const [isVertical, setVerticalOrientation] = React.useState(false);
  const started = useGameStoreStarted();
  const timerAction = useTimerActions();
  const startTimer = useGameStoreStartTimer();
  const { actions: timerActions } = useTimerStore.getState();

  useEffect(() => {
    console.log("PuzzleClient CHALLENGES", challenges?.length);
    console.log("PuzzleClient CURRENT CHALLENGE", currentChallengeIndex);
    // if (challenges) {
    //   const currentChallenge = challenges[currentChallengeIndex];
    //   setImage(currentChallenge?.image);
    //   setPieces(currentChallenge?.pieces);
    //   setVerticalOrientation(currentChallenge?.isVertical);
    // }
  }, [challenges, currentChallengeIndex]);

  //   return (
  //     <Text style={{ color: "black" }}>
  //       {`test - server function, ${image?.user}`}
  //       {`test - server function, ${pieces}`}
  //     </Text>
  //   );

  return (
    <SafeAreaView style={containers.centeredFullScreen}>
      <RectangleLogo
        width={30}
        height={30}
        style={[{ marginBottom: theme.spacer[3].y }]}
        color={isDark ? theme.color.white : theme.color.black}
      />

      <PuzzleContainer url={image?.url} pieces={pieces} />

      <PuzzleLegend image={image} />
    </SafeAreaView>
  );
}

export default PuzzleClient;

//   return <PuzzleStage />;
/*
// TODO : use RSC// "use server";

function Puzzle() {
  // Store slices
  const { images, error, imageReady } = useUnsplashStore();
  const { loading, completed, challenges, currentChallengeIndex } =
    useGameStore();
  // Store actions
  const { fetchImages, resetImages } = useUnsplashStoreActions();
  const {
    buildChallenges,
    getCurrentChallenge,
    restartGame,
    nextChallenge,
    startGame,
    getScore,
  } = useGameStoreActions();
  const needNextChallenge = useNeedNextChallenge();
  const [image, setImage] = React.useState(null);
  const [pieces, setPieces] = React.useState(null);
  const [isVertical, setVerticalOrientation] = React.useState(false);
  const started = useGameStoreStarted();
  const timerAction = useTimerActions();
  const startTimer = useGameStoreStartTimer();
  const { actions: timerActions } = useTimerStore.getState();
  const { theme, styles, isDark } = useTheme();
  const { containers } = styles;

  useEffect(() => {
    console.log("CURRENT CHALLENGE");
    if (challenges) {
      const currentChallenge = challenges[currentChallengeIndex];
      setImage(currentChallenge?.image);
      setPieces(currentChallenge?.pieces);
      setVerticalOrientation(currentChallenge?.isVertical);
    }
  }, [challenges, currentChallengeIndex]);

  // Listen for the end-of-game

  return (
    <SafeAreaView style={containers.centeredFullScreen}>
      <RectangleLogo
        width={30}
        height={30}
        style={[{ marginBottom: theme.spacer[3].y }]}
        color={isDark ? theme.color.white : theme.color.black}
      />

      {isVertical ? (
        <PuzzleContainerVertical url={image?.url} pieces={pieces} />
      ) : (
        <PuzzleContainer url={image?.url} pieces={pieces} />
      )}

      <PuzzleLegend image={image} />
    </SafeAreaView>
  );
}
  */
PuzzleClient.displayName = "PuzzleClient";
