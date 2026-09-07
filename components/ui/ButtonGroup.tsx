import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useIsSmallScreen } from "@/hooks/useIsSmallScreen";

export type ButtonGroupProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function ButtonGroup({ children, style }: ButtonGroupProps) {
  const { theme } = useTheme();
  const isSmallScreen = useIsSmallScreen();

  return (
    <View
      style={[
        {
          flexDirection: isSmallScreen ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isSmallScreen ? "stretch" : "center",
          gap: theme.spacer[1].y,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
