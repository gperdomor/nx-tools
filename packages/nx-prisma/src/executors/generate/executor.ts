import { createPrismaBuilder } from '../core/prisma-builder';
import { PrismaGenerateSchema } from './schema';

const runExecutor = createPrismaBuilder<PrismaGenerateSchema>({
  commands: ['prisma generate'],
});

export default runExecutor;
