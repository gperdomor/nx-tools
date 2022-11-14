import { ExecutorContext } from '@nrwl/devkit';
import { execSync } from 'child_process';
import executor from './executor';
import { ResetExecutorSchema } from './schema';

jest.mock('child_process', () => {
  const originalModule = jest.requireActual('child_process');
  return {
    __esModule: true,
    ...originalModule,
    execSync: jest.fn(),
  };
});

const mockContext: Partial<ExecutorContext> = {
  root: 'workspace-root',
  workspace: { version: 2, projects: { foo: { root: 'apps/foo' } } },
  projectName: 'foo',
};

describe('Reset Executor', () => {
  it('empty options', async () => {
    const options: ResetExecutorSchema = {};
    const output = await executor(options, mockContext as ExecutorContext);
    expect(execSync).toHaveBeenCalledWith(`npx prisma migrate reset`, {
      cwd: 'workspace-root/apps/foo',
      stdio: 'inherit',
    });
    expect(output.success).toBeTruthy();
  });

  test.each([['schema', 'my-prisma-file.schema']])(
    'given %p option with %p value, should be handled has arg',
    async (option: keyof ResetExecutorSchema, value: string) => {
      const options: ResetExecutorSchema = {
        [option]: value,
      };
      const output = await executor(options, mockContext as ExecutorContext);
      expect(execSync).toHaveBeenCalledWith(`npx prisma migrate reset --${option}=${value}`, {
        cwd: 'workspace-root/apps/foo',
        stdio: 'inherit',
      });
      expect(output.success).toBeTruthy();
    }
  );

  test.each([['force'], ['skip-generate'], ['skip-seed']])(
    'given %p, should be handled has flag',
    async (flag: keyof ResetExecutorSchema) => {
      const options: ResetExecutorSchema = {
        [flag]: true,
      };
      const output = await executor(options, mockContext as ExecutorContext);
      expect(execSync).toHaveBeenCalledWith(`npx prisma migrate reset --${flag}`, {
        cwd: 'workspace-root/apps/foo',
        stdio: 'inherit',
      });
      expect(output.success).toBeTruthy();
    }
  );

  it('with all options', async () => {
    const options: ResetExecutorSchema = {
      schema: 'my-schema.schema',
      force: true,
      'skip-generate': true,
      'skip-seed': true,
    };
    const output = await executor(options, mockContext as ExecutorContext);
    expect(execSync).toHaveBeenCalledWith(
      'npx prisma migrate reset --schema=my-schema.schema --force --skip-generate --skip-seed',
      { cwd: 'workspace-root/apps/foo', stdio: 'inherit' }
    );
    expect(output.success).toBeTruthy();
  });
});
