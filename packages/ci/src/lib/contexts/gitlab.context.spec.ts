import { RunnerProvider } from '../runner-provider.enum';
import { GitLabContext } from './gitlab.context';

describe('GitLabContext', () => {
  beforeEach(() => {
    process.env.CI_PIPELINE_SOURCE = 'gitlab-event-name';
    process.env.CI_COMMIT_SHA = 'gitlab-sha';
    process.env.CI_COMMIT_REF_SLUG = 'gitlab-ref-slug';
    process.env.CI_JOB_ID = 'gitlab-action';
    process.env.GITLAB_USER_LOGIN = 'gitlab-actor';
    process.env.CI_JOB_NAME = 'gitlab-job';
    process.env.CI_PIPELINE_ID = '10';
    process.env.CI_PIPELINE_IID = '100';
  });

  it('Should be take proper values', () => {
    const context = new GitLabContext();

    expect(context).toBeInstanceOf(GitLabContext);
    expect(context.provider).toEqual(RunnerProvider.GitLab);
    expect(context.eventName).toEqual('gitlab-event-name');
    expect(context.sha).toEqual('gitlab-sha');
    expect(context.ref).toEqual('refs/heads/gitlab-ref-slug');
    expect(context.action).toEqual('gitlab-action');
    expect(context.actor).toEqual('gitlab-actor');
    expect(context.job).toEqual('gitlab-job');
    expect(context.runNumber).toEqual(10);
    expect(context.runId).toEqual(100);
  });

  describe('When git tag is present', () => {
    beforeEach(() => {
      process.env.CI_COMMIT_TAG = 'gitlab-tag';
    });

    it('Should be take proper values', () => {
      const context = new GitLabContext();

      expect(context).toBeInstanceOf(GitLabContext);
      expect(context.provider).toEqual(RunnerProvider.GitLab);
      expect(context.eventName).toEqual('gitlab-event-name');
      expect(context.sha).toEqual('gitlab-sha');
      expect(context.ref).toEqual('refs/tags/gitlab-tag');
      expect(context.action).toEqual('gitlab-action');
      expect(context.actor).toEqual('gitlab-actor');
      expect(context.job).toEqual('gitlab-job');
      expect(context.runNumber).toEqual(10);
      expect(context.runId).toEqual(100);
    });
  });
});
