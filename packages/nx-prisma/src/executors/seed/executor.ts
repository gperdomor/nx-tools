import { getExecOutput, getProjectRoot, logger } from '@nx-tools/core';
import { ExecutorContext, getPackageManagerCommand } from '@nx/devkit';
import { join } from 'node:path';
import { SeedExecutorSchema } from './schema';

export default async function run(options: SeedExecutorSchema, ctx: ExecutorContext): Promise<{ success: true }> {
  if (!options.script) {
    throw new Error('You must specify a seed script file.');
  }

  const command = `${getPackageManagerCommand().exec} ts-node`;
  const args = getArgs(options, ctx);

  await logger.group('Seeding Database', async () => {
    await getExecOutput(command, args, { ignoreReturnCode: true }).then((res) => {
      if (res.stderr.length > 0 && res.exitCode != 0) {
        throw new Error(`${res.stderr.trim() ?? 'unknown error'}`);
      }
    });
  });

  return { success: true };
}

const getArgs = (options: SeedExecutorSchema, ctx: ExecutorContext): string[] => {
  const args = [];
  const tsConfig = options?.tsConfig ?? join(getProjectRoot(ctx), 'tsconfig.json');

  args.push(`--project=${tsConfig}`);

  args.push(options.script);

  return args;
};
