import * as ci from '@nx-tools/ci';
import { EOL } from 'os';

/**
 * Interface for getInput options
 */
export interface InputOptions {
  /** Optional. Whether the input is required. If required and not present, will throw. Defaults to false */
  required?: boolean;
}

/**
 * The code to exit an action
 */
export enum ExitCode {
  /**
   * A code indicating that the action was successful
   */
  Success = 0,

  /**
   * A code indicating that the action was a failure
   */
  Failure = 1,
}

/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
export const getInput = (name: string, fallback?: string, options?: InputOptions): string => {
  const val: string = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || fallback || '';
  if (options && options.required && !val) {
    throw new Error(`Input required and not supplied: ${name}`);
  }

  return val.trim();
};

/**
 * Writes info to log with console.log.
 * @param message info message
 */
export function info(message: string): void {
  process.stdout.write(message + EOL);
}

/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
export function setFailed(message: string | Error): void {
  process.exitCode = ExitCode.Failure;

  info(message + EOL);
}

/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
export function startGroup(name: string): void {
  switch (ci.getProvider()) {
    case ci.PROVIDER.github:
      info(`::group::${name}`);
      break;
    case ci.PROVIDER.gitlab:
      info('section_start:`date +%s`:' + name + '\re[0K');
      break;
    default:
      info(name);
  }
}

/**
 * End an output group.
 */
export function endGroup(name: string): void {
  switch (ci.getProvider()) {
    case ci.PROVIDER.github:
      info('::endgroup::');
      break;
    case ci.PROVIDER.gitlab:
      info('section_end:`date +%s`:' + name + '\re[0K');
      break;
    default:
      info(name);
  }
}

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const parseBoolean = (value?: boolean): 'true' | 'false' | undefined =>
  value === undefined ? undefined : value ? 'true' : 'false';
