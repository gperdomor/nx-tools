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
      },
      { clear: true },
    );
  });

  afterEach(() => {
    restore();
  });

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

    it('Should be take proper values', async () => {
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
