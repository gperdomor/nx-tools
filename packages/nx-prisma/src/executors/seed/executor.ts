import { exec, getProjectRoot, logger } from '@nx-tools/core';
import { ExecutorContext, getPackageManagerCommand, joinPathFragments, PromiseExecutor } from '@nx/devkit';
import { SeedExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<SeedExecutorSchema> = async (options, ctx) => {
  if (!options.script) {
    throw new Error('You must specify a seed script file.');
  }
  options.executeWith = options.executeWith ?? 'ts-node';

  const command = `${getPackageManagerCommand().exec} ${options.executeWith}`;
  const args = getArgs(options, ctx);

  await logger.group('Seeding Database', async () => {
    const res = await exec(command, args, { throwOnError: false });

    if (res.stderr.length > 0 && res.exitCode != 0) {
      throw new Error(`${res.stderr.trim() ?? 'unknown error'}`);
    }
  });

  return { success: true };
};

const getArgs = (options: SeedExecutorSchema, ctx: ExecutorContext): string[] => {
  const args = [];
  const tsConfigArgName = options.executeWith === 'ts-node' ? 'project' : 'tsconfig';
  const tsConfig = options?.tsConfig ?? joinPathFragments(getProjectRoot(ctx), 'tsconfig.json');

  args.push(`--${tsConfigArgName}=${tsConfig}`);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  args.push(options.script!);

  return args;
};

export default runExecutor;
