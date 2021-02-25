import { RunnerProvider } from '../runner-provider.enum';
import { RunnerContext } from './context';

export class GitHubContext extends RunnerContext {
  /**
   * Hydrate the context from the environment
   */
  constructor() {
    super(RunnerProvider.GITHUB_ACTIONS);
    const { env } = process;

    this.eventName = env.GITHUB_EVENT_NAME;
    this.sha = env.GITHUB_SHA;
    this.ref = env.GITHUB_REF;
    this.actor = env.GITHUB_ACTOR;
    this.job = env.GITHUB_JOB;
    this.runNumber = parseInt(env.GITHUB_RUN_NUMBER, 10);
    this.runId = parseInt(env.GITHUB_RUN_ID, 10);
  }
}
