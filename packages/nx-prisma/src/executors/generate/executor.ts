import { createPrismaBuilder } from '../core/prisma-builder';
import { PrismaGenerateSchema } from './schema';

const runExecutor = createPrismaBuilder<PrismaGenerateSchema>({
  description: 'Generating Client...',
  commands: ['npx prisma generate'],
});

export default runExecutor;
