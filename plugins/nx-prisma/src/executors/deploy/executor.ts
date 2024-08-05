import { ExecutorContext, PromiseExecutor } from '@nx/devkit';
import { runCommand } from '../../run-commands';
import { getDefaultScheme } from '../../utils';
import { DeployExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<DeployExecutorSchema> = async (options, ctx) => {
  return runCommand(options, ctx, {
    description: 'Deploying Database',
    command: 'prisma migrate deploy',
    getArgs,
  });
};

const getArgs = (options: DeployExecutorSchema, ctx: ExecutorContext): string[] => {
  const args = [];
  const schema = options?.schema ?? getDefaultScheme(ctx);

  args.push(`--schema=${schema}`);

  return args;
};

export default runExecutor;
