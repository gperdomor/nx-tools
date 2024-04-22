import { logger } from '@nx-tools/core';
import { BaseContext } from 'clipanion';

export type Context = BaseContext & {
  cwd: string;
  logger: typeof logger;
};
