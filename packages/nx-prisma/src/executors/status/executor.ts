import { ExecutorContext } from '@nrwl/devkit';
import { runCommand } from '../../run-commands';
import { StatusExecutorSchema } from './schema';

export default async function run(options: StatusExecutorSchema, ctx: ExecutorContext): Promise<{ success: true }> {
  return runCommand(options, ctx, {
    description: 'Getting Migration Status',
    command: 'prisma migrate status',
    getArgs,
  });
}

const getArgs = (options: StatusExecutorSchema): string[] => {
  const args = [];

  if (options?.schema) {
    args.push(`--schema=${options.schema}`);
  }

  return args;
};
