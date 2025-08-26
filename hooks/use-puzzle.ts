// usePuzzleViewModel.ts

import { useCallback, useEffect, useRef, useState } from "react";
import {
  useGameStore,
  useGameStoreActions,
  useNeedNextChallenge,
  useGameStoreStartTimer,
} from "@/stores/game";
import { useTimerActions, useTimerStore } from "@/stores/timer";
import { router } from "expo-router";

export function usePuzzle(challenges) {
  const { currentChallengeIndex, completed } = useGameStore();
  const { nextChallenge, setChallenges } = useGameStoreActions();
  const needNextChallenge = useNeedNextChallenge();
  const startTimer = useGameStoreStartTimer();
  const timerActions = useTimerStore((state) => state.actions);
  const timerAction = useTimerActions();

  const [image, setImage] = useState(challenges?.[0]?.image || null);
  const [pieces, setPieces] = useState(challenges?.[0]?.pieces || null);
  const [isVertical, setVerticalOrientation] = useState(false);

  // Add hydration logic here
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current && challenges?.length) {
      setChallenges(challenges);
      hydrated.current = true;
    }
  }, [challenges, setChallenges]);

  useEffect(() => {
    if (needNextChallenge) {
      nextChallenge();
    }
  }, [nextChallenge, needNextChallenge]);

  useEffect(() => {
    if (startTimer) {
      timerAction.start();
    } else {
      timerAction.reset();
    }
  }, [startTimer, timerAction]);

  useEffect(() => {
    if (challenges && challenges[currentChallengeIndex]) {
      const currentChallenge = challenges[currentChallengeIndex];
      setImage(currentChallenge.image);
      setPieces(currentChallenge.pieces);
      setVerticalOrientation(currentChallenge.isVertical);
    }
  }, [challenges, currentChallengeIndex]);

  const onAnimationEnd = useCallback(() => {
    timerActions.reset();
    router.replace("/?finished=true");
  }, [timerActions]);

  return {
    image,
    pieces,
    isVertical,
    onAnimationEnd,
    completed,
  };
}
