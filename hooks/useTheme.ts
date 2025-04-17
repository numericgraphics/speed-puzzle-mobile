import theme from "@/themes/default";
import { useMemo } from "react";
import { StyleSheet, useColorScheme } from "react-native";

export const useTheme = () => {
  const colorScheme = useColorScheme() || "light";

  const result = useMemo(() => {
    const containers = StyleSheet.create({
      centeredFullScreen: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacer[3].x,
      },
      left: {
        width: "100%",
        padding: theme.spacer[3].x,
      },
      row: {
        flexDirection: "row",
        alignItems: "center",
      },
    });

    const typography = StyleSheet.create({
      title: {
        fontFamily: theme.text.fontFamily.bold,
        color: theme.color.white,
        fontSize: theme.text.fontSize.xl,
        fontWeight: "bold",
        textAlign: "center",
      },
      body: {
        fontFamily: theme.text.fontFamily.medium,
        color: theme.color.white,
        fontSize: theme.text.fontSize.lg,
        textAlign: "center",
      },
      labelBold: {
        fontFamily: theme.text.fontFamily.bold,
        fontSize: theme.text.fontSize.md,
        color: theme.color.white,
      },
      label: {
        fontFamily: theme.text.fontFamily.medium,
        fontSize: theme.text.fontSize.md,
        color: theme.color.white,
      },
    });

    const buttons = StyleSheet.create({
      linkButton: {
        fontFamily: theme.text.fontFamily.default,
        color: theme.color.white,
        borderWidth: 1,
        borderColor: theme.color.white,
        paddingHorizontal: theme.spacer[2].x,
        paddingVertical: theme.spacer[1].y,
        borderRadius: 4,
      },
    });

    return { theme, styles: { containers, typography, buttons } };
  }, [colorScheme, theme]);

  return result;
};
