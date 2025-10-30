import { logger } from '@nx-tools/core';
import { provider } from 'std-env';
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

export class ContextProxyFactory {
  public static async create(): Promise<RunnerContext> {
    logger.info(`CI Provider: ${provider}`);

    switch (provider) {
      case 'azure_pipelines':
        return Azure.context();

      case 'bitbucket':
        return BitBucket.context();

      case 'circle':
        return Circle.context();

      case 'drone':
        return Drone.context();

      case 'github_actions':
        return Github.context();

      case 'gitlab':
        return Gitlab.context();

      case 'hudson':
        if (process.env.JENKINS || process.env.JENKINS_URL) {
          logger.info(`Unsupported CI Provider "${provider}"... Using Jenkins as fallback`);
          return Jenkins.context();
        } else {
          logger.info(`Unsupported CI Provider "${provider}"... Using Git context as fallback`);
          return Git.context();
        }

      case 'jenkins':
        return Jenkins.context();

      case 'semaphore':
        return Semaphore.context();

      case 'travis':
        return Travis.context();

      case 'teamcity':
        return Teamcity.context();

      default:
        logger.info(`Unsupported CI Provider "${provider}"... Using Git context as fallback`);
        return Git.context();
    }
  }
}
