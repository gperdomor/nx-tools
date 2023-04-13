import { ExecutorContext } from '@nrwl/devkit';
import { RunnerContext as Context, ContextProxyFactory, RepoMetadata, RepoProxyFactory } from '@nx-tools/ci-context';
import { logger } from '@nx-tools/core';
import * as fs from 'node:fs';
import { GROUP_PREFIX } from './constants';
import { Inputs, getInputs } from './context';
import { Meta, Version } from './meta';

export async function getMetadata(options: Partial<Inputs>, ctx?: ExecutorContext): Promise<Meta> {
  const inputs: Inputs = await getInputs(options, ctx);
  if (inputs.images.length == 0) {
    throw new Error(`images input required`);
  }

  const context: Context = await ContextProxyFactory.create();
  const repo: RepoMetadata = await RepoProxyFactory.create(inputs['github-token']);
  logger.startGroup(GROUP_PREFIX, `Context info`);
  logger.info(`eventName: ${context.eventName}`);
  logger.info(`sha: ${context.sha}`);
  logger.info(`ref: ${context.ref}`);
  logger.info(`actor: ${context.actor}`);
  logger.info(`runNumber: ${context.runNumber}`);
  logger.info(`runId: ${context.runId}`);

  const meta: Meta = new Meta(inputs, context, repo);

  const version: Version = meta.version;
  if (meta.version.main == undefined || meta.version.main.length == 0) {
    logger.warn(`No Docker image version has been generated. Check tags input.`);
  } else {
    logger.startGroup(GROUP_PREFIX, `Docker image version`);
    logger.info(version.main || '');
  }

  // Docker tags
  const tags: Array<string> = meta.getTags();
  if (tags.length == 0) {
    logger.warn('No Docker tag has been generated. Check tags input.');
  } else {
    logger.startGroup(GROUP_PREFIX, `Docker tags`);
    for (const tag of tags) {
      logger.info(tag);
    }
  }

  // Docker labels
  const labels: Array<string> = meta.getLabels();
  logger.startGroup(GROUP_PREFIX, `Docker labels`);
  for (const label of labels) {
    logger.info(label);
  }

  // JSON
  const jsonOutput = meta.getJSON();
  logger.startGroup(GROUP_PREFIX, `JSON output`);
  logger.info(JSON.stringify(jsonOutput, null, 2));

  // Bake file definition
  const bakeFile: string = meta.getBakeFile();
  logger.startGroup(GROUP_PREFIX, `Bake definition file`);
  logger.info(fs.readFileSync(bakeFile, 'utf8'));

  return meta;
}
