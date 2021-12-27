import { info, startGroup } from '@nx-tools/core';
import { RunnerContext } from './interfaces';
import * as azure from './utils/azure-devops';
import * as bitbucket from './utils/bitbucket';
import * as circle from './utils/circle';
import * as github from './utils/github';
import * as gitlab from './utils/gitlab';
import * as jenkins from './utils/jenkins';
import * as local from './utils/local';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ci = require('ci-info');

export class ContextProxyFactory {
  public static async create(): Promise<RunnerContext> {
    startGroup('Getting CI Provider', 'CI Context');

    if (ci.BITBUCKET) {
      info(`CI Provider: ${ci.name}`);
      return bitbucket.context();
    }

    if (ci.CIRCLE) {
      info(`CI Provider: ${ci.name}`);
      return circle.context();
    }

    if (ci.GITHUB_ACTIONS) {
      info(`CI Provider: ${ci.name}`);
      return github.context();
    }

    if (ci.GITLAB) {
      info(`CI Provider: ${ci.name}`);
      return gitlab.context();
    }

    if (ci.JENKINS) {
      info(`CI Provider: ${ci.name}`);
      return jenkins.context();
    }

    if (ci.AZURE_PIPELINES) {
      info(`CI Provider: ${ci.name}`);
      return azure.context();
    }

    if (!ci.isCI || process.env['CI_CONTEXT_FALLBACK_TO_LOCAL']?.toLowerCase() === 'true') {
      info(`Unsupported CI Provider... Using Local Environment as fallback`);
      return local.context();
    }

    throw new Error('Unsupported CI Provider');
  }
}
