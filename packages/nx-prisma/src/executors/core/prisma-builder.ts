import { ExecutorContext } from '@nrwl/devkit';
import { join } from 'path';
import { PrismaBuilderOptions, PrismaCommands, runCommand } from './run-commands';

export const createPrismaBuilder =
  <T extends PrismaBuilderOptions>(command: PrismaCommands<T>) =>
  async (options: T, context?: ExecutorContext) => {
    if (!options.schema) {
      options.schema = join(context?.workspace.projects[context.projectName].root, 'schema.prisma');
    }

    return runCommand(command, options);
  };
