import { ExecutorContext, getPackageManagerCommand } from '@nrwl/devkit';
import { getExecOutput, getProjectRoot, startGroup } from '@nx-tools/core';
import { SeedExecutorSchema } from './schema';

export default async function run(options: SeedExecutorSchema, ctx: ExecutorContext): Promise<{ success: true }> {
  if (!options.script) {
    throw new Error('You must specify a seed script file.');
  }

  const cwd = getProjectRoot(ctx);
  const command = `${getPackageManagerCommand().exec} ts-node`;
  const args = getArgs(options);

  startGroup('Seeding Database', 'Nx Prisma');

  await getExecOutput(command, args, { cwd, ignoreReturnCode: true }).then((res) => {
    if (res.stderr.length > 0 && res.exitCode != 0) {
      throw new Error(`${res.stderr.trim() ?? 'unknown error'}`);
    }
  });

  return { success: true };
}

const getArgs = (options: SeedExecutorSchema): string[] => {
  const args = [];

  if (options?.tsConfig) {
    args.push(`--project=${options.tsConfig}`);
  }

  args.push(options.script);

  return args;
};
