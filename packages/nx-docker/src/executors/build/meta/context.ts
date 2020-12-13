import { getInput, parseBoolean } from '@nx-tools/core';

export interface Inputs {
  images: string[];
  tagSha: boolean;
  tagEdge: boolean;
  tagEdgeBranch: string;
  tagMatch: string;
  tagMatchGroup: number;
  tagMatchLatest: boolean;
  tagSchedule: string;
  sepTags: string;
  sepLabels: string;
  githubToken: string;
}

export const getInputs = (options: Partial<Inputs>): Inputs => {
  return {
    images: getInputList('images', options.images),
    tagSha: /true/i.test(getInput('tag-sha', parseBoolean(options.tagSha)) || 'false'),
    tagEdge: /true/i.test(getInput('tag-edge', parseBoolean(options.tagEdge)) || 'false'),
    tagEdgeBranch: getInput('tag-edge-branch', options.tagEdgeBranch),
    tagMatch: getInput('tag-match', options.tagMatch),
    tagMatchGroup: Number(getInput('tag-match-group', `${options.tagMatchGroup}`)) || 0,
    tagMatchLatest: /true/i.test(getInput('tag-match-latest', parseBoolean(options.tagMatchLatest)) || 'true'),
    tagSchedule: getInput('tag-schedule', options.tagSchedule) || 'nightly',
    sepTags: getInput('sep-tags', options.sepTags) || `\n`,
    sepLabels: getInput('sep-labels', options.sepLabels) || `\n`,
    githubToken: getInput('github-token', options.githubToken),
  };
};

export const getInputList = (name: string, fallback?: string[]): string[] => {
  const items = getInput(name);

  if (items == '') {
    return fallback ?? [];
  }

  return items
    .split(/\r?\n/)
    .filter((x) => x)
    .reduce<string[]>((acc, line) => acc.concat(line.split(',').filter((x) => x)).map((pat) => pat.trim()), []);
};
