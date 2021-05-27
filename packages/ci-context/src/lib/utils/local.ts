import { RepoMetadata, RunnerContext } from '../interfaces';

export function context(): RunnerContext {
  return {
    actor: process.env.NXDOCKER_ACTOR,
    eventName: process.env.NXDOCKER_EVENT_NAME,
    job: process.env.NXDOCKER_JOB,
    payload: {},
    ref: process.env.NXDOCKER_REF,
    runId: parseInt(process.env.NXDOCKER_RUN_ID, 10),
    runNumber: parseInt(process.env.NXDOCKER_RUN_NUMBER, 10),
    sha: process.env.NXDOCKER_SHA,
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
