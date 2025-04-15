import React from "react";
import { View, Text, Linking, StyleSheet } from "react-native";
import { UnsplashImageData } from "@/types";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export function PuzzleLegend({ image }: { image: UnsplashImageData }) {
  return (
    <Animated.View
      entering={FadeIn.duration(1500)}
      exiting={FadeOut.duration(300)}
      style={styles.container}
    >
      <View style={styles.row}>
        <Text style={styles.label}>Photo by:</Text>
        <Text style={styles.value}>{image.user}</Text>
      </View>
      <View style={styles.row}>
        <Text
          style={styles.linkButton}
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

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 50,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  label: {
    color: "white",
    fontWeight: "bold",
    marginRight: 4,
  },
  value: {
    color: "white",
    flex: 1,
  },
  linkButton: {
    color: "white",
    borderWidth: 1,
    borderColor: "white",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});
