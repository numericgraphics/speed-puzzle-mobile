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
    console.log("SlideVertical url", url);
    setContentPosition(-(slideWidth * index));
    () => {
      console.log("SlideVertical unmounted");
    };
  }, [url]);

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
        contentPosition={{ left: contentPosition }}
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
    backgroundColor: "red",
  },
  image: {
    height: "100%",
  },
});

export default SlideVertical;
