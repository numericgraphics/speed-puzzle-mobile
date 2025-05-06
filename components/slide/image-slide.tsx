import React from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { SlideType } from "@/modules/puzzle/puzzle-container";

const Slide = ({ id, index, url, slideHeight, imageHeight }: SlideType) => {
  return (
    <View style={[styles.container, { height: slideHeight }]}>
      <Image
        source={{ uri: url }}
        style={[
          styles.image,
          { height: imageHeight, top: -index * slideHeight },
        ]}
        contentFit="cover"
        transition={300}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    width: "100%",
  },
  image: {
    width: "100%",
  },
});

export default Slide;
