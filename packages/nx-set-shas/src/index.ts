#!/usr/bin/env node
import { Command } from 'commander';
import { version } from '../package.json';
import { gitlabCommand } from './lib/gitlab/command';

const program = new Command();

program
  .name('nx-set-shas')
  .description('Sets the base and head SHAs required for `nx affected` commands in CI')
  .addCommand(gitlabCommand())
  .version(version, '-v, --version', 'Output the current version');

program.parse(process.argv);
