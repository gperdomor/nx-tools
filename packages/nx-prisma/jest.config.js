module.exports = {
  displayName: 'nx-prisma',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  globalSetup: './setup-test.ts',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/nx-prisma',
  testMatch: ['**/test-suite.ts'],
  testEnvironment: 'node',
};
