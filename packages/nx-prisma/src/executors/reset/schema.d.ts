import { PrismaBase } from '../../interfaces';

export interface ResetExecutorSchema extends PrismaBase {
  /**
   * Skip the confirmation prompt.
   */
  force?: boolean;
  /**
   * Skip triggering generators (for example, Prisma Client).
   */
  'skip-generate'?: boolean;
  /**
   * Skip triggering seed.
   */
  'skip-seed'?: boolean;
}
