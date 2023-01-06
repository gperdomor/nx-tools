import mockedEnv, { RestoreFn } from 'mocked-env';
import { RunnerContext } from '../interfaces';
import * as travis from './travis';

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
    restore();
  });

  describe('context', () => {
    it('Should be take proper cotext values', async () => {
      context = await travis.context();

      expect(context).toMatchObject({
        actor: 'travis-actor',
        eventName: 'travis-event-name',
        job: 'travis-job',
        payload: {},
        ref: 'refs/heads/travis-ref-slug',
        runId: 100,
        runNumber: 10,
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
        context = await travis.context();

        expect(context).toMatchObject({
          actor: 'travis-actor',
          eventName: 'travis-event-name',
          job: 'travis-job',
          ref: 'refs/tags/travis-tag',
          runId: 100,
          runNumber: 10,
          sha: 'travis-sha',
        });
      });
    });
  });

  describe('repo', () => {
    it('Should be take proper repo values', async () => {
      const repo = await travis.repo();

      expect(repo).toMatchObject({
        default_branch: '',
        description: '',
        html_url: '',
        license: null,
        name: 'travis/nx-tools',
      });
    });
  });
});
