import type { PrismaResetSchema } from './schema';

import executor from './executor';

const options: PrismaResetSchema = {
  schema: 'packages/nx-prisma/tests/schema.prisma',
};

export const resetSuite = () =>
  describe('Reset Executor', () => {
    it('can run', async () => {
      const output = await executor(options);
      expect(output.stderr).toBeFalsy();
      expect(output.success).toBeTruthy();
    }, 10000);
  });
