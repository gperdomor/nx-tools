import {
  addDependenciesToPackageJson,
  formatFiles,
  generateFiles,
  installPackagesTask,
  joinPathFragments,
  readProjectConfiguration,
  stripIndents,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import { ConfigurationGeneratorSchema } from './schema';
import { CODEGEN_DEFAULT_DIR, CODEGEN_VERSION, GRAPQH_VERSION } from './constants';

export async function configurationGenerator(tree: Tree, options: ConfigurationGeneratorSchema) {
  const project = readProjectConfiguration(tree, options.project);

  if (!options.directory) {
    options.directory = CODEGEN_DEFAULT_DIR;
  }

  const configFileName = `codegen.${options.configFileType}`;
  const destDir = joinPathFragments(project.root, options.directory);
  const configFilePath = joinPathFragments(destDir, configFileName);

  if (tree.exists(configFilePath)) {
    throw new Error(
      stripIndents`The "${configFilePath}" file already exists in the project "${project.name}". Are you sure this is the right project to set up Grapqh Code Generator?
      If you are sure, you can remove the existing file and re-run the generator.`
    );
  }

  generateFiles(tree, joinPathFragments(__dirname, 'files', options.configFileType), destDir, {
    schema: options.schema,
  });

  let executorOpts: Record<string, unknown> = {};

  if (options.directory !== CODEGEN_DEFAULT_DIR) {
    executorOpts = {
      options: {
        config: `${project.root}/${options.directory}/${configFileName}`,
      },
    };
  }

  updateProjectConfiguration(tree, options.project, {
    ...project,
    targets: {
      ...project.targets,
      'codegen-generate': {
        executor: '@nx-tools/nx-graphql-codegen:generate',
        ...executorOpts,
      },
    },
  });

  if (!options.skipPackageJson) {
    addDependenciesToPackageJson(tree, { graphql: GRAPQH_VERSION }, { '@graphql-codegen/cli': CODEGEN_VERSION });
  }

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return () => {
    installPackagesTask(tree);
  };
}

export default configurationGenerator;
