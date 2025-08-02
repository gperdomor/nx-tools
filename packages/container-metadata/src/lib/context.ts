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
