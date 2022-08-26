import * as core from '@nx-tools/core';
import * as docker from './docker';

jest.mock('@nx-tools/core', () => {
  const originalModule = jest.requireActual('@nx-tools/core');
  return {
    __esModule: true,
    ...originalModule,
    getExecOutput: jest.fn(async () => Promise.resolve()),
  };
});

describe('isAvailable', () => {
  it('cli', () => {
    const execSpy = jest.spyOn(core, 'getExecOutput');
    docker.isAvailable();

    expect(execSpy).toHaveBeenCalledWith(`docker`, undefined, {
      silent: true,
      ignoreReturnCode: true,
    });
  });
});
