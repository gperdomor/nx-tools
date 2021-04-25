import executor from './executor';
import type { PrismaMigrateSchema } from './schema';

const options: PrismaMigrateSchema = {
  schema: 'packages/nx-prisma/tests/schema.prisma',
};

export const migrationsSuite = () =>
  describe('Migrations Executor', () => {
    it('can run', async () => {
      const output = await executor(options);
      expect(output.stderr).toBeFalsy();
      expect(output.success).toBeTruthy();
    }, 20000);
  });
