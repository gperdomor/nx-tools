import { ExecutorContext, names } from '@nrwl/devkit';
import { exec, getBooleanInput, getExecOutput, info, interpolate, loadPackage, startGroup } from '@nx-tools/core';
import { isCI } from 'ci-info';
import 'dotenv/config';
import { randomBytes } from 'node:crypto';
import { mkdir, rmdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as buildx from './buildx';
import * as context from './context';
import { DockerBuildSchema } from './schema';

const GROUP_PREFIX = 'Nx Docker';

export async function run(options: DockerBuildSchema, ctx?: ExecutorContext): Promise<{ success: true }> {
  const tmpDir = context.tmpDir();
  let createBuilder: boolean;
  let inputs: context.Inputs;

  try {
    startGroup(`Docker info`, GROUP_PREFIX);
    await exec('docker', ['version']);
    await exec('docker', ['info']);

    if (!(await buildx.isAvailable())) {
      throw new Error(`Docker buildx is required. See https://github.com/docker/setup-buildx-action to set up buildx.`);
    }

    const buildxVersion = await buildx.getVersion();
    const defContext = context.defaultContext();

    inputs = await context.getInputs(
      defContext,
      {
        ...options,
        file: options.file || join(ctx?.workspace.projects[ctx.projectName].root, 'Dockerfile'),
      },
      ctx
    );

    createBuilder = getBooleanInput('create-builder', {
      prefix: names(ctx?.projectName || '').constantName,
      fallback: 'false',
    });

    if (createBuilder) {
      inputs.builder = inputs.builder || `${ctx.projectName}-${randomBytes(24).toString('hex').substring(0, 6)}`;
    }

    if (options.metadata?.images) {
      const { getMetadata } = loadPackage('@nx-tools/docker-metadata', 'Nx Docker BUild Executor');
      startGroup('Generating metadata', GROUP_PREFIX);
      const meta = await getMetadata(options.metadata, ctx);
      inputs.labels = meta.getLabels();
      inputs.tags = meta.getTags();
    }

    startGroup(`Starting build...`, GROUP_PREFIX);
    if (createBuilder) {
      info(`Creating builder`);
      await getExecOutput(`docker`, ['buildx', 'create', `--name=${inputs.builder}`], {
        ignoreReturnCode: true,
      }).then((res) => {
        if (res.stderr.length > 0 && res.exitCode != 0) {
          throw new Error(`buildx failed with: ${res.stderr.match(/(.*)\s*$/)![0].trim()}`);
        }
      });
    }
    const args: string[] = await context.getArgs(inputs, defContext, buildxVersion);
    await getExecOutput(
      'docker',
      args.map((arg) => interpolate(arg)),
      {
        ignoreReturnCode: true,
      }
    ).then((res) => {
      if (res.stderr.length > 0 && res.exitCode != 0) {
        throw new Error(`buildx failed with: ${res.stderr.match(/(.*)\s*$/)![0].trim()}`);
      }
    });

    startGroup(`Setting outputs`, GROUP_PREFIX);
    const imageID = await buildx.getImageID();
    const metadata = await buildx.getMetadata();

    if (imageID) {
      info(`digest=${imageID}`);

      if (isCI) {
        const outputDir = `${ctx?.root}/.nx-docker/${ctx.projectName}`;
        await mkdir(outputDir, { recursive: true });
        await writeFile(`${outputDir}/iidfile`, imageID);
      }
    }
    if (metadata) {
      info(`metadata=${metadata}`);
      if (isCI) {
        const outputDir = `${ctx?.root}/.nx-docker/${ctx.projectName}`;
        await mkdir(outputDir, { recursive: true });
        await writeFile(`${outputDir}/metadata`, metadata);
      }
    }
  } finally {
    await cleanup(tmpDir, createBuilder ? inputs?.builder : undefined);
  }

  return { success: true };
}

async function cleanup(tmpDir: string, builder: string | undefined): Promise<void> {
  if (builder) {
    startGroup(`Removing builder ${builder}`, GROUP_PREFIX);
    await getExecOutput(`docker`, ['buildx', 'rm', builder], {
      ignoreReturnCode: true,
    });
  }

  if (tmpDir.length > 0) {
    startGroup(`Removing temp folder ${tmpDir}`, GROUP_PREFIX);
    await rmdir(tmpDir, { recursive: true });
  }
}

export default run;
