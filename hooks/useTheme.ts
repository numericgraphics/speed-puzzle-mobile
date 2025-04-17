import theme from "@/themes/default";
import { useMemo } from "react";
import { StyleSheet, useColorScheme } from "react-native";

export const useTheme = () => {
  const colorScheme = useColorScheme() || "light";

  const result = useMemo(() => {
    const isDark = colorScheme === "light" ? false : true;

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
    });

    const buttons = StyleSheet.create({
      linkButton: {
        fontFamily: theme.text.fontFamily.default,
        color: colorScheme === "light" ? theme.color.black : theme.color.white,
        borderWidth: 1,
        borderColor:
          colorScheme === "light" ? theme.color.black : theme.color.white,
        paddingHorizontal: theme.spacer[2].x,
        paddingVertical: theme.spacer[1].y,
        borderRadius: 4,
      },
    });

    return {
      theme,
      styles: { containers, typography, buttons },
      isDark,
    };
  }, [colorScheme, theme]);

  return result;
};
