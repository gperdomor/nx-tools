import { exec, startGroup } from '@nx-tools/core';
import { info } from 'console';

export interface PrismaBuilderOptions {
  schema?: string;
  options?: Record<string, boolean>;
}

export interface PrismaCommands<T extends PrismaBuilderOptions> {
  description: string;
  command: string;
}

const extractArgs = <T extends PrismaBuilderOptions>(options: T) => {
  const args = [];

  for (const [key, value] of Object.entries(options)) {
    if (key !== 'options') {
      args.push(`--${key}=${value}`);
    }
  }

  return args;
};

const extractFlags = <T extends PrismaBuilderOptions>(options: Record<string, boolean> = {}) => {
  const flags = [];

  for (const [key, value] of Object.entries(options)) {
    if (value) {
      flags.push(`--${key}`);
    }
  }

  return flags;
};

export const runCommand = async <T extends PrismaBuilderOptions>(
  { description, command }: PrismaCommands<T>,
  options: T
): Promise<{ success: true }> => {
  startGroup(description, 'Nx Prisma');

  const commandArgs = extractArgs(options);
  const commandFlags = extractFlags(options.options);

  const args = [...commandArgs, ...commandFlags];

  info(`Running: ${command} ${args}`);

  await exec(command, args);

  return { success: true };
};
