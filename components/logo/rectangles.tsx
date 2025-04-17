import * as React from "react";
import { SvgXml } from "react-native-svg";

import { ViewProps } from "react-native";

const RectangleLogo = ({
  width,
  height,
  color = "white",
  ...props
}: {
  width: number;
  height: number;
  color?: string;
} & ViewProps) => {
  const xml = `
  <svg width="192" height="192" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Bottom rectangle -->
  <rect x="36" y="135" width="120" height="40" stroke="${color}" stroke-width="5" />
  
  <!-- Middle rectangle -->
  <rect x="36" y="80" width="120" height="40" stroke="${color}" stroke-width="10" />
  
  <!-- Top rectangle -->
  <rect x="36" y="20" width="120" height="40" stroke="${color}" stroke-width="15" />
</svg>
`;

  return <SvgXml xml={xml} width={width} height={height} {...props} />;
};

export default RectangleLogo;
