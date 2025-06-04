const {getDefaultConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  defaultConfig.transformer.babelTransformerPath = require.resolve(
    'react-native-svg-transformer',
  );
  defaultConfig.resolver.assetExts = [
    'bmp',
    'gif',
    'jpeg',
    'jpg',
    'png',
    'webp',
  ]; // Add other asset extensions if needed
  defaultConfig.resolver.sourceExts = [
    ...defaultConfig.resolver.sourceExts,
    'svg',
  ]; // Include 'svg' in sourceExts
  return defaultConfig;
};

module.exports = config;
