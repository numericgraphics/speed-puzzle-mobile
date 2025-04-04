import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ListRenderItemInfo,
  RefreshControl,
  Platform,
  SafeAreaView,
  Dimensions,
} from "react-native";
import ReorderableList, {
  ReorderableListReorderEvent,
  reorderItems,
} from "react-native-reorderable-list";
import { Slide, SlideProps } from "./slide";
import { runOnJS } from "react-native-reanimated";
import { getColor } from "@/helpers/colors";
import { Image } from "expo-image";

const NUM_ITEMS = 4;
const SCREEN_WIDTH = Dimensions.get("window").width;
const SLIDE_HEIGHT = 120; // Height of each slide
const IMAGE_HEIGHT = SLIDE_HEIGHT * NUM_ITEMS; // Image height should cover all slides
const imageUrl =
  "https://media.admagazine.fr/photos/646dcd1c261b65c3279fdfd2/16:9/w_2240,c_limit/GettyImages-1347979016%20(1).jpg";

Image.prefetch(imageUrl);

// const initialData: SlideProps[] = Array.from({ length: NUM_ITEMS }, (_, index) => ({
//   id: `slide-${index}`,
//   index,
//   url: imageUrl,
//   slideHeight: SLIDE_HEIGHT,
//   imageHeight: IMAGE_HEIGHT,
// }));

const initialData: SlideProps[] = [...Array(NUM_ITEMS)].map((d, index) => {
  const backgroundColor = getColor(index, NUM_ITEMS);
  return {
    id: `slide-${index}`,
    index,
    url: imageUrl,
    slideWidth: SCREEN_WIDTH,
    slideHeight: SLIDE_HEIGHT,
    imageHeight: IMAGE_HEIGHT,
    backgroundColor,
    cropStartY: SLIDE_HEIGHT / NUM_ITEMS,
  };
});

let directData: SlideProps[] = [];

export default function PuzzleContainer() {
  const [data, setData] = useState(initialData);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshEnabled, setRefreshEnabled] = useState(true);
  directData = initialData;
  useEffect(() => {}, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleDragStart = useCallback(() => {
    "worklet";

    // NOTE: If it's refreshing we don't want the refresh control to disappear
    // and we can keep it enabled since it won't conflict with the drag.
    if (Platform.OS === "android" && !refreshing) {
      runOnJS(setRefreshEnabled)(false);
    }
  }, [refreshing]);

  const handleDragEnd = useCallback(() => {
    "worklet";

    if (Platform.OS === "android") {
      runOnJS(setRefreshEnabled)(true);
    }
  }, []);

  const handleReorder = ({ from, to }: ReorderableListReorderEvent) => {
    "worklet";
    // directData = reorderItems(directData, from, to);
    setData((value) => reorderItems(value, from, to));
  };

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<SlideProps>) => <Slide {...item} />,
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <ReorderableList
        data={data}
        onReorder={handleReorder}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
            enabled={refreshEnabled}
          />
        }
        panActivateAfterLongPress={Platform.OS === "android" ? 520 : undefined}
        //   ItemSeparatorComponent={PlaylistItemSeparator}
      />
      {/* <DraggableFlatList
        data={data}
        keyExtractor={(item) => item.key}
        onDragEnd={({ data }) => setData(data)}
        renderItem={renderItem}
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  itemContainer: {
    marginVertical: 2,
  },
  activeSlide: {
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
});
