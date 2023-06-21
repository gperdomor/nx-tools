import { logger } from '@nx-tools/core';
import { ExecutorContext, getPackageManagerCommand } from '@nx/devkit';
import { execSync } from 'node:child_process';
import { getDefaultScheme } from '../../utils';
import { ResetExecutorSchema } from './schema';

export default async function run(options: ResetExecutorSchema, ctx: ExecutorContext): Promise<{ success: true }> {
  const command = `${getPackageManagerCommand().exec} prisma migrate reset`;
  const args = getArgs(options, ctx);

  await logger.group('Resetting Database', async () => {
    execSync([command, ...args].join(' '), {
      stdio: 'inherit',
    });
  });

  return { success: true };
}

const getArgs = (options: ResetExecutorSchema, ctx: ExecutorContext): string[] => {
  const args = [];
  const schema = options?.schema ?? getDefaultScheme(ctx);

  args.push(`--schema=${schema}`);

  if (options.force) {
    args.push('--force');
  }

  if (options?.['skip-generate']) {
    args.push('--skip-generate');
  }

  if (options?.['skip-seed']) {
    args.push('--skip-seed');
  }

  return args;
};
