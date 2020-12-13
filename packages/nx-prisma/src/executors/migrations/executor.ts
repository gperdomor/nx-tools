import { createPrismaBuilder } from '../core/prisma-builder';
import { PrismaMigrateSchema } from './schema';

const runExecutor = createPrismaBuilder<PrismaMigrateSchema>({
  commands: ['prisma migrate save --experimental', 'prisma migrate up --experimental'],
  argsFactory: () => [['--name=nx-prisma', '--create-db'], ['--create-db']],
});

export default runExecutor;
