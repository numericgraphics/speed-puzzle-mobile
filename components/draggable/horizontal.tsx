// existing imports...
import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  withSpring,
  SharedValue,
} from "react-native-reanimated";

// utility: swaps two indexes inside a positions map
const objectMove = (
  object: Record<string, number>,
  from: number,
  to: number
): Record<string, number> => {
  "worklet";
  const newObj = { ...object };
  for (const key in object) {
    if (object[key] === from) newObj[key] = to;
    if (object[key] === to) newObj[key] = from;
  }
  return newObj;
};

export interface DraggableProps {
  id: string | number;
  positions: SharedValue<Record<string, number>>;
  children: React.ReactNode;
  imageHeight?: number;
  itemWidth?: number;
  onDragEnd: (event: SharedValue<Record<string, number>>) => void;
}

/* -------------------------------------------------------------
   DraggableHorizontal – same API as the vertical Draggable
   but constrained to the X axis.
------------------------------------------------------------- */
export const DraggableHorizontal: React.FC<DraggableProps> = ({
  id,
  positions,
  children,
  itemWidth = 120,
  imageHeight,
  onDragEnd,
}) => {
  const idKey = id.toString();

  console.log("DraggableHorizontal", children);

  const isDragging = useSharedValue(false);
  const offsetX = useSharedValue((positions.value[idKey] ?? 0) * itemWidth);
  const startX = useSharedValue(0);
  const itemCount = Object.keys(positions.value).length;

  console.log("DraggableHorizontal offsetX", offsetX.value);

  useAnimatedReaction(
    () => positions.value[idKey],
    (now, prev) => {
      if (now !== prev && !isDragging.value) {
        offsetX.value = withSpring(now * itemWidth);
      }
    },
    [isDragging]
  );

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
      startX.value = offsetX.value;
    })
    .onUpdate(({ translationX }) => {
      const newX = startX.value + translationX;
      offsetX.value = newX;

      const newIndex = Math.max(
        0,
        Math.min(Math.floor(newX / itemWidth), itemCount - 1)
      );
      const currentIndex = positions.value[idKey];
      if (newIndex !== currentIndex) {
        positions.value = objectMove(positions.value, currentIndex, newIndex);
      }
    })
    .onFinalize(() => {
      isDragging.value = false;
      offsetX.value = withSpring((positions.value[idKey] ?? 0) * itemWidth);
      onDragEnd(positions);
    });

  const style = useAnimatedStyle(() => ({
    position: "absolute",
    left: offsetX.value,
    top: 0,
    zIndex: isDragging.value ? 1 : 0,
    backgroundColor: "green",
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={style}>{children}</Animated.View>
    </GestureDetector>
  );
};

/* keep the default export of your original vertical Draggable here */
