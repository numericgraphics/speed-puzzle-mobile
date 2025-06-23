// components/logo/AnimatedBottomRectangle.tsx
import React, { useRef, useEffect } from "react";
import { Animated, Easing, ViewStyle } from "react-native";
import { Svg, Rect } from "react-native-svg";

interface Props {
  width: number;
  height: number;
  color?: string;
  style?: ViewStyle;
}

export const AnimatedBottomRectangle = ({
  width,
  height,
  color = "white",
  style,
}: Props) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();
  }, []);

  // slide from -200px above into place
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 0],
  });
  // little rotation
  const rotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["-20deg", "0deg"],
  });

  return (
    <Animated.View
      style={[
        { width, height, transform: [{ translateY }, { rotate }] },
        { backgroundColor: "transparent", position: "absolute" },
        style,
      ]}
    >
      <Svg width={width} height={height} viewBox="0 0 192 192">
        <Rect
          x={36}
          y={135}
          width={120}
          height={40}
          stroke={color}
          strokeWidth={5}
        />
      </Svg>
    </Animated.View>
  );
};
