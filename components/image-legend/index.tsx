import React from "react";
import { View, Text, Linking } from "react-native";
import { UnsplashImageData } from "@/types";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/Button";

export function PuzzleLegend({ image }: { image: UnsplashImageData }) {
  const { styles, theme } = useTheme();
  const { containers, typography } = styles;
  return (
    <Animated.View
      entering={FadeIn.duration(1500)}
      exiting={FadeOut.duration(300)}
      style={[containers.fullWidth, { marginTop: theme.spacer[1].y }]}
    >
      <View style={[containers.row, { marginBottom: theme.spacer[1].y }]}>
        <Text
          style={[typography.labelBold, { marginRight: theme.spacer[1].x }]}
        >
          Photo by :
        </Text>
        <Text style={typography.label}>{image?.user}</Text>
      </View>
      <View style={containers.row}>
        <Button
          label="Link"
          icon="open-in-new"
          onPress={() => {
            Linking.openURL(image?.link);
          }}
        />
      </View>
    </Animated.View>
  );
}
