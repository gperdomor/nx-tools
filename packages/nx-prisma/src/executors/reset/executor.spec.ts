import { ExecutorContext } from '@nx/devkit';
import { execSync } from 'node:child_process';
import executor from './executor';
import { ResetExecutorSchema } from './schema';

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

describe('Reset Executor', () => {
  beforeEach(() => {
    jest.spyOn(console, 'info').mockImplementation(() => true);
  });

  it('empty options', async () => {
    const options: ResetExecutorSchema = { force: true };
    const output = await executor(options, mockContext as ExecutorContext);
    expect(execSync).toHaveBeenCalledWith(
      `npx prisma migrate reset --schema=workspace-root/apps/foo/prisma/schema.prisma --force`,
      {
        stdio: 'inherit',
      }
    );
    expect(output.success).toBeTruthy();
  });

  test.each([['schema', 'my-prisma-file.schema']])(
    'given %p option with %p value, should be handled has arg',
    async (option: keyof ResetExecutorSchema, value: string) => {
      const options: ResetExecutorSchema = {
        force: true,
        [option]: value,
      };
      const output = await executor(options, mockContext as ExecutorContext);
      expect(execSync).toHaveBeenCalledWith(`npx prisma migrate reset --${option}=${value} --force`, {
        stdio: 'inherit',
      });
      expect(output.success).toBeTruthy();
    }
  );

  test.each([['skip-generate'], ['skip-seed']])(
    'given %p, should be handled has flag',
    async (flag: keyof ResetExecutorSchema) => {
      const options: ResetExecutorSchema = {
        force: true,
        [flag]: true,
      };
      const output = await executor(options, mockContext as ExecutorContext);
      expect(execSync).toHaveBeenCalledWith(
        `npx prisma migrate reset --schema=workspace-root/apps/foo/prisma/schema.prisma --force --${flag}`,
        {
          stdio: 'inherit',
        }
      );
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
      { stdio: 'inherit' }
    );
    expect(output.success).toBeTruthy();
  });
});
