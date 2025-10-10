import { getExecOutput, logger } from '@nx-tools/core';
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

export const runCommand = async <T extends GraphqlCodeGenBuilderOptions>(
  options: T,
  ctx: ExecutorContext,
  { description, command, getArgs }: GraphqlCodeGenCommands<T>,
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
