import { ExecutorContext } from '@nrwl/devkit';
import { execSync } from 'child_process';
import executor from './executor';
import { MigrateExecutorSchema } from './schema';

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

describe('Migrate Executor', () => {
  it('empty options', async () => {
    const options: MigrateExecutorSchema = {};
    const output = await executor(options, mockContext as ExecutorContext);
    expect(execSync).toHaveBeenCalledWith(`npx prisma migrate dev`, {
      cwd: 'workspace-root/apps/foo',
      stdio: 'inherit',
    });
    expect(output.success).toBeTruthy();
  });

  test.each([
    ['schema', 'my-prisma-file.schema'],
    ['name', 'my first migration'],
  ])(
    'given %p option with %p value, should be handled has arg',
    async (option: keyof MigrateExecutorSchema, value: string) => {
      const options: MigrateExecutorSchema = {
        [option]: value,
      };
      const output = await executor(options, mockContext as ExecutorContext);
      expect(execSync).toHaveBeenCalledWith(`npx prisma migrate dev --${option}=${value}`, {
        cwd: 'workspace-root/apps/foo',
        stdio: 'inherit',
      });
      expect(output.success).toBeTruthy();
    }
  );

  test.each([['create-only'], ['skip-generate'], ['skip-seed']])(
    'given %p, should be handled has flag',
    async (flag: keyof MigrateExecutorSchema) => {
      const options: MigrateExecutorSchema = {
        [flag]: true,
      };
      const output = await executor(options, mockContext as ExecutorContext);
      expect(execSync).toHaveBeenCalledWith(`npx prisma migrate dev --${flag}`, {
        cwd: 'workspace-root/apps/foo',
        stdio: 'inherit',
      });
      expect(output.success).toBeTruthy();
    }
  );

  it('with all options', async () => {
    const options: MigrateExecutorSchema = {
      schema: 'my-schema.schema',
      name: 'migration-name',
      'create-only': true,
      'skip-generate': true,
      'skip-seed': true,
    };
    const output = await executor(options, mockContext as ExecutorContext);
    expect(execSync).toHaveBeenCalledWith(
      'npx prisma migrate dev --schema=my-schema.schema --name=migration-name --create-only --skip-generate --skip-seed',
      { cwd: 'workspace-root/apps/foo', stdio: 'inherit' }
    );
    expect(output.success).toBeTruthy();
  });
});
