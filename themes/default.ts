const theme = {
  color: {
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
    overlay: "rgba(0, 0, 0, 0.6)",
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
      light: "Nunito_300Light", // 500
      medium: "Nunito_400Regular", // 500
      bold: "Nunito_900Black", // 700
      body: "Nunito_400Regular",
      default: "Nunito_400Regular",
    },
  },
};

theme.text.color = {
  100: theme.color["100"],
  200: theme.color["200"],
  300: theme.color["300"],
  primary: theme.color.primary,
  valid: theme.color.valid,
  danger: theme.color.danger,
  placeholder: theme.color.placeholder,
  textAreaPlaceholder: theme.color.textAreaPlaceholder,
};

export default theme;
