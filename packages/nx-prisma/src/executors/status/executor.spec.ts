import executor from './executor';
import { PrismaStatusSchema } from './schema';

const options: PrismaStatusSchema = {
  schema: 'packages/nx-prisma/tests/schema.prisma',
};

export const statusSuite = () =>
  describe('Status Executor', () => {
    it('can run', async () => {
      const output = await executor(options);
      expect(output.success).toBeTruthy();
    }, 40000);
  });
