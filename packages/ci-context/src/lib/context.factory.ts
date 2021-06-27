import { RunnerContext } from './interfaces';
import * as circle from './utils/circle';
import * as github from './utils/github';
import * as gitlab from './utils/gitlab';
import * as local from './utils/local';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ci = require('ci-info');

export class ContextProxyFactory {
  public static async create(): Promise<RunnerContext> {
    if (!ci.isCI) {
      return local.context();
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

    throw new Error('Unsupported runner provider');
  }
}
