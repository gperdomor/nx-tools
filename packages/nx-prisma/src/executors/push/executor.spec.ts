import { ExecutorContext } from '@nx/devkit';
import { expectCommandToHaveBeenCalled } from '../generate/executor.spec';
import executor from './executor';
import { PushExecutorSchema } from './schema';

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

describe('Push Executor', () => {
  it('empty options', async () => {
    const options: PushExecutorSchema = {};
    const output = await executor(options, mockContext as ExecutorContext);
    expect(
      expectCommandToHaveBeenCalled('pnpm exec prisma db push', [
        '--schema=workspace-root/apps/foo/prisma/schema.prisma',
      ])
    );
    expect(output.success).toBeTruthy();
  });

  test.each([['schema', 'my-prisma-file.schema']])(
    'given %p option with %p value, should be included in the args array',
    async (option: keyof PushExecutorSchema, value: string) => {
      const options: PushExecutorSchema = {
        [option]: value,
      };
      const output = await executor(options, mockContext as ExecutorContext);
      expect(expectCommandToHaveBeenCalled('pnpm exec prisma db push', [`--${option}=${value}`]));
      expect(output.success).toBeTruthy();
    }
  );

  test.each([['skip-generate'], ['force-reset'], ['accept-data-loss']])(
    'given %p flag, should be included in the args array',
    async (flag: keyof PushExecutorSchema) => {
      const options: PushExecutorSchema = {
        [flag]: true,
      };
      const output = await executor(options, mockContext as ExecutorContext);
      expect(
        expectCommandToHaveBeenCalled('pnpm exec prisma db push', [
          '--schema=workspace-root/apps/foo/prisma/schema.prisma',
          `--${flag}`,
        ])
      );
      expect(output.success).toBeTruthy();
    }
  );

  it('with all options', async () => {
    const options: PushExecutorSchema = {
      schema: 'my-schema.schema',
      'skip-generate': true,
      'force-reset': true,
      'accept-data-loss': true,
    };
    const output = await executor(options, mockContext as ExecutorContext);
    expect(
      expectCommandToHaveBeenCalled('pnpm exec prisma db push', [
        '--schema=my-schema.schema',
        '--accept-data-loss',
        '--force-reset',
        '--skip-generate',
      ])
    );
    expect(output.success).toBeTruthy();
  });
});
