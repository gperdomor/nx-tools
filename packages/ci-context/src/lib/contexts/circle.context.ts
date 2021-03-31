import { Vendor } from '../vendors';
import { CIContext } from './context';

export class CircleContext extends CIContext {
  /**
   * Hydrate the context from the environment
   */
  constructor() {
    super(Vendor.CIRCLE);
    const { env } = process;

    this.eventName = env.CI_PULL_REQUEST ? 'pull_request' : 'unknown';
    this.sha = env.CIRCLE_SHA1;
    this.ref = env.CIRCLE_TAG ? `refs/tags/${env.CIRCLE_TAG}` : `refs/heads/${env.CIRCLE_BRANCH}`;
    this.actor = env.CIRCLE_USERNAME;
    this.job = env.CIRCLE_JOB;
    this.runNumber = parseInt(env.CIRCLE_BUILD_NUM, 10);
    this.runId = parseInt(env.CIRCLE_BUILD_NUM, 10);
  }
}
