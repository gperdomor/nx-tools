import { exec, startGroup } from '@nx-tools/core';
import { PrismaSeedSchema } from './schema';

export default async function runExecutor(options: PrismaSeedSchema): Promise<{ success: true }> {
  try {
    startGroup('--> Seeding Database...');

    await exec(`npx ts-node --project ${options.tsConfig} ${options.script}`);
  } catch (error) {
    throw new Error('Seeding failed...');
  }

  return { success: true };
}
