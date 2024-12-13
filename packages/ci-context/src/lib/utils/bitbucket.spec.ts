import { RunnerContext } from '../interfaces';
import * as bitbucket from './bitbucket';
import { BitBucket } from './bitbucket';

describe('BitBucket Context', () => {
  let context: RunnerContext;

  beforeEach(() => {
    vi.stubEnv('BITBUCKET_PR_ID', 'pr-id');
    vi.stubEnv('BITBUCKET_COMMIT', 'bitbucket-sha');
    vi.stubEnv('BITBUCKET_BRANCH', 'bitbucket-ref-slug');
    vi.stubEnv('BITBUCKET_STEP_TRIGGERER_UUID', 'bitbucket-actor-uuid');
    vi.stubEnv('BITBUCKET_STEP_UUID', 'bitbucket-job-uuid');
    vi.stubEnv('BITBUCKET_BUILD_NUMBER', '50');
    vi.stubEnv('BITBUCKET_REPO_FULL_NAME', 'gperdomor/nx-tools');
    vi.stubEnv('BITBUCKET_WORKSPACE', 'nx-tools');
    vi.stubEnv('BITBUCKET_GIT_HTTP_ORIGIN', 'https://bitbucket.org/gperdomor/nx-tools');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('context', () => {
    it('Should be take proper values', async () => {
      context = await BitBucket.context();

      expect(context).toEqual({
        name: 'BITBUCKET',
        actor: 'bitbucket-actor-uuid',
        eventName: 'pull_request',
        job: 'bitbucket-job-uuid',
        payload: {},
        ref: 'refs/heads/bitbucket-ref-slug',
        runId: 50,
        runNumber: 50,
        repoUrl: 'https://bitbucket.org/gperdomor/nx-tools',
        sha: 'bitbucket-sha',
      });
    });

    it('Should be take proper values - no pr', async () => {
      delete process.env['BITBUCKET_PR_ID'];
      context = await BitBucket.context();

      expect(context).toEqual({
        name: 'BITBUCKET',
        actor: 'bitbucket-actor-uuid',
        eventName: 'unknown',
        job: 'bitbucket-job-uuid',
        payload: {},
        ref: 'refs/heads/bitbucket-ref-slug',
        runId: 50,
        runNumber: 50,
        repoUrl: 'https://bitbucket.org/gperdomor/nx-tools',
        sha: 'bitbucket-sha',
      });
    });

    describe('When git tag is present', () => {
      beforeEach(() => {
        vi.stubEnv('BITBUCKET_TAG', 'bitbucket-tag');
      });

      it('Should be take proper context values', async () => {
        context = await BitBucket.context();

        expect(context).toEqual({
          name: 'BITBUCKET',
          actor: 'bitbucket-actor-uuid',
          eventName: 'pull_request',
          job: 'bitbucket-job-uuid',
          payload: {},
          ref: 'refs/tags/bitbucket-tag',
          runId: 50,
          runNumber: 50,
          repoUrl: 'https://bitbucket.org/gperdomor/nx-tools',
          sha: 'bitbucket-sha',
        });
      });
    });
  });

  describe('repo', () => {
    it('Should be take proper repo values', async () => {
      const repo = await bitbucket.repo();

      expect(repo).toEqual({
        default_branch: '',
        description: '',
        html_url: 'https://bitbucket.org/gperdomor/nx-tools',
        license: null,
        name: 'nx-tools',
      });
    });
  });
});
