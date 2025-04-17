import { fnScale, fnVerticalScale } from "@/helpers/scale";

const theme = {
  spacer: [],
  color: {
    black: "",
    white: "",
    100: "",
    200: "",
    300: "",
    400: "",
    500: "",
    600: "",
    700: "",
    primary: "",
    valid: "",
    error: "",
    danger: "",
    inactive: "",
    warning: "",
    placeholder: "",
    textAreaPlaceholder: "",
  },
  size: {
    default: 0,
    xsm: 0,
    sm: 0,
    md: 0,
    lg: 0,
    xl: 0,
    xxl: 0,
  },
  text: {
    color: {
      100: "",
      200: "",
      300: "",
      primary: "",
      valid: "",
      danger: "",
      placeholder: "",
      textAreaPlaceholder: "",
    },
    fontFamily: {
      default: "",
      light: "",
      medium: "",
      bold: "",
      body: "",
    },
    fontSize: {
      default: 0,
      xsm: 0,
      sm: 0,
      md: 0,
      lg: 0,
      xl: 0,
      xxl: 0,
    },
  },
};

theme.spacer = [0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96].map(
  (spacing) => ({
    x: fnScale(spacing),
    y: fnVerticalScale(spacing),
  })
);

theme.color = {
  black: "#000000",
  white: "#FFFFFF",
  100: "#FFFFFF",
  200: "rgba(255,255,255,0.8)", // Long Text
  300: "#ABABAB", // Short Text
  400: "#151515", // Highlight 2
  500: "#161616", // Highlight 1 + Thermostat dialBackground
  600: "#0A0B0B", // Background
  700: "#707084", // Better way to place it ?
  primary: "#1AD4BB",
  valid: "#1AD4BB",
  error: "#E54155",
  danger: "#E54155",
  inactive: "#838689",
  warning: "#FFC60E",
  placeholder: "rgba(255, 255, 255, 0.7)",
  textAreaPlaceholder: "rgba(255, 255, 255, 0.5)",
};

theme.size = {
  default: fnScale(14),
  xsm: fnScale(10),
  sm: fnScale(12),
  md: fnScale(14),
  lg: fnScale(16),
  xl: fnScale(22),
  xxl: fnScale(28),
};

theme.text = {
  color: {
    100: theme.color["100"],
    200: theme.color["200"],
    300: theme.color["300"],
    primary: theme.color.primary,
    valid: theme.color.valid,
    danger: theme.color.danger,
    placeholder: theme.color.placeholder,
    textAreaPlaceholder: theme.color.textAreaPlaceholder,
  },
  fontFamily: {
    light: "Nunito_300Light", // 500
    medium: "Nunito_400Regular", // 500
    bold: "Nunito_900Black", // 700
    body: "Nunito_400Regular",
    default: "Nunito_400Regular",
  },
  fontSize: {
    default: theme.size.default,
    xsm: theme.size.xsm,
    sm: theme.size.sm,
    md: theme.size.md,
    lg: theme.size.lg,
    xl: theme.size.xl,
    xxl: theme.size.xxl,
  },
};
export default theme;
