import { ExecutorContext } from '@nrwl/devkit';
import { getProjectRoot } from '@nx-tools/core';
import { join } from 'node:path';

export const getDefaultScheme = (ctx: ExecutorContext) => join(getProjectRoot(ctx), 'prisma/schema.prisma');
