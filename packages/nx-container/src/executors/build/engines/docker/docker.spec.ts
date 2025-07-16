import * as core from '@nx-tools/core';
import * as docker from './docker';

describe('isAvailable', () => {
  it('cli', () => {
    const execSpy = vi.spyOn(core, 'exec');
    docker.isAvailable();

    expect(execSpy).toHaveBeenCalledWith(`docker`, undefined, {
      silent: true,
      throwOnError: false,
    });
  });
});
