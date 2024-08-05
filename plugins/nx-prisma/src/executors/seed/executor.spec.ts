import { ExecutorContext } from '@nx/devkit';
import { expectCommandToHaveBeenCalled } from '../generate/executor.spec';
import executor from './executor';
import { SeedExecutorSchema } from './schema';

jest.mock('@nx-tools/core', () => {
  const originalModule = jest.requireActual('@nx-tools/core');
  return {
    __esModule: true,
    ...originalModule,
    getExecOutput: jest.fn(async () => Promise.resolve({ stderr: '', exitCode: 0 })),
  };
});

const context: ExecutorContext = {
  root: 'workspace-folder',
  workspace: { version: 2, projects: { foo: { root: 'apps/foo' } } },
  projectName: 'foo',
  cwd: process.cwd(),
  isVerbose: false,
};

describe('Seed Executor', () => {
  it('can run with empty options', async () => {
    const options: SeedExecutorSchema = {
      script: undefined,
    };
    expect.assertions(1);
    await expect(executor(options, context)).rejects.toThrowError('You must specify a seed script file.');
  });

  describe('with ts-node', () => {
    it('script option', async () => {
      const options: SeedExecutorSchema = {
        script: 'custom-seed-file.ts',
      };
      const output = await executor(options, context);
      expect(
        expectCommandToHaveBeenCalled('npx ts-node', [
          '--project=workspace-folder/apps/foo/tsconfig.json',
          'custom-seed-file.ts',
        ])
      );
      expect(output.success).toBeTruthy();
    });

    it('with all options', async () => {
      const options: SeedExecutorSchema = {
        script: 'seed.ts',
        tsConfig: 'tsconfig.base.ts',
      };
      const output = await executor(options, context);
      expect(expectCommandToHaveBeenCalled('npx ts-node', ['--project=tsconfig.base.ts', 'seed.ts']));
      expect(output.success).toBeTruthy();
    });
  });

  describe('with tsx', () => {
    it('script option', async () => {
      const options: SeedExecutorSchema = {
        script: 'custom-seed-file.ts',
        executeWith: 'tsx',
      };
      const output = await executor(options, context);
      expect(
        expectCommandToHaveBeenCalled('npx tsx', [
          '--tsconfig=workspace-folder/apps/foo/tsconfig.json',
          'custom-seed-file.ts',
        ])
      );
      expect(output.success).toBeTruthy();
    });

    it('with all options', async () => {
      const options: SeedExecutorSchema = {
        script: 'seed.ts',
        tsConfig: 'tsconfig.base.ts',
        executeWith: 'tsx',
      };
      const output = await executor(options, context);
      expect(expectCommandToHaveBeenCalled('npx tsx', ['--tsconfig=tsconfig.base.ts', 'seed.ts']));
      expect(output.success).toBeTruthy();
    });
  });
});
