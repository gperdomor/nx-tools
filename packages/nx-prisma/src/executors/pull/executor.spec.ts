import { ExecutorContext } from '@nrwl/devkit';
import { expectCommandToHaveBeenCalled } from '../generate/executor.spec';
import executor from './executor';
import { PullExecutorSchema } from './schema';

jest.mock('@nx-tools/core', () => {
  const originalModule = jest.requireActual('@nx-tools/core');
  return {
    __esModule: true,
    ...originalModule,
    getExecOutput: jest.fn(async () => Promise.resolve({ stderr: '', exitCode: 0 })),
  };
});

const mockContext: Partial<ExecutorContext> = {
  root: 'workspace-root',
  workspace: { version: 2, projects: { foo: { root: 'apps/foo' } } },
  projectName: 'foo',
};

describe('Pull Executor', () => {
  it('empty options', async () => {
    const options: PullExecutorSchema = {};
    const output = await executor(options, mockContext as ExecutorContext);
    expect(expectCommandToHaveBeenCalled('npx prisma db pull', [], 'workspace-root/apps/foo'));
    expect(output.success).toBeTruthy();
  });

  test.each([['schema', 'my-prisma-file.schema']])(
    'given %p option with %p value, should be handled has arg',
    async (option: keyof PullExecutorSchema, value: string) => {
      const options: PullExecutorSchema = {
        [option]: value,
      };
      const output = await executor(options, mockContext as ExecutorContext);
      expect(expectCommandToHaveBeenCalled('npx prisma db pull', [`--${option}=${value}`], 'workspace-root/apps/foo'));
      expect(output.success).toBeTruthy();
    }
  );

  test.each([['force'], ['print']])('given %p, should be handled has flag', async (flag: keyof PullExecutorSchema) => {
    const options: PullExecutorSchema = {
      [flag]: true,
    };
    const output = await executor(options, mockContext as ExecutorContext);
    expect(expectCommandToHaveBeenCalled('npx prisma db pull', [`--${flag}`], 'workspace-root/apps/foo'));
    expect(output.success).toBeTruthy();
  });

  it('with all options', async () => {
    const options: PullExecutorSchema = {
      schema: 'my-schema.schema',
      force: true,
      print: true,
    };
    const output = await executor(options, mockContext as ExecutorContext);
    expect(
      expectCommandToHaveBeenCalled(
        'npx prisma db pull',
        ['--schema=my-schema.schema', '--force', '--print'],
        'workspace-root/apps/foo'
      )
    );
    expect(output.success).toBeTruthy();
  });
});
