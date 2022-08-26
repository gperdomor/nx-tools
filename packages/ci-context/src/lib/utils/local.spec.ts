import mockedEnv, { RestoreFn } from 'mocked-env';
import * as local from './local';

jest.mock('./local-helpers', () => {
  return {
    __esModule: true,
    getSha: jest.fn(() => 'local-sha'),
    getRef: jest.fn(() => 'local-ref'),
    getCommitUserEmail: jest.fn(() => 'local-actor'),
  };
});

describe('LocalContext', () => {
  let restore: RestoreFn;

  beforeEach(() => {
    restore = mockedEnv({ PATH: process.env['PATH'] }, { clear: true });
  });

  afterEach(() => {
    restore();
  });

  describe('context', () => {
    it('Should be take proper cotext values', async () => {
      const context = await local.context();

      expect(context).toMatchObject({
        actor: 'local-actor',
        eventName: 'push',
        job: 'build',
        payload: {},
        ref: 'local-ref',
        runId: 0,
        runNumber: 0,
        sha: 'local-sha',
      });
    });
  });

  describe('repo', () => {
    it('Should be take proper repo values', async () => {
      const repo = await local.repo();

      expect(repo).toMatchObject({
        default_branch: '',
        description: '',
        html_url: '',
        license: null,
        name: '',
      });
    });
  });
});
