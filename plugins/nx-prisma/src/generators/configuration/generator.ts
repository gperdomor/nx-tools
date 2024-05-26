import {
  Tree,
  addDependenciesToPackageJson,
  formatFiles,
  generateFiles,
  installPackagesTask,
  joinPathFragments,
  readProjectConfiguration,
  stripIndents,
  updateProjectConfiguration,
} from '@nx/devkit';
import { PRISMA_DEFAULT_DIR, PRISMA_VERSION } from './constants';
import { ConfigurationGeneratorSchema } from './schema';

export async function configurationGenerator(tree: Tree, options: ConfigurationGeneratorSchema) {
  const project = readProjectConfiguration(tree, options.project);

  if (!options.directory) {
    options.directory = PRISMA_DEFAULT_DIR;
  }

  const destDir = joinPathFragments(project.root, options.directory);

  if (tree.exists(joinPathFragments(destDir, 'schema.prisma'))) {
    throw new Error(
      stripIndents`The "${joinPathFragments(destDir, 'schema.prisma')}" file already exists in the project "${
        project.name
      }". Are you sure this is the right project to set up Prisma?
      If you are sure, you can remove the existing file and re-run the generator.`
    );
  }

  generateFiles(tree, joinPathFragments(__dirname, 'files'), destDir, {
    provider: options.database,
  });

  let executorOpts: Record<string, unknown> = {};

  if (options.directory !== PRISMA_DEFAULT_DIR) {
    executorOpts = {
      options: {
        schema: `${project.root}/${options.directory}/schema.prisma`,
      },
    };
  }

  updateProjectConfiguration(tree, options.project, {
    ...project,
    targets: {
      ...project.targets,
      'prisma-deploy': {
        executor: '@nx-tools/nx-prisma:deploy',
        ...executorOpts,
      },
      'prisma-format': {
        executor: '@nx-tools/nx-prisma:format',
        ...executorOpts,
      },
      'prisma-generate': {
        executor: '@nx-tools/nx-prisma:generate',
        ...executorOpts,
      },
      'prisma-migrate': {
        executor: '@nx-tools/nx-prisma:migrate',
        ...executorOpts,
      },
      'prisma-pull': {
        executor: '@nx-tools/nx-prisma:pull',
        ...executorOpts,
      },
      'prisma-push': {
        executor: '@nx-tools/nx-prisma:push',
        ...executorOpts,
      },
      'prisma-reset': {
        executor: '@nx-tools/nx-prisma:reset',
        ...executorOpts,
      },
      'prisma-resolve': {
        executor: '@nx-tools/nx-prisma:resolve',
        ...executorOpts,
      },
      'prisma-seed': {
        executor: '@nx-tools/nx-prisma:seed',
        ...executorOpts,
      },
      'prisma-status': {
        executor: '@nx-tools/nx-prisma:status',
        ...executorOpts,
      },
      'prisma-studio': {
        executor: '@nx-tools/nx-prisma:studio',
        ...executorOpts,
      },
      'prisma-validate': {
        executor: '@nx-tools/nx-prisma:validate',
        ...executorOpts,
      },
    },
  });

  if (!options.skipPackageJson) {
    addDependenciesToPackageJson(tree, { '@prisma/client': PRISMA_VERSION }, { prisma: PRISMA_VERSION });
  }

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return () => {
    installPackagesTask(tree);
  };
}

export default configurationGenerator;
