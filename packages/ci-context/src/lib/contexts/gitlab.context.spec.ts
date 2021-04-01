import { GitLabContext } from './gitlab.context';

describe('GitLabContext', () => {
  let env: NodeJS.ProcessEnv;

  beforeEach(() => {
    env = process.env;
    process.env = {
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
    process.env = env;
  });

  it('Should be take proper values', () => {
    const context = new GitLabContext();

    expect(context).toBeInstanceOf(GitLabContext);
    expect(context).toMatchObject({
      actor: 'gitlab-actor',
      eventName: 'gitlab-event-name',
      job: 'gitlab-job',
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

    it('Should be take proper values', () => {
      const context = new GitLabContext();

      expect(context).toBeInstanceOf(GitLabContext);
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
