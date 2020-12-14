// import executor from './executor';
import { PrismaMigrateSchema } from './schema';

const options: PrismaMigrateSchema = {
  schema: 'packages/nx-prisma/tests/schema.prisma',
};

describe('Migrations Executor', () => {
  test.todo('add tests');

  // it('can run', async () => {
  //   const output = await executor(options);
  //   expect(output.success).toBe(true);
  // });
});
