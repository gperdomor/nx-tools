import { RepoMetadata } from './interfaces';
import * as circle from './utils/circle';
import * as github from './utils/github';
import * as gitlab from './utils/gitlab';
import * as jenkins from './utils/jenkins';
import * as local from './utils/local';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ci = require('ci-info');

export class RepoProxyFactory {
  public static async create(token: string): Promise<RepoMetadata> {
    if (!ci.isCI) {
      return local.repo();
    }

    if (ci.CIRCLE) {
      return circle.repo();
    }

    if (ci.GITHUB_ACTIONS) {
      return github.repo(token);
    }

    if (ci.GITLAB) {
      return gitlab.repo();
    }

    if (ci.JENKINS) {
      return jenkins.repo();
    }

    throw new Error('Unsupported repository provider');
  }
}
