import { RunnerContext } from '../interfaces';
import * as local from './local';

describe('LocalContext', () => {
  const ENV: NodeJS.ProcessEnv = process.env;
  let context: RunnerContext;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = {
      ...ENV,
      PATH: 'true',
      NXDOCKER_EVENT_NAME: 'local-event-name',
      NXDOCKER_SHA: 'local-sha',
      NXDOCKER_REF: 'local-ref',
      NXDOCKER_ACTION: 'local-action',
      NXDOCKER_ACTOR: 'local-actor',
      NXDOCKER_JOB: 'local-job',
      NXDOCKER_RUN_NUMBER: '30',
      NXDOCKER_RUN_ID: '300',
    };
  });

  afterEach(() => {
    process.env = ENV; // Restore old environment
  });

  it('Should be take proper values', () => {
    context = local.context();

    expect(context).toMatchObject({
      actor: 'local-actor',
      eventName: 'local-event-name',
      job: 'local-job',
      payload: {},
      ref: 'local-ref',
      runId: 300,
      runNumber: 30,
      sha: 'local-sha',
    });
  });
});
