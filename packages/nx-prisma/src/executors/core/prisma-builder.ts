import { PrismaBuilderOptions, PrismaCommands, runCommands } from './run-commands';

export const createPrismaBuilder = <T extends PrismaBuilderOptions>(commands: PrismaCommands<T>) => async (
  options: T,
) => {
  if (!options.schema) {
    throw new Error('ERROR: Bad builder config for @nx-tools/nx-prisma - "schema" option is required');
  }

  return runCommands(commands, options);
};
