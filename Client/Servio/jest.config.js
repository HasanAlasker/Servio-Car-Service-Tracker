module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: {
    '^react-native-worklets$': 'react-native-worklets-core',
  },
  testMatch: ['**/__tests__/**/*.test.js', '**/smoke-tests/**/*.test.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-reanimated|react-native-gifted-charts|react-native-alert-queue|react-native-toast-notifications)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
};
