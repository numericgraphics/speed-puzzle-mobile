import { Dimensions, SafeAreaView, StyleSheet, View } from "react-native";
import { runOnJS, SharedValue, useSharedValue } from "react-native-reanimated";

import Draggable from "../../components/draggable";
import { getColor } from "@/helpers/colors";
import Slide from "../../components/slide/image-slide";
import { PuzzlePieceType, UnsplashImageData } from "@/types";
import { PUZZLE_SLIDE_NUMBER } from "@/constants";
import PuzzlePieces from "@/helpers/puzzle";
import { useGameStoreActions } from "@/stores/game";

const NUM_ITEMS = 4;
const SCREEN_WIDTH = Dimensions.get("window").width;
const SLIDE_HEIGHT = 120; // Height of each slide
const IMAGE_HEIGHT = SLIDE_HEIGHT * NUM_ITEMS; // Image height should cover all slides
const imageUrl =
  "https://media.admagazine.fr/photos/646dcd1c261b65c3279fdfd2/16:9/w_2240,c_limit/GettyImages-1347979016%20(1).jpg";

export interface SlideType {
  id: string;
  index: number;
  url: string;
  slideWidth: number;
  slideHeight: number;
  imageHeight: number;
  backgroundColor?: string;
}

export interface PuzzleContainerProps {
  image: UnsplashImageData;
  pieces: PuzzlePieceType[];
}

export default function PuzzleContainer({
  image,
  pieces,
}: PuzzleContainerProps) {
  const { url } = image;
  const { checkPuzzleOrderMobile } = useGameStoreActions();
  // const initialData: SlideType[] = [...Array(PUZZLE_SLIDE_NUMBER)].map(
  //   (d, index) => {
  //     const backgroundColor = getColor(index, PUZZLE_SLIDE_NUMBER);
  //     return {
  //       id: `slide-${index}`,
  //       index,
  //       url: url,
  //       slideWidth: SCREEN_WIDTH,
  //       slideHeight: SLIDE_HEIGHT,
  //       imageHeight: IMAGE_HEIGHT,
  //       backgroundColor,
  //     };
  //   }
  // );

  const positions = useSharedValue(
    Object.assign(
      {},
      ...pieces.map((item: PuzzlePieceType, index) => ({ [index]: item.index }))
    )
  );

  // return (
  //   <SafeAreaView style={styles.container}>
  //     <View style={styles.wrapper}>
  //       {initialData.map((item) => {
  //         console.log("item", item);
  //         return (
  //           <Draggable key={item.index} positions={positions} id={item.index}>
  //             <Slide
  //               key={item.index}
  //               id={item.id}
  //               index={item.index}
  //               url={item.url}
  //               slideWidth={item.slideWidth}
  //               slideHeight={item.slideHeight}
  //               imageHeight={item.imageHeight}
  //             />
  //           </Draggable>
  //         );
  //       })}
  //     </View>
  //   </SafeAreaView>
  // );

  const onDragEnd = (event: SharedValue<Record<string, number>>) => {
    "worklet";
    // console.log(
    //   "onDragEnd - ordered ? : ",
    //   PuzzlePieces.checkPuzzleOrderMobile(event.value)
    // );
    runOnJS(checkPuzzleOrderMobile)(event.value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        {[...Array(PUZZLE_SLIDE_NUMBER)].map((_, index) => {
          return (
            <Draggable
              key={index}
              positions={positions}
              id={index}
              onDragEnd={onDragEnd}
            >
              <Slide
                key={index}
                id={index.toString()}
                index={index}
                url={url}
                slideWidth={SCREEN_WIDTH}
                slideHeight={SLIDE_HEIGHT}
                imageHeight={IMAGE_HEIGHT}
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
