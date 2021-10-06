import { ExecutorContext } from '@nrwl/devkit';
import { exec, getExecOutput, info, interpolate, loadPackage, startGroup } from '@nx-tools/core';
import 'dotenv/config';
import { rmdirSync } from 'fs';
import { join } from 'path';
import * as buildx from './buildx';
import * as context from './context';
import { DockerBuildSchema } from './schema';

const GROUP_PREFIX = 'Nx Docker';

export default async function run(options: DockerBuildSchema, ctx?: ExecutorContext): Promise<{ success: true }> {
  const tmpDir = context.tmpDir();

  try {
    startGroup('Docker info', GROUP_PREFIX);
    await exec('docker', ['version']);
    await exec('docker', ['info']);

    if (!(await buildx.isAvailable())) {
      throw new Error(`Docker buildx is required. See https://github.com/docker/setup-buildx-action to set up buildx.`);
    }

    const buildxVersion = await buildx.getVersion();
    const defContext = context.defaultContext();
    const inputs: context.Inputs = await context.getInputs(defContext, {
      ...options,
      file: options.file || join(ctx?.workspace.projects[ctx.projectName].root, 'Dockerfile'),
    });

    if (options.metadata?.images) {
      const { getMetadata } = loadPackage('@nx-tools/docker-metadata', 'Nx Docker BUild Executor', () =>
        require('@nx-tools/docker-metadata'),
      );
      startGroup('Generating metadata', GROUP_PREFIX);
      const meta = await getMetadata(options.metadata);
      inputs.labels = meta.getLabels();
      inputs.tags = meta.getTags();
    }

    startGroup(`Starting build...`, GROUP_PREFIX);
    const args: string[] = await context.getArgs(inputs, defContext, buildxVersion);
    await getExecOutput(
      'docker',
      args.map((arg) => interpolate(arg)),
      {
        ignoreReturnCode: true,
      },
    ).then((res) => {
      if (res.stderr.length > 0 && res.exitCode != 0) {
        throw new Error(`buildx failed with: ${res.stderr.match(/(.*)\s*$/)![0].trim()}`);
      }
    });

    startGroup('Setting outputs', GROUP_PREFIX);
    const imageID = await buildx.getImageID();
    const metadata = await buildx.getMetadata();
    if (imageID) {
      info(`digest=${imageID}`);
    }
    if (metadata) {
      info(`metadata=${metadata}`);
    }
  } finally {
    cleanup(tmpDir);
  }

  return { success: true };
}

async function cleanup(tmpDir: string): Promise<void> {
  if (tmpDir.length > 0) {
    startGroup(`Removing temp folder ${tmpDir}`, GROUP_PREFIX);
    rmdirSync(tmpDir, { recursive: true });
  }
}
