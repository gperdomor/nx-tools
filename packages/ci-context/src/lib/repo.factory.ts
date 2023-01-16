import { RepoMetadata } from './interfaces';
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

export class RepoProxyFactory {
  public static async create(token: string): Promise<RepoMetadata> {
    if (ci.AZURE_PIPELINES) {
      return azure.repo();
    }

    if (ci.BITBUCKET) {
      return bitbucket.repo();
    }

    if (ci.CIRCLE) {
      return circle.repo();
    }

    if (ci.DRONE) {
      return drone.repo();
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

    if (ci.SEMAPHORE) {
      return semaphore.repo();
    }

    if (ci.TRAVIS) {
      return travis.repo();
    }

    if (ci.TEAMCITY) {
      return teamcity.repo();
    }

    if (!ci.isCI || process.env['CI_CONTEXT_FALLBACK_TO_LOCAL']?.toLowerCase() === 'true') {
      return local.repo();
    }

    throw new Error('Unsupported CI Provider');
  }
}
