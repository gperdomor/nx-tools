import { Context } from '@actions/github/lib/context';
import { RunnerContext } from '../interfaces';
import * as github from './github';

jest.spyOn(github, 'context').mockImplementation((): Context => {
  return new Context();
});

describe('GitHub Context', () => {
  const ENV: NodeJS.ProcessEnv = process.env;
  let context: RunnerContext;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = {
      ...ENV,
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
    process.env = ENV; // Restore old environment
  });

  it('Should be take proper values', () => {
    context = github.context();

    expect(context).toMatchObject({
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
