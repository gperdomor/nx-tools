import * as core from '@nx-tools/core';
import * as docker from './docker';

vi.mock('@nx-tools/core', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('@nx-tools/core')>()),
    getExecOutput: vi.fn(async () => Promise.resolve()),
  };
});

describe('isAvailable', () => {
  it('cli', () => {
    const execSpy = vi.spyOn(core, 'getExecOutput');
    docker.isAvailable();

    expect(execSpy).toHaveBeenCalledWith(`docker`, undefined, {
      silent: true,
      ignoreReturnCode: true,
    });
  });
});
