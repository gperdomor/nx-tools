import { spawnSync } from 'node:child_process';
import { URLSearchParams } from 'node:url';

/**
 * Find last successful pipeline run on the repo
 * @param {number} project
 * @param {string} branch
 * @param {string} token
 * @returns
 */
export const findSuccessfulCommit = async ({
  lastSuccessfulEvent,
  mainBranchName,
  project,
  token,
}: {
  lastSuccessfulEvent: string;
  mainBranchName: string;
  project: string;
  token: string | undefined;
}): Promise<string | undefined> => {
  const params = new URLSearchParams({
    scope: 'finished',
    status: 'success',
    source: lastSuccessfulEvent,
    per_page: '100',
  });

  if (lastSuccessfulEvent === 'push') {
    params.append('ref', mainBranchName);
  }

  const baseUrl = process.env['CI_API_V4_URL'] ?? 'https://gitlab.com/api/v4';
  const headers: Record<string, string> = token
    ? { 'PRIVATE-TOKEN': token }
    : { 'JOB-TOKEN': process.env['CI_JOB_TOKEN'] ?? '' };

  const response = await fetch(`${baseUrl}/projects/${project}/pipelines?${params.toString()}`, {
    headers,
    signal: AbortSignal.timeout(5_000),
  });

  const json: any = await response.json();

  let shas: string[];

  if (response.ok) {
    shas = json.map((pipeline: { sha: string }) => pipeline.sha);
  } else {
    throw new Error(json.message);
  }

  return findExistingCommit(project, headers, mainBranchName, shas);
};

/**
 * Get first existing commit
 */
async function findExistingCommit(
  project: string,
  headers: Record<string, string>,
  branchName: string,
  shas: string[]
): Promise<string | undefined> {
  for (const commitSha of shas) {
    if (await commitExists(project, headers, branchName, commitSha)) {
      return commitSha;
    }
  }
  return undefined;
}

/**
 * Check if given commit is valid
 */
async function commitExists(
  project: string,
  headers: Record<string, string>,
  branchName: string,
  commitSha: string
): Promise<boolean> {
  try {
    spawnSync('git', ['cat-file', '-e', commitSha], {
      stdio: ['pipe', 'pipe', null],
    });

    const baseUrl = process.env['CI_API_V4_URL'] ?? 'https://gitlab.com/api/v4';

    // Check the commit exists in general
    let response = await fetch(`${baseUrl}/projects/${project}/repository/commits/${commitSha}`, {
      headers,
      signal: AbortSignal.timeout(5_000),
    });
    let json: any = await response.json();

    if (!response.ok) {
      throw new Error(json.message);
    }

    // Check the commit exists on the expected main branch (it will not in the case of a rebased main branch)
    const params = new URLSearchParams({
      ref_name: branchName,
      per_page: '100',
    });

    response = await fetch(`${baseUrl}/projects/${project}/repository/commits?${params.toString()}`, {
      headers,
      signal: AbortSignal.timeout(5_000),
    });
    json = await response.json();
    if (!response.ok) {
      throw new Error(json.message);
    }

    const commits = json;

    return commits.some((commit: { id: string }) => commit.id === commitSha);
  } catch {
    return false;
  }
}
