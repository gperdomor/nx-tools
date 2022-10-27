import { ExecutorContext, getPackageManagerCommand } from '@nrwl/devkit';
import { getExecOutput, getProjectRoot, startGroup } from '@nx-tools/core';
import { GROUP_PREFIX } from '../../constants';
import { StudioExecutorSchema } from './schema';

export default async function run(options: StudioExecutorSchema, ctx: ExecutorContext): Promise<{ success: true }> {
  const cwd = getProjectRoot(ctx);
  const command = `${getPackageManagerCommand().exec} prisma studio`;
  const args = getArgs(options);

  startGroup('Running Prisma Studio', GROUP_PREFIX);

  await getExecOutput(command, args, { cwd, ignoreReturnCode: true }).then((res) => {
    if (res.stderr.length > 0 && res.exitCode != 0) {
      throw new Error(`${res.stderr.trim() ?? 'unknown error'}`);
    }
  });

  return { success: true };
}

const getArgs = (options: StudioExecutorSchema): string[] => {
  const args = [];

  if (options?.schema) {
    args.push(`--schema=${options.schema}`);
  }

  if (options?.browser) {
    args.push(`--browser=${options.browser}`);
  }

  if (options?.port) {
    args.push(`--port=${options.port}`);
  }

  return args;
};
