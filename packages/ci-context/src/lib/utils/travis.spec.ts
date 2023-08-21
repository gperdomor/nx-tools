import mockedEnv, { RestoreFn } from 'mocked-env';
import { RunnerContext } from '../interfaces';
import * as travis from './travis';
import { Travis } from './travis';

describe('Travis Context', () => {
  let restore: RestoreFn;
  let context: RunnerContext;

  beforeEach(() => {
    restore = mockedEnv(
      {
        TRAVIS: 'true',
        TRAVIS_EVENT_TYPE: 'travis-event-name',
        TRAVIS_COMMIT: 'travis-sha',
        TRAVIS_BRANCH: 'travis-ref-slug',
        USER: 'travis-actor',
        TRAVIS_JOB_NAME: 'travis-job',
        TRAVIS_BUILD_ID: '10',
        TRAVIS_BUILD_NUMBER: '100',
        TRAVIS_REPO_SLUG: 'travis/nx-tools',
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
      context = await Travis.context();

      expect(context).toEqual({
        name: 'TRAVIS',
        actor: 'travis-actor',
        eventName: 'travis-event-name',
        job: 'travis-job',
        payload: {},
        ref: 'refs/heads/travis-ref-slug',
        runId: 100,
        runNumber: 10,
        repoUrl: '',
        sha: 'travis-sha',
      });
    });

    describe('When git tag is present', () => {
      let restore: RestoreFn;

      beforeEach(() => {
        restore = mockedEnv({
          TRAVIS_TAG: 'travis-tag',
        });
      });

      afterEach(() => {
        restore();
      });

      it('Should be take proper context values', async () => {
        context = await Travis.context();

        expect(context).toEqual({
          name: 'TRAVIS',
          actor: 'travis-actor',
          eventName: 'travis-event-name',
          job: 'travis-job',
          payload: {},
          ref: 'refs/tags/travis-tag',
          runId: 100,
          runNumber: 10,
          repoUrl: '',
          sha: 'travis-sha',
        });
      });
    });
  });

  describe('repo', () => {
    it('Should be take proper repo values', async () => {
      const repo = await travis.repo();

      expect(repo).toEqual({
        default_branch: '',
        description: '',
        html_url: '',
        license: null,
        name: 'travis/nx-tools',
      });
    });
  });
});
