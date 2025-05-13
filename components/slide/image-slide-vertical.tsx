import React, { useEffect } from "react";
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
  const [contentPosition, setContentPosition] = React.useState(0);
  useEffect(() => {
    setContentPosition(-(slideWidth * index));
  }, [url]);

  return (
    <View style={[styles.container, { width: slideWidth }]}>
      <Image
        source={{ uri: url }}
        style={[
          styles.image,
          {
            width: "auto",
            height: imageHeight,
          },
        ]}
        contentPosition={{ left: contentPosition }}
        contentFit="cover"
        transition={0}
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
    height: "100%",
  },
});

export default SlideVertical;
