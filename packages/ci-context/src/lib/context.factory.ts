import { logger } from '@nx-tools/core';
import { RunnerContext } from './interfaces';
import { Azure } from './utils/azure-devops';
import { BitBucket } from './utils/bitbucket';
import { Circle } from './utils/circle';
import { Drone } from './utils/drone';
import { Git } from './utils/git';
import { Github } from './utils/github';
import { Gitlab } from './utils/gitlab';
import { Jenkins } from './utils/jenkins';
import { Semaphore } from './utils/semaphore';
import { Teamcity } from './utils/teamcity';
import { Travis } from './utils/travis';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ci = require('ci-info');

export class ContextProxyFactory {
  public static async create(): Promise<RunnerContext> {
    if (ci.AZURE_PIPELINES) {
      logger.info(`CI Provider: ${ci.name}`);
      return Azure.context();
    }

    if (ci.BITBUCKET) {
      logger.info(`CI Provider: ${ci.name}`);
      return BitBucket.context();
    }

    if (ci.CIRCLE) {
      logger.info(`CI Provider: ${ci.name}`);
      return Circle.context();
    }

    if (ci.DRONE) {
      logger.info(`CI Provider: ${ci.name}`);
      return Drone.context();
    }

    if (ci.GITHUB_ACTIONS) {
      logger.info(`CI Provider: ${ci.name}`);
      return Github.context();
    }

    if (ci.GITLAB) {
      logger.info(`CI Provider: ${ci.name}`);
      return Gitlab.context();
    }

    if (ci.JENKINS) {
      logger.info(`CI Provider: ${ci.name}`);
      return Jenkins.context();
    }

    if (ci.SEMAPHORE) {
      logger.info(`CI Provider: ${ci.name}`);
      return Semaphore.context();
    }

    if (ci.TRAVIS) {
      logger.info(`CI Provider: ${ci.name}`);
      return Travis.context();
    }

    if (ci.TEAMCITY) {
      logger.info(`CI Provider: ${ci.name}`);
      return Teamcity.context();
    }

    logger.info(`Unsupported CI Provider... Using Git as fallback`);
    return Git.context();
  }
}
