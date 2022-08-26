import { ExecutorContext, names } from '@nrwl/devkit';
import * as core from '@nx-tools/core';
import parse from 'csv-parse/lib/sync';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

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
    _tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'container-metadata-action-')).split(path.sep).join(path.posix.sep);
  }
  return _tmpDir;
}

export function getInputs(options: Partial<Inputs>, ctx?: ExecutorContext): Inputs {
  const prefix = names(ctx?.projectName || '').constantName;

  return {
    'bake-target': core.getInput('bake-target', {
      prefix,
      fallback: options['bake-target'] || 'container-metadata-action',
    }),
    'github-token': core.getInput('github-token'),
    'sep-labels': core.getInput('sep-labels', { prefix, fallback: options['sep-labels'] || '\n' }),
    'sep-tags': core.getInput('sep-tags', { prefix, fallback: options['sep-tags'] || '\n' }),
    flavor: getInputList('flavor', prefix, options.flavor, true).map((flavor) => core.interpolate(flavor)),
    images: getInputList('images', prefix, options.images).map((image) => core.interpolate(image)),
    labels: getInputList('labels', prefix, options.labels, true).map((label) => core.interpolate(label)),
    tags: getInputList('tags', prefix, options.tags, true).map((tag) => core.interpolate(tag)),
  };
}

export function getInputList(name: string, prefix = '', fallback?: string[], ignoreComma?: boolean): string[] {
  const res: Array<string> = [];

  const items = core.getInput(name, { prefix });
  if (items == '') {
    return fallback ?? res;
  }

  const records = parse(items, {
    columns: false,
    relax: true,
    comment: '#',
    relaxColumnCount: true,
    skipEmptyLines: true,
  });

  for (const record of records as Array<string[]>) {
    if (record.length == 1) {
      res.push(record[0]);
      continue;
    } else if (!ignoreComma) {
      res.push(...record);
      continue;
    }
    res.push(record.join(','));
  }

  return res.filter((item) => item).map((pat) => pat.trim());
}
