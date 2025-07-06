import { getProjectRoot } from '@nx-tools/core';
import { ExecutorContext, joinPathFragments } from '@nx/devkit';
import { PRISMA_DEFAULT_DIR } from './generators/configuration/constants';

export const getDefaultScheme = (ctx: ExecutorContext) =>
  joinPathFragments(getProjectRoot(ctx), `${PRISMA_DEFAULT_DIR}/schema.prisma`);
