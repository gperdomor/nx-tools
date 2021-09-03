import { ContextProxyFactory, RepoMetadata, RepoProxyFactory, RunnerContext as Context } from '@nx-tools/ci-context';
import * as core from '@nx-tools/core';
import * as fs from 'fs';
import { getInputs, Inputs } from './context';
import { Meta, Version } from './meta';

async function run(options: Partial<Inputs>): Promise<Meta> {
  // try {
  const inputs: Inputs = await getInputs(options);
  if (inputs.images.length == 0) {
    throw new Error(`images input required`);
  }

  const context: Context = await ContextProxyFactory.create();
  const repo: RepoMetadata = await RepoProxyFactory.create(inputs['github-token']);
  core.startGroup(`Context info`);
  core.info(`eventName: ${context.eventName}`);
  core.info(`sha: ${context.sha}`);
  core.info(`ref: ${context.ref}`);
  core.info(`actor: ${context.actor}`);
  core.info(`runNumber: ${context.runNumber}`);
  core.info(`runId: ${context.runId}`);
  core.endGroup();

  const meta: Meta = new Meta(inputs, context, repo);

  const version: Version = meta.version;
  if (meta.version.main == undefined || meta.version.main.length == 0) {
    core.warning(`No Docker image version has been generated. Check tags input.`);
  } else {
    core.startGroup(`Docker image version`);
    core.info(version.main || '');
    core.endGroup();
  }
  core.setOutput('version', version.main || '');

  // Docker tags
  const tags: Array<string> = meta.getTags();
  if (tags.length == 0) {
    core.warning('No Docker tag has been generated. Check tags input.');
  } else {
    core.startGroup(`Docker tags`);
    for (const tag of tags) {
      core.info(tag);
    }
    core.endGroup();
  }
  core.setOutput('tags', tags.join(inputs['sep-tags']));

  // Docker labels
  const labels: Array<string> = meta.getLabels();
  core.startGroup(`Docker labels`);
  for (const label of labels) {
    core.info(label);
  }
  core.endGroup();
  core.setOutput('labels', labels.join(inputs['sep-labels']));

  // JSON
  const jsonOutput = meta.getJSON();
  core.startGroup(`JSON output`);
  core.info(JSON.stringify(jsonOutput, null, 2));
  core.endGroup();
  core.setOutput('json', jsonOutput);

  // Bake definition file
  const bakeFile: string = meta.getBakeFile();
  core.startGroup(`Bake definition file`);
  core.info(fs.readFileSync(bakeFile, 'utf8'));
  core.endGroup();
  core.setOutput('bake-file', bakeFile);

  return meta;
  // } catch (error) {
  //   core.setFailed(error.message);
  // }
}

export const getMetadata = run;
