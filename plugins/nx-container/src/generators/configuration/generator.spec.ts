import { Tree, addProjectConfiguration, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { configurationGenerator } from './generator';
import { ConfigurationSchema } from './schema';

describe('configuration generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  test.each([
    [1, 'myapp', 'docker', undefined, 'docker', undefined],
    [2, 'myapp', 'docker', 'nest', 'docker', 'CMD ["dumb-init", "node", "main.js"]'],
    [3, 'myapp', 'docker', 'next', 'docker', 'ENV NEXT_TELEMETRY_DISABLED 1'],
    [4, 'myapp', 'docker', 'nginx', 'docker', 'FROM docker.io/nginx:stable-alpine'],
    [5, 'myapp', 'podman', undefined, 'podman', undefined],
    [6, 'myapp', 'podman', 'nest', 'podman', 'CMD ["dumb-init", "node", "main.js"]'],
    [7, 'myapp', 'podman', 'next', 'podman', 'ENV NEXT_TELEMETRY_DISABLED 1'],
    [8, 'myapp', 'podman', 'nginx', 'podman', 'FROM docker.io/nginx:stable-alpine'],
    [9, 'myapp', 'kaniko', undefined, 'kaniko', undefined],
    [10, 'myapp', 'kaniko', 'nest', 'kaniko', 'CMD ["dumb-init", "node", "main.js"]'],
    [11, 'myapp', 'kaniko', 'next', 'kaniko', 'ENV NEXT_TELEMETRY_DISABLED 1'],
    [12, 'myapp', 'kaniko', 'nginx', 'kaniko', 'FROM docker.io/nginx:stable-alpine'],
  ])(
    '%d - given projectName=%s, engine=%s and template=%s - should generate configuration for %s executor and proper dockerfile',
    async (_, projectName, engine: any, template: any, executor, text) => {
      const options: ConfigurationSchema = { project: projectName, engine, template };

      addProjectConfiguration(tree, projectName, { root: `apps/${projectName}` });

      await configurationGenerator(tree, options);

      const project = readProjectConfiguration(tree, projectName);
      expect(tree.exists('./apps/myapp/Dockerfile')).toBeTruthy();

      const contents = tree.read('./apps/myapp/Dockerfile', 'utf-8');

      if (text) {
        expect(contents.includes(text)).toBeTruthy();
        expect(contents.includes(`COPY dist/apps/${projectName}/`)).toBeTruthy();
      } else {
        expect(contents).toBe('');
      }

      expect(project.targets).toMatchObject({
        container: {
          executor: `@nx-tools/nx-container:build`,
          options: {
            engine: executor,
          },
        },
      });
    }
  );
});
