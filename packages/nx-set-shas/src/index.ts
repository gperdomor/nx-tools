#! /usr/bin/env node

import { Command } from 'commander';
import { version } from '../package.json';
import { defaultWorkingDirectory, gitlab } from './lib/commands/gitlab';

const program = new Command();

program
  .command('gitlab')
  .description('Find latest successful pipeline of gitlab project')
  .option('-t, --token <token>', 'Authentication token')
  .option('-o, --output <output>')
  .option('-d, --working-dir <directory>', 'The directory where your repository is located', defaultWorkingDirectory)
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
  .action(gitlab);

program.version(version, '-v, --version', 'Output the current version');

program.parse(process.argv);
