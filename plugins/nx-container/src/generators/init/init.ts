import { GeneratorCallback, readNxJson, runTasksInSerial, Tree, updateNxJson } from '@nx/devkit';
import { Schema } from './schema';

export async function initGenerator(tree: Tree, options: Schema) {
  const tasks: GeneratorCallback[] = [];

  addPlugin(tree);

  return runTasksInSerial(...tasks);
}

function addPlugin(tree: Tree) {
  const nxJson = readNxJson(tree);

  if (!hasContainerPlugin(tree)) {
    nxJson.plugins ??= [];
    nxJson.plugins.push({
      plugin: '@nx-tools/nx-container',
      options: {},
    });
    updateNxJson(tree, nxJson);
  }
}

export function hasContainerPlugin(tree: Tree): boolean {
  const nxJson = readNxJson(tree);
  return !!nxJson.plugins?.some((p) =>
    typeof p === 'string' ? p === '@nx-tools/nx-container' : p.plugin === '@nx-tools/nx-container'
  );
}

export default initGenerator;
