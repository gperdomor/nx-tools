import { BuildOptions, Git } from '../interfaces';
import { Login } from '../interfaces/login.interface';
import { BuildBuilderSchema } from '../schema';
import { getCommitRef, getCommitRepository, getCommitSha, parseGitRef } from './git.utils';

export const getLoginOptions = (options: BuildBuilderSchema): Login => {
  const login: Login = {
    username: options.username,
    password: options.password,
  };

  if ((login.username && !login.password) || (!login.username && login.password)) {
    throw new Error('both username and password must be set to login');
  }

  return login;
};

export const getGitOptions = (): Git => ({
  repository: getCommitRepository(),
  sha: getCommitSha(),
  reference: parseGitRef(getCommitRef()),
});

export const getBuildOptions = (options: BuildBuilderSchema, projectRoot: string): BuildOptions => {
  const build: BuildOptions = {
    path: options.path,
    dockerfile: options.dockerfile || `${projectRoot}/Dockerfile`,
    addGitLabels: options.addGitLabels,
    target: options.target,
    alwaysPull: options.alwaysPull,
    cacheFroms: options.cacheFroms?.split(',') || [],
    buildArgs: options.buildArgs
      ? [...options.buildArgs.split(','), 'BUILDKIT_INLINE_CACHE=1']
      : ['BUILDKIT_INLINE_CACHE=1'],
    labels: options.labels?.split(',') || [],
  };

  return build;
};
