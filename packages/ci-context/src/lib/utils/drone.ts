/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { RepoMetadata, RunnerContext } from '../interfaces';

export async function context(): Promise<RunnerContext> {
  return {
    actor: process.env['DRONE_COMMIT_AUTHOR']!,
    eventName: process.env['DRONE_BUILD_EVENT']!,
    job: process.env['DRONE_STAGE_NAME']!,
    payload: {},
    ref: process.env['DRONE_COMMIT_REF']!,
    runId: parseInt(process.env['DRONE_BUILD_NUMBER']!, 10),
    runNumber: parseInt(process.env['DRONE_BUILD_NUMBER']!, 10),
    sha: process.env['DRONE_COMMIT_SHA']!,
  };
}

export async function repo(): Promise<RepoMetadata> {
  return {
    default_branch: process.env['DRONE_REPO_BRANCH']!,
    description: '',
    html_url: process.env['DRONE_REPO_LINK']!,
    license: null,
    name: process.env['DRONE_REPO']!,
  };
}
