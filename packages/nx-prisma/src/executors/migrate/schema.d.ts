import { PrismaBase } from '../../interfaces';

export interface MigrateExecutorSchema extends PrismaBase {
  /**
   * The name of the migration. If no name is provided, the CLI will prompt you.
   */
  name?: string;
  /**
   * Creates a new migration based on the changes in the schema but does not apply that migration.
   */
  'create-only'?: boolean;
  /**
   * Skip triggering seed.
   */
  'skip-seed'?: boolean;
  /**
   * Skip triggering generators (for example, Prisma Client).
   */
  'skip-generate'?: boolean;
}
