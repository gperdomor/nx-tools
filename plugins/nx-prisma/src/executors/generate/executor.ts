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

  if (generator) {
    args.push(`--generator=${generator}`);
  }

  // Option list from https://www.prisma.io/docs/orm/reference/prisma-cli-reference#options-1
  const generatorCommandFlags = ['data-proxy', 'accelerate', 'no-engine', 'no-hints', 'allow-no-models', 'watch'];

  generatorCommandFlags.forEach((flag) => {
    if (options[flag]) {
      args.push(`--${flag}`);
    }
  });

  return args;
};

export default runExecutor;
