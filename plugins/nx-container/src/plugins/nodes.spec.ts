import { type CreateNodesContext, readNxJson, Tree } from '@nx/devkit';
import { createNodes } from './nodes';
import { calculateHashForCreateNodes } from '@nx/devkit/src/utils/calculate-hash-for-create-nodes';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { readdirSync, existsSync, readFileSync } from 'fs';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  readdirSync: jest.fn(),
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
}));

jest.mock('@nx/devkit/src/utils/calculate-hash-for-create-nodes', () => {
  return {
    calculateHashForCreateNodes: jest.fn().mockResolvedValue('mock-hash'),
  };
});

describe('@nx/container/plugin', () => {
  let tree: Tree;
  const createNodesFunction = createNodes[1];
  let context: CreateNodesContext;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    context = {
      nxJsonConfiguration: readNxJson(tree),
      workspaceRoot: '/',
      configFiles: [],
    };

    (existsSync as jest.Mock).mockImplementation((path: string) => {
      return tree.exists(path);
    });

    (readdirSync as jest.Mock).mockImplementation((path: string) => {
      return tree.children(path.replace(/\*/g, ''));
    });

    (readFileSync as jest.Mock).mockImplementation((path: string) => {
      return tree.read(path);
    });
  });

  describe('root project', () => {
    beforeEach(() => {
      tree.write('Dockerfile', '');
      tree.write('package.json', JSON.stringify({ name: 'my-docker-app' }));
      tree.write('project.json', JSON.stringify({ name: 'my-docker-app' }));
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

      expect(nodes).toMatchSnapshot();
      expect(calculateHashForCreateNodes).toHaveBeenCalled();
    });
  });

  describe('non-root project with Dockerfile', () => {
    beforeEach(() => {
      tree.write('apps/your-docker-app/Dockerfile', '');
      tree.write('apps/your-docker-app/package.json', JSON.stringify({ name: 'my-docker-app' }));
      tree.write('apps/your-docker-app/project.json', JSON.stringify({ name: 'my-docker-app' }));
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

      expect(nodes).toMatchSnapshot();
      expect(calculateHashForCreateNodes).toHaveBeenCalled();
    });
  });

  describe('non-root project without project.json', () => {
    beforeEach(() => {
      tree.write('apps/no-project/Dockerfile', '');
      tree.write('apps/no-project/package.json', JSON.stringify({ name: 'no-project-app' }));
    });

    it('should not create nodes if project.json is missing', async () => {
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
