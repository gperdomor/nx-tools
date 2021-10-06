import { createPrismaBuilder } from '../core/prisma-builder';
import { PrismaStatusSchema } from './schema';

const runExecutor = createPrismaBuilder<PrismaStatusSchema>({
  description: 'Getting Migration Status...',
  command: 'npx prisma migrate status',
});

export default runExecutor;
