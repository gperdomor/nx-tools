import { ExecutorContext, getPackageManagerCommand } from '@nrwl/devkit';
import { getExecOutput, getProjectRoot, startGroup } from '@nx-tools/core';
import { GROUP_PREFIX } from '../../constants';
import { ResolveExecutorSchema } from './schema';

export default async function run(options: ResolveExecutorSchema, ctx: ExecutorContext): Promise<{ success: boolean }> {
  if ((options.applied && options['rolled-back']) || (!options.applied && !options['rolled-back'])) {
    throw new Error('You must specify either --rolled-back or --applied.');
  }

  const cwd = getProjectRoot(ctx);
  const command = `${getPackageManagerCommand().exec} prisma migrate resolve`;
  const args = getArgs(options);

  startGroup('Running Resolve', GROUP_PREFIX);

  await getExecOutput(command, args, { cwd, ignoreReturnCode: true }).then((res) => {
    if (res.stderr.length > 0 && res.exitCode != 0) {
      throw new Error(`${res.stderr.trim() ?? 'unknown error'}`);
    }
  });

  return { success: true };
}

const getArgs = (options: ResolveExecutorSchema): string[] => {
  const args = [];

  if (options?.schema) {
    args.push(`--schema=${options.schema}`);
  }

  if (options?.['rolled-back']) {
    args.push(`--rolled-back=${options['rolled-back']}`);
  }

  if (options?.applied) {
    args.push(`--applied=${options['applied']}`);
  }

  return args;
};
