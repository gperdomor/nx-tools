import { ExecutorContext, PromiseExecutor } from '@nx/devkit';
import { runCommand } from '../../run-commands';
import { getDefaultScheme } from '../../utils';
import { GenerateExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<GenerateExecutorSchema> = async (options, ctx: ExecutorContext) => {
  return runCommand(options, ctx, {
    description: 'Generating types',
    command: 'graphql-codegen',
    getArgs,
  });
};

const getArgs = (options: GenerateExecutorSchema, ctx: ExecutorContext): string[] => {
  const args = [];
  const config = options?.config ?? getDefaultScheme(ctx);

  args.push(`--config=${config}`);

  return args;
};

export default runExecutor;
