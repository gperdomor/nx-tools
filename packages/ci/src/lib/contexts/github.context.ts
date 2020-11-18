import { Context } from './context';

export class GitHubContext extends Context {
  /**
   * Hydrate the context from the environment
   */
  constructor() {
    super();
    this.eventName = process.env.GITHUB_EVENT_NAME as string;
    this.sha = process.env.GITHUB_SHA as string;
    this.ref = process.env.GITHUB_REF as string;
    // this.workflow = process.env.GITHUB_WORKFLOW as string;
    this.action = process.env.GITHUB_ACTION as string;
    this.actor = process.env.GITHUB_ACTOR as string;
    this.job = process.env.GITHUB_JOB as string;
    this.runNumber = parseInt(process.env.GITHUB_RUN_NUMBER as string, 10);
    this.runId = parseInt(process.env.GITHUB_RUN_ID as string, 10);
  }
}
