import { Context } from './contexts/context';
import { GitHubContext } from './contexts/github.context';
import { GitLabContext } from './contexts/gitlab.context';
import { PROVIDER } from './enums';

let _provider: PROVIDER;
const _test = process.env.NODE_ENV === 'test';

export const getRunnerProvider = () => {
  if (process.env.GITHUB_ACTIONS === 'true') {
    return PROVIDER.github;
  } else if (process.env.GITLAB_CI === 'true') {
    return PROVIDER.gitlab;
  } else if (process.env.RUN_LOCAL) {
    return PROVIDER.local;
  }
};

export const getProvider = (): string => {
  if (!_provider || _test) {
    _provider = getRunnerProvider();
  }
  return _provider;
};

export class ContextProxyFactory {
  public static create(): Context {
    switch (getProvider()) {
      case PROVIDER.github:
        return new GitHubContext();
      case PROVIDER.gitlab:
        return new GitLabContext();
      default:
        throw new Error('A CI context is required');
    }
  }
}
