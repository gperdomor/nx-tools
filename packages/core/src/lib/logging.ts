import { logger as l } from '@nrwl/devkit';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const chalk = require('chalk');

/**
 * Writes group header info to log with console.log.
 * @param message info message
 */
export function startGroup(prefix: string, message: string): void {
  console.info(`\n${chalk.cyan('>')} ${chalk.inverse(chalk.bold(chalk.cyan(` ${prefix} `)))} ${chalk.bold(message)}\n`);
}

export const logger = { ...l, startGroup };
