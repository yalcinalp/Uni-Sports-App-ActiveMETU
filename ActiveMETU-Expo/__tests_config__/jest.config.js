require('dotenv').config({ path: '__tests_config__/.env.test' });

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
