// components/logo/AnimatedRectangleLogo.tsx
import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { AnimatedBottomRectangle } from "./bottom-recangle";
import { AnimatedMiddleRectangle } from "./middle-recangle";
import { AnimatedTopRectangle } from "./top-recangle";

interface Props {
  width: number;
  height: number;
  color?: string;
}

export const AnimatedRectangleLogo = ({
  width,
  height,
  color = "white",
}: Props & ViewProps) => (
  <View style={[styles.container, { width, height }]}>
    {/* You can tweak the `style` props here to adjust vertical offsets if needed */}
    <AnimatedTopRectangle width={width} height={height} color={color} />
    <AnimatedMiddleRectangle width={width} height={height} color={color} />
    <AnimatedBottomRectangle width={width} height={height} color={color} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
