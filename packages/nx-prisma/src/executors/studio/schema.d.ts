import { PrismaBase } from '../../interfaces';

export interface StudioExecutorSchema extends PrismaBase {
  /**
   * The browser to auto-open Studio in.
   */
  browser?: string;
  /**
   * The port number to start Studio on.
   */
  port?: number;
}
