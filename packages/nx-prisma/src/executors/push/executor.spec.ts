import executor from './executor';
import { PrismaPushSchema } from './schema';

const options: PrismaPushSchema = {
  schema: 'packages/nx-prisma/tests/schema.prisma',
};

export const pushSuite = () =>
  describe('Push Executor', () => {
    it('can run', async () => {
      const output = await executor(options);
      expect(output.success).toBeTruthy();
    }, 40000);
  });
