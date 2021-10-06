import { createPrismaBuilder } from '../core/prisma-builder';
import { PrismaMigrateSchema } from './schema';

const runExecutor = createPrismaBuilder<PrismaMigrateSchema>({
  description: 'Migrating Database...',
  command: 'npx prisma migrate dev',
});

export default runExecutor;
