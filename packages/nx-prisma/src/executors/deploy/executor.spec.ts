import executor from './executor';
import { PrismaDeploySchema } from './schema';

const options: PrismaDeploySchema = {
  schema: 'packages/nx-prisma/tests/schema.prisma',
};

export const deploySuite = () =>
  describe('Deploy Executor', () => {
    it('can run', async () => {
      const output = await executor(options);
      expect(output.success).toBeTruthy();
    }, 40000);
  });
