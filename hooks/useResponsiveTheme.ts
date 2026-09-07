import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

import { moderateScale, moderateVerticalScale } from "@/helpers/scale";

const spacerSteps = [0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96];

export const useResponsiveTheme = () => {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const fontSize = {
      default: moderateScale(14, width),
      xsm: moderateScale(10, width),
      sm: moderateScale(12, width),
      md: moderateScale(14, width),
      lg: moderateScale(16, width),
      xl: moderateScale(22, width),
      xxl: moderateScale(28, width),
      display: moderateScale(48, width),
    };

    const spacer = spacerSteps.map((spacing) => ({
      x: moderateScale(spacing, width),
      y: moderateVerticalScale(spacing, height),
    }));

    return { fontSize, spacer };
  }, [width, height]);
};
