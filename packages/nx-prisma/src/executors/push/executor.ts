import { createPrismaBuilder } from '../core/prisma-builder';
import { PrismaPushSchema } from './schema';

const runExecutor = createPrismaBuilder<PrismaPushSchema>({
  description: 'Pushing Database...',
  command: 'npx prisma db push',
});

export default runExecutor;
