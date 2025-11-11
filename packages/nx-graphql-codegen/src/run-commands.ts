import { exec, logger } from '@nx-tools/core';
import { ExecutorContext, getPackageManagerCommand } from '@nx/devkit';

export interface GraphqlCodeGenBuilderOptions {
  config?: string;
  options?: Record<string, boolean>;
}

export interface GraphqlCodeGenCommands<T extends GraphqlCodeGenBuilderOptions> {
  description: string;
  command: string;
  getArgs: (options: T, ctx: ExecutorContext) => string[];
}

export const splitCommand = (value: string): string[] => value.trim().split(/\s+/).filter(Boolean);

export const runCommand = async <T extends GraphqlCodeGenBuilderOptions>(
  options: T,
  ctx: ExecutorContext,
  { description, command, getArgs }: GraphqlCodeGenCommands<T>,
): Promise<{ success: true }> => {
  const packageManagerExec = splitCommand(getPackageManagerCommand().exec);
  const cmd = splitCommand(command);
  const [bin, ...initialArgs] = packageManagerExec;

  if (!bin) {
    throw new Error('Unable to resolve the package manager command for Prisma.');
  }

  const args = [...initialArgs, ...cmd, ...getArgs(options, ctx)];

  await logger.group(description, async () => {
    const res = await exec(bin, args, { throwOnError: false });

    if (res.stderr.length > 0 && res.exitCode != 0) {
      throw new Error(`${res.stderr.trim() ?? 'unknown error'}`);
    }
  });

  return { success: true };
};
