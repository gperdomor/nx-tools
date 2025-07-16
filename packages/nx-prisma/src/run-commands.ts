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

export const runCommand = async <T extends PrismaBuilderOptions>(
  options: T,
  ctx: ExecutorContext,
  { description, command, getArgs }: PrismaCommands<T>,
): Promise<{ success: true }> => {
  const cmd = `${getPackageManagerCommand().exec} ${command}`;
  const args = getArgs(options, ctx);

  await logger.group(description, async () => {
    const res = await exec(cmd, args, { throwOnError: false });

    if (res.stderr.length > 0 && res.exitCode != 0) {
      throw new Error(`${res.stderr.trim() ?? 'unknown error'}`);
    }
  });

  return { success: true };
};
