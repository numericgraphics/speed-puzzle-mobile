import { isTablet } from "./device";

const mobileGuidelineBaseWidth = 375;
const mobileGuidelineBaseHeight = 812;
const tabletGuidelineBaseWidth = 768;
const tabletGuidelineBaseHeight = 1024;

const guidelineBaseWidth = () =>
  isTablet() ? tabletGuidelineBaseWidth : mobileGuidelineBaseWidth;
const guidelineBaseHeight = () =>
  isTablet() ? tabletGuidelineBaseHeight : mobileGuidelineBaseHeight;

const moderateScale = (size: number, width: number, factor = 0.5): number => {
  const widthScale = width / guidelineBaseWidth();
  return size + (widthScale * size - size) * factor;
};

const moderateVerticalScale = (
  size: number,
  height: number,
  factor = 0.5
): number => {
  const heightScale = height / guidelineBaseHeight();
  return size + (heightScale * size - size) * factor;
};

export { moderateScale, moderateVerticalScale };
