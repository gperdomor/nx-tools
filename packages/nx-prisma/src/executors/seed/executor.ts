import * as exec from '../core/exec';
import { PrismaSeedSchema } from './schema';

export default async function runExecutor(options: PrismaSeedSchema): Promise<{ success: true }> {
  try {
    exec.exec(`ts-node --project ${options.tsConfig} ${options.script}`, null, null, './');
  } catch (error) {
    throw new Error('Seeding failed...');
  }

  return { success: true };
}
