import React from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { ISlide } from "../puzzle-container-draggable";

const Slide = ({ id, index, url, slideHeight, imageHeight }: ISlide) => {
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
    position: "absolute",
    width: "100%",
  },
});

export default Slide;
