import { logger as l } from '@nx/devkit';
import * as os from 'node:os';
import { provider } from 'std-env';
import c from 'tinyrainbow';

export const escapeData = (s: string): string => {
  return s.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
};

/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name: string): void {
  switch (provider) {
    case 'github_actions':
      return console.log(`::group::${escapeData(name)}${os.EOL}`);
    case 'gitlab': {
      const timestamp = Math.floor(Date.now() / 1000);
      return console.log(`\x1b[0Ksection_start:${timestamp}:${name}[collapsed=${true}]\r\x1b[0K${name}`);
    }
    default:
      console.log(`${os.EOL}${c.cyan('>')} ${c.inverse(c.bold(c.cyan(` ${name} `)))}${os.EOL}`);
  }
}

/**
 * End an output group.
 */
function endGroup(name: string): void {
  switch (provider) {
    case 'github_actions':
      return console.log(`::endgroup::${os.EOL}`);
    case 'gitlab': {
      const timestamp = Math.floor(Date.now() / 1000);
      return console.log(`\x1b[0Ksection_end:${timestamp}:${name}\r\x1b[0K`);
    }
    default:
      return console.log(os.EOL);
  }
}

/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
async function group<T>(name: string, fn: () => Promise<T>): Promise<T> {
  startGroup(name);

  let result: T;

  try {
    result = await fn();
  } finally {
    endGroup(name);
  }

  return result;
}

export const logger = {
  warn: l.warn,
  error: l.error,
  info: l.info,
  log: l.log,
  debug: l.debug,
  fatal: l.fatal,
  verbose: l.verbose,
  startGroup,
  endGroup,
  group,
};
