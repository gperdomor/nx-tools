import { ExecutorContext, getPackageManagerCommand } from '@nrwl/devkit';
import { getProjectRoot, startGroup } from '@nx-tools/core';
import { execSync } from 'child_process';
import { ResetExecutorSchema } from './schema';

export default async function run(options: ResetExecutorSchema, ctx: ExecutorContext): Promise<{ success: true }> {
  const cwd = getProjectRoot(ctx);
  const command = `${getPackageManagerCommand().exec} prisma migrate reset`;
  const args = getArgs(options);

  startGroup('Resetting Database', 'Nx Prisma');

  execSync([command, ...args].join(' '), {
    cwd: cwd,
    stdio: 'inherit',
  });

  return { success: true };
}

const getArgs = (options: ResetExecutorSchema): string[] => {
  const args = [];

  if (options?.schema) {
    args.push(`--schema=${options.schema}`);
  }

  if (options?.force) {
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
