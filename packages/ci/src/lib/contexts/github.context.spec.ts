import { RunnerProvider } from '../runner-provider.enum';
import { GitHubContext } from './github.context';

describe('GitHubContext', () => {
  beforeEach(() => {
    process.env.GITHUB_EVENT_NAME = 'github-event-name';
    process.env.GITHUB_SHA = 'github-sha';
    process.env.GITHUB_REF = 'github-ref';
    process.env.GITHUB_ACTION = 'github-action';
    process.env.GITHUB_ACTOR = 'github-actor';
    process.env.GITHUB_JOB = 'github-job';
    process.env.GITHUB_RUN_NUMBER = '20';
    process.env.GITHUB_RUN_ID = '200';
  });

  it('Should be take proper values', () => {
    const context = new GitHubContext();

    expect(context).toBeInstanceOf(GitHubContext);
    expect(context.provider).toEqual(RunnerProvider.GitHub);
    expect(context.eventName).toEqual('github-event-name');
    expect(context.sha).toEqual('github-sha');
    expect(context.ref).toEqual('github-ref');
    expect(context.action).toEqual('github-action');
    expect(context.actor).toEqual('github-actor');
    expect(context.job).toEqual('github-job');
    expect(context.runNumber).toEqual(20);
    expect(context.runId).toEqual(200);
  });
});
