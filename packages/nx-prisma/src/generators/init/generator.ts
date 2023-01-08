import {
  formatFiles,
  GeneratorCallback,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { addPrismaConfig } from './lib/add-prisma-config';
import { addPrismaRequiredPackages } from './lib/add-prisma-required-packages';
import { detectPrismaInstalledVersion } from './lib/detect-prisma-installed-version';
import { InitGeneratorSchema } from './schema';

export default async function (tree: Tree, options: InitGeneratorSchema): Promise<GeneratorCallback> {
  const project = readProjectConfiguration(tree, options.project);

  const prismaInstalledVersion = detectPrismaInstalledVersion(tree);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let installTask: GeneratorCallback = () => {};

  if (!options.skipPackageJson) {
    if (prismaInstalledVersion === undefined) {
      installTask = addPrismaRequiredPackages(tree);
    }
  }

  addPrismaConfig(tree, options, project, prismaInstalledVersion ?? '4');

  updateProjectConfiguration(tree, options.project, {
    ...project,
    targets: {
      ...project.targets,
      'prisma-generate': {
        executor: '@nx-tools/nx-prisma:generate',
        options: { schema: `${project.root}/prisma/schema.prisma` },
      },
      'prisma-migrate': {
        executor: '@nx-tools/nx-prisma:migrate',
        options: { schema: `${project.root}/prisma/schema.prisma` },
      },
      'prisma-pull': {
        executor: '@nx-tools/nx-prisma:pull',
        options: { schema: `${project.root}/prisma/schema.prisma` },
      },
      'prisma-push': {
        executor: '@nx-tools/nx-prisma:push',
        options: { schema: `${project.root}/prisma/schema.prisma` },
      },
      'prisma-deploy': {
        executor: '@nx-tools/nx-prisma:deploy',
        options: { schema: `${project.root}/prisma/schema.prisma` },
      },
      'prisma-status': {
        executor: '@nx-tools/nx-prisma:status',
        options: { schema: `${project.root}/prisma/schema.prisma` },
      },
      'prisma-studio': {
        executor: '@nx-tools/nx-prisma:studio',
        options: { schema: `${project.root}/prisma/schema.prisma` },
      },
    },
  });

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return installTask;
}
