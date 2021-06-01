import * as circle from './utils/circle';
import * as github from './utils/github';
import * as gitlab from './utils/gitlab';
import * as local from './utils/local';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ci = require('ci-info');

export class RepoProxyFactory {
  public static async create(token: string) {
    if (!ci.isCI) {
      return local.repo(token);
    }

    if (ci.CIRCLE) {
      return circle.repo(token);
    }

    if (ci.GITHUB_ACTIONS) {
      return github.repo(token);
    }

    if (ci.GITLAB) {
      return gitlab.repo(token);
    }

    throw new Error('Unsupported repository provider');
  }
}
