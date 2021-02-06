import * as core from '@nx-tools/core';
import * as exec from './exec';

export interface PrismaBuilderOptions {
  schema?: string;
  silent?: boolean;
}

export interface PrismaCommands<T extends PrismaBuilderOptions> {
  description: string;
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

export const runCommands = async <T extends PrismaBuilderOptions>(
  { description, commands, args, argsFactory }: PrismaCommands<T>,
  options: T,
) => {
  const commandArgs = extractArgs(commands.length, { args, argsFactory }, options);

  for (const baseCommand of commands) {
    core.info(`--> ${description}`);
    const command = `${baseCommand} --schema=${options.schema} ${commandArgs.join(' ')}`;
    const result = await exec.exec(command, null, options.silent, './');
    if (!result.success) {
      return result;
    }
  }

  return { success: true };
};
