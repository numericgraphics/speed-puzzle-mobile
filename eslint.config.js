// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    rules: {
      // React Compiler is not enabled in this project; these rules assume its
      // memoization model and false-positive on idiomatic react-native-reanimated
      // SharedValue.value mutation and Animated.Value ref usage.
      "react-hooks/immutability": "off",
      "react-hooks/refs": "off",
      // Raw apostrophes/quotes in JSX text are fine in RN/Expo (no HTML injection risk);
      // we prefer readable text over &apos;/&quot; entities.
      "react/no-unescaped-entities": "off",
    },
  },
]);
