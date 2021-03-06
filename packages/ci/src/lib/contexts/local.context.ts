import { RunnerProvider } from '../runner-provider.enum';
import { RunnerContext } from './context';

export class LocalContext extends RunnerContext {
  /**
   * Hydrate the context from the environment
   */
  constructor() {
    super(RunnerProvider.LOCAL_MACHINE);
    const { env } = process;

    this.eventName = env.NXDOCKER_EVENT_NAME;
    this.sha = env.NXDOCKER_SHA;
    this.ref = env.NXDOCKER_REF;
    this.actor = env.NXDOCKER_ACTOR;
    this.job = env.NXDOCKER_JOB;
    this.runNumber = parseInt(env.NXDOCKER_RUN_NUMBER, 10);
    this.runId = parseInt(env.NXDOCKER_RUN_ID, 10);
  }
}
