import { Vendor } from '../vendors';
import { CIContext } from './context';

export class GitLabContext extends CIContext {
  /**
   * Hydrate the context from the environment
   */
  constructor() {
    super(Vendor.GITLAB);
    const { env } = process;

    this.eventName = env.CI_PIPELINE_SOURCE;
    this.sha = env.CI_COMMIT_SHA;
    this.ref = env.CI_COMMIT_TAG ? `refs/tags/${env.CI_COMMIT_TAG}` : `refs/heads/${env.CI_COMMIT_REF_SLUG}`;
    this.actor = env.GITLAB_USER_LOGIN;
    this.job = env.CI_JOB_NAME;
    this.runNumber = parseInt(env.CI_PIPELINE_ID, 10);
    this.runId = parseInt(env.CI_PIPELINE_IID, 10);
  }
}
