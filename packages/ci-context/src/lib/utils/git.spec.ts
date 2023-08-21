import mockedEnv, { RestoreFn } from 'mocked-env';
import * as local from './git';
import { Git } from './git';

describe('Git Context', () => {
  let restore: RestoreFn;

  beforeEach(() => {
    restore = mockedEnv({ PATH: process.env['PATH'] }, { clear: true });

    jest.spyOn(Git, 'getCommitUserEmail').mockResolvedValue('local-actor');
    jest.spyOn(Git, 'ref').mockResolvedValue('local-ref');
    jest.spyOn(Git, 'remoteURL').mockResolvedValue('https://local-git.com/gperdomor/nx-tools');
    jest.spyOn(Git, 'fullCommit').mockResolvedValue('local-sha');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    restore();
  });

  describe('context', () => {
    it('Should be take proper cotext values', async () => {
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
});
