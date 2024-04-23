const nxPreset = require('@nx/jest/preset').default;

module.exports = { ...nxPreset, testEnvironment: 'node', coverageReporters: ['html', 'json'], clearMocks: true };
