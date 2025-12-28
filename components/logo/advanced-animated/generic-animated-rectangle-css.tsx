import React, { useImperativeHandle } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { Svg, Rect } from "react-native-svg";
import type { RectDimensions } from "./rectangles-config";
import {
  animationXConfig,
  animationYConfig,
  animationXEndedConfig,
  animationYEndedConfig,
  animationYLongEndedConfig,
  type AnimationConfig,
} from "./animations-config";

export interface AnimatedRectangleHandle {
  startX(): void;
  endX(): void;
  startY(): void;
  endY(): void;
  endLongY(): void;
}

interface Props {
  width: number;
  height: number;
  shape: RectDimensions;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const GenericAnimatedRectangle = ({
  width,
  height,
  shape,
  color = "white",
  style,
  ref,
}: Props & { ref?: React.Ref<AnimatedRectangleHandle> }) => {
  const [currentConfig, setCurrentConfig] = React.useState<
    AnimationConfig | undefined
  >();

  useImperativeHandle(
    ref,
    () => ({
      startX() {
        setCurrentConfig(animationXConfig[shape.id]);
      },
      endX() {
        setCurrentConfig(animationXEndedConfig[shape.id]);
      },
      startY() {
        setCurrentConfig(animationYConfig[shape.id]);
      },
      endY() {
        setCurrentConfig(animationYEndedConfig[shape.id]);
      },
      endLongY() {
        setCurrentConfig(animationYLongEndedConfig[shape.id]);
      },
    }),
    [shape.id]
  );

  if (!currentConfig) return null;

  // Reanimated v4 CSS Animations keyframes
  const keyframes = {
    from: {
      opacity: currentConfig.opacityStart,
      transform: [
        { translateX: currentConfig.offsetXStart },
        { translateY: currentConfig.offsetYStart },
        { rotateZ: currentConfig.rotateFrom },
        { scale: currentConfig.scaleFrom },
      ],
    },
    to: {
      opacity: currentConfig.opacityEnd,
      transform: [
        { translateX: currentConfig.offsetXEnd },
        { translateY: currentConfig.offsetYEnd },
        { rotateZ: currentConfig.rotateTo },
        { scale: currentConfig.scaleTo },
      ],
    },
  } as const;

  // You can map per-shape easings to custom cubic-beziers later if you want.
  const timingFunction = "ease";

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width,
          height,
          backgroundColor: "transparent",
          // CSS Animations via Reanimated 4:
          animationName: keyframes,
          animationDuration: `${currentConfig.duration}ms`,
          animationTimingFunction: timingFunction,
          animationFillMode: "forwards",
        } as any,
        style,
      ]}
    >
      <Svg width={width} height={height} viewBox="0 0 192 192">
        <Rect
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          stroke={color}
          strokeWidth={shape.strokeWidth}
          fill="none"
        />
      </Svg>
    </Animated.View>
  );
};
