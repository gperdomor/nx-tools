import { readJson, Tree } from '@nx/devkit';
import { checkAndCleanWithSemver } from '@nx/workspace/src/utilities/version-utils';
import { lt } from 'semver';

export function detectPrismaInstalledVersion(tree: Tree): '3' | '4' | undefined {
  const { dependencies, devDependencies } = readJson(tree, 'package.json');
  const prismaVersion = dependencies?.['@prisma/client'] ?? devDependencies?.['@prisma/client'];

  if (!prismaVersion) {
    return undefined;
  }

  const version = checkAndCleanWithSemver('@prisma/client', prismaVersion);
  if (lt(version, '4.0.0')) {
    throw new Error(
      `The Tailwind CSS version "${prismaVersion}" is not supported. Please upgrade to v4.0.0 or higher.`
    );
  }

  return lt(version, '4.0.0') ? '3' : '4';
}
