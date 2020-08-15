import { BuildOptions, Git, ProjectMetadata } from '../interfaces';
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

export const getBuildOptions = (options: BuildBuilderSchema, metadata: ProjectMetadata): BuildOptions => {
  const build: BuildOptions = {
    path: options.path,
    dockerfile: options.dockerfile || `${metadata.root}/Dockerfile`,
    addGitLabels: options.add_git_labels,
    target: options.target,
    alwaysPull: options.always_pull,
    cacheFroms: options.cache_froms?.split(',') || [],
    buildArgs: options.build_args?.split(',') || [],
    labels: options.labels?.split(',') || [],
  };

  return build;
};
