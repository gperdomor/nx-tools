module.exports = {
  name: 'example-app',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/example-app',
  globals: { 'ts-jest': { tsConfig: '<rootDir>/tsconfig.spec.json' } },
};
