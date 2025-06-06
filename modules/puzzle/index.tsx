// TODO : use RSC// "use server";

import React, { StrictMode, useEffect } from "react";

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
import { CompletedPuzzle } from "./complete-screen";
import { StartPuzzle } from "./start-screen";
import { useTimerActions, useTimerStore, useTimerValue } from "@/stores/timer";
import { NUMBER_OF_QUESTION } from "@/constants";
import { fetchUnsplashImage } from "@/helpers/unsplash-photo";
import { SafeAreaView, View, Text } from "react-native";
import RectangleLogo from "@/components/logo/rectangles";
import TimeDisplay from "@/components/timer-display";
import { PuzzleLegend } from "@/components/image-legend";
import { useTheme } from "@/hooks/useTheme";
import { createScore, createUser } from "@/db/queries/inserts";
import { getUserByName } from "@/db/queries/select";

export default function Puzzle() {
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
  // const currentChallengeCompleted = useChallengeStoreCompleted();

  const onStartGame = () => {
    console.log("STARTING GAME!");
    startGame();
  };
  // Re-initialize the game state, with empty challenges
  const onRestartGame = () => {
    console.log("RESTARTING GAME!");
    restartGame();
  };

  useEffect(() => {
    console.log("INIT PUZZLE COMPONENT");
    try {
      async function addUserInDB() {
        // This is just a placeholder for any DB initialization logic
        console.log("Database initialized successfully.");
        // console.log("Database db", db);
        await createUser({
          userName: "testUser-00",
          password: "testPassword",
        });

        console.log("user created");

        // const testUser02 = await db.query.users.findFirst({
        //   where: eq(users.userName, "testUser-02"), // or eq(users.id, someUuid)
        //   with: {
        //     scores: true, // << one-to-many defined in schema.ts
        //   },
        // });

        // if (!testUser02) {
        //   console.error("User not found");
        //   return;
        // }

        // console.log("testUser02", testUser02);
        // await createScore(testUser02.id, "12345");
      }

      async function getUserFromDB() {
        // This is just a placeholder for any DB initialization logic
        console.log("Database initialized successfully.");
        // console.log("Database db", db);
        await getUserByName("test-db-00");

        console.log("user created");

        // const testUser02 = await db.query.users.findFirst({
        //   where: eq(users.userName, "testUser-02"), // or eq(users.id, someUuid)
        //   with: {
        //     scores: true, // << one-to-many defined in schema.ts
        //   },
        // });

        // if (!testUser02) {
        //   console.error("User not found");
        //   return;
        // }

        // console.log("testUser02", testUser02);
        // await createScore(testUser02.id, "12345");
      }

      // addUserInDB();
      getUserFromDB();
    } catch (error) {
      console.error("Error initializing Puzzle component:", error);
    }
  }, []);

  // On mount, fetch images
  useEffect(() => {
    const getImages = async () => {
      try {
        useUnsplashStore.setState({ loading: true });
        const unsplashImages = await fetchUnsplashImage(
          NUMBER_OF_QUESTION,
          false
        );
        fetchImages(unsplashImages);
      } catch (err) {
        console.error("Error fetching images:", err);
      }
    };

    console.log("FETCH IMAGES!", images);
    if (images.length === 0 && loading) {
      getImages();
    }
  }, [images, loading]);

  useEffect(() => {
    if (startTimer) {
      console.log("START TIMER");
      timerAction.start();
    } else {
      console.log("RESET TIMER");
      timerAction.reset();
    }
  }, [startTimer]);

  useEffect(() => {
    console.log("BUILD CHALLENGES!", imageReady);
    if (imageReady) {
      console.log("BUILD CHALLENGES! Images fetched");
      buildChallenges();
    }
  }, [imageReady, buildChallenges]);

  useEffect(() => {
    console.log("CURRENT CHALLENGE");
    if (challenges) {
      const currentChallenge = challenges[currentChallengeIndex];
      setImage(currentChallenge?.image);
      setPieces(currentChallenge?.pieces);
      setVerticalOrientation(currentChallenge?.isVertical);
    }
  }, [challenges, currentChallengeIndex]);

  useEffect(() => {
    console.log("NEXT CHALLENGE! currentChallengeCompleted");
    if (needNextChallenge) {
      console.log("NEXT CHALLENGE! ");
      nextChallenge();
    }
  }, [nextChallenge, needNextChallenge]);

  // Listen for the end-of-game
  useEffect(() => {
    if (completed) {
      console.log(
        "GAME COMPLETE! You could show a final score here or navigate away."
      );
      timerActions.reset();
      resetImages();
    }
  }, [completed]);

  if (!started) {
    return <StartPuzzle onStart={onStartGame} />;
  }

  if (loading || !image || !pieces) {
    return <StatusMessage message="Loading..." />;
  }

  if (error) {
    return <StatusMessage message={`Error: ${error}`} />;
  }

  if (completed) {
    return <CompletedPuzzle onRestart={onRestartGame} score={getScore()} />;
  }

  return (
    <SafeAreaView style={containers.centeredFullScreen}>
      <RectangleLogo
        width={30}
        height={30}
        style={[{ marginBottom: theme.spacer[3].y }]}
        color={isDark ? theme.color.white : theme.color.black}
      />
      {/* <StrictMode> */}

      {isVertical ? (
        <PuzzleContainerVertical url={image?.url} pieces={pieces} />
      ) : (
        <PuzzleContainer url={image?.url} pieces={pieces} />
      )}

      {/* </StrictMode> */}
      <PuzzleLegend image={image} />
    </SafeAreaView>
  );
}
Puzzle.displayName = "Puzzle";
