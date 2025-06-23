import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { View, StyleSheet } from "react-native";
import { rectanglesConfig } from "./rectangles-config";
import {
  GenericAnimatedRectangle,
  AnimatedRectangleHandle,
} from "././generic-animated-rectangle";

export interface AnimatedRectanglesLayerHandle {
  handleStartX(callback?: () => void): void;
  handleEndX(callback?: () => void): void;
  handleStartY(callback?: () => void): void;
  handleEndY(callback?: () => void): void;
  handleEndYLong(callback?: () => void): void;
}

interface Props {
  width: number;
  height: number;
  color?: string;
}

export const AnimatedRectanglesLayer = forwardRef<
  AnimatedRectanglesLayerHandle,
  Props
>(({ width, height, color = "white" }, ref) => {
  const topRef = useRef<AnimatedRectangleHandle>(null);
  const middleRef = useRef<AnimatedRectangleHandle>(null);
  const bottomRef = useRef<AnimatedRectangleHandle>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const runCallback = (callback: () => void) => {
    if (callback) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback();
        timeoutRef.current = null;
      }, 1500);
    }
  };

  useImperativeHandle(ref, () => ({
    handleStartX: (callback?: () => void) => {
      topRef.current?.startX();
      middleRef.current?.startX();
      bottomRef.current?.startX();
      callback && runCallback(callback);
    },
    handleEndX: (callback?: () => void) => {
      topRef.current?.endX();
      middleRef.current?.endX();
      bottomRef.current?.endX();
      callback && runCallback(callback);
    },
    handleStartY: (callback?: () => void) => {
      topRef.current?.startY();
      middleRef.current?.startY();
      bottomRef.current?.startY();
      callback && runCallback(callback);
    },
    handleEndY: (callback?: () => void) => {
      topRef.current?.endY();
      middleRef.current?.endY();
      bottomRef.current?.endY();
      callback && runCallback(callback);
    },
    handleEndYLong: (callback?: () => void) => {
      topRef.current?.endLongY();
      middleRef.current?.endLongY();
      bottomRef.current?.endLongY();
      callback && runCallback(callback);
    },
  }));

  return (
    <View style={[styles.container, { width, height }]}>
      {rectanglesConfig.map((shape) => {
        const r =
          shape.id === "top"
            ? topRef
            : shape.id === "middle"
            ? middleRef
            : bottomRef;
        return (
          <GenericAnimatedRectangle
            key={shape.id}
            ref={r}
            width={width}
            height={height}
            shape={shape}
            color={color}
          />
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center" },
});

AnimatedRectanglesLayer.displayName = "AnimatedRectanglesLayer";
