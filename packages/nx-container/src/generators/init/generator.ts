import {
  formatFiles,
  generateFiles,
  ProjectConfiguration,
  readNxJson,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import * as path from 'path';
import { InitGeneratorSchema } from './schema';

function addFiles(tree: Tree, project: ProjectConfiguration, template) {
  const templateOptions = {
    projectName: project.name,
    template: '',
  };
  generateFiles(tree, path.join(__dirname, 'files', template || 'empty'), project.root, templateOptions);
}

export default async function (tree: Tree, options: InitGeneratorSchema) {
  const project = readProjectConfiguration(tree, options.project);
  const nx = readNxJson(tree);

  updateProjectConfiguration(tree, options.project, {
    ...project,
    targets: {
      ...project.targets,
      container: {
        executor: '@nx-tools/nx-container:build',
        dependsOn: ['build'],
        options: {
          engine: options.engine,
          metadata: {
            images: [`${project.name}`],
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

  addFiles(tree, project, options.template);

  if (!options.skipFormat) {
    await formatFiles(tree);
  }
}
