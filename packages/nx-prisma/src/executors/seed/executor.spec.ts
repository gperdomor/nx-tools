// import executor from './executor';
import { PrismaSeedSchema } from './schema';

const options: PrismaSeedSchema = {
  script: 'packages/nx-prisma/tests/schema.prisma',
  tsConfig: '',
};

describe('Seed Executor', () => {
  test.todo('fix tests');

  // it('can run', async () => {
  //   const output = await executor(options);
  //   expect(output.success).toBe(true);
  // });
});
