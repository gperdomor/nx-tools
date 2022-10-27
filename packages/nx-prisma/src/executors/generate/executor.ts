import { ExecutorContext, getPackageManagerCommand } from '@nrwl/devkit';
import { getExecOutput, getProjectRoot, startGroup } from '@nx-tools/core';
import { GROUP_PREFIX } from '../../constants';
import { GenerateExecutorSchema } from './schema';

export default async function run(options: GenerateExecutorSchema, ctx: ExecutorContext): Promise<{ success: true }> {
  const cwd = getProjectRoot(ctx);
  const command = `${getPackageManagerCommand().exec} prisma generate`;
  const args = getArgs(options);

  startGroup('Generating Client', GROUP_PREFIX);

  await getExecOutput(command, args, { cwd, ignoreReturnCode: true }).then((res) => {
    if (res.stderr.length > 0 && res.exitCode != 0) {
      throw new Error(`${res.stderr.trim() ?? 'unknown error'}`);
    }
  });

  return { success: true };
}

const getArgs = (options: GenerateExecutorSchema): string[] => {
  const args = [];

  if (options?.schema) {
    args.push(`--schema=${options.schema}`);
  }

  if (options?.['data-proxy']) {
    args.push('--data-proxy');
  }

  if (options?.watch) {
    args.push('--watch');
  }

  return args;
};
