import mockedEnv, { RestoreFn } from 'mocked-env';
import { RunnerContext } from '../interfaces';
import * as devops from './azure-devops';

describe('Azure DevOps Context', () => {
  let restore: RestoreFn;
  let context: RunnerContext;

  beforeEach(() => {
    restore = mockedEnv(
      {
        BUILD_SOURCEVERSION: 'devops-sha',
        BUILD_SOURCEVERSIONAUTHOR: 'devops-actor',
        AGENT_JOBNAME: 'devops-job',
        BUILD_BUILDID: '40',
      },
      { clear: true },
    );
  });

  afterEach(() => {
    restore();
  });

  describe('When building pull requests', () => {
    beforeEach(() => {
      process.env.SYSTEM_PULLREQUEST_SOURCEBRANCH = 'refs/heads/devops-ref-slug';
      process.env.SYSTEM_PULLREQUEST_PULLREQUESTID = '123';
    });

    it('Should be take proper values', async () => {
      context = await devops.context();

      expect(context).toMatchObject({
        actor: 'devops-actor',
        eventName: 'pull_request',
        job: 'devops-job',
        payload: {},
        ref: 'refs/heads/devops-ref-slug',
        runId: 40,
        runNumber: 40,
        sha: 'devops-sha',
      });
    });
  });

  describe('When building branches', () => {
    beforeEach(() => {
      process.env.BUILD_SOURCEBRANCH = 'refs/heads/devops-ref-slug';
    });

    it('Should be take proper values', async () => {
      context = await devops.context();

      expect(context).toMatchObject({
        actor: 'devops-actor',
        eventName: 'unknown',
        job: 'devops-job',
        payload: {},
        ref: 'refs/heads/devops-ref-slug',
        runId: 40,
        runNumber: 40,
        sha: 'devops-sha',
      });
    });
  });
});
