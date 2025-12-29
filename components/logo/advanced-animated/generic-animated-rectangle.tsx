import React, {
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";
import { Svg, Rect } from "react-native-svg";
import type { RectDimensions } from "./rectangles-config";
import {
  animationXConfig,
  animationYConfig,
  animationXEndedConfig,
  animationYEndedConfig,
  animationYLongEndedConfig,
  AnimationConfig,
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
  const anim = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const [currentConfig, setCurrentConfig] = React.useState<
    AnimationConfig | undefined
  >();

  useEffect(() => {
    if (currentConfig) {
      runAnimation();
    }
  }, [currentConfig]);

  function runAnimation() {
    opacity.setValue(currentConfig.opacityStart);
    anim.setValue(0);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: currentConfig.opacityEnd,
        duration: currentConfig.duration,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 1,
        duration: currentConfig.duration,
        easing: currentConfig.easing,
        useNativeDriver: true,
      }),
    ]).start();
  }

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

  if (!currentConfig) {
    return null;
  }

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [currentConfig.offsetXStart, currentConfig.offsetXEnd],
  });
  const rotateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [currentConfig.rotateFrom, currentConfig.rotateTo],
  });
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [currentConfig.offsetYStart, currentConfig.offsetYEnd],
  });
  const rotateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [currentConfig.rotateFrom, currentConfig.rotateTo],
  });

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [currentConfig.scaleFrom, currentConfig.scaleTo],
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width,
          height,
          opacity,
          transform: [
            { translateX },
            { rotateX },
            { translateY },
            { rotateY },
            { scale },
          ],
          backgroundColor: "transparent",
        },
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
        />
      </Svg>
    </Animated.View>
  );
};
