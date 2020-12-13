import { RunnerProvider } from '../runner-provider.enum';
import { RunnerContext } from './context';

export class LocalContext extends RunnerContext {
  /**
   * Hydrate the context from the environment
   */
  constructor() {
    super(RunnerProvider.Local);
    this.eventName = process.env.COMMIT_EVENT_NAME as string;
    this.sha = process.env.COMMIT_SHA as string;
    this.ref = process.env.COMMIT_REF as string;
    // this.workflow = process.env.COMMIT_WORKFLOW as string;
    this.action = process.env.COMMIT_ACTION as string;
    this.actor = process.env.COMMIT_ACTOR as string;
    this.job = process.env.COMMIT_JOB as string;
    this.runNumber = parseInt(process.env.COMMIT_RUN_NUMBER as string, 10);
    this.runId = parseInt(process.env.COMMIT_RUN_ID as string, 10);
  }
}
