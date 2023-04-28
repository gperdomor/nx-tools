import { logger } from '@nx/devkit';

const MISSING_REQUIRED_DEPENDENCY = (name: string, reason: string) =>
  `The "${name}" package is missing. Please, make sure to install this library ($ npm install ${name}) to take advantage of ${reason}.`;

// eslint-disable-next-line @typescript-eslint/ban-types
export async function loadPackage(packageName: string, context: string, loaderFn?: Function) {
  try {
    return loaderFn ? loaderFn() : await import(packageName);
  } catch (e) {
    logger.error(`PackageLoader - ${MISSING_REQUIRED_DEPENDENCY(packageName, context)}`);
    process.exit(1);
  }
}
