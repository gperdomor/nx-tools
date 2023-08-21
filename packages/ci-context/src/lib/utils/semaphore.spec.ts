import mockedEnv, { RestoreFn } from 'mocked-env';
import { RunnerContext } from '../interfaces';
import * as semaphore from './semaphore';
import { Semaphore } from './semaphore';

describe('Semaphore Context', () => {
  let restore: RestoreFn;
  let context: RunnerContext;

  beforeEach(() => {
    restore = mockedEnv(
      {
        SEMAPHORE: 'true',
        SEMAPHORE_GIT_REF_TYPE: 'semaphore-event-name',
        SEMAPHORE_JOB_NAME: 'semaphore-job',
        SEMAPHORE_GIT_REF: 'refs/heads/semaphore-ref',
        SEMAPHORE_PIPELINE_ID: '10',
        SEMAPHORE_JOB_ID: '100',
        SEMAPHORE_GIT_SHA: 'semaphore-sha',
        SEMAPHORE_GIT_URL: 'https://semaphore.com/gperdomor/nx-tools',
        SEMAPHORE_GIT_REPO_SLUG: 'gperdomor/nx-tools',
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
      context = await Semaphore.context();

      expect(context).toEqual({
        name: 'SEMAPHORE',
        actor: 'semaphore',
        eventName: 'semaphore-event-name',
        job: 'semaphore-job',
        payload: {},
        ref: 'refs/heads/semaphore-ref',
        runId: 10,
        runNumber: 100,
        repoUrl: 'https://semaphore.com/gperdomor/nx-tools',
        sha: 'semaphore-sha',
      });
    });

    describe('When git tag is present', () => {
      let restore: RestoreFn;

      beforeEach(() => {
        restore = mockedEnv({
          SEMAPHORE_GIT_REF: 'refs/tags/semaphore-tag',
        });
      });

      afterEach(() => {
        restore();
      });

      it('Should be take proper context values', async () => {
        context = await Semaphore.context();

        expect(context).toEqual({
          name: 'SEMAPHORE',
          actor: 'semaphore',
          eventName: 'semaphore-event-name',
          job: 'semaphore-job',
          payload: {},
          ref: 'refs/tags/semaphore-tag',
          runId: 10,
          runNumber: 100,
          repoUrl: 'https://semaphore.com/gperdomor/nx-tools',
          sha: 'semaphore-sha',
        });
      });
    });
  });

  describe('repo', () => {
    it('Should be take proper repo values', async () => {
      const repo = await semaphore.repo();

      expect(repo).toMatchObject({
        default_branch: '',
        description: '',
        html_url: 'https://semaphore.com/gperdomor/nx-tools',
        license: null,
        name: 'nx-tools',
      });
    });
  });
});
