import { logger } from '@nx-tools/core';
import { Command } from 'commander';
import { existsSync } from 'node:fs';
import { printVerboseHook } from '../utils/debug-utils';
import { findLatestCommit } from './find-successful-pipeline';

export const defaultWorkingDirectory = '.';

export const gitlabCommand = () => {
  const command = new Command('gitlab');

  command
    .description('Find latest successful pipeline of gitlab project')
    .option('-t, --token <token>', 'Authentication token')
    .option('-o, --output <output>')
    .option('-d, --working-dir <directory>', 'The directory where your repository is located', defaultWorkingDirectory)
    .option('--verbose', 'output debug logs', false)
    .option(
      '--error-on-no-successful-pipeline <error>',
      'By default, if no successful pipeline is found on the main branch to determine the SHA, we will log a warning and use HEAD~1. Enable this option to error and exit instead.',
      false
    )
    .requiredOption(
      '-b, --branch <branch>',
      'The name of the main branch in your repo, used as the target of PRs. E.g. main, master etc',
      process.env['CI_DEFAULT_BRANCH']
    )
    .requiredOption('-p, --project <project>', 'The ID of the project.', process.env['CI_PROJECT_ID'])
    .hook('preAction', printVerboseHook)
    .action(async (options) => {
      const { branch, project, token, errorOnNoSuccessfulPipeline, output, workingDir } = options;

      if (workingDir !== defaultWorkingDirectory) {
        if (existsSync(workingDir)) {
          process.chdir(workingDir);
        } else {
          logger.warn('\n');
          logger.warn(`WARNING: Working directory '${workingDir}' doesn't exist.\n`);
        }
      }

      await findLatestCommit(project, branch, output, token, errorOnNoSuccessfulPipeline);
    });

  return command;
};
