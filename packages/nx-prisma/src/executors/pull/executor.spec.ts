import executor from './executor';
import { PrismaPullSchema } from './schema';

const options: PrismaPullSchema = {
  schema: 'packages/nx-prisma/tests/schema.prisma',
};

export const pullSuite = () =>
  describe('Pull Executor', () => {
    it('can run', async () => {
      const output = await executor(options);
      expect(output.success).toBeTruthy();
    }, 40000);
  });
