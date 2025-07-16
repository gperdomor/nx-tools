import { provider } from 'std-env';
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

export class RepoProxyFactory {
  public static async create(token: string): Promise<RepoMetadata> {
    switch (provider) {
      case 'azure_pipelines':
        return azure.repo();

      case 'bitbucket':
        return bitbucket.repo();

      case 'circle':
        return circle.repo();

      case 'drone':
        return drone.repo();

      case 'github_actions':
        return github.repo(token);

      case 'gitlab':
        return gitlab.repo();

      case 'jenkins':
        return jenkins.repo();

      case 'semaphore':
        return semaphore.repo();

      case 'travis':
        return travis.repo();

      case 'teamcity':
        return teamcity.repo();

      default:
        return git.repo();
    }
  }
}
