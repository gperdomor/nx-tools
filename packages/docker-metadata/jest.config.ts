/* eslint-disable */
import { readFileSync } from 'fs';

// Reading the SWC compilation config and remove the "exclude"
// for the test files to be compiled by SWC
const { exclude: _, ...swcJestConfig } = JSON.parse(readFileSync(`${__dirname}/.lib.swcrc`, 'utf-8'));
export default {
  displayName: 'docker-metadata',
  preset: '../../jest.preset.js',
  transform: {
    // '^.+\\.[tj]s$': ['@swc/jest', swcJestConfig],
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/docker-metadata',
};
