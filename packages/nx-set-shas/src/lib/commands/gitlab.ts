import { blue, red, yellow } from 'colorette';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fetch } from 'undici';
import { findExistingCommit } from '../utils/git-utils';

export const defaultWorkingDirectory = '.';

export const gitlab = async (options: any) => {
  const { branch, project, token, errorOnNoSuccessfulPipeline, output, workingDir } = options;

  if (workingDir !== defaultWorkingDirectory) {
    if (existsSync(workingDir)) {
      process.chdir(workingDir);
    } else {
      process.stdout.write('\n');
      process.stdout.write(yellow(`WARNING: Working directory '${workingDir}' doesn't exist.\n`));
    }
  }

  let BASE_SHA;
  const eventName = process.env['CI_MERGE_REQUEST_ID'] ? 'pull_request' : '';
  let HEAD_SHA = process.env['CI_COMMIT_SHA'] || execSync(`git rev-parse HEAD`, { encoding: 'utf-8' }).trim();

  if (eventName === 'pull_request') {
    BASE_SHA = execSync(`git merge-base origin/${branch} HEAD`, { encoding: 'utf-8' });
  } else {
    try {
      BASE_SHA = await findSuccessfulCommit(project, branch, token);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      process.stdout.write(`${red(e.message)}\n`);
      process.exit(1);
    }

    if (!BASE_SHA) {
      if (errorOnNoSuccessfulPipeline) {
        reportFailure(branch);
        process.exit(1);
      } else {
        process.stdout.write('\n');
        process.stdout.write(yellow(`WARNING: Unable to find a successful pipeline run on 'origin/${branch}'\n`));
        process.stdout.write(yellow(`We are therefore defaulting to use HEAD~1 on 'origin/${branch}'\n`));
        process.stdout.write('\n');
        process.stdout.write(
          yellow(
            `NOTE: You can instead make this a hard error by setting flag 'error-on-no-successful-pipeline' on the running script.\n`
          )
        );

        BASE_SHA = execSync(`git rev-parse origin/${branch}~1`, { encoding: 'utf-8' });
      }
    } else {
      process.stdout.write('\n');
      process.stdout.write(`Found the last successful pipeline run on 'origin/${branch}'\n`);
      process.stdout.write(`Commit: ${BASE_SHA}\n\n`);
    }
  }

  const stripNewLineEndings = (sha: string) => sha.replace('\n', '');
  BASE_SHA = stripNewLineEndings(BASE_SHA);
  HEAD_SHA = stripNewLineEndings(HEAD_SHA);
  process.stdout.write(blue(`NX_BASE: ${BASE_SHA}\n`));
  process.stdout.write(blue(`NX_HEAD: ${HEAD_SHA}\n`));

  let lines: string[] = [];

  if (output) {
    if (existsSync(output)) {
      const variables = readFileSync(output).toString('utf-8').split('\n');
      lines = variables.filter(
        (variable) => !(variable.startsWith('NX_BASE') || variable.startsWith('NX_HEAD') || variable === '')
      );
    }
    lines.push(`NX_BASE=${BASE_SHA}`, `NX_HEAD=${HEAD_SHA}`);
    writeFileSync(output, lines.join('\n'), { encoding: 'utf-8' });
    process.stdout.write(blue(`NX_BASE and NX_HEAD environment variables have been written to '${output}'\n`));
  }
};

const reportFailure = (branchName: string) => {
  process.stdout.write(
    red(`
      Unable to find a successful pipeline run on 'origin/${branchName}'
      NOTE: You have set 'error-on-no-successful-pipeline' on the script so this is a hard error.
      Is it possible that you have no runs currently on 'origin/${branchName}'?
      - If yes, then you should run the pipeline without this flag first.
      - If no, then you might have changed your git history and those commits no longer exist.\n`)
  );
};

/**
 * Find last successful pipeline run on the repo
 * @param {number} project
 * @param {string} branch
 * @param {string} token
 * @returns
 */
const findSuccessfulCommit = async (
  project: number,
  branch: string,
  token: string | undefined
): Promise<string | undefined> => {
  const params: Record<string, string> = {
    scope: 'finished',
    status: 'success',
    ref: branch,
    per_page: '50',
  };

  const response = await fetch(
    `${process.env['CI_API_V4_URL']}/projects/${project}/pipelines?${new URLSearchParams(params).toString()}`,
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    }
  );

  const json: any = await response.json();

  let shas: string[];

  if (response.ok) {
    shas = json.map((pipeline: { sha: string }) => pipeline.sha);
  } else {
    process.stdout.write(red(json.message));
    process.exit(1);
  }

  return findExistingCommit(shas);
};
