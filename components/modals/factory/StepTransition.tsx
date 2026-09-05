import React, { ReactNode } from "react";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";

// Single place to tune how a modal's internal steps replace one another
// (e.g. form -> success, sign-up -> login).
const STEP_ENTER = FadeIn.duration(180).delay(60);
const STEP_EXIT = FadeOut.duration(120);
const STEP_LAYOUT = Layout.duration(200);

type StepTransitionProps = {
  /** Identity of the currently visible step — changing it triggers the crossfade. */
  stepKey: string;
  children: ReactNode;
};

/**
 * Wrap a modal step's content so switching `stepKey` crossfades out the old
 * content and fades in the new one, with the card resizing smoothly between
 * them. Used by every generated modal so all step transitions stay in sync.
 */
export function StepTransition({ stepKey, children }: StepTransitionProps) {
  return (
    <Animated.View key={stepKey} entering={STEP_ENTER} exiting={STEP_EXIT} layout={STEP_LAYOUT}>
      {children}
    </Animated.View>
  );
}
