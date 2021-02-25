import { CircleContext } from './circle.context';

describe('CircleCI Context', () => {
  let env: NodeJS.ProcessEnv;

  beforeEach(() => {
    env = process.env;
    process.env = {
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
    process.env = env;
  });

  it('Should be take proper values', () => {
    const context = new CircleContext();

    expect(context).toBeInstanceOf(CircleContext);
    expect(context).toMatchObject({
      actor: 'circleci-actor',
      eventName: 'pull_request',
      job: 'circleci-job',
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
      const context = new CircleContext();

      expect(context).toBeInstanceOf(CircleContext);
      expect(context).toMatchObject({
        actor: 'circleci-actor',
        eventName: 'pull_request',
        job: 'circleci-job',
        ref: 'refs/tags/circleci-tag',
        runId: 40,
        runNumber: 40,
        sha: 'circleci-sha',
      });
    });
  });
});
