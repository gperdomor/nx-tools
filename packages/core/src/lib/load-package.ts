import { logger } from '@nx/devkit';

const MISSING_REQUIRED_DEPENDENCY = (name: string, reason: string) =>
  `The "${name}" package is missing. Please, make sure to install this library ($ npm install ${name}) to take advantage of ${reason}.`;

export async function loadPackage(packageName: string, context: string, loaderFn?: () => unknown) {
  try {
    return loaderFn ? loaderFn() : await import(packageName);
  } catch {
    logger.error(`PackageLoader - ${MISSING_REQUIRED_DEPENDENCY(packageName, context)}`);
    process.exit(1);
  }
}
