import mockedEnv, { RestoreFn } from 'mocked-env';
import { RunnerContext } from '../interfaces';
import * as local from './local';

jest.mock('./local-helpers', () => {
  return {
    __esModule: true,
    getSha: jest.fn(() => 'local-sha'),
    getRef: jest.fn(() => 'local-ref'),
    getCommitUserEmail: jest.fn(() => 'local-actor'),
  };
});

describe('LocalContext', () => {
  let restore: RestoreFn;
  let context: RunnerContext;

  beforeEach(() => {
    restore = mockedEnv({ PATH: process.env['PATH'] }, { clear: true });
  });

  afterEach(() => {
    restore();
  });

  it('Should be take proper values', async () => {
    context = await local.context();

    expect(context).toMatchObject({
      actor: 'local-actor',
      eventName: 'push',
      job: 'build',
      payload: {},
      ref: 'local-ref',
      runId: 0,
      runNumber: 0,
      sha: 'local-sha',
    });
  });
});
