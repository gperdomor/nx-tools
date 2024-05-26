import { ExecutorContext } from '@nx/devkit';
import { runCommand } from '../../run-commands';
import { getDefaultScheme } from '../../utils';
import { FormatExecutorSchema } from './schema';

export default async function run(options: FormatExecutorSchema, ctx: ExecutorContext): Promise<{ success: true }> {
  return runCommand(options, ctx, {
    description: 'Format schema',
    command: 'prisma format',
    getArgs,
  });
}

const getArgs = (options: FormatExecutorSchema, ctx: ExecutorContext): string[] => {
  const args = [];
  const schema = options?.schema ?? getDefaultScheme(ctx);

  args.push(`--schema=${schema}`);

  return args;
};
