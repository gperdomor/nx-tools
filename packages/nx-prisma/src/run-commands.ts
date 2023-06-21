import { ExecutorContext, getPackageManagerCommand } from '@nx/devkit';
import { getExecOutput, logger } from '@nx-tools/core';

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
  { description, command, getArgs }: PrismaCommands<T>
): Promise<{ success: true }> => {
  const cmd = `${getPackageManagerCommand().exec} ${command}`;
  const args = getArgs(options, ctx);

  await logger.group(description, async () => {
    await getExecOutput(cmd, args, { ignoreReturnCode: true }).then((res) => {
      if (res.stderr.length > 0 && res.exitCode != 0) {
        throw new Error(`${res.stderr.trim() ?? 'unknown error'}`);
      }
    });
  });

  return { success: true };
};
