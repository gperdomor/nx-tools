import 'dotenv/config';
import * as core from '@nx-tools/core';
import { getMetadata } from '@nx-tools/docker-meta';
import * as fs from 'fs';
import * as buildx from './buildx';
import * as context from './context';
import { BuildExecutorSchema } from './schema';

export default async function run(options: BuildExecutorSchema): Promise<{ success: true }> {
  core.startGroup(`Docker info`);
  await core.exec('docker', ['version']);
  await core.exec('docker', ['info']);
  core.endGroup();

  if (!(await buildx.isAvailable())) {
    throw new Error(`Docker buildx is required. See https://github.com/docker/setup-buildx-action to set up buildx.`);
  }

  const tmpDir = context.tmpDir();
  const buildxVersion = await buildx.getVersion();
  const defContext = context.defaultContext();
  const inputs: context.Inputs = await context.getInputs(defContext, options);

  if (inputs.meta.enabled) {
    const meta = await getMetadata(options.meta);
    inputs.labels = meta.getLabels();
    inputs.tags = meta.getTags();
  }

  core.info(`Starting build...`);
  const args: string[] = await context.getArgs(inputs, defContext, buildxVersion);
  await core
    .getExecOutput(
      'docker',
      args.map((arg) => core.interpolate(arg)),
      {
        ignoreReturnCode: true,
      },
    )
    .then((res) => {
      if (res.stderr.length > 0 && res.exitCode != 0) {
        throw new Error(`buildx failed with: ${res.stderr.match(/(.*)\s*$/)![0].trim()}`);
      }
    });

  const imageID = await buildx.getImageID();
  if (imageID) {
    core.startGroup(`Extracting digest`);
    core.info(`${imageID}`);
    core.endGroup();
  }

  cleanup(tmpDir);

  return { success: true };
}

async function cleanup(tmpDir: string): Promise<void> {
  if (tmpDir.length > 0) {
    core.startGroup(`Removing temp folder ${tmpDir}`);
    fs.rmdirSync(tmpDir, { recursive: true });
    core.endGroup();
  }
}
