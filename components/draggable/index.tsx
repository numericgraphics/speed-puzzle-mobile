import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  withSpring,
  SharedValue,
} from "react-native-reanimated";

// Utility function to swap two items' order in the positions object (id -> order index)
const objectMove = (
  object: Record<string, number>,
  from: number,
  to: number
): Record<string, number> => {
  "worklet";
  const newObject = { ...object };
  for (const key in object) {
    if (object[key] === from) {
      newObject[key] = to;
    }
    if (object[key] === to) {
      newObject[key] = from;
    }
  }
  return newObject;
};

type DraggableProps = {
  /** Unique identifier for the draggable item */
  id: string | number;
  /** Shared Reanimated value mapping item identifiers to their current order index */
  positions: SharedValue<Record<string, number>>;
  /** Content to render inside the draggable item */
  children: React.ReactNode;
  /** Height of each item (used for calculating positions) */
  itemHeight?: number;

  onDragEnd: (event: any) => void;
};

const Draggable: React.FC<DraggableProps> = ({
  id,
  positions,
  children,
  itemHeight = 120,
  onDragEnd,
}) => {
  const idKey = id.toString();
  // Shared values for the drag state
  const isDragging = useSharedValue(false);
  const scale = useSharedValue(1);
  // Shared value for the item’s current top offset (Y position)
  const offsetY = useSharedValue((positions.value[idKey] ?? 0) * itemHeight);
  // Shared value to track the starting Y position when drag begins
  const startY = useSharedValue(0);
  // Total number of items (for bounds clamping)
  const itemCount = Object.keys(positions.value).length;

  // Update this item's position when the shared positions mapping changes (i.e., other items move)
  useAnimatedReaction(
    () => positions.value[idKey],
    (currentPosition, previousPosition) => {
      if (currentPosition !== previousPosition && !isDragging.value) {
        // Smoothly animate to new position if not currently being dragged
        offsetY.value = withSpring(currentPosition * itemHeight);
      }
    },
    [isDragging]
  );

  // Set up the pan gesture using the new Gesture API
  const panGesture = Gesture.Pan()
    .onStart(() => {
      // Mark the item as dragging and record its start position
      isDragging.value = true;
      startY.value = offsetY.value;
      // Scale up the item slightly to indicate active drag
      scale.value = withSpring(1.05);
    })
    .onUpdate((event) => {
      // Update the item's position as the finger moves
      const newY = startY.value + event.translationY;
      offsetY.value = newY;
      // Determine the new order index based on the item's current Y position
      const newIndex = Math.max(
        0,
        Math.min(Math.floor(newY / itemHeight), itemCount - 1)
      );
      const currentIndex = positions.value[idKey];
      // If the item has moved to a different index, swap the items in the positions map
      if (newIndex !== currentIndex) {
        positions.value = objectMove(positions.value, currentIndex, newIndex);
      }
    })
    .onFinalize((event) => {
      // Drag finished (finger released or gesture cancelled)
      // Mark the item as no longer dragging
      isDragging.value = false;
      // Animate the item back to normal scale
      scale.value = withSpring(1);
      // Snap the item to its final position in the list
      const finalPositionY = (positions.value[idKey] ?? 0) * itemHeight;
      offsetY.value = withSpring(finalPositionY);
      onDragEnd(positions);
    });

  // Animated style applied to the draggable item
  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    top: offsetY.value,
    left: 0,
    right: 0,
    zIndex: isDragging.value ? 1 : 0,
    // transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </GestureDetector>
  );
};

export default Draggable;
