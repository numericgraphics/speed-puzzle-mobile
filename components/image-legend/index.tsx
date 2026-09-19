import React from "react";
import { Text, Linking } from "react-native";
import { UnsplashImageData } from "@/types";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useTheme } from "@/hooks/useTheme";
import { UNSPLASH_HOME_URL } from "@/constants";
import { withUnsplashUtm } from "@/helpers/unsplash-photo";

export function PuzzleLegend({ image }: { image: UnsplashImageData }) {
  const { styles, theme } = useTheme();
  const { containers, typography } = styles;
  const linkStyle = [typography.labelBold, { textDecorationLine: "underline" as const }];

  return (
    <Animated.View
      entering={FadeIn.duration(1500)}
      exiting={FadeOut.duration(300)}
      style={[containers.fullWidth, { marginTop: theme.spacer[1].y }]}
    >
      <Text style={typography.label}>
        Photo by{" "}
        <Text style={linkStyle} onPress={() => Linking.openURL(image?.link)}>
          {image?.user}
        </Text>{" "}
        on{" "}
        <Text
          style={linkStyle}
          onPress={() => Linking.openURL(withUnsplashUtm(UNSPLASH_HOME_URL))}
        >
          Unsplash
        </Text>
      </Text>
    </Animated.View>
  );
}
