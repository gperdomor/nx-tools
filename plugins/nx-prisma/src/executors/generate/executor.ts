import { ExecutorContext, PromiseExecutor } from '@nx/devkit';
import { runCommand } from '../../run-commands';
import { getDefaultScheme } from '../../utils';
import { GenerateExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<GenerateExecutorSchema> = async (options, ctx) => {
  return runCommand(options, ctx, {
    description: 'Generating Client',
    command: 'prisma generate',
    getArgs,
  });
};

const getArgs = (options: GenerateExecutorSchema, ctx: ExecutorContext): string[] => {
  const args = [];
  const schema = options?.schema ?? getDefaultScheme(ctx);
  const generator = options?.generator;

  args.push(`--schema=${schema}`);

  if (options?.['data-proxy']) {
    args.push('--data-proxy');
  }

  if (generator) {
    args.push(`--generator=${generator}`);
  }

  if (options?.watch) {
    args.push('--watch');
  }

  return args;
};

export default runExecutor;
