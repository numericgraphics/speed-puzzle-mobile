import { useWindowDimensions } from "react-native";

const SMALL_SCREEN_BREAKPOINT = 380;

export const useIsSmallScreen = () => {
  const { width } = useWindowDimensions();
  return width < SMALL_SCREEN_BREAKPOINT;
};
