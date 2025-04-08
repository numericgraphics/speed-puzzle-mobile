import { Dimensions, SafeAreaView, StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import Draggable from "../../components/draggable";
import { getColor } from "@/helpers/colors";
import Slide from "../../components/slide/image-slide";
import { useUnsplash } from "@/providers/unsplash-provider";

const NUM_ITEMS = 4;
const SCREEN_WIDTH = Dimensions.get("window").width;
const SLIDE_HEIGHT = 120; // Height of each slide
const IMAGE_HEIGHT = SLIDE_HEIGHT * NUM_ITEMS; // Image height should cover all slides
const imageUrl =
  "https://media.admagazine.fr/photos/646dcd1c261b65c3279fdfd2/16:9/w_2240,c_limit/GettyImages-1347979016%20(1).jpg";

export interface ISlide {
  id: string;
  index: number;
  url: string;
  slideWidth: number;
  slideHeight: number;
  imageHeight: number;
  backgroundColor?: string;
}

export default function PuzzleContainer() {
  const { images } = useUnsplash();
  console.log("PuzzleContainer images", images);
  const arr = new Array(NUM_ITEMS).fill("").map((_, i) => i);
  const initialData: ISlide[] = [...Array(NUM_ITEMS)].map((d, index) => {
    const backgroundColor = getColor(index, NUM_ITEMS);
    return {
      id: `slide-${index}`,
      index,
      url: images[0]?.url,
      slideWidth: SCREEN_WIDTH,
      slideHeight: SLIDE_HEIGHT,
      imageHeight: IMAGE_HEIGHT,
      backgroundColor,
    };
  });
  const positions = useSharedValue(
    Object.assign(
      {},
      ...initialData.map((item: ISlide) => ({ [item.index]: item.index }))
    )
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        {initialData.map((item) => {
          console.log("item", item);
          return (
            <Draggable key={item.index} positions={positions} id={item.index}>
              <Slide
                key={item.index}
                id={item.id}
                index={item.index}
                url={item.url}
                slideWidth={item.slideWidth}
                slideHeight={item.slideHeight}
                imageHeight={item.imageHeight}
              />
            </Draggable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  wrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
  },
});
