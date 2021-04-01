import { GitHubContext } from './github.context';

describe('GitHubContext', () => {
  let env: NodeJS.ProcessEnv;

  beforeEach(() => {
    env = process.env;
    process.env = {
      GITHUB_ACTIONS: 'true',
      GITHUB_EVENT_NAME: 'github-event-name',
      GITHUB_SHA: 'github-sha',
      GITHUB_REF: 'github-ref',
      GITHUB_ACTOR: 'github-actor',
      GITHUB_JOB: 'github-job',
      GITHUB_RUN_NUMBER: '20',
      GITHUB_RUN_ID: '200',
    };
  });

  afterEach(() => {
    process.env = env;
  });

  it('Should be take proper values', () => {
    const context = new GitHubContext();

    expect(context).toBeInstanceOf(GitHubContext);
    expect(context).toMatchObject({
      provider: 'GitHub Actions',
      actor: 'github-actor',
      eventName: 'github-event-name',
      job: 'github-job',
      ref: 'github-ref',
      runId: 200,
      runNumber: 20,
      sha: 'github-sha',
    });
  });
});
