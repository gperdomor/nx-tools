import { GeneratorCallback, PluginConfiguration, readNxJson, runTasksInSerial, Tree, updateNxJson } from '@nx/devkit';
import { Schema } from './schema';
import { DEFAULT_ENGINE } from '../configuration/constants';

export async function initGenerator(tree: Tree, options: Schema): Promise<GeneratorCallback> {
  const tasks: GeneratorCallback[] = [];
  const nxJson = readNxJson(tree);

  // Add container plugin to Nx configuration if not already present
  if (!hasContainerPlugin(nxJson)) {
    nxJson.plugins ??= [];

    const pluginConfig: PluginConfiguration =
      options.defaultEngine !== DEFAULT_ENGINE
        ? { plugin: '@nx-tools/nx-container', options: { defaultEngine: options.defaultEngine } }
        : '@nx-tools/nx-container';

    nxJson.plugins.push(pluginConfig);
    updateNxJson(tree, nxJson);
  }

  return runTasksInSerial(...tasks);
}

function hasContainerPlugin(nxJson: { plugins?: PluginConfiguration[] }): boolean {
  return (
    nxJson.plugins?.some((plugin) =>
      typeof plugin === 'string' ? plugin === '@nx-tools/nx-container' : plugin.plugin === '@nx-tools/nx-container'
    ) ?? false
  );
}

export default initGenerator;
