import { PrismaBuilderOptions, PrismaCommands, runCommands } from './run-commands';

export const createPrismaBuilder = <T extends PrismaBuilderOptions>(commands: PrismaCommands<T>) => async (
  options: T,
): Promise<{ success: true }> => {
  if (!options.schema) {
    throw new Error('ERROR: Bad builder config for @nx-tools/nx-prisma - "schema" option is required');
  }

  await runCommands(commands, options);

  return { success: true };
};
