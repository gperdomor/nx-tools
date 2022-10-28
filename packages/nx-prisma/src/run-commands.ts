import { ExecutorContext, getPackageManagerCommand } from '@nrwl/devkit';
import { getExecOutput, getProjectRoot, startGroup } from '@nx-tools/core';

export interface PrismaBuilderOptions {
  schema?: string;
  options?: Record<string, boolean>;
}

export interface PrismaCommands<T extends PrismaBuilderOptions> {
  description: string;
  command: string;
  getArgs: (options: T) => string[];
}

export const runCommand = async <T extends PrismaBuilderOptions>(
  options: T,
  ctx: ExecutorContext,
  { description, command, getArgs }: PrismaCommands<T>
): Promise<{ success: true }> => {
  const cwd = getProjectRoot(ctx);
  const cmd = `${getPackageManagerCommand().exec} ${command}`;
  const args = getArgs(options);

  startGroup(description, 'Nx Prisma');

  await getExecOutput(cmd, args, { cwd, ignoreReturnCode: true }).then((res) => {
    if (res.stderr.length > 0 && res.exitCode != 0) {
      throw new Error(`${res.stderr.trim() ?? 'unknown error'}`);
    }
  });

  return { success: true };
};
