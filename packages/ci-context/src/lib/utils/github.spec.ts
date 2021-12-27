import { Context } from '@actions/github/lib/context';
import mockedEnv, { RestoreFn } from 'mocked-env';
import { RunnerContext } from '../interfaces';
import * as github from './github';

jest.spyOn(github, 'context').mockImplementation((): Promise<Context> => {
  return Promise.resolve(new Context());
});

describe('GitHub Context', () => {
  let restore: RestoreFn;
  let context: RunnerContext;

  beforeEach(() => {
    restore = mockedEnv(
      {
        GITHUB_ACTIONS: 'true',
        GITHUB_EVENT_NAME: 'github-event-name',
        GITHUB_SHA: 'github-sha',
        GITHUB_REF: 'github-ref',
        GITHUB_ACTOR: 'github-actor',
        GITHUB_JOB: 'github-job',
        GITHUB_RUN_NUMBER: '20',
        GITHUB_RUN_ID: '200',
      },
      { clear: true }
    );
  });

  afterEach(() => {
    restore();
  });

  it('Should be take proper values', async () => {
    context = await github.context();

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
