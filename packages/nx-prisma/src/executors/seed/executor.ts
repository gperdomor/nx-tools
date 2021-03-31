import * as core from '@nx-tools/core';
import * as exec from '../core/exec';
import { PrismaSeedSchema } from './schema';

export default async function runExecutor(options: PrismaSeedSchema) {
  try {
    core.info('--> Seeding Database...');
    return await exec.exec(`npx ts-node --project ${options.tsConfig} ${options.script}`, null, null, './');
  } catch (error) {
    throw new Error('Seeding failed...');
  }
}
