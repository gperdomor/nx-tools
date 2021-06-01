import * as core from '@nx-tools/core';
import csvparse from 'csv-parse/lib/sync';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

let _tmpDir: string;

export interface Inputs {
  bakeTarget: string;
  flavor: string[];
  githubToken: string;
  images: string[];
  labels: string[];
  sepLabels: string;
  sepTags: string;
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
    bakeTarget: core.getInput('bake-target', { fallback: options.bakeTarget || 'docker-metadata-action' }),
    flavor: getInputList('flavor', options.flavor, true),
    githubToken: core.getInput('github-token', { fallback: options.githubToken }),
    images: getInputList('images', options.images),
    labels: getInputList('labels', options.labels, true),
    sepLabels: core.getInput('sep-labels', { fallback: options.sepLabels || `\n` }),
    sepTags: core.getInput('sep-tags', { fallback: options.sepTags || `\n` }),
    tags: getInputList('tags', options.tags, true),
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
