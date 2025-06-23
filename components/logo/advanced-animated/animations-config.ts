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
  rotateTo: string;
  scaleFrom: number;
  scaleTo: number;
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
    easing: Easing.bounce,
    rotateFrom: "0deg",
    rotateTo: "0deg",
    scaleFrom: 1,
    scaleTo: 1,
    opacityStart: 0,
    opacityEnd: 1,
  },
  middle: {
    offsetXStart: 200,
    offsetXEnd: 0,
    offsetYStart: 0,
    offsetYEnd: 0,
    duration: 800,
    easing: Easing.bounce,
    rotateFrom: "0deg",
    rotateTo: "0deg",
    scaleFrom: 1,
    scaleTo: 1,
    opacityStart: 0,
    opacityEnd: 1,
  },
  bottom: {
    offsetXStart: -200,
    offsetXEnd: 0,
    offsetYStart: 0,
    offsetYEnd: 0,
    duration: 800,
    easing: Easing.bounce,
    rotateFrom: "0deg",
    rotateTo: "0deg",
    scaleFrom: 1,
    scaleTo: 1,
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
    easing: Easing.bounce,
    rotateFrom: "30deg",
    rotateTo: "0deg",
    scaleFrom: 1,
    scaleTo: 1,
    opacityStart: 0,
    opacityEnd: 1,
  },
  middle: {
    offsetXStart: 0,
    offsetXEnd: 0,
    offsetYStart: -150,
    offsetYEnd: 0,
    duration: 1000,
    easing: Easing.bounce,
    rotateFrom: "10deg",
    rotateTo: "0deg",
    scaleFrom: 1,
    scaleTo: 1,
    opacityStart: 0,
    opacityEnd: 1,
  },
  bottom: {
    offsetXStart: 0,
    offsetXEnd: 0,
    offsetYStart: -100,
    offsetYEnd: 0,
    duration: 800,
    easing: Easing.bounce,
    rotateFrom: "-20deg",
    rotateTo: "0deg",
    scaleFrom: 1,
    scaleTo: 1,
    opacityStart: 0,
    opacityEnd: 1,
  },
};

export const animationXEndedConfig: AnimationConfigMap = {
  top: {
    offsetXStart: 0,
    offsetXEnd: -200,
    offsetYStart: 0,
    offsetYEnd: 0,
    duration: 800,
    easing: Easing.out(Easing.bounce),
    rotateFrom: "0deg",
    rotateTo: "0deg",
    scaleFrom: 1,
    scaleTo: 1,
    opacityStart: 1,
    opacityEnd: 0,
  },

  middle: {
    offsetXStart: 0,
    offsetXEnd: 200,
    offsetYStart: 0,
    offsetYEnd: 0,
    duration: 1000,
    easing: Easing.out(Easing.bounce),
    rotateFrom: "0deg",
    rotateTo: "0deg",
    scaleFrom: 1,
    scaleTo: 1,
    opacityStart: 1,
    opacityEnd: 0,
  },

  bottom: {
    offsetXStart: 0,
    offsetXEnd: -200,
    offsetYStart: 0,
    offsetYEnd: 0,
    duration: 1200,
    easing: Easing.out(Easing.bounce),
    rotateFrom: "0deg",
    rotateTo: "0deg",
    scaleFrom: 1,
    scaleTo: 1,
    opacityStart: 1,
    opacityEnd: 0,
  },
};

export const animationYEndedConfig: AnimationConfigMap = {
  top: {
    offsetXStart: 0,
    offsetXEnd: 0,
    offsetYStart: 0,
    offsetYEnd: -200,
    duration: 1200,
    easing: Easing.out(Easing.bounce),
    rotateFrom: "30deg",
    rotateTo: "0deg",
    scaleFrom: 1,
    scaleTo: 1,
    opacityStart: 1,
    opacityEnd: 0,
  },
  middle: {
    offsetXStart: 0,
    offsetXEnd: 0,
    offsetYStart: 0,
    offsetYEnd: -150,
    duration: 1000,
    easing: Easing.out(Easing.bounce),
    rotateFrom: "10deg",
    rotateTo: "0deg",
    scaleFrom: 1,
    scaleTo: 1,
    opacityStart: 1,
    opacityEnd: 0,
  },
  bottom: {
    offsetXStart: 0,
    offsetXEnd: 0,
    offsetYStart: 0,
    offsetYEnd: -100,
    duration: 800,
    easing: Easing.out(Easing.bounce),
    rotateFrom: "-20deg",
    rotateTo: "0deg",
    scaleFrom: 1,
    scaleTo: 1,
    opacityStart: 1,
    opacityEnd: 0,
  },
};

export const animationYLongEndedConfig: AnimationConfigMap = {
  top: {
    offsetXStart: 0,
    offsetXEnd: 0,
    offsetYStart: 0,
    offsetYEnd: 400,
    duration: 1200,
    easing: Easing.in(Easing.back(1.2)),
    rotateFrom: "0deg",
    rotateTo: "0deg",
    scaleFrom: 1,
    scaleTo: 1.5,
    opacityStart: 1,
    opacityEnd: 0,
  },
  middle: {
    offsetXStart: 0,
    offsetXEnd: 0,
    offsetYStart: 0,
    offsetYEnd: 300,
    duration: 1000,
    easing: Easing.in(Easing.back(1.0)),
    rotateFrom: "0deg",
    rotateTo: "0deg",
    scaleFrom: 1,
    scaleTo: 1.5,
    opacityStart: 1,
    opacityEnd: 0,
  },
  bottom: {
    offsetXStart: 0,
    offsetXEnd: 0,
    offsetYStart: 0,
    offsetYEnd: 200,
    duration: 800,
    easing: Easing.in(Easing.back(0.8)),
    rotateFrom: "0deg",
    rotateTo: "0deg",
    scaleFrom: 1,
    scaleTo: 1.5,
    opacityStart: 1,
    opacityEnd: 0,
  },
};
