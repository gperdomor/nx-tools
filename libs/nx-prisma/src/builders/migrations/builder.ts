import { createBuilder } from '@angular-devkit/architect';

import { createPrismaBuilder } from '../core/prisma-builder';
import { PrismaMigrateSchema } from './schema';

export const runBuilder = createPrismaBuilder<PrismaMigrateSchema>({
  commands: ['prisma migrate save --experimental', 'prisma migrate up --experimental'],
  argsFactory: () => [['--name=nx-prisma', '--create-db'], ['--create-db']],
});

export default createBuilder(runBuilder);
