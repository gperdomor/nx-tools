import { createPrismaBuilder } from '../core/prisma-builder';
import { PrismaResetSchema } from './schema';

const runExecutor = createPrismaBuilder<PrismaResetSchema>({
  description: 'Resetting Database...',
  commands: ['npx prisma migrate reset --force --preview-feature'],
});

export default runExecutor;
