import {
  formatFiles,
  generateFiles,
  ProjectConfiguration,
  readNxJson,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import * as path from 'node:path';
import { DEFAULT_ENGINE, DEFAULT_TEMPLATE } from './constants';
import { ConfigurationGeneratorSchema } from './schema';

function addFiles(tree: Tree, project: ProjectConfiguration, template: string) {
  const templateOptions = {
    projectName: project.name,
    template: '',
  };
  generateFiles(tree, path.join(__dirname, 'files', template), project.root, templateOptions);
}

export async function configurationGenerator(tree: Tree, options: ConfigurationGeneratorSchema) {
  const project = readProjectConfiguration(tree, options.project);

  if (!hasContainerPlugin(tree)) {
    updateProjectConfiguration(tree, options.project, {
      ...project,
      targets: {
        ...project.targets,
        container: {
          executor: `@nx-tools/nx-container:build`,
          dependsOn: ['build'],
          options: {
            engine: options.engine ?? DEFAULT_ENGINE,
            metadata: {
              images: [project.name],
              load: true,
              tags: [
                'type=schedule',
                'type=ref,event=branch',
                'type=ref,event=tag',
                'type=ref,event=pr',
                'type=sha,prefix=sha-',
              ],
            },
          },
        },
      },
    });
  }

  addFiles(tree, project, options.template ?? DEFAULT_TEMPLATE);

  if (!options.skipFormat) {
    await formatFiles(tree);
  }
}

export function hasContainerPlugin(tree: Tree): boolean {
  const nxJson = readNxJson(tree);
  return (
    nxJson?.plugins?.some((p) =>
      typeof p === 'string' ? p === '@nx-tools/nx-container' : p.plugin === '@nx-tools/nx-container',
    ) ?? false
  );
}

export default configurationGenerator;
