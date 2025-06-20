// app/components/AnimatedFilledRectangleLogo.tsx
import React, { forwardRef, useImperativeHandle } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnUI,
  withDelay,
} from "react-native-reanimated";
import FilledRectangleLogo from "@/components/logo/filled-rectangles";

export interface AnimatedLogoHandle {
  start: () => void;
}

type Props = {
  width?: number;
  height?: number;
  color: string;
  callback: () => void;
};

const AnimatedFilledRectangleLogo = forwardRef<AnimatedLogoHandle, Props>(
  ({ width = 50, height = 50, color, callback }, ref) => {
    const rotation = useSharedValue(0);
    const scale = useSharedValue(0);
    const opacity = useSharedValue(1);
    const animationDuration = 2000;

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value },
      ] as any,
    }));

    useImperativeHandle(ref, () => ({
      start: () => {
        rotation.value = withTiming(180, {
          duration: animationDuration,
          easing: Easing.linear,
        });

        scale.value = withTiming(
          20,
          {
            duration: animationDuration,
            easing: Easing.linear,
          },
          () => {
            callback();
            opacity.value = withDelay(
              800,
              withTiming(0, {
                duration: animationDuration * 0.5,
                easing: Easing.linear,
              })
            );
          }
        );
      },
    }));

    return (
      <Animated.View
        style={[
          { position: "absolute", backgroundColor: "transparent" },
          animatedStyle,
        ]}
      >
        <FilledRectangleLogo width={width} height={height} color={color} />
      </Animated.View>
    );
  }
);

export default AnimatedFilledRectangleLogo;
