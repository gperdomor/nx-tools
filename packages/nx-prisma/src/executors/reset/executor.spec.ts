import executor from './executor';
import { PrismaResetSchema } from './schema';

const options: PrismaResetSchema = {
  schema: 'packages/nx-prisma/tests/schema.prisma',
};

export const resetSuite = () =>
  describe('Reset Executor', () => {
    it('can run', async () => {
      const output = await executor(options);
      expect(output.success).toBe(true);
    });
  });
