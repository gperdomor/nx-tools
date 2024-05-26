import { ExecutorContext } from '@nx/devkit';
import { runCommand } from '../../run-commands';
import { getDefaultScheme } from '../../utils';
import { DeployExecutorSchema } from './schema';

export default async function runExecutor(
  options: DeployExecutorSchema,
  ctx: ExecutorContext
): Promise<{ success: true }> {
  return runCommand(options, ctx, {
    description: 'Deploying Database',
    command: 'prisma migrate deploy',
    getArgs,
  });
}

const getArgs = (options: DeployExecutorSchema, ctx: ExecutorContext): string[] => {
  const args = [];
  const schema = options?.schema ?? getDefaultScheme(ctx);

  args.push(`--schema=${schema}`);

  return args;
};
