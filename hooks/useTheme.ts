import baseTheme from "@/themes/default";
import { useMemo } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { useResponsiveTheme } from "./useResponsiveTheme";

export const useTheme = () => {
  const colorScheme = useColorScheme() || "light";
  const { fontSize, spacer } = useResponsiveTheme();

  const result = useMemo(() => {
    const isDark = colorScheme === "light" ? false : true;

    const theme = {
      ...baseTheme,
      spacer,
      size: fontSize,
      text: { ...baseTheme.text, fontSize },
    };

    const containers = StyleSheet.create({
      centeredFullScreen: {
        width: "100%",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacer[3].x,
      },
      fullWidth: {
        width: "100%",
        padding: theme.spacer[3].x,
      },
      row: {
        flexDirection: "row",
        alignItems: "center",
      },
      main: {
        flex: 1,
        backgroundColor:
          colorScheme === "light" ? theme.color.white : theme.color.black,
      },
    });

    const typography = StyleSheet.create({
      title: {
        fontFamily: theme.text.fontFamily.bold,
        color: colorScheme === "light" ? theme.color.black : theme.color.white,
        fontSize: theme.text.fontSize.xl,
        fontWeight: "bold",
        textAlign: "center",
      },
      body: {
        fontFamily: theme.text.fontFamily.medium,
        color: colorScheme === "light" ? theme.color.black : theme.color.white,
        fontSize: theme.text.fontSize.lg,
        textAlign: "center",
      },
      bodyBold: {
        fontFamily: theme.text.fontFamily.bold,
        color: colorScheme === "light" ? theme.color.black : theme.color.white,
        fontSize: theme.text.fontSize.lg,
      },
      labelBold: {
        fontFamily: theme.text.fontFamily.bold,
        fontSize: theme.text.fontSize.md,
        color: colorScheme === "light" ? theme.color.black : theme.color.white,
      },
      label: {
        fontFamily: theme.text.fontFamily.medium,
        fontSize: theme.text.fontSize.md,
        color: colorScheme === "light" ? theme.color.black : theme.color.white,
      },
      display: {
        fontFamily: theme.text.fontFamily.bold,
        color: colorScheme === "light" ? theme.color.black : theme.color.white,
        fontSize: theme.text.fontSize.display,
        fontWeight: "bold",
        textAlign: "center",
      },
    });

    // Caps on the OS-level accessibility text-scale multiplier, so a large
    // system font setting can't blow up short/critical UI text while body
    // copy is still allowed to grow generously.
    const maxFontSizeMultiplier = {
      title: 1.4,
      body: 2.0,
      bodyBold: 1.8,
      labelBold: 1.6,
      label: 1.6,
      display: 1.3,
    };

    const inputs = StyleSheet.create({
      textInput: {
        fontFamily: theme.text.fontFamily.default,
        color: colorScheme === "light" ? theme.color.black : theme.color.white,
        borderWidth: 1,
        borderColor:
          colorScheme === "light" ? theme.color.black : theme.color.white,
        paddingHorizontal: theme.spacer[2].x,
        paddingVertical: theme.spacer[1].y,
        borderRadius: 8,
        backgroundColor: "transparent",
        fontSize: theme.text.fontSize.md,
      },
    });

    return {
      theme,
      styles: { containers, typography, inputs },
      maxFontSizeMultiplier,
      isDark,
    };
  }, [colorScheme, fontSize, spacer]);

  return result;
};
