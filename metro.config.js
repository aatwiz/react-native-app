// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure .ts/.tsx are resolved inside node_modules (needed by react-native-svg)
config.resolver.sourceExts = [...(config.resolver.sourceExts || []), 'ts', 'tsx'];
// Remove duplicates
config.resolver.sourceExts = [...new Set(config.resolver.sourceExts)];

module.exports = config;
