import { PrismaBase } from '../../interfaces';

export interface PushExecutorSchema extends PrismaBase {
  /**
   * Skip generation of artifacts such as Prisma Client.
   */
  'skip-generate'?: boolean;
  /**
   * Resets the database and then updates the schema - useful if you need to start from scratch due to unexecutable migrations.
   */
  'force-reset'?: boolean;
  /**
   * Ignore data loss warnings. This option is required if as a result of making the schema changes, data may be lost.
   */
  'accept-data-loss'?: boolean;
}
