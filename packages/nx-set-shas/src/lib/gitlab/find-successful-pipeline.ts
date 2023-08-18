import { logger } from '@nx-tools/core';
import * as chalk from 'chalk';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fetch } from 'undici';
import { findExistingCommit, getBase, getHead } from '../utils/git-utils';

export const findLatestCommit = async (
  project: number,
  branch: string,
  output: string,
  token: string,
  errorOnNoSuccessfulPipeline: boolean
) => {
  let BASE_SHA;
  const eventName = process.env['CI_MERGE_REQUEST_ID'] ? 'pull_request' : '';
  let HEAD_SHA = process.env['CI_COMMIT_SHA'] || getHead();

  if (eventName === 'pull_request') {
    BASE_SHA = getBase(branch);
  } else {
    try {
      BASE_SHA = await findSuccessfulCommit(project, branch, token);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      logger.error(`${e.message}\n`);
      process.exit(1);
    }

    if (!BASE_SHA) {
      if (errorOnNoSuccessfulPipeline) {
        reportFailure(branch);
        process.exit(1);
      } else {
        logger.warn('\n');
        logger.warn(`WARNING: Unable to find a successful pipeline run on 'origin/${branch}'\n`);
        logger.warn(`We are therefore defaulting to use HEAD~1 on 'origin/${branch}'\n`);
        logger.warn('\n');
        logger.warn(
          `NOTE: You can instead make this a hard error by setting flag 'error-on-no-successful-pipeline' on the running script.\n`
        );

        BASE_SHA = getBase(`${branch}~1`);
      }
    } else {
      logger.info('\n');
      logger.info(`Found the last successful pipeline run on 'origin/${branch}'\n`);
      logger.info(`Commit: ${BASE_SHA}\n\n`);
    }
  }

  const stripNewLineEndings = (sha: string) => sha.replace('\n', '');
  BASE_SHA = stripNewLineEndings(BASE_SHA);
  HEAD_SHA = stripNewLineEndings(HEAD_SHA);
  logger.info(chalk.blue(`NX_BASE: ${BASE_SHA}\n`));
  logger.info(chalk.blue(`NX_HEAD: ${HEAD_SHA}\n`));

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
    logger.info(chalk.blue(`NX_BASE and NX_HEAD environment variables have been written to '${output}'\n`));
  }
};

const reportFailure = (branchName: string) => {
  logger.error(
    `
      Unable to find a successful pipeline run on 'origin/${branchName}'
      NOTE: You have set 'error-on-no-successful-pipeline' on the script so this is a hard error.
      Is it possible that you have no runs currently on 'origin/${branchName}'?
      - If yes, then you should run the pipeline without this flag first.
      - If no, then you might have changed your git history and those commits no longer exist.\n`
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

  const url = process.env['CI_API_V4_URL'] ?? 'https://gitlab.com/api/v4';

  const response = await fetch(`${url}/projects/${project}/pipelines?${new URLSearchParams(params).toString()}`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  const json: any = await response.json();

  let shas: string[];

  if (response.ok) {
    shas = json.map((pipeline: { sha: string }) => pipeline.sha);
  } else {
    logger.error(json.message);
    process.exit(1);
  }

  return findExistingCommit(shas);
};
