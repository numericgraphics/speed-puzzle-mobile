import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";
import { useTheme } from "@/hooks/useTheme";

export type LinkTextProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<TextStyle>;
  testID?: string;
};

export function LinkText({ label, onPress, disabled, style, testID }: LinkTextProps) {
  const { theme, isDark } = useTheme();
  const foreground = isDark ? theme.color.white : theme.color.black;

  return (
    <Text
      onPress={disabled ? undefined : onPress}
      testID={testID}
      style={[
        {
          fontFamily: theme.text.fontFamily.default,
          color: foreground,
          textDecorationLine: "underline",
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {label}
    </Text>
  );
}
