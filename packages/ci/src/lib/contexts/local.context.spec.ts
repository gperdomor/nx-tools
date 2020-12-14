import { RunnerProvider } from '../runner-provider.enum';
import { LocalContext } from './local.context';

describe('LocalContext', () => {
  beforeEach(() => {
    process.env.COMMIT_EVENT_NAME = 'local-event-name';
    process.env.COMMIT_SHA = 'local-sha';
    process.env.COMMIT_REF = 'local-ref';
    process.env.COMMIT_ACTION = 'local-action';
    process.env.COMMIT_ACTOR = 'local-actor';
    process.env.COMMIT_JOB = 'local-job';
    process.env.COMMIT_RUN_NUMBER = '30';
    process.env.COMMIT_RUN_ID = '300';
  });

  it('Should be take proper values', () => {
    const context = new LocalContext();

    expect(context).toBeInstanceOf(LocalContext);
    expect(context.provider).toEqual(RunnerProvider.Local);
    expect(context.eventName).toEqual('local-event-name');
    expect(context.sha).toEqual('local-sha');
    expect(context.ref).toEqual('local-ref');
    expect(context.action).toEqual('local-action');
    expect(context.actor).toEqual('local-actor');
    expect(context.job).toEqual('local-job');
    expect(context.runNumber).toEqual(30);
    expect(context.runId).toEqual(300);
  });
});
