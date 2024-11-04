import { getExecOutput } from '@nx-tools/core';
import { ExecutorContext } from '@nx/devkit';
import executor from './executor';
import { GenerateExecutorSchema } from './schema';

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

export const expectCommandToHaveBeenCalled = (cmd: string, args: string[]) => {
  expect(getExecOutput).toHaveBeenCalledWith(cmd, args, { ignoreReturnCode: true });
};

describe('Generate Executor', () => {
  beforeEach(() => {
    jest.spyOn(console, 'info').mockImplementation(() => true);
  });

  it('can run with empty options', async () => {
    const options: GenerateExecutorSchema = {};
    const output = await executor(options, context);
    expect(expectCommandToHaveBeenCalled('npx graphql-codegen', ['--config=workspace-root/apps/foo/codegen.ts']));
    expect(output.success).toBeTruthy();
  });

  it('can run with config options', async () => {
    const options: GenerateExecutorSchema = {
      config: 'workspace-root/apps/foo/codegen.ts',
    };
    const output = await executor(options, context);
    expect(expectCommandToHaveBeenCalled('npx graphql-codegen', ['--config=workspace-root/apps/foo/codegen.ts']));
    expect(output.success).toBeTruthy();
  });
});
