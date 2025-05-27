import React, { useMemo, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { SlideType } from "@/modules/puzzle/puzzle-container";

const SlideVertical = ({
  id,
  index,
  url,
  slideWidth,
  imageHeight,
}: SlideType) => {
  const contentPosition = useRef(-(slideWidth * index));

  console.log("SlideVertical slideWidth", slideWidth);

  return (
    <View style={[styles.container, { width: slideWidth }]}>
      <Image
        source={{ uri: url }}
        style={[
          styles.image,
          {
            height: imageHeight,
          },
        ]}
        contentFit="cover"
        contentPosition={{ left: contentPosition.current - slideWidth * 0.5 }}
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
    width: "auto",
  },
});

export default SlideVertical;
