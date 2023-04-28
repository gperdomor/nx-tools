import { addDependenciesToPackageJson, GeneratorCallback, Tree } from '@nx/devkit';
import { prismaVersion } from '../utils/versions';

export function addPrismaRequiredPackages(tree: Tree): GeneratorCallback {
  return addDependenciesToPackageJson(
    tree,
    {
      '@prisma/client': prismaVersion,
    },
    {
      prisma: prismaVersion,
    }
  );
}
