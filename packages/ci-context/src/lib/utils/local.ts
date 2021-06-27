import { getExecOutput } from '@nx-tools/core';
import { RepoMetadata, RunnerContext } from '../interfaces';

export const getRef = async () => {
  const output = await getExecOutput('git symbolic-ref HEAD');
  return output.stdout.trim();
};

export const getCommitUserEmail = async () => {
  const output = await getExecOutput('git log -1 --pretty=format:%ae');
  return output.stdout.trim();
};

export const getSha = async () => {
  const output = await getExecOutput('git rev-parse HEAD');
  return output.stdout.trim();
};

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

export async function repo(token: string): Promise<RepoMetadata> {
  return {
    default_branch: '',
    description: '',
    html_url: '',
    license: null,
    name: '',
  };
}
