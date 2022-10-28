import { ExecutorContext } from '@nrwl/devkit';
import { runCommand } from '../../run-commands';
import { GenerateExecutorSchema } from './schema';

export default async function run(options: GenerateExecutorSchema, ctx: ExecutorContext): Promise<{ success: true }> {
  return runCommand(options, ctx, {
    description: 'Generating Client',
    command: 'prisma generate',
    getArgs,
  });
}

const getArgs = (options: GenerateExecutorSchema): string[] => {
  const args = [];

  if (options?.schema) {
    args.push(`--schema=${options.schema}`);
  }

  if (options?.['data-proxy']) {
    args.push('--data-proxy');
  }

  if (options?.watch) {
    args.push('--watch');
  }

  return args;
};
