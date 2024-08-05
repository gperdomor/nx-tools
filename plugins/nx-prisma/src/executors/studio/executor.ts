import { ExecutorContext, PromiseExecutor } from '@nx/devkit';
import { runCommand } from '../../run-commands';
import { getDefaultScheme } from '../../utils';
import { StudioExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<StudioExecutorSchema> = async (options, ctx) => {
  return runCommand(options, ctx, {
    description: 'Running Prisma Studio',
    command: 'prisma studio',
    getArgs,
  });
};

const getArgs = (options: StudioExecutorSchema, ctx: ExecutorContext): string[] => {
  const args = [];
  const schema = options?.schema ?? getDefaultScheme(ctx);

  args.push(`--schema=${schema}`);

  if (options?.browser) {
    args.push(`--browser=${options.browser}`);
  }

  if (options?.port) {
    args.push(`--port=${options.port}`);
  }

  return args;
};

export default runExecutor;
