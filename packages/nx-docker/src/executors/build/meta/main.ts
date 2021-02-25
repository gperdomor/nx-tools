import { RunnerContext, RunnerContextProxyFactory } from '@nx-tools/ci';
import * as core from '@nx-tools/core';
import { getInputs, Inputs } from './context';
import { Meta, Version } from './meta';

export const extractMetadata = async (options: Partial<Inputs>) => {
  try {
    const inputs: Inputs = await getInputs(options);

    if (inputs.images.length == 0) {
      throw new Error(`images input required`);
    }

    const context: RunnerContext = RunnerContextProxyFactory.create();

    core.startGroup(`Context info`);
    core.info(`eventName: ${context.eventName}`);
    core.info(`sha: ${context.sha}`);
    core.info(`ref: ${context.ref}`);
    core.info(`actor: ${context.actor}`);
    core.info(`runNumber: ${context.runNumber}`);
    core.info(`runId: ${context.runId}`);
    core.endGroup(`Context info`);

    const meta: Meta = new Meta(inputs, context);

    const version: Version = meta.version();
    core.startGroup(`Docker image version`);
    core.info(version.version || '');
    core.endGroup(`Docker image version`);

    const tags: Array<string> = meta.tags();
    core.startGroup(`Docker tags`);
    for (const tag of tags) {
      core.info(tag);
    }
    core.endGroup(`Docker tags`);

    const labels: Array<string> = meta.labels();
    core.startGroup(`Docker labels`);
    for (const label of labels) {
      core.info(label);
    }
    core.endGroup(`Docker labels`);

    return meta;
  } catch (error) {
    core.setFailed(error.message);
  }
};
