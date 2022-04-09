import { RepoMetadata, RunnerContext } from '../interfaces';
import { getCommitUserEmail, getRef, getSha } from './local-helpers';

export async function context(): Promise<RunnerContext> {
  return {
    actor: await getCommitUserEmail(),
    eventName: 'push',
    job: 'build',
    payload: {},
    ref: await getRef(),
    runId: 0,
    runNumber: 0,
    sha: await getSha(),
  };
}

export async function repo(): Promise<RepoMetadata> {
  return {
    default_branch: '',
    description: '',
    html_url: '',
    license: null,
    name: '',
  };
}
