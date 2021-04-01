import { LocalContext } from './local.context';

describe('LocalContext', () => {
  let env: NodeJS.ProcessEnv;

  beforeEach(() => {
    env = process.env;
    process.env = {
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
    process.env = env;
  });

  it('Should be take proper values', () => {
    const context = new LocalContext();

    expect(context).toBeInstanceOf(LocalContext);
    expect(context).toMatchObject({
      actor: 'local-actor',
      eventName: 'local-event-name',
      job: 'local-job',
      ref: 'local-ref',
      runId: 300,
      runNumber: 30,
      sha: 'local-sha',
    });
  });
});
