import React from "react";
import { View, Text, Linking, StyleSheet } from "react-native";
import { UnsplashImageData } from "@/types";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useTheme } from "@/hooks/useTheme";

export function PuzzleLegend({ image }: { image: UnsplashImageData }) {
  const { styles, theme } = useTheme();
  const { containers, typography, buttons } = styles;
  return (
    <Animated.View
      entering={FadeIn.duration(1500)}
      exiting={FadeOut.duration(300)}
      style={[containers.left, { marginTop: theme.spacer[2].y }]}
    >
      <View style={[containers.row, { marginBottom: theme.spacer[1].y }]}>
        <Text
          style={[typography.labelBold, { marginRight: theme.spacer[1].x }]}
        >
          Photo by :
        </Text>
        <Text style={typography.label}>{image.user}</Text>
      </View>
      <View style={containers.row}>
        <Text
          style={buttons.linkButton}
          onPress={() => {
            Linking.openURL(image.link);
          }}
        >
          Link
        </Text>
      </View>
    </Animated.View>
  );
}
