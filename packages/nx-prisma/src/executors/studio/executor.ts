import { ExecutorContext } from '@nrwl/devkit';
import { runCommand } from '../../run-commands';
import { getDefaultScheme } from '../../utils';
import { StudioExecutorSchema } from './schema';

export default async function run(options: StudioExecutorSchema, ctx: ExecutorContext): Promise<{ success: true }> {
  return runCommand(options, ctx, {
    description: 'Running Prisma Studio',
    command: 'prisma studio',
    getArgs,
  });
}

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
