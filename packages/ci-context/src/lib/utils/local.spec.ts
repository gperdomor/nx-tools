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
    };
  });

  afterEach(() => {
    process.env = ENV; // Restore old environment
  });

  it('Should be take proper values', async () => {
    jest.spyOn(local, 'getSha').mockResolvedValue('local-sha');
    jest.spyOn(local, 'getRef').mockResolvedValue('local-ref');
    jest.spyOn(local, 'getCommitUserEmail').mockResolvedValue('local-actor');

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
