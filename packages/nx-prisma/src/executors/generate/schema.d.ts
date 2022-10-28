import { PrismaBase } from '../../interfaces';

export interface GenerateExecutorSchema extends PrismaBase {
  /**
   * The generate command will generate Prisma Client for use with the Data Proxy.
   */
  'data-proxy'?: boolean;
  /**
   * The generate command will continue to watch the schema.prisma file and re-generate Prisma Client on file changes.
   */
  watch?: boolean;
}
