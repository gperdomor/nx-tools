import executor from './executor';
import { PrismaMigrateSchema } from './schema';

const options: PrismaMigrateSchema = {
  schema: 'packages/nx-prisma/tests/schema.prisma',
};

export const migrateSuite = () =>
  describe('Migrate Executor', () => {
    it('can run', async () => {
      const output = await executor(options);
      expect(output.success).toBeTruthy();
    }, 40000);
  });
