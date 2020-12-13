import { createPrismaBuilder } from '../core/prisma-builder';
import { PrismaRollbackSchema } from './schema';

const runExecutor = createPrismaBuilder<PrismaRollbackSchema>({
  commands: ['prisma migrate down --experimental'],
});

export default runExecutor;
