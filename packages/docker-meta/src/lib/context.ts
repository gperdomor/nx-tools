import * as core from '@nx-tools/core';
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

export function getInputs(options: Partial<Inputs>): Inputs {
  return {
    'bake-target': core.getInput('bake-target', { fallback: options['bake-target'] || 'docker-metadata-action' }),
    flavor: getInputList('flavor', options.flavor, true).map((flavor) => core.interpolate(flavor)),
    'github-token': core.getInput('github-token'),
    images: getInputList('images', options.images).map((image) => core.interpolate(image)),
    labels: getInputList('labels', options.labels, true).map((label) => core.interpolate(label)),
    'sep-labels': core.getInput('sep-labels', { fallback: options['sep-labels'] || '\n' }),
    'sep-tags': core.getInput('sep-tags', { fallback: options['sep-tags'] || '\n' }),
    tags: getInputList('tags', options.tags, true).map((tag) => core.interpolate(tag)),
  };
}

export function getInputList(name: string, fallback?: string[], ignoreComma?: boolean): string[] {
  const res: Array<string> = [];

  const items = core.getInput(name);
  if (items == '') {
    return fallback ?? res;
  }

  for (const output of csvparse(items, {
    columns: false,
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
