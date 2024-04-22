import { ExecutorContext } from '@nx/devkit';
import { execSync } from 'node:child_process';
import executor from './executor';
import { MigrateExecutorSchema } from './schema';

jest.mock('node:child_process', () => {
  const originalModule = jest.requireActual('node:child_process');
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
  beforeEach(() => {
    jest.spyOn(console, 'info').mockImplementation(() => true);
  });

  it('empty options', async () => {
    const options: MigrateExecutorSchema = { name: 'mig-name' };
    const output = await executor(options, mockContext as ExecutorContext);
    expect(execSync).toHaveBeenCalledWith(
      `npx prisma migrate dev --schema=workspace-root/apps/foo/prisma/schema.prisma --name=mig-name`,
      {
        stdio: 'inherit',
      }
    );
    expect(output.success).toBeTruthy();
  });

  test.each([['create-only'], ['skip-generate'], ['skip-seed']])(
    'given %p, should be handled has flag',
    async (flag: keyof MigrateExecutorSchema) => {
      const options: MigrateExecutorSchema = {
        name: 'users',
        [flag]: true,
      };
      const output = await executor(options, mockContext as ExecutorContext);
      expect(execSync).toHaveBeenCalledWith(
        `npx prisma migrate dev --schema=workspace-root/apps/foo/prisma/schema.prisma --name=users --${flag}`,
        {
          stdio: 'inherit',
        }
      );
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
      { stdio: 'inherit' }
    );
    expect(output.success).toBeTruthy();
  });
});
