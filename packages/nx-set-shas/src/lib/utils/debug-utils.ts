import { logger } from '@nx-tools/core';
import * as chalk from 'chalk';

export const printVerboseHook = (thisCommand: any) => {
  const options = thisCommand.opts();

  if (options.verbose) {
    logger.debug(chalk.blue('CLI arguments'));
    logger.debug(chalk.blue(JSON.stringify(options, null, 2)));
  }
};
