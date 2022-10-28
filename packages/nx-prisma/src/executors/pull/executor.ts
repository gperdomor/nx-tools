import { ExecutorContext } from '@nrwl/devkit';
import { runCommand } from '../../run-commands';
import { PullExecutorSchema } from './schema';

export default async function run(options: PullExecutorSchema, ctx: ExecutorContext): Promise<{ success: true }> {
  return runCommand(options, ctx, {
    description: 'Pulling Database',
    command: 'prisma db pull',
    getArgs,
  });
}

const getArgs = (options: PullExecutorSchema): string[] => {
  const args = [];

  if (options?.schema) {
    args.push(`--schema=${options.schema}`);
  }

  if (options?.force) {
    args.push('--force');
  }

  if (options?.print) {
    args.push('--print');
  }

  return args;
};
