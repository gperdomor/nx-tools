import { ExecutorContext } from '@nrwl/devkit';
import { expectCommandToHaveBeenCalled } from '../generate/executor.spec';
import executor from './executor';
import { DeployExecutorSchema } from './schema';

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

describe('Deploy Executor', () => {
  it('empty options', async () => {
    const options: DeployExecutorSchema = {};
    const output = await executor(options, mockContext as ExecutorContext);
    expect(
      expectCommandToHaveBeenCalled('npx prisma migrate deploy', [
        '--schema=workspace-root/apps/foo/prisma/schema.prisma',
      ])
    );
    expect(output.success).toBeTruthy();
  });

  test.each([['schema', 'my-prisma-file.schema']])(
    'given %p option with %p value, should be included in the args array',
    async (option: keyof Omit<DeployExecutorSchema, 'options'>, value: string) => {
      const options: DeployExecutorSchema = {
        [option]: value,
      };
      const output = await executor(options, mockContext as ExecutorContext);
      expect(expectCommandToHaveBeenCalled('npx prisma migrate deploy', [`--${option}=${value}`]));
      expect(output.success).toBeTruthy();
    }
  );
});
