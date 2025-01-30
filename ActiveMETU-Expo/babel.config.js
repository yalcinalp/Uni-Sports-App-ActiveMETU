module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './app',
            Utils: './utils',
            Translations: './utils/translations',
            Styles: './styles',
            Components: './components',
            Screens: './screens',
            Tests: './tests',
            Assets: './assets',
            Screens: './screens',
          },
        },
      ],
    ],
  };
};
