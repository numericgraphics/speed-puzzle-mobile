import theme from "@/themes/default";
import { useMemo } from "react";
import { StyleSheet, useColorScheme } from "react-native";

export const useTheme = () => {
  const colorScheme = useColorScheme() || "light";
  console.log("useTheme - colorScheme", colorScheme);
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: theme.spacer[3].x,
          backgroundColor: theme.color.black,
        },
        title: {
          fontFamily: theme.text.fontFamily.bold,
          color: theme.color.white,
          fontSize: theme.text.fontSize.xl,
          fontWeight: "bold",
          textAlign: "center",
          paddingBottom: theme.spacer[1].y,
        },
        text: {
          fontFamily: theme.text.fontFamily.medium,
          color: "gray",
          fontSize: theme.text.fontSize.lg,
          textAlign: "center",
          paddingBottom: theme.spacer[2].y,
        },
        linkButton: {
          fontFamily: theme.text.fontFamily.default,
          color: "white",
          borderWidth: 1,
          borderColor: "white",
          padding: theme.spacer[2].x,
          marginTop: theme.spacer[4].y,
          borderRadius: 4,
        },
      }),
    [colorScheme]
  );
  return { styles, theme };
};
