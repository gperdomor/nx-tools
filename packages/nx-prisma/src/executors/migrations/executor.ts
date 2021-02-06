import { createPrismaBuilder } from '../core/prisma-builder';
import { PrismaMigrateSchema } from './schema';

const runExecutor = (options: PrismaMigrateSchema) => {
  const builder = createPrismaBuilder<PrismaMigrateSchema>({
    description: 'Migrating Database...',
    commands: ['npx prisma migrate dev --preview-feature --name=nx-prisma'],
  });

  return builder(options);
};

export default runExecutor;
