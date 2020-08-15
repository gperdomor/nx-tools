import { createBuilder } from '@angular-devkit/architect';

import { createPrismaBuilder } from '../core/prisma-builder';
import { PrismaMigrateSchema } from './schema';

export const runBuilder = createPrismaBuilder<PrismaMigrateSchema>({
  commands: ['prisma migrate down --experimental'],
});

export default createBuilder(runBuilder);
