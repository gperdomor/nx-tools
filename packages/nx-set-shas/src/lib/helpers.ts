import * as semver from 'semver';
import { Context } from './types';

export const validateNodejsVersion = (context: Context) => {
  const version = process.versions.node;

  // Non-exhaustive known requirements:
  // - 18.12 is the first LTS release
  const range = `>=18.12.0`;

  if (semver.satisfies(version, range)) return true;

  context.logger.error(`This tool requires a Node version compatible with ${range} (got ${version}). Upgrade Node.`);

  return false;
};

/**
 * Strips LF line endings from given string
 */
export const stripNewLineEndings = (string: string): string => {
  return string.replace('\n', '');
};
