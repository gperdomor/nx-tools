import executor from './executor';
import { PrismaGenerateSchema } from './schema';

const options: PrismaGenerateSchema = {
  schema: 'packages/nx-prisma/tests/schema.prisma',
};

export const generateSuite = () =>
  describe('Generate Executor', () => {
    it('can run', async () => {
      const output = await executor(options);
      expect(output.success).toBe(true);
    });
  });
