import mockedEnv, { RestoreFn } from 'mocked-env';
import { RunnerContext } from '../interfaces';
import * as gitlab from './gitlab';
import { Gitlab } from './gitlab';

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
        CI_DEFAULT_BRANCH: 'main',
        CI_PROJECT_URL: 'https://gitlab.com/gperdomor/nx-tools',
        CI_PROJECT_NAME: 'nx-tools',
        CI_PROJECT_VISIBILITY: 'public',
      },
      { clear: true }
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
    restore();
  });

  describe('context', () => {
    it('Should be take proper cotext values', async () => {
      context = await Gitlab.context();

      expect(context).toEqual({
        name: 'GITLAB',
        actor: 'gitlab-actor',
        eventName: 'gitlab-event-name',
        job: 'gitlab-job',
        payload: {
          repository: {
            default_branch: 'main',
            private: false,
          },
        },
        ref: 'refs/heads/gitlab-ref-slug',
        runId: 100,
        runNumber: 10,
        repoUrl: 'https://gitlab.com/gperdomor/nx-tools',
        sha: 'gitlab-sha',
      });
    });

    describe('When git tag is present', () => {
      let restore: RestoreFn;

      beforeEach(() => {
        restore = mockedEnv({
          CI_COMMIT_TAG: 'gitlab-tag',
          CI_PROJECT_VISIBILITY: 'private',
        });
      });

      afterEach(() => {
        restore();
      });

      it('Should be take proper context values', async () => {
        context = await Gitlab.context();

        expect(context).toEqual({
          name: 'GITLAB',
          actor: 'gitlab-actor',
          eventName: 'gitlab-event-name',
          job: 'gitlab-job',
          payload: {
            repository: {
              default_branch: 'main',
              private: true,
            },
          },
          ref: 'refs/tags/gitlab-tag',
          runId: 100,
          runNumber: 10,
          repoUrl: 'https://gitlab.com/gperdomor/nx-tools',
          sha: 'gitlab-sha',
        });
      });
    });
  });

  describe('repo', () => {
    it('Should be take proper repo values', async () => {
      const repo = await gitlab.repo();

      expect(repo).toEqual({
        default_branch: 'main',
        description: '',
        html_url: 'https://gitlab.com/gperdomor/nx-tools',
        license: null,
        name: 'nx-tools',
      });
    });
  });
});
