const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Firebase needs cjs
config.resolver.sourceExts.push('cjs');

module.exports = config;
