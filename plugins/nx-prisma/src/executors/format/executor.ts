import { ExecutorContext, PromiseExecutor } from '@nx/devkit';
import { runCommand } from '../../run-commands';
import { getDefaultScheme } from '../../utils';
import { FormatExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<FormatExecutorSchema> = async (options, ctx) => {
  return runCommand(options, ctx, {
    description: 'Format schema',
    command: 'prisma format',
    getArgs,
  });
};

const getArgs = (options: FormatExecutorSchema, ctx: ExecutorContext): string[] => {
  const args = [];
  const schema = options?.schema ?? getDefaultScheme(ctx);

  args.push(`--schema=${schema}`);

  return args;
};

export default runExecutor;
