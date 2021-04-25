import executor from './executor';
import type { PrismaSeedSchema } from './schema';

const options: PrismaSeedSchema = {
  script: 'packages/nx-prisma/tests/seed.ts',
  tsConfig: 'packages/nx-prisma/tsconfig.spec.json',
};

export const seedSuite = () =>
  describe('Seed Executor', () => {
    it('can run', async () => {
      const output = await executor(options);
      expect(output.stderr).toBeFalsy();
      expect(output.success).toBeTruthy();
    }, 20000);
  });
