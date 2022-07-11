import { logger } from '@nrwl/devkit';
import { bold, cyan, gray, inverse, reset } from 'colorette';

//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------

/**
 * Gets whether Actions Step Debug is on or not
 */
export function isDebug(): boolean {
  return process.env['RUNNER_DEBUG'] === '1';
}

/**
 * Writes debug message to user log
 * @param message debug message
 */
export function debug(message: string): void {
  logger.debug(message);
}

/**
 * Writes error to log with console.log
 * @param message error issue message. Errors will be converted to string via toString()
 */
export function error(message: string | Error): void {
  logger.error(message instanceof Error ? message.toString() : message);
}

/**
 * Writes warning to log with console.log
 * @param message warning issue message. Errors will be converted to string via toString()
 */
export function warning(message: string | Error): void {
  logger.warn(message instanceof Error ? message.toString() : message);
}

/**
 * Writes notice to log with console.log
 * @param message notice issue message. Errors will be converted to string via toString()
 */
export function notice(message: string | Error): void {
  logger.log(message instanceof Error ? message.toString() : message);
}

/**
 * Writes info to log with console.log.
 * @param message info message
 */
export function info(message: string): void {
  logger.info(message);
}

export const GROUP_PREFIX = (prefix: string) => {
  const trimmed = prefix.trim();

  if (trimmed.length === 0) {
    return `${cyan('>')}`;
  }

  return `${cyan('>')} ${reset(inverse(bold(gray(` ${trimmed} `))))}`;
};

/**
 * Writes group header info to log with console.log.
 * @param message info message
 */
export function startGroup(message: string, prefix = ''): void {
  console.info(`\n${GROUP_PREFIX(prefix)} ${bold(message)}\n`);
}
