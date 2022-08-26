import mockedEnv, { RestoreFn } from 'mocked-env';
import { RunnerContext } from '../interfaces';
import * as bitbucket from './bitbucket';

describe('CircleCI Context', () => {
  let restore: RestoreFn;
  let context: RunnerContext;

  beforeEach(() => {
    restore = mockedEnv(
      {
        BITBUCKET_PR_ID: 'pr-id',
        BITBUCKET_COMMIT: 'bitbucket-sha',
        BITBUCKET_BRANCH: 'bitbucket-ref-slug',
        BITBUCKET_STEP_TRIGGERER_UUID: 'bitbucket-actor-uuid',
        BITBUCKET_STEP_UUID: 'bitbucket-job-uuid',
        BITBUCKET_BUILD_NUMBER: '50',
        BITBUCKET_REPO_FULL_NAME: 'gperdomor/nx-tools',
        BITBUCKET_WORKSPACE: 'nx-tools',
      },
      { clear: true }
    );
  });

  afterEach(() => {
    restore();
  });

  describe('context', () => {
    it('Should be take proper values', async () => {
      context = await bitbucket.context();

      expect(context).toMatchObject({
        actor: 'bitbucket-actor-uuid',
        eventName: 'pull_request',
        job: 'bitbucket-job-uuid',
        payload: {},
        ref: 'refs/heads/bitbucket-ref-slug',
        runId: 50,
        runNumber: 50,
        sha: 'bitbucket-sha',
      });
    });

    it('Should be take proper values - no pr', async () => {
      delete process.env['BITBUCKET_PR_ID'];
      context = await bitbucket.context();

      expect(context).toMatchObject({
        actor: 'bitbucket-actor-uuid',
        eventName: 'unknown',
        job: 'bitbucket-job-uuid',
        payload: {},
        ref: 'refs/heads/bitbucket-ref-slug',
        runId: 50,
        runNumber: 50,
        sha: 'bitbucket-sha',
      });
    });

    describe('When git tag is present', () => {
      let restore: RestoreFn;

      beforeEach(() => {
        restore = mockedEnv({
          BITBUCKET_TAG: 'bitbucket-tag',
        });
      });

      afterEach(() => {
        restore();
      });

      it('Should be take proper context values', async () => {
        context = await bitbucket.context();

        expect(context).toMatchObject({
          actor: 'bitbucket-actor-uuid',
          eventName: 'pull_request',
          job: 'bitbucket-job-uuid',
          payload: {},
          ref: 'refs/tags/bitbucket-tag',
          runId: 50,
          runNumber: 50,
          sha: 'bitbucket-sha',
        });
      });
    });
  });

  describe('repo', () => {
    it('Should be take proper repo values', async () => {
      const repo = await bitbucket.repo();

      expect(repo).toMatchObject({
        default_branch: '',
        description: '',
        html_url: 'https://bitbucket.org/gperdomor/nx-tools',
        license: null,
        name: 'nx-tools',
      });
    });
  });
});
