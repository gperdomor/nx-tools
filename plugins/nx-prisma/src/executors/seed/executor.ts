import { getExecOutput, getProjectRoot, logger } from '@nx-tools/core';
import { ExecutorContext, getPackageManagerCommand, joinPathFragments } from '@nx/devkit';
import { SeedExecutorSchema } from './schema';

export default async function runExecutor(
  options: SeedExecutorSchema,
  ctx: ExecutorContext
): Promise<{ success: true }> {
  if (!options.script) {
    throw new Error('You must specify a seed script file.');
  }
  options.executeWith = options.executeWith ?? 'ts-node';

  const command = `${getPackageManagerCommand().exec} ${options.executeWith}`;
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
  const tsConfigArgName = options.executeWith === 'ts-node' ? 'project' : 'tsconfig';
  const tsConfig = options?.tsConfig ?? joinPathFragments(getProjectRoot(ctx), 'tsconfig.json');

  args.push(`--${tsConfigArgName}=${tsConfig}`);

  args.push(options.script);

  return args;
};
