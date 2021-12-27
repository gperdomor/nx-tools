import mockedEnv, { RestoreFn } from 'mocked-env';
import { RunnerContext } from '../interfaces';
import * as gitlab from './gitlab';

describe('GitLab Context', () => {
  let restore: RestoreFn;
  let context: RunnerContext;

  beforeEach(() => {
    restore = mockedEnv(
      {
        GITLAB_CI: 'true',
        CI_PIPELINE_SOURCE: 'gitlab-event-name',
        CI_COMMIT_SHA: 'gitlab-sha',
        CI_COMMIT_REF_SLUG: 'gitlab-ref-slug',
        CI_JOB_ID: 'gitlab-action',
        GITLAB_USER_LOGIN: 'gitlab-actor',
        CI_JOB_NAME: 'gitlab-job',
        CI_PIPELINE_ID: '10',
        CI_PIPELINE_IID: '100',
      },
      { clear: true }
    );
  });

  afterEach(() => {
    restore();
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
    let restore: RestoreFn;

    beforeEach(() => {
      restore = mockedEnv({
        CI_COMMIT_TAG: 'gitlab-tag',
      });
    });

    afterEach(() => {
      restore();
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
