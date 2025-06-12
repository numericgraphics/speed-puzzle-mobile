import React, { memo } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useReorderableDrag } from "react-native-reorderable-list";
import MemoizedImage from "./memorize-image";

export interface SlideProps {
  id: string;
  index: number;
  url: string;
  slideWidth: number;
  slideHeight: number;
  imageHeight: number;
  backgroundColor?: string;
  cropStartY: number;
}

export const Slide: React.FC<SlideProps> = memo(
  ({
    index,
    url,
    slideWidth,
    slideHeight,
    imageHeight,
    backgroundColor,
    cropStartY,
  }) => {
    const drag = useReorderableDrag();
    console.log("redraw", index);
    // const image = useImage(url);

    // if (!image)
    //   return <View style={{ height: slideHeight, backgroundColor }} />;

    return (
      <Pressable onLongPress={drag}>
        {/*   <Canvas
          style={{ height: slideHeight, width: slideWidth }}
          pointerEvents="none"
        >
          <Rect x={0} y={0} width={slideWidth} height={slideHeight} />
          <SkiaImage
            image={image}
            x={0}
            y={0} // Crop via negative offset
            width={slideWidth}
            height={image.height()}
            fit="cover"
          />
        </Canvas>*/}
        <View
          style={[styles.container, { height: slideHeight, backgroundColor }]}
        >
          <MemoizedImage
            url={url}
            imageHeight={imageHeight}
            index={index}
            slideHeight={slideHeight}
            cropStartY={cropStartY}
          />
          {/* <Image
            source={{ uri: url }}
            style={[
              styles.image,
              //   { height: imageHeight, top: 0 },
              { height: imageHeight, top: -index * slideHeight },
            ]}
            contentPosition={{ top: cropStartY, left: 0 }} // stable cropping
            contentFit="cover"
            transition={0}
          /> */}
        </View>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    width: "100%",
    borderRadius: 8,
    marginVertical: 4,
  },
  image: {
    position: "absolute",
    width: "100%",
  },
});
