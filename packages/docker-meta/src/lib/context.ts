import * as core from '@nx-tools/core';
import csvparse from 'csv-parse/lib/sync';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

let _tmpDir: string;

export interface Inputs {
  images: string[];
  tags: string[];
  flavor: string[];
  labels: string[];
  sepTags: string;
  sepLabels: string;
}

export function tmpDir(): string {
  if (!_tmpDir) {
    _tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ghaction-docker-meta-')).split(path.sep).join(path.posix.sep);
  }
  return _tmpDir;
}

export function getInputs(options: Partial<Inputs>): Inputs {
  return {
    images: getInputList('images', options.images),
    tags: getInputList('tags', options.tags, true),
    flavor: getInputList('flavor', options.flavor, true),
    labels: getInputList('labels', options.labels, true),
    sepTags: core.getInput('sep-tags', options.sepTags) || `\n`,
    sepLabels: core.getInput('sep-labels', options.sepLabels) || `\n`,
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

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};
