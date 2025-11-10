import { exec, logger } from '@nx-tools/core';
import { ExecutorContext, getPackageManagerCommand } from '@nx/devkit';

export interface PrismaBuilderOptions {
  schema?: string;
  options?: Record<string, boolean>;
}

export interface PrismaCommands<T extends PrismaBuilderOptions> {
  description: string;
  command: string;
  getArgs: (options: T, ctx: ExecutorContext) => string[];
}

const splitCommand = (value: string): string[] => value.trim().split(/\s+/).filter(Boolean);

export const runCommand = async <T extends PrismaBuilderOptions>(
  options: T,
  ctx: ExecutorContext,
  { description, command, getArgs }: PrismaCommands<T>,
): Promise<{ success: true }> => {
  const packageManagerExec = splitCommand(getPackageManagerCommand().exec);
  const prismaCommand = splitCommand(command);
  const [bin, ...initialArgs] = packageManagerExec;

  if (!bin) {
    throw new Error('Unable to resolve the package manager command for Prisma.');
  }

  const args = [...initialArgs, ...prismaCommand, ...getArgs(options, ctx)];

  await logger.group(description, async () => {
    const res = await exec(bin, args, { throwOnError: false });

    if (res.stderr.length > 0 && res.exitCode != 0) {
      throw new Error(`${res.stderr.trim() ?? 'unknown error'}`);
    }
  });

  return { success: true };
};
