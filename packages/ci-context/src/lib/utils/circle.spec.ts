import mockedEnv, { RestoreFn } from 'mocked-env';
import { RunnerContext } from '../interfaces';
import * as circle from './circle';
import { Circle } from './circle';

describe('CircleCI Context', () => {
  let restore: RestoreFn;
  let context: RunnerContext;

  beforeEach(() => {
    restore = mockedEnv(
      {
        CIRCLECI: 'true',
        CI_PULL_REQUEST: 'true',
        CIRCLE_SHA1: 'circleci-sha',
        CIRCLE_BRANCH: 'circleci-ref-slug',
        CIRCLE_USERNAME: 'circleci-actor',
        CIRCLE_JOB: 'circleci-job',
        CIRCLE_BUILD_NUM: '30',
        CIRCLE_REPOSITORY_URL: 'https://circle.com/gperdomor/nx-tools',
        CIRCLE_PROJECT_REPONAME: 'nx-tools',
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
      context = await Circle.context();

      expect(context).toEqual({
        name: 'CIRCLE',
        actor: 'circleci-actor',
        eventName: 'pull_request',
        job: 'circleci-job',
        payload: {},
        ref: 'refs/heads/circleci-ref-slug',
        runId: 30,
        runNumber: 30,
        repoUrl: 'https://circle.com/gperdomor/nx-tools',
        sha: 'circleci-sha',
      });
    });

    it('Should be take proper context values - no pr', async () => {
      delete process.env['CI_PULL_REQUEST'];
      context = await Circle.context();

      expect(context).toEqual({
        name: 'CIRCLE',
        actor: 'circleci-actor',
        eventName: 'unknown',
        job: 'circleci-job',
        payload: {},
        ref: 'refs/heads/circleci-ref-slug',
        runId: 30,
        runNumber: 30,
        repoUrl: 'https://circle.com/gperdomor/nx-tools',
        sha: 'circleci-sha',
      });
    });

    describe('When git tag is present', () => {
      let restore: RestoreFn;

      beforeEach(() => {
        restore = mockedEnv({
          CIRCLE_TAG: 'circleci-tag',
        });
      });

      afterEach(() => {
        restore();
      });

      it('Should be take proper context values', async () => {
        context = await Circle.context();

        expect(context).toEqual({
          name: 'CIRCLE',
          actor: 'circleci-actor',
          eventName: 'pull_request',
          job: 'circleci-job',
          payload: {},
          ref: 'refs/tags/circleci-tag',
          runId: 30,
          runNumber: 30,
          repoUrl: 'https://circle.com/gperdomor/nx-tools',
          sha: 'circleci-sha',
        });
      });
    });
  });

  describe('repo', () => {
    it('Should be take proper repo values', async () => {
      const repo = await circle.repo();

      expect(repo).toMatchObject({
        default_branch: '',
        description: '',
        html_url: 'https://circle.com/gperdomor/nx-tools',
        license: null,
        name: 'nx-tools',
      });
    });
  });
});
