import { RunnerProvider } from './runner-provider.enum';

let _provider: RunnerProvider;

export const getRunnerProvider = () => {
  if (process.env.GITHUB_ACTIONS === 'true') {
    return RunnerProvider.GitHub;
  } else if (process.env.GITLAB_CI === 'true') {
    return RunnerProvider.GitLab;
  } else if (process.env.RUN_LOCAL) {
    return RunnerProvider.Local;
  } else {
    throw new Error('Unknown runner provider');
  }
};

export const runnerProvider = (): RunnerProvider => {
  return getRunnerProvider();
  // if (!_provider) {
  //   _provider = getRunnerProvider();
  // }
  // return _provider;
};
