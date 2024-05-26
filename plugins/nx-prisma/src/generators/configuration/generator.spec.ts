import { Tree, addProjectConfiguration, readProjectConfiguration, stripIndents } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { configurationGenerator } from './generator';

describe('configuration generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run for non root projects', async () => {
    addProjectConfiguration(tree, 'mypkg', { root: 'apps/mypkg' });

    await configurationGenerator(tree, { project: 'mypkg', database: 'postgresql' });

    const project = readProjectConfiguration(tree, 'mypkg');

    expect(tree.exists('./apps/mypkg/prisma/schema.prisma')).toBeTruthy();

    const contents = tree.read('./apps/mypkg/prisma/schema.prisma', 'utf-8');

    expect(contents).toMatch('provider = "postgresql"');

    expect(project.targets).toEqual({
      'prisma-deploy': {
        executor: '@nx-tools/nx-prisma:deploy',
      },
      'prisma-format': {
        executor: '@nx-tools/nx-prisma:format',
      },
      'prisma-generate': {
        executor: '@nx-tools/nx-prisma:generate',
      },
      'prisma-migrate': {
        executor: '@nx-tools/nx-prisma:migrate',
      },
      'prisma-pull': {
        executor: '@nx-tools/nx-prisma:pull',
      },
      'prisma-push': {
        executor: '@nx-tools/nx-prisma:push',
      },
      'prisma-reset': {
        executor: '@nx-tools/nx-prisma:reset',
      },
      'prisma-resolve': {
        executor: '@nx-tools/nx-prisma:resolve',
      },
      'prisma-seed': {
        executor: '@nx-tools/nx-prisma:seed',
      },
      'prisma-status': {
        executor: '@nx-tools/nx-prisma:status',
      },
      'prisma-studio': {
        executor: '@nx-tools/nx-prisma:studio',
      },
      'prisma-validate': {
        executor: '@nx-tools/nx-prisma:validate',
      },
    });
  });

  it('should handle custom directory', async () => {
    addProjectConfiguration(tree, 'mypkg', { root: 'apps/mypkg' });

    await configurationGenerator(tree, { project: 'mypkg', database: 'sqlite', directory: 'custom-dir' });

    const project = readProjectConfiguration(tree, 'mypkg');

    expect(tree.exists('./apps/mypkg/custom-dir/schema.prisma')).toBeTruthy();

    const contents = tree.read('./apps/mypkg/custom-dir/schema.prisma', 'utf-8');

    expect(contents).toMatch('provider = "sqlite"');

    expect(project.targets).toEqual({
      'prisma-deploy': {
        executor: '@nx-tools/nx-prisma:deploy',
        options: {
          schema: 'apps/mypkg/custom-dir/schema.prisma',
        },
      },
      'prisma-format': {
        executor: '@nx-tools/nx-prisma:format',
        options: {
          schema: 'apps/mypkg/custom-dir/schema.prisma',
        },
      },
      'prisma-generate': {
        executor: '@nx-tools/nx-prisma:generate',
        options: {
          schema: 'apps/mypkg/custom-dir/schema.prisma',
        },
      },
      'prisma-migrate': {
        executor: '@nx-tools/nx-prisma:migrate',
        options: {
          schema: 'apps/mypkg/custom-dir/schema.prisma',
        },
      },
      'prisma-pull': {
        executor: '@nx-tools/nx-prisma:pull',
        options: {
          schema: 'apps/mypkg/custom-dir/schema.prisma',
        },
      },
      'prisma-push': {
        executor: '@nx-tools/nx-prisma:push',
        options: {
          schema: 'apps/mypkg/custom-dir/schema.prisma',
        },
      },
      'prisma-reset': {
        executor: '@nx-tools/nx-prisma:reset',
        options: {
          schema: 'apps/mypkg/custom-dir/schema.prisma',
        },
      },
      'prisma-resolve': {
        executor: '@nx-tools/nx-prisma:resolve',
        options: {
          schema: 'apps/mypkg/custom-dir/schema.prisma',
        },
      },
      'prisma-seed': {
        executor: '@nx-tools/nx-prisma:seed',
        options: {
          schema: 'apps/mypkg/custom-dir/schema.prisma',
        },
      },
      'prisma-status': {
        executor: '@nx-tools/nx-prisma:status',
        options: {
          schema: 'apps/mypkg/custom-dir/schema.prisma',
        },
      },
      'prisma-studio': {
        executor: '@nx-tools/nx-prisma:studio',
        options: {
          schema: 'apps/mypkg/custom-dir/schema.prisma',
        },
      },
      'prisma-validate': {
        executor: '@nx-tools/nx-prisma:validate',
        options: {
          schema: 'apps/mypkg/custom-dir/schema.prisma',
        },
      },
    });
  });

  it('should work for root projects', async () => {
    addProjectConfiguration(tree, 'mypkg', { root: '.' });

    await configurationGenerator(tree, { project: 'mypkg', database: 'mongodb' });

    const project = readProjectConfiguration(tree, 'mypkg');

    expect(tree.exists('./prisma/schema.prisma')).toBeTruthy();

    const contents = tree.read('./prisma/schema.prisma', 'utf-8');

    expect(contents).toMatch('provider = "mongodb"');

    expect(project.targets).toEqual({
      'prisma-deploy': {
        executor: '@nx-tools/nx-prisma:deploy',
      },
      'prisma-format': {
        executor: '@nx-tools/nx-prisma:format',
      },
      'prisma-generate': {
        executor: '@nx-tools/nx-prisma:generate',
      },
      'prisma-migrate': {
        executor: '@nx-tools/nx-prisma:migrate',
      },
      'prisma-pull': {
        executor: '@nx-tools/nx-prisma:pull',
      },
      'prisma-push': {
        executor: '@nx-tools/nx-prisma:push',
      },
      'prisma-reset': {
        executor: '@nx-tools/nx-prisma:reset',
      },
      'prisma-resolve': {
        executor: '@nx-tools/nx-prisma:resolve',
      },
      'prisma-seed': {
        executor: '@nx-tools/nx-prisma:seed',
      },
      'prisma-status': {
        executor: '@nx-tools/nx-prisma:status',
      },
      'prisma-studio': {
        executor: '@nx-tools/nx-prisma:studio',
      },
      'prisma-validate': {
        executor: '@nx-tools/nx-prisma:validate',
      },
    });
  });

  it('should throws if prisma schema already exists', async () => {
    expect.assertions(2);

    addProjectConfiguration(tree, 'mypkg', { root: 'apps/mypkg' });

    await configurationGenerator(tree, { project: 'mypkg', database: 'postgresql' });

    expect(tree.exists('./apps/mypkg/prisma/schema.prisma')).toBeTruthy();

    try {
      await configurationGenerator(tree, { project: 'mypkg', database: 'postgresql' });
    } catch (e) {
      expect(e.message).toEqual(
        stripIndents`The "apps/mypkg/prisma/schema.prisma" file already exists in the project "mypkg". Are you sure this is the right project to set up Prisma?
        If you are sure, you can remove the existing file and re-run the generator.`
      );
    }
  });
});
