import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { dotenv } from '@nx-tools/core';
import * as fs from 'fs';
import * as buildx from './buildx';
import * as context from './context';
import * as exec from './exec';
import { BuildBuilderSchema } from './schema';

export async function runBuilder(options: BuildBuilderSchema, ctx: BuilderContext): Promise<BuilderOutput> {
  try {
    dotenv();

    // if (os.platform() !== 'linux') {
    //   throw new Error(`Only supported on linux platform`);
    // }

    if (!(await buildx.isAvailable())) {
      throw new Error(`Buildx is required. See https://github.com/docker/setup-buildx-action to set up buildx.`);
    }

    const tmpDir = context.tmpDir();

    ctx.logger.info(`tmpDir ${tmpDir}`);

    const buildxVersion = await buildx.getVersion();
    ctx.logger.info(`📣 Buildx version: ${buildxVersion}`);

    const defContext = context.defaultContext();
    const inputs: context.Inputs = await context.getInputs(defContext);

    ctx.logger.info(`🏃 Starting build...`);
    const args: string[] = await context.getArgs(inputs, defContext, buildxVersion);
    await exec.exec('docker', args).then((res) => {
      if (res.stderr != '' && !res.success) {
        throw new Error(`buildx call failed with: ${res.stderr.match(/(.*)\s*$/)?.[0]}`);
      }
    });

    const imageID = await buildx.getImageID();
    if (imageID) {
      ctx.logger.info('🛒 Extracting digest...');
      ctx.logger.info(`${imageID}`);
    }

    cleanup(ctx);

    return Promise.resolve({ success: true });
  } catch (error) {
    return Promise.resolve({ success: false, error: error.message });
  }
}

const cleanup = async (ctx: BuilderContext): Promise<void> => {
  const tmpDir = context.tmpDir();
  ctx.logger.info(`🚿 Removing temp folder ${tmpDir}`);
  fs.rmdirSync(tmpDir, { recursive: true });
};

export default createBuilder(runBuilder);
