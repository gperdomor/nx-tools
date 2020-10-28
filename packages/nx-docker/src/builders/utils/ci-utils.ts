export const isGitlabCI = () => {
  return process.env.GITLAB_CI === 'true';
};

export const isGithubActions = () => {
  return process.env.GITHUB_ACTIONS === 'true';
};

export const isTravis = () => {
  return process.env.TRAVIS === 'true';
};

export const isCircleCI = () => {
  return process.env.CIRCLECI === 'true';
};

export const isAppveyor = () => {
  return process.env.APPVEYOR === 'True' || process.env.APPVEYOR === 'true';
};

export const isAzurePipelines = () => {
  return (
    process.env.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI != undefined && process.env.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI !== ''
  );
};
