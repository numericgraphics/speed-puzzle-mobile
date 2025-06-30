// Learn more https://docs.expo.io/guides/customizing-metro
// This configuration file extends the default Expo Metro configuration
// to include additional source extensions, specifically for SQL files.
// It also wraps the configuration with Reanimated's Metro config to ensure compatibility with React Native Reanimated.
// The `getDefaultConfig` function retrieves the default Metro configuration,

const { getDefaultConfig } = require("expo/metro-config");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push("sql");

// Add wasm asset support
config.resolver.assetExts.push("wasm");

module.exports = wrapWithReanimatedMetroConfig(config);
