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

  let stdout = '';
  let stderr = '';

  for (const baseCommand of commands) {
    core.info(`--> ${description}`);
    const command = `${baseCommand} --schema=${options.schema} ${commandArgs.join(' ')}`;
    const result = await exec.exec(command, null, options.silent, './');
    stdout += `${result.stdout}\n`.trim();
    stderr += `${result.stderr}\n`.trim();

    if (!result.success) {
      return { success: false, stdout, stderr };
    }
  }

  return { success: true, stdout, stderr };
};
