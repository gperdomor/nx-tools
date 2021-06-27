import { RunnerContext } from '../interfaces';
import * as gitlab from './gitlab';

describe('GitLab Context', () => {
  const ENV: NodeJS.ProcessEnv = process.env;
  let context: RunnerContext;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = {
      ...ENV,
      GITLAB_CI: 'true',
      CI_PIPELINE_SOURCE: 'gitlab-event-name',
      CI_COMMIT_SHA: 'gitlab-sha',
      CI_COMMIT_REF_SLUG: 'gitlab-ref-slug',
      CI_JOB_ID: 'gitlab-action',
      GITLAB_USER_LOGIN: 'gitlab-actor',
      CI_JOB_NAME: 'gitlab-job',
      CI_PIPELINE_ID: '10',
      CI_PIPELINE_IID: '100',
    };
  });

  afterEach(() => {
    process.env = ENV; // Restore old environment
  });

  it('Should be take proper values', async () => {
    context = await gitlab.context();

    expect(context).toMatchObject({
      actor: 'gitlab-actor',
      eventName: 'gitlab-event-name',
      job: 'gitlab-job',
      payload: {},
      ref: 'refs/heads/gitlab-ref-slug',
      runId: 100,
      runNumber: 10,
      sha: 'gitlab-sha',
    });
  });

  describe('When git tag is present', () => {
    beforeEach(() => {
      process.env.CI_COMMIT_TAG = 'gitlab-tag';
    });

    it('Should be take proper values', async () => {
      context = await gitlab.context();

      expect(context).toMatchObject({
        actor: 'gitlab-actor',
        eventName: 'gitlab-event-name',
        job: 'gitlab-job',
        ref: 'refs/tags/gitlab-tag',
        runId: 100,
        runNumber: 10,
        sha: 'gitlab-sha',
      });
    });
  });
});
