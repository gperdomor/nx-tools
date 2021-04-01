import { debug, info } from '@nx-tools/core';
import { getMetadata } from '@nx-tools/docker-meta';
import { config } from 'dotenv';
import * as fs from 'fs';
import * as os from 'os';
import * as buildx from './buildx';
import * as context from './context';
import * as exec from './exec';
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

  info(`tmpDir ${tmpDir}`);

  const buildxVersion = await buildx.getVersion();
  info(`📣 Buildx version: ${buildxVersion}`);

  const defContext = context.defaultContext();
  const inputs: context.Inputs = await context.getInputs(defContext, options);

  if (inputs.meta.enabled) {
    const meta = await getMetadata(options.meta);
    if (inputs.meta.mode === context.MetaMode.prepend) {
      inputs.labels = [...meta.getLabels(), ...inputs.labels];
      inputs.tags = [...meta.getTags(), ...inputs.tags];
    } else {
      inputs.labels = [...inputs.labels, ...meta.getLabels()];
      inputs.tags = [...inputs.tags, ...meta.getTags()];
    }
  }

  info(`🏃 Starting build...`);
  const args: string[] = await context.getArgs(inputs, defContext, buildxVersion);

  debug(`executing -> docker ${args.join(' ')}`);
  await exec.exec('docker', args).then((res) => {
    if (res.stderr != '' && !res.success) {
      throw new Error(`buildx call failed with: ${res.stderr.match(/(.*)\s*$/)?.[0]}`);
    }
  });

  const imageID = await buildx.getImageID();
  if (imageID) {
    info('🛒 Extracting digest...');
    info(`${imageID}`);
  }

  cleanup();

  return { success: true };
}

const cleanup = async (): Promise<void> => {
  const tmpDir = context.tmpDir();
  info(`🚿 Removing temp folder ${tmpDir}`);
  fs.rmdirSync(tmpDir, { recursive: true });
};
