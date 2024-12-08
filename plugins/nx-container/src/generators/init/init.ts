import {
  ExpandedPluginConfiguration,
  GeneratorCallback,
  PluginConfiguration,
  readNxJson,
  runTasksInSerial,
  Tree,
  updateNxJson,
} from '@nx/devkit';
import { ContainerPluginOptions } from '../../plugins';
import { Schema } from './schema';

export async function initGenerator(tree: Tree, options: Schema): Promise<GeneratorCallback> {
  const tasks: GeneratorCallback[] = [];
  const nxJson = readNxJson(tree);

  // Add container plugin to Nx configuration if not already present
  if (!hasContainerPlugin(nxJson)) {
    nxJson.plugins ??= [];

    const pluginConfig: ExpandedPluginConfiguration<ContainerPluginOptions> = {
      plugin: '@nx-tools/nx-container',
      options: { defaultEngine: options.defaultEngine, defaultRegistry: options.defaultRegistry },
    };

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
