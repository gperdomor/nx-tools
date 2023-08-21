import mockedEnv, { RestoreFn } from 'mocked-env';
import { RunnerContext } from '../interfaces';
import * as devops from './azure-devops';
import { Azure } from './azure-devops';

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
        BUILD_REPOSITORY_URI: 'https://azure.com/gperdomor/nx-tools',
      },
      { clear: true }
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
    restore();
  });

  describe('context', () => {
    describe('When building pull requests', () => {
      beforeEach(() => {
        process.env['SYSTEM_PULLREQUEST_SOURCEBRANCH'] = 'refs/heads/devops-ref-slug';
        process.env['SYSTEM_PULLREQUEST_PULLREQUESTID'] = '123';
      });

      it('Should be take proper context values', async () => {
        context = await Azure.context();

        expect(context).toEqual({
          name: 'AZURE',
          actor: 'devops-actor',
          eventName: 'pull_request',
          job: 'devops-job',
          payload: {},
          ref: 'refs/heads/devops-ref-slug',
          runId: 40,
          runNumber: 40,
          repoUrl: 'https://azure.com/gperdomor/nx-tools',
          sha: 'devops-sha',
        });
      });
    });

    describe('When building branches', () => {
      beforeEach(() => {
        process.env['BUILD_SOURCEBRANCH'] = 'refs/heads/devops-ref-slug';
      });

      it('Should be take proper context values', async () => {
        context = await Azure.context();

        expect(context).toEqual({
          name: 'AZURE',
          actor: 'devops-actor',
          eventName: 'unknown',
          job: 'devops-job',
          payload: {},
          ref: 'refs/heads/devops-ref-slug',
          runId: 40,
          runNumber: 40,
          repoUrl: 'https://azure.com/gperdomor/nx-tools',
          sha: 'devops-sha',
        });
      });
    });
  });

  describe('repo', () => {
    it('Should be take proper repo values', async () => {
      const repo = await devops.repo();

      expect(repo).toEqual({
        default_branch: '',
        description: '',
        html_url: 'https://azure.com/gperdomor/nx-tools',
        license: null,
        name: 'devops-job',
      });
    });
  });
});
