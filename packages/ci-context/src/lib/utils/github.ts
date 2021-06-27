import * as github from '@actions/github';
import { RepoMetadata, RunnerContext } from '../interfaces';

export async function context(): Promise<RunnerContext> {
  const { actor, eventName, job, ref, runId, runNumber, sha, payload } = github.context;

  return {
    actor,
    eventName,
    job,
    payload,
    ref,
    runId,
    runNumber,
    sha,
  };
}

export async function repo(token: string): Promise<RepoMetadata> {
  const response = await github.getOctokit(token).rest.repos.get({
    ...github.context.repo,
  });

  const { default_branch, description, html_url, license, name } = response.data;

  return {
    default_branch,
    description,
    html_url,
    license,
    name,
  };
}
