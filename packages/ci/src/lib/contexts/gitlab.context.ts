import { RunnerProvider } from '../runner-provider.enum';
import { RunnerContext } from './context';

export class GitLabContext extends RunnerContext {
  /**
   * Hydrate the context from the environment
   */
  constructor() {
    super(RunnerProvider.GitLab);
    this.eventName = process.env.CI_PIPELINE_SOURCE as string;
    this.sha = process.env.CI_COMMIT_SHA as string;
    this.ref = process.env.CI_COMMIT_TAG
      ? `refs/tags/${process.env.CI_COMMIT_TAG as string}`
      : `refs/heads/${process.env.CI_COMMIT_REF_SLUG as string}`;
    // this.workflow = process.env.GITHUB_WORKFLOW as string;
    this.action = process.env.CI_JOB_ID as string;
    this.actor = process.env.GITLAB_USER_LOGIN as string;
    this.job = process.env.CI_JOB_NAME as string;
    this.runNumber = parseInt(process.env.CI_PIPELINE_ID as string, 10);
    this.runId = parseInt(process.env.CI_PIPELINE_IID as string, 10);
  }
}
