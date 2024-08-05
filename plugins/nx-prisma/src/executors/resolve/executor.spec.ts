import { ExecutorContext } from '@nx/devkit';
import { expectCommandToHaveBeenCalled } from '../generate/executor.spec';
import executor from './executor';
import { ResolveExecutorSchema } from './schema';

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
  workspace: { version: 2, projects: { foo: { root: 'apps/foo' } } },
  projectName: 'foo',
  cwd: process.cwd(),
  isVerbose: false,
};

describe('Resolve Executor', () => {
  it('can run with empty options', async () => {
    const options: ResolveExecutorSchema = {};
    expect.assertions(1);
    await expect(executor(options, context)).rejects.toThrowError(
      'You must specify either --rolled-back or --applied.'
    );
  });

  it('with --rolled-back and --applied', async () => {
    const options: ResolveExecutorSchema = {
      applied: 'add-user-table',
      'rolled-back': 'add-products-table',
    };
    expect.assertions(1);
    await expect(executor(options, context)).rejects.toThrowError(
      'You must specify either --rolled-back or --applied.'
    );
  });

  test.each([
    ['applied', 'add_users_table'],
    ['rolled-back', 'add_products_table'],
  ])(
    'given %p option with %p value, should be included in the args array',
    async (option: keyof ResolveExecutorSchema, value: string) => {
      const options: ResolveExecutorSchema = {
        [option]: value,
      };
      const output = await executor(options, context);
      expect(
        expectCommandToHaveBeenCalled('npx prisma migrate resolve', [
          '--schema=workspace-root/apps/foo/prisma/schema.prisma',
          `--${option}=${value}`,
        ])
      );
      expect(output.success).toBeTruthy();
    }
  );

  it('with schema and applied', async () => {
    const options: ResolveExecutorSchema = {
      schema: 'custom.schema',
      applied: 'add_users_table',
    };
    const output = await executor(options, context);
    expect(
      expectCommandToHaveBeenCalled('npx prisma migrate resolve', [
        '--schema=custom.schema',
        '--applied=add_users_table',
      ])
    );
    expect(output.success).toBeTruthy();
  });

  it('with schema and applied', async () => {
    const options: ResolveExecutorSchema = {
      schema: 'custom.schema',
      'rolled-back': 'add_users_table',
    };
    const output = await executor(options, context);
    expect(
      expectCommandToHaveBeenCalled('npx prisma migrate resolve', [
        '--schema=custom.schema',
        '--rolled-back=add_users_table',
      ])
    );
    expect(output.success).toBeTruthy();
  });
});
