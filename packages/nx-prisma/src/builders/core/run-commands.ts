import { createProcess } from '@nx-tools/core';
import { from, zip } from 'rxjs';
import { concatMap } from 'rxjs/operators';

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
  options: T
) => {
  return Array.from({ length }, (_, i) => argsFactory?.(options)?.[i] ?? args?.[i] ?? []);
};

export const runCommands = <T extends PrismaBuilderOptions>(
  { commands, args, argsFactory }: PrismaCommands<T>,
  options: T
) => {
  const commandArgs = extractArgs(commands.length, { args, argsFactory }, options);
  return zip(from(commands), from(commandArgs)).pipe(
    concatMap(async ([baseCommand, args]) => {
      const command = `${baseCommand} --schema=${options.schema} ${args.join(' ')}`;
      await createProcess({ command, silent: options.silent, color: true });
    })
  );
};
