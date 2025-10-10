import { logger } from '@nx-tools/core';
import { ExecutorContext, getPackageManagerCommand, PromiseExecutor } from '@nx/devkit';
import { execSync } from 'node:child_process';
import { getDefaultScheme } from '../../utils';
import { MigrateExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<MigrateExecutorSchema> = async (options, ctx) => {
  const command = `${getPackageManagerCommand().exec} prisma migrate dev`;
  const args = getArgs(options, ctx);

  await logger.group('Migrating Database', async () => {
    execSync([command, ...args].join(' '), {
      stdio: 'inherit',
    });
  });

  return { success: true };
};

const getArgs = (options: MigrateExecutorSchema, ctx: ExecutorContext): string[] => {
  const args = [];
  const schema = options?.schema ?? getDefaultScheme(ctx);

  args.push(`--schema=${schema}`);
  args.push(`--name="${options.name}"`);

  if (options?.['create-only']) {
    args.push('--create-only');
  }

  if (options?.['skip-generate']) {
    args.push('--skip-generate');
  }

  if (options?.['skip-seed']) {
    args.push('--skip-seed');
  }

  return args;
};

export default runExecutor;
