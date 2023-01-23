import { ExecutorContext } from '@nrwl/devkit';
import { runCommand } from '../../run-commands';
import { getDefaultScheme } from '../../utils';
import { StatusExecutorSchema } from './schema';

export default async function run(options: StatusExecutorSchema, ctx: ExecutorContext): Promise<{ success: true }> {
  return runCommand(options, ctx, {
    description: 'Getting Migration Status',
    command: 'prisma migrate status',
    getArgs,
  });
}

const getArgs = (options: StatusExecutorSchema, ctx: ExecutorContext): string[] => {
  const args = [];
  const schema = options?.schema ?? getDefaultScheme(ctx);

  args.push(`--schema=${schema}`);

  return args;
};
