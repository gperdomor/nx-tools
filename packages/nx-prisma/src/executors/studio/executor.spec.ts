import { ExecutorContext } from '@nx/devkit';
import { expectCommandToHaveBeenCalled } from '../generate/executor.spec';
import executor from './executor';
import { StudioExecutorSchema } from './schema';

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

describe('Studio Executor', () => {
  it('empty options', async () => {
    const options: StudioExecutorSchema = {};
    const output = await executor(options, mockContext as ExecutorContext);
    expect(
      expectCommandToHaveBeenCalled('npx prisma studio', ['--schema=workspace-root/apps/foo/prisma/schema.prisma'])
    );
    expect(output.success).toBeTruthy();
  });

  test.each([
    ['browser', 'safari'],
    ['browser', 'chrome'],
    ['port', 5555],
  ])(
    'given %p option with %p value, should be included in the args array',
    async (option: keyof Omit<StudioExecutorSchema, 'options'>, value: string) => {
      const options: StudioExecutorSchema = {
        [option]: value,
      };
      const output = await executor(options, mockContext as ExecutorContext);
      expect(
        expectCommandToHaveBeenCalled('npx prisma studio', [
          '--schema=workspace-root/apps/foo/prisma/schema.prisma',
          `--${option}=${value}`,
        ])
      );
      expect(output.success).toBeTruthy();
    }
  );

  it('with all options', async () => {
    const options: StudioExecutorSchema = {
      schema: 'my-schema.schema',
      browser: 'firefox',
      port: 6666,
    };
    const output = await executor(options, mockContext as ExecutorContext);
    expect(
      expectCommandToHaveBeenCalled('npx prisma studio', [
        '--schema=my-schema.schema',
        '--browser=firefox',
        '--port=6666',
      ])
    );
    expect(output.success).toBeTruthy();
  });
});
