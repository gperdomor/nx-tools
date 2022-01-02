import { ExecutorContext, names } from '@nrwl/devkit';
import { getInput, interpolate } from '@nx-tools/core';
import csvparse from 'csv-parse/lib/sync';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

let _tmpDir: string;

export interface Inputs {
  'bake-target': string;
  'github-token': string;
  'sep-labels': string;
  'sep-tags': string;
  flavor: string[];
  images: string[];
  labels: string[];
  tags: string[];
}

export function tmpDir(): string {
  if (!_tmpDir) {
    _tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'docker-metadata-action-')).split(path.sep).join(path.posix.sep);
  }
  return _tmpDir;
}

export function getInputs(options: Partial<Inputs>, ctx?: ExecutorContext): Inputs {
  const prefix = names(ctx?.projectName || '').constantName;

  return {
    'bake-target': getInput('bake-target', { prefix, fallback: options['bake-target'] || 'docker-metadata-action' }),
    'github-token': getInput('github-token'),
    'sep-labels': getInput('sep-labels', { prefix, fallback: options['sep-labels'] || '\n' }),
    'sep-tags': getInput('sep-tags', { prefix, fallback: options['sep-tags'] || '\n' }),
    flavor: getInputList('flavor', prefix, options.flavor, true).map((flavor) => interpolate(flavor)),
    images: getInputList('images', prefix, options.images).map((image) => interpolate(image)),
    labels: getInputList('labels', prefix, options.labels, true).map((label) => interpolate(label)),
    tags: getInputList('tags', prefix, options.tags, true).map((tag) => interpolate(tag)),
  };
}

export function getInputList(name: string, prefix: string, fallback?: string[], ignoreComma?: boolean): string[] {
  const res: Array<string> = [];

  const items = getInput(name, { prefix });
  if (items == '') {
    return fallback ?? res;
  }

  for (const output of csvparse(items, {
    columns: false,
    relax: true,
    relaxColumnCount: true,
    skipLinesWithEmptyValues: true,
  }) as Array<string[]>) {
    if (output.length == 1) {
      res.push(output[0]);
      continue;
    } else if (!ignoreComma) {
      res.push(...output);
      continue;
    }
    res.push(output.join(','));
  }

  return res.filter((item) => item).map((pat) => pat.trim());
}
