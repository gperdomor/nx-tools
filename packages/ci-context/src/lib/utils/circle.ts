import { RepoMetadata, RunnerContext } from '../interfaces';

export function context(): RunnerContext {
  return {
    actor: process.env.CIRCLE_USERNAME,
    eventName: process.env.CI_PULL_REQUEST ? 'pull_request' : 'unknown',
    job: process.env.CIRCLE_JOB,
    payload: {},
    ref: process.env.CIRCLE_TAG ? `refs/tags/${process.env.CIRCLE_TAG}` : `refs/heads/${process.env.CIRCLE_BRANCH}`,
    runId: parseInt(process.env.CIRCLE_BUILD_NUM, 10),
    runNumber: parseInt(process.env.CIRCLE_BUILD_NUM, 10),
    sha: process.env.CIRCLE_SHA1,
  };
}

export async function repo(token: string): Promise<RepoMetadata> {
  return {
    default_branch: '',
    description: '',
    html_url: process.env.CIRCLE_REPOSITORY_URL,
    license: null,
    name: process.env.CIRCLE_PROJECT_REPONAME,
  };
}
