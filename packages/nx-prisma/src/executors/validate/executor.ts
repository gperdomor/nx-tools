import { ExecutorContext, PromiseExecutor } from '@nx/devkit';
import { runCommand } from '../../run-commands';
import { getDefaultScheme } from '../../utils';
import { ValidateExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<ValidateExecutorSchema> = async (options, ctx) => {
  return runCommand(options, ctx, {
    description: 'Validating schema',
    command: 'prisma validate',
    getArgs,
  });
};

const getArgs = (options: ValidateExecutorSchema, ctx: ExecutorContext): string[] => {
  const args = [];
  const schema = options?.schema ?? getDefaultScheme(ctx);

  args.push(`--schema=${schema}`);

  return args;
};

export default runExecutor;
