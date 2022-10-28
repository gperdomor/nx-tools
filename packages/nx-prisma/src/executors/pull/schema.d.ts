import { PrismaBase } from '../../interfaces';

export interface PullExecutorSchema extends PrismaBase {
  /**
   * Force overwrite of manual changes made to schema.
   */
  force?: boolean;
  /**
   * Prints the created schema.prisma to the screen instead of writing it to the filesystem.
   */
  print?: boolean;
}
