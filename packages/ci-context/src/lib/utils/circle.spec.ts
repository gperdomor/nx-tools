import mockedEnv, { RestoreFn } from 'mocked-env';
import { RunnerContext } from '../interfaces';
import * as circle from './circle';

describe('CircleCI Context', () => {
  let restore: RestoreFn;
  let context: RunnerContext;

  beforeEach(() => {
    restore = mockedEnv({
      CIRCLECI: 'true',
      CI_PULL_REQUEST: 'true',
      CIRCLE_SHA1: 'circleci-sha',
      CIRCLE_BRANCH: 'circleci-ref-slug',
      CIRCLE_USERNAME: 'circleci-actor',
      CIRCLE_JOB: 'circleci-job',
      CIRCLE_BUILD_NUM: '40',
    });
  });

  afterEach(() => {
    restore();
  });

  it('Should be take proper values', async () => {
    context = await circle.context();

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
    let restore: RestoreFn;

    beforeEach(() => {
      restore = mockedEnv({
        CIRCLE_TAG: 'circleci-tag',
      });
    });

    afterEach(() => {
      restore();
    });

    it('Should be take proper values', async () => {
      context = await circle.context();

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
