import { Tree, addProjectConfiguration, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { configurationGenerator } from './generator';
import { ConfigurationGeneratorSchema, Engine, Template } from './schema';

describe('configuration generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  test.each([
    [1, 'myapp', 'docker', undefined, 'docker', undefined],
    [2, 'myapp', 'docker', 'nest', 'docker', 'CMD ["dumb-init", "node", "main.js"]'],
    [3, 'myapp', 'docker', 'next', 'docker', 'ENV NEXT_TELEMETRY_DISABLED=1'],
    [4, 'myapp', 'docker', 'nginx', 'docker', 'FROM docker.io/nginx:stable-alpine'],
    [5, 'myapp', 'podman', undefined, 'podman', undefined],
    [6, 'myapp', 'podman', 'nest', 'podman', 'CMD ["dumb-init", "node", "main.js"]'],
    [7, 'myapp', 'podman', 'next', 'podman', 'ENV NEXT_TELEMETRY_DISABLED=1'],
    [8, 'myapp', 'podman', 'nginx', 'podman', 'FROM docker.io/nginx:stable-alpine'],
  ] as [number, string, Engine, Template | undefined, Engine, string | undefined][])(
    '%d - given projectName=%s, engine=%s and template=%s - should generate configuration for %s executor and proper dockerfile',
    async (
      _: number,
      projectName: string,
      engine: Engine,
      template: Template | undefined,
      executor: Engine,
      text: string | undefined,
    ) => {
      const options: ConfigurationGeneratorSchema = { project: projectName, engine, template };

      addProjectConfiguration(tree, projectName, { root: `apps/${projectName}` });

      await configurationGenerator(tree, options);

      const project = readProjectConfiguration(tree, projectName);
      expect(tree.exists('./apps/myapp/Dockerfile')).toBeTruthy();

      const contents = tree.read('./apps/myapp/Dockerfile', 'utf-8');

      if (text) {
        expect(contents?.includes(text)).toBeTruthy();
        if (template !== 'next') {
          expect(contents?.includes(`COPY dist/apps/${projectName}/`)).toBeTruthy();
        } else {
          expect(contents?.includes(`COPY apps/${projectName}/.next/standalone`)).toBeTruthy();
        }
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
    },
  );
});
