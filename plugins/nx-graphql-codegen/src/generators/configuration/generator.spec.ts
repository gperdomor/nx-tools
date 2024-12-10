import { Tree, addProjectConfiguration, readProjectConfiguration, stripIndents } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { configurationGenerator } from './generator';
import { ConfigurationGeneratorSchema } from './schema';

describe('configuration generator', () => {
  let tree: Tree;
  const projectName = 'mypkg';

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run for non root projects with yml file type', async () => {
    const options: ConfigurationGeneratorSchema = {
      project: projectName,
      configFileType: 'yml',
      schema: 'url-mocked',
      skipFormat: false,
      skipPackageJson: false,
    };

    addProjectConfiguration(tree, projectName, { root: `apps/${projectName}` });

    await configurationGenerator(tree, options);

    const project = readProjectConfiguration(tree, projectName);
    expect(tree.exists('./apps/mypkg/codegen.yml')).toBeTruthy();

    const contents = tree.read('./apps/mypkg/codegen.yml', 'utf-8');
    expect(contents).toMatch('- url-mocked');

    expect(project.targets).toEqual({
      'codegen-generate': {
        executor: '@nx-tools/nx-graphql-codegen:generate',
      },
    });
  });

  it('should run for non root projects with ts file type', async () => {
    const options: ConfigurationGeneratorSchema = {
      project: projectName,
      configFileType: 'ts',
      schema: 'url-mocked',
      skipFormat: false,
      skipPackageJson: false,
    };

    addProjectConfiguration(tree, projectName, { root: `apps/${projectName}` });

    await configurationGenerator(tree, options);

    const project = readProjectConfiguration(tree, projectName);
    expect(tree.exists('./apps/mypkg/codegen.ts')).toBeTruthy();

    const contents = tree.read('./apps/mypkg/codegen.ts', 'utf-8');
    expect(contents).toMatch('url-mocked');

    expect(project.targets).toEqual({
      'codegen-generate': {
        executor: '@nx-tools/nx-graphql-codegen:generate',
      },
    });
  });

  it('should handle custom directory', async () => {
    const options: ConfigurationGeneratorSchema = {
      project: projectName,
      directory: 'codegen',
      configFileType: 'ts',
      schema: 'url-mocked',
      skipFormat: false,
      skipPackageJson: false,
    };

    addProjectConfiguration(tree, projectName, { root: `apps/${projectName}` });

    await configurationGenerator(tree, options);

    const project = readProjectConfiguration(tree, projectName);
    expect(tree.exists('./apps/mypkg/codegen/codegen.ts')).toBeTruthy();

    const contents = tree.read('./apps/mypkg/codegen/codegen.ts', 'utf-8');
    expect(contents).toMatch('url-mocked');

    expect(project.targets).toEqual({
      'codegen-generate': {
        executor: '@nx-tools/nx-graphql-codegen:generate',
        options: {
          config: 'apps/mypkg/codegen/codegen.ts',
        },
      },
    });
  });

  it('should throws if codegen file already exists', async () => {
    const options: ConfigurationGeneratorSchema = {
      project: projectName,
      configFileType: 'ts',
      schema: 'url-mocked',
      skipFormat: false,
      skipPackageJson: false,
    };

    // expect.assertions(2);

    addProjectConfiguration(tree, projectName, { root: `apps/${projectName}` });

    await configurationGenerator(tree, options);

    expect(tree.exists('./apps/mypkg/codegen.ts')).toBeTruthy();

    try {
      await configurationGenerator(tree, options);
    } catch (e) {
      expect((e as Error).message).toEqual(
        stripIndents`The "apps/mypkg/codegen.ts" file already exists in the project "${projectName}". Are you sure this is the right project to set up Grapqh Code Generator?
        If you are sure, you can remove the existing file and re-run the generator.`
      );
    }
  });
});
