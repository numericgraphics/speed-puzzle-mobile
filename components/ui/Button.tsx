import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@/hooks/useTheme";
import { useIsSmallScreen } from "@/hooks/useIsSmallScreen";

export type ButtonIconName = keyof typeof MaterialCommunityIcons.glyphMap;

export type ButtonProps = {
  label: string;
  icon?: ButtonIconName;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function Button({
  label,
  icon,
  onPress,
  disabled,
  loading,
  fullWidth,
  style,
  testID,
}: ButtonProps) {
  const { theme, isDark } = useTheme();
  const isSmallScreen = useIsSmallScreen();
  const shouldFillWidth = fullWidth ?? isSmallScreen;
  const isDisabled = disabled || loading;

  const foreground = isDark ? theme.color.white : theme.color.black;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      testID={testID}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: shouldFillWidth ? "stretch" : "center",
          width: shouldFillWidth ? "100%" : undefined,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: foreground,
          borderRadius: 4,
          paddingHorizontal: theme.spacer[2].x,
          paddingVertical: theme.spacer[1].y,
          opacity: isDisabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={foreground}
          style={{ marginRight: theme.spacer[1].x }}
        />
      ) : icon ? (
        <MaterialCommunityIcons
          name={icon}
          size={theme.text.fontSize.xl}
          color={foreground}
          style={{ marginRight: theme.spacer[1].x }}
        />
      ) : null}
      <Text
        style={{
          fontFamily: theme.text.fontFamily.default,
          color: foreground,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
