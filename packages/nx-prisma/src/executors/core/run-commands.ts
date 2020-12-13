import * as core from '@nx-tools/core';
import { asyncForEach } from '@nx-tools/core';
import * as exec from './exec';

export interface PrismaBuilderOptions {
  schema?: string;
  silent?: boolean;
}

export interface PrismaCommands<T extends PrismaBuilderOptions> {
  commands: string[];
  args?: string[][];
  argsFactory?: (options: T) => string[][];
}

const extractArgs = <T extends PrismaBuilderOptions>(
  length: number,
  { args, argsFactory }: Pick<PrismaCommands<T>, 'args' | 'argsFactory'>,
  options: T,
) => {
  return Array.from({ length }, (_, i) => argsFactory?.(options)?.[i] ?? args?.[i] ?? []);
};

export const runCommands = <T extends PrismaBuilderOptions>(
  { commands, args, argsFactory }: PrismaCommands<T>,
  options: T,
): void => {
  const commandArgs = extractArgs(commands.length, { args, argsFactory }, options);

  core.startGroup('Running prisma commands');
  asyncForEach(commands, async (baseCommand) => {
    const command = `${baseCommand} --schema=${options.schema} ${commandArgs.join(' ')}`;
    core.info(`--> Running ${command}`);
    try {
      await exec.exec(command, null, options.silent, './');
    } catch (error) {
      core.error(error);
    }
  });
  core.endGroup('Running prisma commands');
};
