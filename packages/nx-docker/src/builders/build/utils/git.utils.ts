import { GitReferenceType } from '../enums/git.enum';
import { GitReference } from '../interfaces';
import { isAppveyor, isAzurePipelines, isCircleCI, isGithubActions, isGitlabCI, isTravis } from './ci.utils';

export const getCommitSha = (): string => {
  if (isGitlabCI() && process.env.CI_COMMIT_SHA != null) {
    return process.env.CI_COMMIT_SHA;
  }

  if (isGithubActions() && process.env.GITHUB_SHA != null) {
    return process.env.GITHUB_SHA;
  }

  if (isCircleCI() && process.env.CIRCLE_SHA1 != null) {
    return process.env.CIRCLE_SHA1;
  }

  if (isAppveyor() && process.env.APPVEYOR_REPO_COMMIT != null) {
    return process.env.APPVEYOR_REPO_COMMIT;
  }

  if (isTravis() && process.env.TRAVIS_COMMIT != null) {
    return process.env.TRAVIS_COMMIT;
  }

  const branchCommitId = process.env.BUILD_SOURCEVERSION;
  // this check is for a CI build from a local branch
  if (isAzurePipelines() && branchCommitId != null) {
    return branchCommitId;
  }

  const pullRequestCommitId = process.env.SYSTEM_PULLREQUEST_SOURCECOMMITID;
  if (isAzurePipelines() && pullRequestCommitId != null) {
    return pullRequestCommitId;
  }

  // Generic Fallback
  if (process.env.GIT_COMMIT_SHA != null) {
    return process.env.GIT_COMMIT_SHA;
  }

  throw new Error(
    `Unable to get the SHA for the current build. Check the documentation for the expected environment variables.`,
  );
};

export const getCommitRef = (): string => {
  if (isGitlabCI() && process.env.CI_COMMIT_REF_NAME != null) {
    if (process.env.CI_COMMIT_TAG != null) {
      return `refs/tags/${process.env.CI_COMMIT_REF_NAME}`;
    }

    if (process.env.CI_MERGE_REQUEST_ID != null) {
      return `refs/pull/${process.env.CI_COMMIT_REF_NAME}`;
    }

    return `refs/heads/${process.env.CI_COMMIT_REF_NAME}`;
  }

  if (isGithubActions() && process.env.GITHUB_REF != null) {
    return process.env.GITHUB_REF;
  }

  if (isCircleCI() && process.env.CIRCLE_BRANCH != null) {
    if (process.env.CIRCLE_TAG != null) {
      return `refs/tags/${process.env.CIRCLE_TAG}`;
    }

    if (process.env.CIRCLE_PULL_REQUEST != null) {
      return `refs/pull/${process.env.CIRCLE_BRANCH}`;
    }

    return `refs/heads/${process.env.CIRCLE_BRANCH}`;
  }

  if (isAppveyor() && process.env.APPVEYOR_REPO_BRANCH != null) {
    if (process.env.APPVEYOR_REPO_TAG === 'true') {
      return `refs/tags/${process.env.APPVEYOR_REPO_TAG_NAME}`;
    }

    if (process.env.APPVEYOR_PULL_REQUEST_NUMBER != null) {
      return `refs/pull/${process.env.APPVEYOR_REPO_BRANCH}`;
    }

    return `refs/heads/${process.env.APPVEYOR_REPO_BRANCH}`;
  }

  if (isTravis() && process.env.TRAVIS_BRANCH != null) {
    if (process.env.TRAVIS_TAG != null) {
      return `refs/tags/${process.env.TRAVIS_TAG}`;
    }

    if (process.env.TRAVIS_PULL_REQUEST !== 'false') {
      return `refs/pull/${process.env.TRAVIS_BRANCH}`;
    }

    return `refs/heads/${process.env.TRAVIS_BRANCH}`;
  }

  if (isAzurePipelines() && process.env.BUILD_SOURCEBRANCH) {
    return process.env.BUILD_SOURCEBRANCH;
  }

  // Generic Fallback
  if (process.env.GIT_COMMIT_REF != null) {
    return process.env.GIT_COMMIT_REF;
  }

  throw new Error(
    `Unable to get the REF for the current build. Check the documentation for the expected environment variables.`,
  );
};

export const getCommitRepository = (): string => {
  if (isGitlabCI() && process.env.CI_REPOSITORY_URL != null) {
    return process.env.CI_REPOSITORY_URL;
  }

  if (isGithubActions() && process.env.GITHUB_REPOSITORY != null) {
    return `https://github.com/${process.env.GITHUB_REPOSITORY}`;
  }

  if (isCircleCI() && process.env.CIRCLE_REPOSITORY_URL != null) {
    return process.env.CIRCLE_REPOSITORY_URL;
  }

  if (isAppveyor() && process.env.APPVEYOR_REPO_NAME != null) {
    return `https://${process.env.APPVEYOR_REPO_PROVIDER}.com/${process.env.APPVEYOR_REPO_NAME}`;
  }

  if (isTravis() && process.env.TRAVIS_REPO_SLUG != null) {
    return `https://github.com/${process.env.TRAVIS_COMMIT}`;
  }

  if (isAzurePipelines() && process.env.BUILD_REPOSITORY_URI != null) {
    return process.env.BUILD_REPOSITORY_URI;
  }

  // Generic Fallback
  if (process.env.GIT_REPO != null) {
    return process.env.GIT_REPO;
  }

  throw new Error(
    `Unable to get the repository for the current build. Check the documentation for the expected environment variables.`,
  );
};

export const parseGitRef = (ref: string): GitReference => {
  const splited = ref.split('/', 3);

  if (splited.length === 3) {
    const name = splited[2];
    switch (splited[1]) {
      case 'heads':
        return { type: GitReferenceType.GitRefHead, name };
      case 'pull':
        return { type: GitReferenceType.GitRefPullRequest, name };
      case 'tags':
        return { type: GitReferenceType.GitRefTag, name };
    }
  }
  return { type: GitReferenceType.GitRefUnknown, name };
};
