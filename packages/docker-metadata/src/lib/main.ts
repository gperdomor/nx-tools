import { ExecutorContext } from '@nrwl/devkit';
import { ContextProxyFactory, RepoMetadata, RepoProxyFactory, RunnerContext as Context } from '@nx-tools/ci-context';
import * as core from '@nx-tools/core';
import * as fs from 'fs';
import { GROUP_PREFIX } from './constants';
import { getInputs, Inputs } from './context';
import { Meta, Version } from './meta';

export default async function run(options: Partial<Inputs>, ctx?: ExecutorContext): Promise<Meta> {
  const inputs: Inputs = await getInputs(options, ctx);
  if (inputs.images.length == 0) {
    throw new Error(`images input required`);
  }

  const context: Context = await ContextProxyFactory.create();
  const repo: RepoMetadata = await RepoProxyFactory.create(inputs['github-token']);
  core.startGroup(`Context info`, GROUP_PREFIX);
  core.info(`eventName: ${context.eventName}`);
  core.info(`sha: ${context.sha}`);
  core.info(`ref: ${context.ref}`);
  core.info(`actor: ${context.actor}`);
  core.info(`runNumber: ${context.runNumber}`);
  core.info(`runId: ${context.runId}`);

  const meta: Meta = new Meta(inputs, context, repo);

  const version: Version = meta.version;
  if (meta.version.main == undefined || meta.version.main.length == 0) {
    core.warning(`No Docker image version has been generated. Check tags input.`);
  } else {
    core.startGroup(`Docker image version`, GROUP_PREFIX);
    core.info(version.main || '');
  }

  // Docker tags
  const tags: Array<string> = meta.getTags();
  if (tags.length == 0) {
    core.warning('No Docker tag has been generated. Check tags input.');
  } else {
    core.startGroup(`Docker tags`, GROUP_PREFIX);
    for (const tag of tags) {
      core.info(tag);
    }
  }

  // Docker labels
  const labels: Array<string> = meta.getLabels();
  core.startGroup(`Docker labels`, GROUP_PREFIX);
  for (const label of labels) {
    core.info(label);
  }

  // JSON
  const jsonOutput = meta.getJSON();
  core.startGroup(`JSON output`, GROUP_PREFIX);
  core.info(JSON.stringify(jsonOutput, null, 2));

  // Bake definition file
  const bakeFile: string = meta.getBakeFile();
  core.startGroup(`Bake definition file`, GROUP_PREFIX);
  core.info(fs.readFileSync(bakeFile, 'utf8'));

  return meta;
}
