import { RunnerContext } from '../interfaces';
import * as circle from './circle';

describe('CircleCI Context', () => {
  const ENV: NodeJS.ProcessEnv = process.env;
  let context: RunnerContext;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = {
      ...ENV,
      CIRCLECI: 'true',
      CI_PULL_REQUEST: 'true',
      CIRCLE_SHA1: 'circleci-sha',
      CIRCLE_BRANCH: 'circleci-ref-slug',
      CIRCLE_USERNAME: 'circleci-actor',
      CIRCLE_JOB: 'circleci-job',
      CIRCLE_BUILD_NUM: '40',
    };
  });

  afterEach(() => {
    process.env = ENV; // Restore old environment
  });

  it('Should be take proper values', () => {
    context = circle.context();

    expect(context).toMatchObject({
      actor: 'circleci-actor',
      eventName: 'pull_request',
      job: 'circleci-job',
      payload: {},
      ref: 'refs/heads/circleci-ref-slug',
      runId: 40,
      runNumber: 40,
      sha: 'circleci-sha',
    });
  });

  describe('When git tag is present', () => {
    beforeEach(() => {
      process.env.CIRCLE_TAG = 'circleci-tag';
    });

    it('Should be take proper values', () => {
      context = circle.context();

      expect(context).toMatchObject({
        actor: 'circleci-actor',
        eventName: 'pull_request',
        job: 'circleci-job',
        payload: {},
        ref: 'refs/tags/circleci-tag',
        runId: 40,
        runNumber: 40,
        sha: 'circleci-sha',
      });
    });
  });
});
