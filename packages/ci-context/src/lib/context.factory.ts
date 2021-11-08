import { RunnerContext } from './interfaces';
import * as bitbucket from './utils/bitbucket';
import * as circle from './utils/circle';
import * as github from './utils/github';
import * as gitlab from './utils/gitlab';
import * as jenkins from './utils/jenkins';
import * as azure from './utils/azure-devops';
import * as local from './utils/local';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ci = require('ci-info');

export class ContextProxyFactory {
  public static async create(): Promise<RunnerContext> {
    if (!ci.isCI) {
      return local.context();
    }

    if (ci.BITBUCKET) {
      return bitbucket.context();
    }

    if (ci.CIRCLE) {
      return circle.context();
    }

    if (ci.GITHUB_ACTIONS) {
      return github.context();
    }

    if (ci.GITLAB) {
      return gitlab.context();
    }

    if (ci.JENKINS) {
      return jenkins.context();
    }

    if (ci.AZURE_PIPELINES) {
      return azure.context();
    }

    throw new Error('Unsupported CI provider');
  }
}
