import { PrismaGenerateSchema } from './schema';

const options: PrismaGenerateSchema = {
  schema: 'packages/nx-prisma/tests/schema.prisma',
};

describe('Generate Executor', () => {
  test.todo('add tests');

  // it('can run', async () => {
  //   const output = await executor(options);
  //   expect(output.success).toBe(true);
  // });
});
