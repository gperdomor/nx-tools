import * as core from '@nx-tools/core';
import mockedEnv, { RestoreFn } from 'mocked-env';
import * as local from './git';
import { Git } from './git';

describe('Git Context', () => {
  let restore: RestoreFn;

  beforeEach(() => {
    restore = mockedEnv({ PATH: process.env['PATH'] }, { clear: true });

    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    restore();
  });

  describe('context', () => {
    it('Should be take proper cotext values', async () => {
      jest.spyOn(Git, 'getCommitUserEmail').mockResolvedValue('local-actor');
      jest.spyOn(Git, 'ref').mockResolvedValue('local-ref');
      jest.spyOn(Git, 'remoteURL').mockResolvedValue('https://local-git.com/gperdomor/nx-tools');
      jest.spyOn(Git, 'fullCommit').mockResolvedValue('local-sha');

      const context = await Git.context();

      expect(context).toEqual({
        name: 'GIT',
        actor: 'local-actor',
        eventName: 'push',
        job: 'build',
        payload: {},
        ref: 'local-ref',
        runId: 0,
        runNumber: 0,
        repoUrl: 'https://local-git.com/gperdomor/nx-tools',
        sha: 'local-sha',
      });
    });
  });

  describe('repo', () => {
    it('Should be take proper repo values', async () => {
      jest.spyOn(Git, 'remoteURL').mockResolvedValue('https://local-git.com/gperdomor/nx-tools');

      const repo = await local.repo();

      expect(repo).toEqual({
        default_branch: '',
        description: '',
        html_url: 'https://local-git.com/gperdomor/nx-tools',
        license: null,
        name: '',
      });
    });
  });

  describe('remoteURL', () => {
    it('have been called', async () => {
      const execSpy = jest.spyOn(core, 'getExecOutput');
      try {
        await Git.remoteURL();
      } catch (err) {
        // noop
      }
      expect(execSpy).toHaveBeenCalledWith(`git`, ['remote', 'get-url', 'origin'], {
        silent: true,
        ignoreReturnCode: true,
      });
    });
  });

  describe('ref', () => {
    it('returns mocked ref', async () => {
      jest.spyOn(core, 'getExecOutput').mockImplementation((cmd, args): Promise<core.ExecOutput> => {
        const fullCmd = `${cmd} ${args?.join(' ')}`;
        let result = '';
        switch (fullCmd) {
          case 'git branch --show-current':
            result = 'test';
            break;
          case 'git symbolic-ref HEAD':
            result = 'refs/heads/test';
            break;
        }
        return Promise.resolve({
          stdout: result,
          stderr: '',
          exitCode: 0,
        });
      });

      const ref = await Git.ref();

      expect(ref).toEqual('refs/heads/test');
    });

    it('returns mocked detached tag ref', async () => {
      jest.spyOn(core, 'getExecOutput').mockImplementation((cmd, args): Promise<core.ExecOutput> => {
        const fullCmd = `${cmd} ${args?.join(' ')}`;
        let result = '';
        switch (fullCmd) {
          case 'git branch --show-current':
            result = '';
            break;
          case 'git show -s --pretty=%D':
            result = 'HEAD, tag: 8.0.0';
            break;
        }
        return Promise.resolve({
          stdout: result,
          stderr: '',
          exitCode: 0,
        });
      });

      const ref = await Git.ref();

      expect(ref).toEqual('refs/tags/8.0.0');
    });

    it('returns mocked detached tag ref (shallow clone)', async () => {
      jest.spyOn(core, 'getExecOutput').mockImplementation((cmd, args): Promise<core.ExecOutput> => {
        const fullCmd = `${cmd} ${args?.join(' ')}`;
        let result = '';
        switch (fullCmd) {
          case 'git branch --show-current':
            result = '';
            break;
          case 'git show -s --pretty=%D':
            result = 'grafted, HEAD, tag: 8.0.0';
            break;
        }
        return Promise.resolve({
          stdout: result,
          stderr: '',
          exitCode: 0,
        });
      });

      const ref = await Git.ref();

      expect(ref).toEqual('refs/tags/8.0.0');
    });

    it('returns mocked detached pull request merge ref (shallow clone)', async () => {
      jest.spyOn(core, 'getExecOutput').mockImplementation((cmd, args): Promise<core.ExecOutput> => {
        const fullCmd = `${cmd} ${args?.join(' ')}`;
        let result = '';
        switch (fullCmd) {
          case 'git branch --show-current':
            result = '';
            break;
          case 'git show -s --pretty=%D':
            result = 'grafted, HEAD, pull/221/merge';
            break;
        }
        return Promise.resolve({
          stdout: result,
          stderr: '',
          exitCode: 0,
        });
      });

      const ref = await Git.ref();

      expect(ref).toEqual('refs/pull/221/merge');
    });

    it('should throws an error when detached HEAD ref is not supported', async () => {
      jest.spyOn(core, 'getExecOutput').mockImplementation((cmd, args): Promise<core.ExecOutput> => {
        const fullCmd = `${cmd} ${args?.join(' ')}`;
        let result = '';
        switch (fullCmd) {
          case 'git branch --show-current':
            result = '';
            break;
          case 'git show -s --pretty=%D':
            result = 'wrong, HEAD, tag: 8.0.0';
            break;
        }
        return Promise.resolve({
          stdout: result,
          stderr: '',
          exitCode: 0,
        });
      });

      await expect(Git.ref()).rejects.toThrow('Cannot find detached HEAD ref in "wrong, HEAD, tag: 8.0.0"');
    });

    it('returns mocked detached branch ref', async () => {
      jest.spyOn(core, 'getExecOutput').mockImplementation((cmd, args): Promise<core.ExecOutput> => {
        const fullCmd = `${cmd} ${args?.join(' ')}`;
        let result = '';
        switch (fullCmd) {
          case 'git branch --show-current':
            result = '';
            break;
          case 'git show -s --pretty=%D':
            result = 'HEAD, origin/test, test';
            break;
        }
        return Promise.resolve({
          stdout: result,
          stderr: '',
          exitCode: 0,
        });
      });

      const ref = await Git.ref();

      expect(ref).toEqual('refs/heads/test');
    });
  });

  describe('fullCommit', () => {
    it('have been called', async () => {
      const execSpy = jest.spyOn(core, 'getExecOutput');
      try {
        await Git.fullCommit();
      } catch (err) {
        // noop
      }
      expect(execSpy).toHaveBeenCalledWith(`git`, ['show', '--format=%H', 'HEAD', '--quiet', '--'], {
        silent: true,
        ignoreReturnCode: true,
      });
    });
  });

  describe('tag', () => {
    it('have been called', async () => {
      const execSpy = jest.spyOn(core, 'getExecOutput');
      try {
        await Git.tag();
      } catch (err) {
        // noop
      }
      expect(execSpy).toHaveBeenCalledWith(`git`, ['tag', '--points-at', 'HEAD', '--sort', '-version:creatordate'], {
        silent: true,
        ignoreReturnCode: true,
      });
    });
  });
});
