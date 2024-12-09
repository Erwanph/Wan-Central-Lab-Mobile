module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // Preset default untuk Expo
    plugins: [
      ['react-native-reanimated/plugin', { relativeSourceLocation: true }],
    ], // Tambahkan plugin Reanimated dengan opsi yang benar
  };
};
