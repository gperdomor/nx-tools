import type { PrismaMigrateSchema } from './schema';

import executor from './executor';

const options: PrismaMigrateSchema = {
  schema: 'packages/nx-prisma/tests/schema.prisma',
};

export const migrationsSuite = () =>
  describe('Migrations Executor', () => {
    it('can run', async () => {
      const output = await executor(options);
      expect(output.stderr).toBeFalsy();
      expect(output.success).toBeTruthy();
    });
  });
