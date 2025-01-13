module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // Preset default untuk Expo
    plugins: [
      ['react-native-reanimated/plugin', { relativeSourceLocation: true }], // Plugin Reanimated
      ['module:react-native-dotenv', { // Plugin untuk .env
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      }],
    ],
  };
};
