import { RunnerProvider } from './runner-provider.enum';

export const getRunnerProvider = () => {
  if (process.env.GITHUB_ACTIONS == 'true') {
    return RunnerProvider.GitHub;
  } else if (process.env.GITLAB_CI == 'true') {
    return RunnerProvider.GitLab;
  } else if (process.env.RUN_LOCAL) {
    return RunnerProvider.Local;
  } else {
    throw new Error('Unknown runner provider');
  }
};
