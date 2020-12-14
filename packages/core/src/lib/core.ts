import { runnerProvider, RunnerProvider } from '@nx-tools/ci';
import chalk from 'chalk';
import * as os from 'os';

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

//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------

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

//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------

/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
export function setFailed(message: string | Error): void {
  process.exitCode = ExitCode.Failure;

  error(message);
}

//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------

/**
 * Gets whether Actions Step Debug is on or not
 */
export const isDebug = (): boolean => {
  return process.env['RUNNER_DEBUG'] === '1';
};

/**
 * Writes debug message to user log
 * @param message debug message
 */
export const debug = (message: string): void => {
  info(chalk.green(`::debug::${message}`));
};

/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
export const error = (message: string | Error): void => {
  info(chalk.red(`::error::${message instanceof Error ? message.toString() : message}`));
};

/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
export const warning = (message: string | Error): void => {
  info(chalk.yellow(`::warning::${message instanceof Error ? message.toString() : message}`));
};

/**
 * Writes info to log with console.log.
 * @param message info message
 */
export const info = (message: string): void => {
  process.stdout.write(message + os.EOL);
};

/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
export const startGroup = (name: string): void => {
  switch (runnerProvider()) {
    case RunnerProvider.GitLab:
      info('section_start:`date +%s`:' + name + '\re[0K');
      break;

    case RunnerProvider.GitHub:
    case RunnerProvider.Local:
    default:
      info(`::group::${name}`);
      break;
  }
};

/**
 * End an output group.
 */
export const endGroup = (name: string): void => {
  switch (runnerProvider()) {
    case RunnerProvider.GitLab:
      info('section_end:`date +%s`:' + name + '\re[0K');
      break;

    case RunnerProvider.GitHub:
    case RunnerProvider.Local:
    default:
      info('::endgroup::');
      break;
  }
};

/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
export const group = async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
  startGroup(name);

  let result: T;

  try {
    result = await fn();
  } finally {
    endGroup(name);
  }

  return result;
};

//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------

/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function saveState(name: string, value: any): void {
  // issueCommand('save-state', { name }, value);
}

/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
export function getState(name: string): string {
  return process.env[`STATE_${name}`] || '';
}

//-----------------------------------------------------------------------
// Utils Commands
//-----------------------------------------------------------------------

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const parseBoolean = (value?: boolean): 'true' | 'false' | undefined =>
  value === undefined ? undefined : value ? 'true' : 'false';
