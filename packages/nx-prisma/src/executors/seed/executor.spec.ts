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

const mockContext: Partial<ExecutorContext> = {
  root: 'workspace-folder',
  workspace: { version: 2, projects: { foo: { root: 'apps/foo' } } },
  projectName: 'foo',
};

describe('Seed Executor', () => {
  it('empty options', async () => {
    const options: SeedExecutorSchema = {
      script: undefined,
    };
    expect.assertions(1);
    await expect(executor(options, mockContext as ExecutorContext)).rejects.toThrowError(
      'You must specify a seed script file.'
    );
  });

  it('script option', async () => {
    const options: SeedExecutorSchema = {
      script: 'custom-seed-file.ts',
    };
    const output = await executor(options, mockContext as ExecutorContext);
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
    const output = await executor(options, mockContext as ExecutorContext);
    expect(expectCommandToHaveBeenCalled('npx ts-node', ['--project=tsconfig.base.ts', 'seed.ts']));
    expect(output.success).toBeTruthy();
  });
});
