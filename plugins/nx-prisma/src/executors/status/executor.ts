import { ExecutorContext, PromiseExecutor } from '@nx/devkit';
import { runCommand } from '../../run-commands';
import { getDefaultScheme } from '../../utils';
import { StatusExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<StatusExecutorSchema> = async (options, ctx) => {
  return runCommand(options, ctx, {
    description: 'Getting Migration Status',
    command: 'prisma migrate status',
    getArgs,
  });
};

const getArgs = (options: StatusExecutorSchema, ctx: ExecutorContext): string[] => {
  const args = [];
  const schema = options?.schema ?? getDefaultScheme(ctx);

  args.push(`--schema=${schema}`);

  return args;
};

export default runExecutor;
