import { createPrismaBuilder } from '../core/prisma-builder';
import { PrismaDeploySchema } from './schema';

const runExecutor = createPrismaBuilder<PrismaDeploySchema>({
  description: 'Deploying Database...',
  command: 'npx prisma migrate deploy',
});

export default runExecutor;
