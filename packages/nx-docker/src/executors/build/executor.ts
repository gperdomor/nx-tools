import * as core from '@nx-tools/core';
import { config } from 'dotenv';
import * as fs from 'fs';
import * as os from 'os';
import * as buildx from './buildx';
import * as context from './context';
import * as exec from './exec';
import { extractMetadata } from './meta/main';
import { BuildExecutorSchema } from './schema';

export default async function runExecutor(options: BuildExecutorSchema): Promise<{ success: true }> {
  config();

  if (os.platform() !== 'linux' && os.platform() !== 'darwin') {
    throw new Error(`Only supported on linux and darwin platform`);
  }

  if (!(await buildx.isAvailable())) {
    throw new Error(`Buildx is required. See https://github.com/docker/setup-buildx-action to set up buildx.`);
  }

  const tmpDir = context.tmpDir();

  core.info(`tmpDir ${tmpDir}`);

  const buildxVersion = await buildx.getVersion();
  core.info(`📣 Buildx version: ${buildxVersion}`);

  const defContext = context.defaultContext();
  const inputs: context.Inputs = await context.getInputs(defContext, options);

  if (inputs.meta.enabled) {
    const meta = await extractMetadata(options.meta);
    if (inputs.meta.mode === context.MetaMode.prepend) {
      inputs.labels = [...meta.labels(), ...inputs.labels];
      inputs.tags = [...meta.tags(), ...inputs.tags];
    } else {
      inputs.labels = [...inputs.labels, ...meta.labels()];
      inputs.tags = [...inputs.tags, ...meta.tags()];
    }
  }

  core.info(`🏃 Starting build...`);
  const args: string[] = await context.getArgs(inputs, defContext, buildxVersion);

  core.debug(`executing -> docker ${args.join(' ')}`);
  await exec.exec('docker', args).then((res) => {
    if (res.stderr != '' && !res.success) {
      throw new Error(`buildx call failed with: ${res.stderr.match(/(.*)\s*$/)?.[0]}`);
    }
  });

  const imageID = await buildx.getImageID();
  if (imageID) {
    core.info('🛒 Extracting digest...');
    core.info(`${imageID}`);
  }

  cleanup();

  return { success: true };
}

const cleanup = async (): Promise<void> => {
  const tmpDir = context.tmpDir();
  core.info(`🚿 Removing temp folder ${tmpDir}`);
  fs.rmdirSync(tmpDir, { recursive: true });
};
