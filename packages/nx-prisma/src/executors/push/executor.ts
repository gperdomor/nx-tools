import { ExecutorContext, getPackageManagerCommand } from '@nrwl/devkit';
import { getExecOutput, getProjectRoot, startGroup } from '@nx-tools/core';
import { GROUP_PREFIX } from '../../constants';
import { PushExecutorSchema } from './schema';

export default async function run(options: PushExecutorSchema, ctx: ExecutorContext): Promise<{ success: true }> {
  const cwd = getProjectRoot(ctx);
  const command = `${getPackageManagerCommand().exec} prisma db push`;
  const args = getArgs(options);

  startGroup('Pushing Database', GROUP_PREFIX);

  await getExecOutput(command, args, { cwd, ignoreReturnCode: true }).then((res) => {
    if (res.stderr.length > 0 && res.exitCode != 0) {
      throw new Error(`${res.stderr.trim() ?? 'unknown error'}`);
    }
  });

  return { success: true };
}

const getArgs = (options: PushExecutorSchema): string[] => {
  const args = [];

  if (options?.schema) {
    args.push(`--schema=${options.schema}`);
  }

  if (options?.['accept-data-loss']) {
    args.push('--accept-data-loss');
  }

  if (options?.['force-reset']) {
    args.push('--force-reset');
  }

  if (options?.['skip-generate']) {
    args.push('--skip-generate');
  }

  return args;
};
