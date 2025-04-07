import React, { useMemo } from "react";
import { StyleSheet, ImageStyle } from "react-native";
import { Image } from "expo-image";

interface MemoizedImageProps {
  url: string;
  imageHeight: number;
  index: number;
  slideHeight: number;
  cropStartY: number;
}

const MemoizedImage: React.FC<MemoizedImageProps> = ({
  url,
  imageHeight,
  index,
  slideHeight,
  cropStartY,
}) => {
  const imageStyle: ImageStyle = useMemo(
    () => ({
      height: imageHeight,
      top: -index * slideHeight,
    }),
    [imageHeight, index, slideHeight]
  );

  const imageSource = useMemo(() => ({ uri: url }), [url]);

  return (
    <Image
      source={imageSource}
      style={[styles.image, imageStyle]}
      contentPosition={{ top: cropStartY, left: 0 }}
      contentFit="cover"
      transition={0}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
  },
});

export default React.memo(MemoizedImage);
