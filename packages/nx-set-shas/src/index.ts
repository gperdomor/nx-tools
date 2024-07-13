#!/usr/bin/env node

import { logger } from '@nx-tools/core';
import { Builtins, Cli } from 'clipanion';
import { version } from '../package.json';
import { GitLabCommand } from './lib/gitlab/command';
import { Context } from './lib/types';

const cli = new Cli<Context>({
  binaryName: `nx-set-shas`,
  binaryLabel: `Nx set SHAs`,
  binaryVersion: version,
});

cli.register(Builtins.DefinitionsCommand);
cli.register(Builtins.HelpCommand);
cli.register(Builtins.TokensCommand);
cli.register(Builtins.VersionCommand);

cli.register(GitLabCommand);

cli.runExit(process.argv.slice(2), {
  cwd: process.cwd(),
  logger: logger,
});
