import { execSync } from 'node:child_process';

/**
 * Get first existing commit
 * @param {string[]} commit_shas
 * @returns {string?}
 */
export const findExistingCommit = async (shas: string[]) => {
  for (const commitSha of shas) {
    if (await commitExists(commitSha)) {
      return commitSha;
    }
  }
  return undefined;
};

/**
 * Check if given commit is valid
 * @param {string} commitSha
 * @returns {boolean}
 */
export const commitExists = async (commitSha: string) => {
  try {
    execSync(`git cat-file -e ${commitSha}`, { stdio: ['pipe', 'pipe', null] });
    return true;
  } catch {
    return false;
  }
};

export const getHead = () => {
  return execSync(`git rev-parse HEAD`, { encoding: 'utf-8' }).trim();
};

export const getBase = (branch: string) => {
  return execSync(`git merge-base origin/${branch} HEAD`, { encoding: 'utf-8' }).trim();
};
