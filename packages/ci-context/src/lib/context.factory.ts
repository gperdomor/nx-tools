import { logger } from '@nx-tools/core';
import { RunnerContext } from './interfaces';
import * as azure from './utils/azure-devops';
import * as bitbucket from './utils/bitbucket';
import * as circle from './utils/circle';
import * as drone from './utils/drone';
import * as github from './utils/github';
import * as gitlab from './utils/gitlab';
import * as jenkins from './utils/jenkins';
import * as local from './utils/local';
import * as semaphore from './utils/semaphore';
import * as teamcity from './utils/teamcity';
import * as travis from './utils/travis';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ci = require('ci-info');

export class ContextProxyFactory {
  public static async create(): Promise<RunnerContext> {
    logger.startGroup('CI Context', 'Getting CI Provider');

    if (ci.AZURE_PIPELINES) {
      logger.info(`CI Provider: ${ci.name}`);
      return azure.context();
    }

    if (ci.BITBUCKET) {
      logger.info(`CI Provider: ${ci.name}`);
      return bitbucket.context();
    }

    if (ci.CIRCLE) {
      logger.info(`CI Provider: ${ci.name}`);
      return circle.context();
    }

    if (ci.DRONE) {
      logger.info(`CI Provider: ${ci.name}`);
      return drone.context();
    }

    if (ci.GITHUB_ACTIONS) {
      logger.info(`CI Provider: ${ci.name}`);
      return github.context();
    }

    if (ci.GITLAB) {
      logger.info(`CI Provider: ${ci.name}`);
      return gitlab.context();
    }

    if (ci.JENKINS) {
      logger.info(`CI Provider: ${ci.name}`);
      return jenkins.context();
    }

    if (ci.SEMAPHORE) {
      logger.info(`CI Provider: ${ci.name}`);
      return semaphore.context();
    }

    if (ci.TRAVIS) {
      logger.info(`CI Provider: ${ci.name}`);
      return travis.context();
    }

    if (ci.TEAMCITY) {
      logger.info(`CI Provider: ${ci.name}`);
      return teamcity.context();
    }

    if (!ci.isCI || process.env['CI_CONTEXT_FALLBACK_TO_LOCAL']?.toLowerCase() === 'true') {
      logger.info(`Unsupported CI Provider... Using Local Environment as fallback`);
      return local.context();
    }

    throw new Error('Unsupported CI Provider');
  }
}
