import { getRunnerProvider } from './ci';
import { RunnerContext } from './contexts/context';
import { GitHubContext } from './contexts/github.context';
import { GitLabContext } from './contexts/gitlab.context';
import { LocalContext } from './contexts/local.context';
import { RunnerProvider } from './runner-provider.enum';

export class RunnerContextProxyFactory {
  public static create(): RunnerContext {
    switch (getRunnerProvider()) {
      case RunnerProvider.GitHub:
        return new GitHubContext();
      case RunnerProvider.GitLab:
        return new GitLabContext();
      case RunnerProvider.Local:
        return new LocalContext();
    }
  }
}
