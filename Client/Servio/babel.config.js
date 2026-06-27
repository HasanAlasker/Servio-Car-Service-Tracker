module.exports = function(api) {
  const isTest = api.env('test');
  return {
    presets: isTest ? ['@react-native/babel-preset'] : ['babel-preset-expo'],
    plugins: isTest ? [] : ['react-native-reanimated/plugin'],
  };
};
