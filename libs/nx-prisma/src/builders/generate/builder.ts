import { createBuilder } from '@angular-devkit/architect';

import { createPrismaBuilder } from '../core/prisma-builder';
import { PrismaGenerateSchema } from './schema';

export const runBuilder = createPrismaBuilder<PrismaGenerateSchema>({
  commands: ['prisma generate'],
});

export default createBuilder(runBuilder);
