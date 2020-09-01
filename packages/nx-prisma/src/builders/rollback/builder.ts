import { createBuilder } from '@angular-devkit/architect';

import { createPrismaBuilder } from '../core/prisma-builder';
import { PrismaRollbackSchema } from './schema';

export const runBuilder = createPrismaBuilder<PrismaRollbackSchema>({
  commands: ['prisma migrate down --experimental'],
});

export default createBuilder(runBuilder);
