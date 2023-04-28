import { ExecutorContext } from '@nx/devkit';
import { runCommand } from '../../run-commands';
import { getDefaultScheme } from '../../utils';
import { PullExecutorSchema } from './schema';

export default async function run(options: PullExecutorSchema, ctx: ExecutorContext): Promise<{ success: true }> {
  return runCommand(options, ctx, {
    description: 'Pulling Database',
    command: 'prisma db pull',
    getArgs,
  });
}

const getArgs = (options: PullExecutorSchema, ctx: ExecutorContext): string[] => {
  const args = [];
  const schema = options?.schema ?? getDefaultScheme(ctx);

  args.push(`--schema=${schema}`);

  if (options?.force) {
    args.push('--force');
  }

  if (options?.print) {
    args.push('--print');
  }

  return args;
};
