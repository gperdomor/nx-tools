module.exports = {
  name: 'nx-prisma-e2e',
  preset: '../../jest.config.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  coverageDirectory: '../../coverage/apps/nx-prisma-e2e',
};
