import mockedEnv, { RestoreFn } from 'mocked-env';
import { RunnerContext } from '../interfaces';
import * as jenkins from './jenkins';
import { Jenkins } from './jenkins';

describe('Jenkins Context', () => {
  let restore: RestoreFn;
  let context: RunnerContext;

  beforeEach(() => {
    restore = mockedEnv(
      {
        CI: 'true',
        CHANGE_FORK: 'pull_request',
        GIT_COMMIT: 'jenkins-sha',
        BRANCH_NAME: 'jenkins-ref-slug',
        CHANGE_AUTHOR: 'jenkins-actor',
        JOB_NAME: 'jenkins-job',
        BUILD_NUMBER: '40',
        GIT_URL: 'https://jenkins.com/gperdomor/nx-tools',
        JOB_BASE_NAME: 'nx-tools',
      },
      { clear: true }
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
    restore();
  });

  describe('context', () => {
    it('Should be take proper context values', async () => {
      context = await Jenkins.context();

      expect(context).toEqual({
        name: 'JENKINS',
        actor: 'jenkins-actor',
        eventName: 'pull_request',
        job: 'jenkins-job',
        payload: {},
        ref: 'refs/heads/jenkins-ref-slug',
        runId: 40,
        runNumber: 40,
        repoUrl: 'https://jenkins.com/gperdomor/nx-tools',
        sha: 'jenkins-sha',
      });
    });

    it('Should be take proper context values - no pr', async () => {
      delete process.env['CHANGE_FORK'];
      context = await Jenkins.context();

      expect(context).toEqual({
        name: 'JENKINS',
        actor: 'jenkins-actor',
        eventName: 'unknown',
        job: 'jenkins-job',
        payload: {},
        ref: 'refs/heads/jenkins-ref-slug',
        runId: 40,
        runNumber: 40,
        repoUrl: 'https://jenkins.com/gperdomor/nx-tools',
        sha: 'jenkins-sha',
      });
    });

    describe('When git tag is present', () => {
      beforeEach(() => {
        process.env['TAG_NAME'] = 'jenkins-tag';
      });

      it('Should be take proper context values', async () => {
        context = await Jenkins.context();

        expect(context).toEqual({
          name: 'JENKINS',
          actor: 'jenkins-actor',
          eventName: 'pull_request',
          job: 'jenkins-job',
          payload: {},
          ref: 'refs/tags/jenkins-tag',
          runId: 40,
          runNumber: 40,
          repoUrl: 'https://jenkins.com/gperdomor/nx-tools',
          sha: 'jenkins-sha',
        });
      });
    });
  });

  describe('repo', () => {
    it('Should be take proper repo values', async () => {
      const repo = await jenkins.repo();

      expect(repo).toEqual({
        default_branch: '',
        description: '',
        html_url: 'https://jenkins.com/gperdomor/nx-tools',
        license: null,
        name: 'nx-tools',
      });
    });
  });
});
