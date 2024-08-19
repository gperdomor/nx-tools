import { ContextProxyFactory, RunnerContext } from '@nx-tools/ci-context';
import * as core from '@nx-tools/core';
import { ExecutorContext, names } from '@nx/devkit';

export interface Inputs {
  quiet?: boolean;
  'bake-target': string;
  'github-token': string;
  'sep-annotations': string;
  'sep-labels': string;
  'sep-tags': string;
  annotations: string[];
  flavor: string[];
  images: string[];
  labels: string[];
  tags: string[];
}

export function getInputs(options: Partial<Inputs>, ctx?: ExecutorContext): Inputs {
  const prefix = names(ctx?.projectName || '').constantName;

  return {
    quiet: options.quiet || false,
    'bake-target': core.getInput('bake-target', {
      prefix,
      fallback: options['bake-target'] || 'container-metadata-action',
    }),
    'github-token': core.getInput('github-token'),
    'sep-annotations': core.getInput('sep-annotations', {
      prefix,
      fallback: options['sep-annotations'] || '\n',
      trimWhitespace: false,
    }),
    'sep-labels': core.getInput('sep-labels', {
      prefix,
      fallback: options['sep-labels'] || '\n',
      trimWhitespace: false,
    }),
    'sep-tags': core.getInput('sep-tags', { prefix, fallback: options['sep-tags'] || '\n', trimWhitespace: false }),
    annotations: core
      .getInputList('annotations', {
        prefix,
        fallback: options.annotations,
        ignoreComma: true,
        comment: '#',
      })
      .map((flavor) => core.interpolate(flavor)),
    flavor: core
      .getInputList('flavor', { prefix, fallback: options.flavor, ignoreComma: true, comment: '#' })
      .map((flavor) => core.interpolate(flavor)),
    images: core
      .getInputList('images', { prefix, fallback: options.images, ignoreComma: true, comment: '#' })
      .map((image) => core.interpolate(image)),
    labels: core
      .getInputList('labels', { prefix, fallback: options.labels, ignoreComma: true, comment: '#' })
      .map((label) => core.interpolate(label)),
    tags: core
      .getInputList('tags', { prefix, fallback: options.tags, ignoreComma: true, comment: '#' })
      .map((tag) => core.interpolate(tag)),
  };
}

export async function getContext(): Promise<RunnerContext> {
  const context = await ContextProxyFactory.create();

  if (context.name === 'GITHUB') {
    // Needs to override Git reference with pr ref instead of upstream branch ref
    // for pull_request_target event
    // https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request_target
    if (/pull_request_target/.test(context.eventName)) {
      context.ref = `refs/pull/${context.payload.number}/merge`;
    }

    // DOCKER_METADATA_PR_HEAD_SHA env var can be used to set associated head
    // SHA instead of commit SHA that triggered the workflow on pull request
    // event.
    if (/true/i.test(process.env.DOCKER_METADATA_PR_HEAD_SHA || '')) {
      if (
        (/pull_request/.test(context.eventName) || /pull_request_target/.test(context.eventName)) &&
        context.payload?.pull_request?.head?.sha != undefined
      ) {
        context.sha = context.payload.pull_request.head.sha;
      }
    }
  }

  return context;
}
