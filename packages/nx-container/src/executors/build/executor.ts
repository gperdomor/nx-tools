import 'dotenv/config';
import { ExecutorContext, names } from '@nrwl/devkit';
import * as core from '@nx-tools/core';
import { getProjectRoot } from '@nx-tools/core';
import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import * as context from './context';
import { EngineAdapter } from './engines/engine-adapter';
import { EngineFactory } from './engines/engine.factory';
import { DockerBuildSchema } from './schema';

const GROUP_PREFIX = 'Nx Container';

export async function run(options: DockerBuildSchema, ctx?: ExecutorContext): Promise<{ success: true }> {
  const tmpDir = context.tmpDir();

  try {
    const defContext = context.defaultContext();
    const inputs: context.Inputs = await context.getInputs(
      defContext,
      {
        ...options,
        file: options.file || join(getProjectRoot(ctx), 'Dockerfile'),
      },
      ctx
    );

    const prefix = names(ctx?.projectName || '').constantName;
    const provider = core.getInput('engine', { prefix, fallback: options.engine || 'docker' });

    const engine: EngineAdapter = EngineFactory.create(provider);
    await engine.initialize(inputs, ctx);

    if (options.metadata?.images) {
      const { getMetadata } = await core.loadPackage('@nx-tools/container-metadata', 'Nx Container Build Executor');
      core.startGroup('Generating metadata', GROUP_PREFIX);
      const meta = await getMetadata(options.metadata, ctx);
      inputs.labels = meta.getLabels();
      inputs.tags = meta.getTags();
    }

    core.startGroup(`Starting build...`, GROUP_PREFIX);
    const args: string[] = await engine.getArgs(inputs, defContext);
    const buildCmd = engine.getCommand(args);
    await core
      .getExecOutput(
        buildCmd.command,
        buildCmd.args.map((arg) => core.interpolate(arg)),
        {
          ignoreReturnCode: true,
        }
      )
      .then((res) => {
        if (res.stderr.length > 0 && res.exitCode != 0) {
          throw new Error(`buildx failed with: ${res.stderr.match(/(.*)\s*$/)?.[0]?.trim() ?? 'unknown error'}`);
        }
      });

    await engine.finalize(inputs, ctx);

    const imageID = await engine.getImageID();
    const metadata = await engine.getMetadata();
    const digest = await engine.getDigest(metadata);

    if (imageID) {
      core.startGroup(`ImageID`);
      core.info(imageID);
      context.setOutput('imageid', imageID, ctx);
    }
    if (digest) {
      core.startGroup(`Digest`);
      core.info(digest);
      context.setOutput('digest', digest, ctx);
    }
    if (metadata) {
      core.startGroup(`Metadata`);
      core.info(metadata);
      context.setOutput('metadata', metadata, ctx);
    }
  } finally {
    await cleanup(tmpDir);
  }

  return { success: true };
}

async function cleanup(tmpDir: string): Promise<void> {
  if (tmpDir.length > 0 && existsSync(tmpDir)) {
    core.startGroup(`Removing temp folder ${tmpDir}`, GROUP_PREFIX);
    await rm(tmpDir, { recursive: true });
  }
}

export default run;
