import mockedEnv, { RestoreFn } from 'mocked-env';
import { RunnerContext } from '../interfaces';
import * as drone from './drone';
import { Drone } from './drone';

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
    jest.restoreAllMocks();
    restore();
  });

  describe('context', () => {
    it('Should be take proper cotext values', async () => {
      context = await Drone.context();

      expect(context).toEqual({
        name: 'DRONE',
        actor: 'drone-actor',
        eventName: 'drone-event-name',
        job: 'drone-job',
        payload: {
          repository: {
            private: false,
          },
        },
        ref: 'refs/heads/drone-ref',
        runId: 100,
        runNumber: 100,
        repoUrl: 'https://drone.com/gperdomor/nx-tools',
        sha: 'drone-sha',
      });
    });

    describe('When git tag is present', () => {
      let restore: RestoreFn;

      beforeEach(() => {
        restore = mockedEnv({
          DRONE_COMMIT_REF: 'refs/tags/drone-v1.0.0',
          DRONE_REPO_PRIVATE: 'true',
        });
      });

      afterEach(() => {
        restore();
      });

      it('Should be take proper context values', async () => {
        context = await Drone.context();

        expect(context).toEqual({
          name: 'DRONE',
          actor: 'drone-actor',
          eventName: 'drone-event-name',
          job: 'drone-job',
          payload: {
            repository: {
              private: true,
            },
          },
          ref: 'refs/tags/drone-v1.0.0',
          runId: 100,
          runNumber: 100,
          repoUrl: 'https://drone.com/gperdomor/nx-tools',
          sha: 'drone-sha',
        });
      });
    });
  });

  describe('repo', () => {
    it('Should be take proper repo values', async () => {
      const repo = await drone.repo();

      expect(repo).toEqual({
        default_branch: 'drone-main',
        description: '',
        html_url: 'https://drone.com/gperdomor/nx-tools',
        license: null,
        name: 'gperdomor/nx-tools',
      });
    });
  });
});
