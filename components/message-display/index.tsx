// src/components/StatusMessage.tsx
import React from "react";
import { View, Text } from "react-native";

import { useTheme } from "@/hooks/useTheme";

interface StatusMessageProps {
  message: string;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ message }) => {
  const { styles, theme } = useTheme();
  const { containers, typography } = styles;
  return (
    <View style={containers.centeredFullScreen}>
      <Text style={[typography.body, { color: theme.color[300] }]}>
        {message}
      </Text>
    </View>
  );
};
