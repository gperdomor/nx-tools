import { PrismaBase } from '../../interfaces';

export interface ResolveExecutorSchema extends PrismaBase {
  /**
   * Record a specific migration as applied.
   */
  applied?: string;
  /**
   * Record a specific migration as rolled back.
   */
  'rolled-back'?: string;
}
