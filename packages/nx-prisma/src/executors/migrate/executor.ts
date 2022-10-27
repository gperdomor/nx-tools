import { ExecutorContext, getPackageManagerCommand } from '@nrwl/devkit';
import { getProjectRoot, startGroup } from '@nx-tools/core';
import { execSync } from 'child_process';
import { GROUP_PREFIX } from '../../constants';
import { MigrateExecutorSchema } from './schema';

export default async function run(options: MigrateExecutorSchema, ctx: ExecutorContext): Promise<{ success: true }> {
  const cwd = getProjectRoot(ctx);
  const command = `${getPackageManagerCommand().exec} prisma migrate dev`;
  const args = getArgs(options);

  startGroup('Migrating Database', GROUP_PREFIX);

  execSync([command, ...args].join(' '), {
    cwd: cwd,
    stdio: 'inherit',
  });

  return { success: true };
}

const getArgs = (options: MigrateExecutorSchema): string[] => {
  const args = [];

  if (options?.schema) {
    args.push(`--schema=${options.schema}`);
  }

  if (options?.name) {
    args.push(`--name=${options.name}`);
  }

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
