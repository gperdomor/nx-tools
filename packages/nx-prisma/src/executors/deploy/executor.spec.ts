import { ExecutorContext } from '@nx/devkit';
import { expectCommandToHaveBeenCalled } from '../generate/executor.spec';
import executor from './executor';
import { DeployExecutorSchema } from './schema';

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

describe('Deploy Executor', () => {
  it('can run with empty options', async () => {
    const options: DeployExecutorSchema = {};
    const output = await executor(options, context as ExecutorContext);
    expect(
      expectCommandToHaveBeenCalled('npx prisma migrate deploy', [
        '--schema=workspace-root/apps/foo/prisma/schema.prisma',
      ])
    );
    expect(output.success).toBeTruthy();
  });

  test.each([['schema', 'my-prisma-file.schema']])(
    'given %p option with %p value, should be included in the args array',
    async (option: string, value: string) => {
      const options: DeployExecutorSchema = {
        [option]: value,
      };
      const output = await executor(options, context as ExecutorContext);
      expect(expectCommandToHaveBeenCalled('npx prisma migrate deploy', [`--${option}=${value}`]));
      expect(output.success).toBeTruthy();
    }
  );
});
