import { RepoMetadata } from './interfaces';
import * as azure from './utils/azure-devops';
import * as bitbucket from './utils/bitbucket';
import * as circle from './utils/circle';
import * as drone from './utils/drone';
import * as git from './utils/git';
import * as github from './utils/github';
import * as gitlab from './utils/gitlab';
import * as jenkins from './utils/jenkins';
import * as semaphore from './utils/semaphore';
import * as teamcity from './utils/teamcity';
import * as travis from './utils/travis';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ci = require('ci-info');

export class RepoProxyFactory {
  public static async create(token: string): Promise<RepoMetadata> {
    switch (true) {
      case ci.AZURE_PIPELINES:
        return azure.repo();

      case ci.BITBUCKET:
        return bitbucket.repo();

      case ci.CIRCLE:
        return circle.repo();

      case ci.DRONE:
        return drone.repo();

      case ci.GITHUB_ACTIONS:
        return github.repo(token);

      case ci.GITLAB:
        return gitlab.repo();

      case ci.JENKINS:
        return jenkins.repo();

      case ci.SEMAPHORE:
        return semaphore.repo();

      case ci.TRAVIS:
        return travis.repo();

      case ci.TEAMCITY:
        return teamcity.repo();
      default:
        return git.repo();
    }
  }
}
