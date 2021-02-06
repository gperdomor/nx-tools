import type { PrismaGenerateSchema } from './schema';

import executor from './executor';

const options: PrismaGenerateSchema = {
  schema: 'packages/nx-prisma/tests/schema.prisma',
};

export const generateSuite = () =>
  describe('Generate Executor', () => {
    it('can run', async () => {
      const output = await executor(options);
      expect(output.stderr).toBeFalsy();
      expect(output.success).toBeTruthy();
    }, 10000);
  });
