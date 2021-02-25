import { getRunnerProvider } from './ci';
import { RunnerContext } from './contexts/context';
import { GitHubContext } from './contexts/github.context';
import { GitLabContext } from './contexts/gitlab.context';
import { LocalContext } from './contexts/local.context';
import { RunnerProvider } from './runner-provider.enum';

export class RunnerContextProxyFactory {
  public static create(): RunnerContext {
    switch (getRunnerProvider()) {
      case RunnerProvider.GITLAB:
        return new GitLabContext();

      case RunnerProvider.GITHUB_ACTIONS:
        return new GitHubContext();

      case RunnerProvider.LOCAL_MACHINE:
        return new LocalContext();

      default:
        throw new Error('Unsupported runner provider');
    }
  }
}
