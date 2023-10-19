import {
  formatFiles,
  generateFiles,
  ProjectConfiguration,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import * as path from 'path';
import { DEFAULT_ENGINE, DEFAULT_TEMPLATE } from './constants';
import { ConfigurationSchema } from './schema';

function addFiles(tree: Tree, project: ProjectConfiguration, template) {
  const templateOptions = {
    projectName: project.name,
    template: '',
  };
  generateFiles(tree, path.join(__dirname, 'files', template), project.root, templateOptions);
}

export async function configurationGenerator(tree: Tree, options: ConfigurationSchema) {
  const project = readProjectConfiguration(tree, options.project);

  updateProjectConfiguration(tree, options.project, {
    ...project,
    targets: {
      ...project.targets,
      container: {
        executor: `@nx-tools/nx-container:${options.engine ?? DEFAULT_ENGINE}`,
        dependsOn: ['build'],
        options: {
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

  addFiles(tree, project, options.template ?? DEFAULT_TEMPLATE);

  if (!options.skipFormat) {
    await formatFiles(tree);
  }
}
