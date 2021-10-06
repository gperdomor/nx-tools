import { createPrismaBuilder } from '../core/prisma-builder';
import { PrismaPullSchema } from './schema';

const runExecutor = createPrismaBuilder<PrismaPullSchema>({
  description: 'Pulling Database...',
  command: 'npx prisma db pull',
});

export default runExecutor;
