import { Dimensions } from "react-native";
import { isTablet } from "./device";

const { width, height } = Dimensions.get("window");

const mobileGuidelineBaseWidth = 375;
const mobileGuidelineBaseHeight = 812;
const tabletGuidelineBaseWidth = 768;
const tabletGuidelineBaseHeight = 1024;

const fnScale = (size: number): number =>
  (width / (isTablet() ? tabletGuidelineBaseWidth : mobileGuidelineBaseWidth)) *
  size;
const fnVerticalScale = (size: number): number =>
  (height /
    (isTablet() ? tabletGuidelineBaseHeight : mobileGuidelineBaseHeight)) *
  size;

export { fnScale, fnVerticalScale };
