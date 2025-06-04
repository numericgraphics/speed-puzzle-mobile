module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
      ["inline-import", { extensions: [".sql"] }],
    ],
  };
};
// This configuration uses the `inline-import` plugin to allow importing SQL files directly into your React Native project.
