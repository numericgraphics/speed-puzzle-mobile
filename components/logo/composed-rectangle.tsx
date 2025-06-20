import React from "react";
import { Svg, Rect } from "react-native-svg";
import { ViewProps } from "react-native";

const BottomRectangle = ({ color = "white" }: { color?: string }) => (
  <Rect x={36} y={135} width={120} height={40} stroke={color} strokeWidth={5} />
);

const MiddleRectangle = ({ color = "white" }: { color?: string }) => (
  <Rect x={36} y={80} width={120} height={40} stroke={color} strokeWidth={10} />
);

const TopRectangle = ({ color = "white" }: { color?: string }) => (
  <Rect x={36} y={20} width={120} height={40} stroke={color} strokeWidth={15} />
);

interface RectangleLogoProps {
  width: number;
  height: number;
  color?: string;
}

export const ComposedRectangles = ({
  width,
  height,
  color = "white",
  ...props
}: RectangleLogoProps & ViewProps) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 192 192"
    fill="none"
    {...props}
  >
    <BottomRectangle color={color} />
    <MiddleRectangle color={color} />
    <TopRectangle color={color} />
  </Svg>
);

export default ComposedRectangles;
