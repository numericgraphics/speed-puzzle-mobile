import { Easing } from "react-native";

// Define a reusable animation config type
export type AnimationConfig = {
  offsetXStart: number;
  offsetXEnd: number;
  offsetYStart: number;
  offsetYEnd: number;
  duration: number;
  easing: (value: number) => number;
  rotateFrom: string;
  opacityStart: number;
  opacityEnd: number;
};

export type AnimationConfigMap = Record<string, AnimationConfig>;

/** Internal horizontal animation settings */
export const animationXConfig: AnimationConfigMap = {
  top: {
    offsetXStart: -200,
    offsetXEnd: 0,
    offsetYStart: 0,
    offsetYEnd: 0,
    duration: 800,
    easing: Easing.in(Easing.circle),
    rotateFrom: "0deg",
    opacityStart: 0,
    opacityEnd: 1,
  },
  middle: {
    offsetXStart: 200,
    offsetXEnd: 0,
    offsetYStart: 0,
    offsetYEnd: 0,
    duration: 800,
    easing: Easing.in(Easing.circle),
    rotateFrom: "0deg",
    opacityStart: 0,
    opacityEnd: 1,
  },
  bottom: {
    offsetXStart: -200,
    offsetXEnd: 0,
    offsetYStart: 0,
    offsetYEnd: 0,
    duration: 800,
    easing: Easing.in(Easing.circle),
    rotateFrom: "0deg",
    opacityStart: 0,
    opacityEnd: 1,
  },
};

/** Internal vertical + rotation settings */
export const animationYConfig: AnimationConfigMap = {
  top: {
    offsetXStart: 0,
    offsetXEnd: 0,
    offsetYStart: -200,
    offsetYEnd: 0,
    duration: 1200,
    easing: Easing.in(Easing.circle),
    rotateFrom: "30deg",
    opacityStart: 0,
    opacityEnd: 1,
  },
  middle: {
    offsetXStart: 0,
    offsetXEnd: 0,
    offsetYStart: -150,
    offsetYEnd: 0,
    duration: 1000,
    easing: Easing.in(Easing.circle),
    rotateFrom: "10deg",
    opacityStart: 0,
    opacityEnd: 1,
  },
  bottom: {
    offsetXStart: 0,
    offsetXEnd: 0,
    offsetYStart: -100,
    offsetYEnd: 0,
    duration: 800,
    easing: Easing.in(Easing.circle),
    rotateFrom: "-20deg",
    opacityStart: 0,
    opacityEnd: 1,
  },
};

/** Fade‐out variants for closing animations */
export const animationXEndedConfig: AnimationConfigMap = {
  top: {
    ...animationXConfig.top,
    easing: Easing.out(Easing.quad),
    duration: 800,
    offsetXStart: animationXConfig.top.offsetXEnd,
    offsetXEnd: animationXConfig.top.offsetXStart,
    offsetYStart: animationXConfig.top.offsetYEnd,
    offsetYEnd: animationXConfig.top.offsetYStart,
    opacityStart: animationXConfig.top.opacityEnd,
    opacityEnd: animationXConfig.top.opacityStart,
  },
  middle: {
    ...animationXConfig.middle,
    easing: Easing.out(Easing.quad),
    duration: 1000,
    offsetXStart: animationXConfig.middle.offsetXEnd,
    offsetXEnd: animationXConfig.middle.offsetXStart,
    offsetYStart: animationXConfig.middle.offsetYEnd,
    offsetYEnd: animationXConfig.middle.offsetYStart,
    opacityStart: animationXConfig.middle.opacityEnd,
    opacityEnd: animationXConfig.middle.opacityStart,
  },
  bottom: {
    ...animationXConfig.bottom,
    easing: Easing.out(Easing.quad),
    duration: 1200,
    offsetXStart: animationXConfig.bottom.offsetXEnd,
    offsetXEnd: animationXConfig.bottom.offsetXStart,
    offsetYStart: animationXConfig.bottom.offsetYEnd,
    offsetYEnd: animationXConfig.bottom.offsetYStart,
    opacityStart: animationXConfig.bottom.opacityEnd,
    opacityEnd: animationXConfig.bottom.opacityStart,
  },
};

export const animationYEndedConfig: AnimationConfigMap = {
  top: {
    ...animationYConfig.top,
    easing: Easing.out(Easing.circle),
    offsetXStart: animationYConfig.top.offsetXEnd,
    offsetXEnd: animationYConfig.top.offsetXStart,
    offsetYStart: animationYConfig.top.offsetYEnd,
    offsetYEnd: animationYConfig.top.offsetYStart,
    opacityStart: animationYConfig.top.opacityEnd,
    opacityEnd: animationYConfig.top.opacityStart,
  },
  middle: {
    ...animationYConfig.middle,
    easing: Easing.out(Easing.circle),
    offsetXStart: animationYConfig.middle.offsetXEnd,
    offsetXEnd: animationYConfig.middle.offsetXStart,
    offsetYStart: animationYConfig.middle.offsetYEnd,
    offsetYEnd: animationYConfig.middle.offsetYStart,
    opacityStart: animationYConfig.middle.opacityEnd,
    opacityEnd: animationYConfig.middle.opacityStart,
  },
  bottom: {
    ...animationYConfig.bottom,
    easing: Easing.out(Easing.circle),
    offsetXStart: animationYConfig.bottom.offsetXEnd,
    offsetXEnd: animationYConfig.bottom.offsetXStart,
    offsetYStart: animationYConfig.bottom.offsetYEnd,
    offsetYEnd: animationYConfig.bottom.offsetYStart,
    opacityStart: animationYConfig.bottom.opacityEnd,
    opacityEnd: animationYConfig.bottom.opacityStart,
  },
};
