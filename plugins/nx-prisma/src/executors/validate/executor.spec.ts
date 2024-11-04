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

const context: ExecutorContext = {
  root: 'workspace-root',
  projectsConfigurations: { version: 2, projects: { foo: { root: 'apps/foo' } } },
  projectName: 'foo',
  cwd: process.cwd(),
  isVerbose: false,
};

describe('Validate Executor', () => {
  it('can run with empty options', async () => {
    const options: ValidateExecutorSchema = {};
    const output = await executor(options, context);
    expect(
      expectCommandToHaveBeenCalled('npx prisma validate', ['--schema=workspace-root/apps/foo/prisma/schema.prisma'])
    );
    expect(output.success).toBeTruthy();
  });

  test.each([['schema', 'my-prisma-file.schema']])(
    'given %p option with %p value, should be included in the args array',
    async (option: keyof Omit<ValidateExecutorSchema, 'options'>, value: string) => {
      const options: ValidateExecutorSchema = {
        [option]: value,
      };
      const output = await executor(options, context);
      expect(expectCommandToHaveBeenCalled('npx prisma validate', [`--${option}=${value}`]));
      expect(output.success).toBeTruthy();
    }
  );
});
