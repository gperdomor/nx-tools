import mockedEnv, { RestoreFn } from 'mocked-env';
import { RunnerContext } from '../interfaces';
import * as drone from './drone';

describe('Drone Context', () => {
  let restore: RestoreFn;
  let context: RunnerContext;

  beforeEach(() => {
    restore = mockedEnv(
      {
        DRONE: 'true',
        DRONE_BUILD_EVENT: 'drone-event-name',
        DRONE_COMMIT_SHA: 'drone-sha',
        DRONE_COMMIT_REF: 'refs/heads/drone-ref',
        DRONE_STAGE_NAME: 'drone-job',
        DRONE_COMMIT_AUTHOR: 'drone-actor',
        DRONE_BUILD_NUMBER: '100',
        DRONE_REPO_BRANCH: 'drone-main',
        DRONE_REPO_LINK: 'https://drone.com/gperdomor/nx-tools',
        DRONE_REPO: 'gperdomor/nx-tools',
      },
      { clear: true }
    );
  });

  afterEach(() => {
    restore();
  });

  describe('context', () => {
    it('Should be take proper cotext values', async () => {
      context = await drone.context();

      expect(context).toMatchObject({
        actor: 'drone-actor',
        eventName: 'drone-event-name',
        job: 'drone-job',
        payload: {},
        ref: 'refs/heads/drone-ref',
        runId: 100,
        runNumber: 100,
        sha: 'drone-sha',
      });
    });

    describe('When git tag is present', () => {
      let restore: RestoreFn;

      beforeEach(() => {
        restore = mockedEnv({
          DRONE_COMMIT_REF: 'refs/tags/drone-v1.0.0',
        });
      });

      afterEach(() => {
        restore();
      });

      it('Should be take proper context values', async () => {
        context = await drone.context();

        expect(context).toMatchObject({
          actor: 'drone-actor',
          eventName: 'drone-event-name',
          job: 'drone-job',
          ref: 'refs/tags/drone-v1.0.0',
          runId: 100,
          runNumber: 100,
          sha: 'drone-sha',
        });
      });
    });
  });

  describe('repo', () => {
    it('Should be take proper repo values', async () => {
      const repo = await drone.repo();

      expect(repo).toMatchObject({
        default_branch: 'drone-main',
        description: '',
        html_url: 'https://drone.com/gperdomor/nx-tools',
        license: null,
        name: 'gperdomor/nx-tools',
      });
    });
  });
});
