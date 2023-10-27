import { readJson, Tree } from '@nx/devkit';
import { checkAndCleanWithSemver } from '@nx/devkit/src/utils/semver';
import { lt } from 'semver';

export function detectPrismaInstalledVersion(tree: Tree): '4' | '5' | undefined {
  const { dependencies, devDependencies } = readJson(tree, 'package.json');
  const prismaVersion = dependencies?.['@prisma/client'] ?? devDependencies?.['@prisma/client'];

  if (!prismaVersion) {
    return undefined;
  }

  const version = checkAndCleanWithSemver('@prisma/client', prismaVersion);
  if (lt(version, '4.0.0')) {
    throw new Error(`The prisma version "${prismaVersion}" is not supported. Please upgrade to v4.0.0 or higher.`);
  }

  return lt(version, '5.0.0') ? '4' : '5';
}
