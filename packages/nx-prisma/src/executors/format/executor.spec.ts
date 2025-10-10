import { ExecutorContext } from '@nx/devkit';
import { expectCommandToHaveBeenCalled } from '../generate/executor.spec';
import executor from './executor';
import { FormatExecutorSchema } from './schema';

vi.mock('@nx-tools/core', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('@nx-tools/core')>()),
    getExecOutput: vi.fn(async () => Promise.resolve({ stderr: '', exitCode: 0 })),
  };
});

const context: Omit<ExecutorContext, 'nxJsonConfiguration' | 'projectGraph'> = {
  root: 'workspace-root',
  projectsConfigurations: { version: 2, projects: { foo: { root: 'apps/foo' } } },
  projectName: 'foo',
  cwd: process.cwd(),
  isVerbose: false,
};

describe('Format Executor', () => {
  it('can run with empty options', async () => {
    const options: FormatExecutorSchema = {};
    const output = await executor(options, context as ExecutorContext);
    expect(
      expectCommandToHaveBeenCalled('npx prisma format', ['--schema=workspace-root/apps/foo/prisma/schema.prisma']),
    );
    expect(output.success).toBeTruthy();
  });

  test.each([['schema', 'my-prisma-file.schema']])(
    'given %p option with %p value, should be handled has arg',
    async (option: string, value: string) => {
      const options: FormatExecutorSchema = {
        [option]: value,
      };
      const output = await executor(options, context as ExecutorContext);
      expect(expectCommandToHaveBeenCalled('npx prisma format', [`--${option}=${value}`]));
      expect(output.success).toBeTruthy();
    },
  );

  it('with all options', async () => {
    const options: FormatExecutorSchema = {
      schema: 'my-schema.schema',
    };
    const output = await executor(options, context as ExecutorContext);
    expect(expectCommandToHaveBeenCalled('npx prisma format', ['--schema=my-schema.schema']));
    expect(output.success).toBeTruthy();
  });
});
