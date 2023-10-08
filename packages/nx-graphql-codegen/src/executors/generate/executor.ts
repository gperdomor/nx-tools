import { GenerateExecutorSchema } from './schema';
import { ExecutorContext } from '@nx/devkit';
import { getDefaultScheme } from '../../utils';
import { runCommand } from '../../run-commands';

export default async function runExecutor(
  options: GenerateExecutorSchema,
  ctx: ExecutorContext
): Promise<{ success: true }> {
  return runCommand(options, ctx, {
    description: 'Generating types',
    command: 'graphql-codegen',
    getArgs,
  });
}

const getArgs = (options: GenerateExecutorSchema, ctx: ExecutorContext): string[] => {
  const args = [];
  const config = options?.config ?? getDefaultScheme(ctx);

  args.push(`--config=${config}`);

  return args;
};
