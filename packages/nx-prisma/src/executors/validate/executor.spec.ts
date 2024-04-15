import { ExecutorContext } from '@nx/devkit';
import { expectCommandToHaveBeenCalled } from '../generate/executor.spec';
import executor from './executor';
import { ValidateExecutorSchema } from './schema';

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

describe('Validate Executor', () => {
  it('empty options', async () => {
    const options: ValidateExecutorSchema = {};
    const output = await executor(options, mockContext as ExecutorContext);
    expect(
      expectCommandToHaveBeenCalled('pnpm exec prisma validate', [
        '--schema=workspace-root/apps/foo/prisma/schema.prisma',
      ])
    );
    expect(output.success).toBeTruthy();
  });

  test.each([['schema', 'my-prisma-file.schema']])(
    'given %p option with %p value, should be included in the args array',
    async (option: keyof Omit<ValidateExecutorSchema, 'options'>, value: string) => {
      const options: ValidateExecutorSchema = {
        [option]: value,
      };
      const output = await executor(options, mockContext as ExecutorContext);
      expect(expectCommandToHaveBeenCalled('pnpm exec prisma validate', [`--${option}=${value}`]));
      expect(output.success).toBeTruthy();
    }
  );
});
