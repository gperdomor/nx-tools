import { PluginConfiguration, Tree, readJson, readNxJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { initGenerator } from './init';

describe('init generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add @nx-tools/nx-container plugin to nx.json', async () => {
    // Run the generator
    await initGenerator(tree, {});

    // Read the nx.json file
    const nxJson = readNxJson(tree);

    // Check that the plugin has been added
    expect(nxJson?.plugins).toBeDefined();
    expect(
      nxJson?.plugins?.some((p: PluginConfiguration) =>
        typeof p === 'string' ? p === '@nx-tools/nx-container' : p.plugin === '@nx-tools/nx-container'
      )
    ).toBe(true);
  });

  it('should not add the plugin if it already exists', async () => {
    // Simulate the plugin already being added
    const nxJson = readJson(tree, 'nx.json');
    nxJson.plugins = [{ plugin: '@nx-tools/nx-container', options: {} }];
    tree.write('nx.json', JSON.stringify(nxJson));

    // Run the generator
    await initGenerator(tree, {});

    // Ensure the plugin was not added again
    const updatedNxJson = readJson(tree, 'nx.json');
    expect(updatedNxJson.plugins.length).toBe(1);
  });
});
