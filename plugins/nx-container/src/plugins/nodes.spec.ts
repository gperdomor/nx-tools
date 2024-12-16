import { workspaceRoot, type CreateNodesContext } from '@nx/devkit';
import { calculateHashForCreateNodes } from '@nx/devkit/src/utils/calculate-hash-for-create-nodes';
import { vol } from 'memfs';
import { createNodes } from './nodes';

vi.mock('node:fs');
vi.mock('node:fs/promises');

vi.mock('@nx/devkit/src/utils/calculate-hash-for-create-nodes', () => {
  return {
    calculateHashForCreateNodes: vi.fn().mockResolvedValue('mock-hash'),
  };
});

describe('@nx/container/plugin', () => {
  const createNodesFunction = createNodes[1];
  let context: CreateNodesContext;

  beforeEach(() => {
    vol.reset();

    context = {
      workspaceRoot: '/workspace-root',
      nxJsonConfiguration: {
        namedInputs: {
          default: ['{projectRoot}/**/*'],
          production: ['!{projectRoot}/**/*.spec.ts'],
        },
      },
      configFiles: [],
    };

    // vol.fromJSON(
    //   {
    //     './proj/Dockerfile': '',
    //     './proj/package.json': '{}',
    //     './proj/project.json': '{}',
    //   },
    //   '/workspace-root'
    // );

    // workaround for https://github.com/nrwl/nx/issues/20330
    const projectDir = `${workspaceRoot}/packages/container-metadata`;
    if (process.cwd() !== projectDir) {
      process.chdir(projectDir);
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vol.reset();
  });

  describe('root project', () => {
    beforeEach(() => {
      vol.fromJSON(
        {
          './Dockerfile': '',
          './package.json': JSON.stringify({ name: 'my-docker-app' }),
          './project.json': JSON.stringify({ name: 'my-docker-app' }),
        },
        '/workspace-root'
      );
    });
    it('should create nodes with correct targets', async () => {
      const nodes = await createNodesFunction(
        'Dockerfile',
        {
          buildTargetName: 'build',
          defaultEngine: 'docker',
        },
        context
      );

      expect(nodes).toMatchInlineSnapshot(`
        {
          "projects": {
            ".": {
              "targets": {
                "build": {
                  "configurations": {
                    "ci": {
                      "load": false,
                      "metadata": {
                        "images": [
                          "docker.io/my-docker-app",
                        ],
                        "tags": [
                          "type=schedule",
                          "type=ref,event=branch",
                          "type=ref,event=tag",
                          "type=ref,event=pr",
                          "type=sha,prefix=sha-",
                        ],
                      },
                      "push": true,
                    },
                  },
                  "dependsOn": [
                    "build",
                  ],
                  "executor": "@nx-tools/nx-container:build",
                  "options": {
                    "engine": "docker",
                    "load": true,
                    "tags": [
                      "docker.io/my-docker-app:dev",
                    ],
                  },
                },
              },
            },
          },
        }
      `);
      expect(calculateHashForCreateNodes).toHaveBeenCalled();
    });
  });

  describe('non-root project with Dockerfile', () => {
    beforeEach(() => {
      vol.fromJSON(
        {
          './apps/your-docker-app/Dockerfile': '',
          './apps/your-docker-app/package.json': JSON.stringify({ name: 'my-docker-app' }),
          './apps/your-docker-app/project.json': JSON.stringify({ name: 'my-docker-app' }),
        },
        '/workspace-root'
      );
    });
    it('should create nodes for non-root project with Dockerfile', async () => {
      const nodes = await createNodesFunction(
        'apps/your-docker-app/Dockerfile',
        {
          buildTargetName: 'build',
          defaultEngine: 'docker',
        },
        context
      );

      expect(nodes).toMatchInlineSnapshot(`
        {
          "projects": {
            "apps/your-docker-app": {
              "targets": {
                "build": {
                  "configurations": {
                    "ci": {
                      "load": false,
                      "metadata": {
                        "images": [
                          "docker.io/my-docker-app",
                        ],
                        "tags": [
                          "type=schedule",
                          "type=ref,event=branch",
                          "type=ref,event=tag",
                          "type=ref,event=pr",
                          "type=sha,prefix=sha-",
                        ],
                      },
                      "push": true,
                    },
                  },
                  "dependsOn": [
                    "build",
                  ],
                  "executor": "@nx-tools/nx-container:build",
                  "options": {
                    "engine": "docker",
                    "load": true,
                    "tags": [
                      "docker.io/my-docker-app:dev",
                    ],
                  },
                },
              },
            },
          },
        }
      `);
      expect(calculateHashForCreateNodes).toHaveBeenCalled();
    });
  });

  describe('non-root project without project.json', () => {
    beforeEach(() => {
      vol.fromJSON(
        {
          './apps/no-project/Dockerfile': '',
        },
        '/workspace-root'
      );
    });

    it('should not create nodes if there is no project.json or package.json', async () => {
      const nodes = await createNodesFunction(
        'apps/no-project/Dockerfile',
        {
          buildTargetName: 'build',
          defaultEngine: 'docker',
        },
        context
      );

      expect(nodes).toEqual({});
      expect(calculateHashForCreateNodes).not.toHaveBeenCalled();
    });
  });
});
