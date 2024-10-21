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

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ci = require('ci-info');

export class ContextProxyFactory {
  public static async create(): Promise<RunnerContext> {
    switch (true) {
      case ci.AZURE_PIPELINES:
        logger.info(`CI Provider: ${ci.name}`);
        return Azure.context();

      case ci.BITBUCKET:
        logger.info(`CI Provider: ${ci.name}`);
        return BitBucket.context();

      case ci.CIRCLE:
        logger.info(`CI Provider: ${ci.name}`);
        return Circle.context();

      case ci.DRONE:
        logger.info(`CI Provider: ${ci.name}`);
        return Drone.context();

      case ci.GITHUB_ACTIONS:
        logger.info(`CI Provider: ${ci.name}`);
        return Github.context();

      case ci.GITLAB:
        logger.info(`CI Provider: ${ci.name}`);
        return Gitlab.context();

      case ci.JENKINS:
        logger.info(`CI Provider: ${ci.name}`);
        return Jenkins.context();

      case ci.SEMAPHORE:
        logger.info(`CI Provider: ${ci.name}`);
        return Semaphore.context();

      case ci.TRAVIS:
        logger.info(`CI Provider: ${ci.name}`);
        return Travis.context();

      case ci.TEAMCITY:
        logger.info(`CI Provider: ${ci.name}`);
        return Teamcity.context();

      default:
        logger.info(`Unsupported CI Provider... Using Git as fallback`);
        return Git.context();
    }
  }
}
