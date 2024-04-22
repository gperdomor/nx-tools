import { GitLabCommand } from './command';

describe('nxSetShas', () => {
  it('should work', () => {
    expect(GitLabCommand.paths).toEqual([['gitlab']]);
  });
});
