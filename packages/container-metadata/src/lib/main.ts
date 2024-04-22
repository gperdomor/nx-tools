import { RunnerContext as Context, ContextProxyFactory, RepoMetadata, RepoProxyFactory } from '@nx-tools/ci-context';
import { isDebug, logger } from '@nx-tools/core';
import { ExecutorContext } from '@nx/devkit';
import * as fs from 'node:fs';
import { Inputs, getInputs } from './context';
import { Meta, Version } from './meta';

function setOutput(name: string, value: string) {
  // core.setOutput(name, value);
  // core.exportVariable(`DOCKER_METADATA_OUTPUT_${name.replace(/\W/g, '_').toUpperCase()}`, value);
}

export async function getMetadata(options: Partial<Inputs>, ctx?: ExecutorContext): Promise<Meta> {
  const inputs: Inputs = getInputs(options, ctx);
  const context: Context = await ContextProxyFactory.create();
  const repo: RepoMetadata = await RepoProxyFactory.create(inputs['github-token']);

  await logger.group(`Context info`, async () => {
    logger.info(`eventName: ${context.eventName}`);
    logger.info(`sha: ${context.sha}`);
    logger.info(`ref: ${context.ref}`);
    logger.info(`actor: ${context.actor}`);
    logger.info(`runNumber: ${context.runNumber}`);
    logger.info(`runId: ${context.runId}`);
  });

  if (isDebug()) {
    await logger.group(`Context payload`, async () => {
      logger.info(JSON.stringify(context.payload, null, 2));
    });
  }

  const meta: Meta = new Meta(inputs, context, repo);

  const version: Version = meta.version;
  if (meta.version.main == undefined || meta.version.main.length == 0) {
    logger.warn(`No Docker image version has been generated. Check tags input.`);
  } else {
    await logger.group(`Docker image version`, async () => {
      logger.info(version.main || '');
    });
  }
  setOutput('version', version.main || '');

  // Docker tags
  const tags: Array<string> = meta.getTags();
  if (tags.length == 0) {
    logger.warn('No Docker tag has been generated. Check tags input.');
  } else {
    await logger.group(`Docker tags`, async () => {
      for (const tag of tags) {
        logger.info(tag);
      }
    });
  }
  setOutput('tags', tags.join(inputs['sep-tags']));

  // Docker labels
  const labels: Array<string> = meta.getLabels();
  await logger.group(`Docker labels`, async () => {
    for (const label of labels) {
      logger.info(label);
    }
    setOutput('labels', labels.join(inputs['sep-labels']));
  });

  // Annotations
  const annotationsRaw: Array<string> = meta.getAnnotations();
  const annotationsLevels = process.env.DOCKER_METADATA_ANNOTATIONS_LEVELS || 'manifest';
  await logger.group(`Annotations`, async () => {
    const annotations: Array<string> = [];
    for (const level of annotationsLevels.split(',')) {
      annotations.push(
        ...annotationsRaw.map((label) => {
          const v = `${level}:${label}`;
          logger.info(v);
          return v;
        })
      );
    }
    setOutput(`annotations`, annotations.join(inputs['sep-annotations']));
  });

  // JSON
  const jsonOutput = meta.getJSON(annotationsLevels.split(','));
  await logger.group(`JSON output`, async () => {
    logger.info(JSON.stringify(jsonOutput, null, 2));
    setOutput('json', JSON.stringify(jsonOutput));
  });

  // Bake files
  for (const kind of ['tags', 'labels', 'annotations:' + annotationsLevels]) {
    const outputName = kind.split(':')[0];
    const bakeFile: string = meta.getBakeFile(kind);
    await logger.group(`Bake file definition (${outputName})`, async () => {
      logger.info(fs.readFileSync(bakeFile, 'utf8'));
      setOutput(`bake-file-${outputName}`, bakeFile);
    });
  }

  // Bake file with tags and labels
  setOutput(`bake-file`, `${meta.getBakeFileTagsLabels()}`);

  return meta;
}
