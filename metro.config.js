const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// EMFILE fix - disable watchman completely
config.watchman = {
  enabled: false,
};

// Single worker thread
config.maxWorkers = 1;

// Reduce file operations
config.maxDependencies = 1500;
config.fileMapCacheSize = 300;

// CRITICAL: Block phosphor-react-native icon directories
const projectRoot = __dirname;

// Custom getBlacklistRE to exclude phosphor heavy folders
config.project = {
  ...config.project,
  disableCache: true,
};

// Update resolver to exclude phosphor folders
config.resolver = {
  ...config.resolver,
  blockList: [
    /node_modules\/phosphor-react-native\/src\/(bold|duotone|fill|light|regular|thin)\//,
  ],
  sourceExts: ['jsx', 'js', 'json', 'ts', 'tsx', 'cjs'],
  assetExts: config.resolver.assetExts,
};

module.exports = config;
