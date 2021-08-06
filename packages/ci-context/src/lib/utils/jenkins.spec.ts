import { RunnerContext } from '../interfaces';
import * as jenkins from './jenkins';

describe('Jenkins Context', () => {
  const ENV: NodeJS.ProcessEnv = process.env;
  let context: RunnerContext;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = {
      ...ENV,
      CI: 'true',
      CHANGE_FORK: 'pull_request',
      GIT_COMMIT: 'jenkins-sha',
      BRANCH_NAME: 'jenkins-ref-slug',
      CHANGE_AUTHOR: 'jenkins-actor',
      JOB_NAME: 'jenkins-job',
      BUILD_NUMBER: '40',
    };
  });

  afterEach(() => {
    process.env = ENV; // Restore old environment
  });

  it('Should be take proper values', async () => {
    context = await jenkins.context();

    expect(context).toMatchObject({
      actor: 'jenkins-actor',
      eventName: 'pull_request',
      job: 'jenkins-job',
      payload: {},
      ref: 'refs/heads/jenkins-ref-slug',
      runId: 40,
      runNumber: 40,
      sha: 'jenkins-sha',
    });
  });

  describe('When git tag is present', () => {
    beforeEach(() => {
      process.env.TAG_NAME = 'jenkins-tag';
    });

    it('Should be take proper values', async () => {
      context = await jenkins.context();

      expect(context).toMatchObject({
        actor: 'jenkins-actor',
        eventName: 'pull_request',
        job: 'jenkins-job',
        payload: {},
        ref: 'refs/tags/jenkins-tag',
        runId: 40,
        runNumber: 40,
        sha: 'jenkins-sha',
      });
    });
  });
});
