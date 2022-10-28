import { ExecutorContext } from '@nrwl/devkit';
import { runCommand } from '../../run-commands';
import { DeployExecutorSchema } from './schema';

export default async function run(options: DeployExecutorSchema, ctx: ExecutorContext): Promise<{ success: true }> {
  return runCommand(options, ctx, {
    description: 'Deploying Database',
    command: 'prisma migrate deploy',
    getArgs,
  });
}

const getArgs = (options: DeployExecutorSchema): string[] => {
  const args = [];

  if (options?.schema) {
    args.push(`--schema=${options.schema}`);
  }

  return args;
};
