import { getPosixName } from '@nx-tools/core';
import { Inputs, getInputs } from './context.js';

beforeEach(() => {
  vi.resetAllMocks();
});

describe('getInputs', () => {
  beforeEach(() => {
    process.env = Object.keys(process.env).reduce<NodeJS.ProcessEnv>((object, key) => {
      if (!key.startsWith('INPUT_')) {
        object[key] = process.env[key];
      }
      return object;
    }, {});
  });

  // prettier-ignore
  test.each([
    [
      0,
      new Map<string, string>([
        ['images', 'moby/buildkit\nghcr.io/moby/mbuildkit'],
      ]),
      {
        quiet: false,
        "bake-target": 'container-metadata-action',
        flavor: [],
        "github-token": '',
        images: ['moby/buildkit', 'ghcr.io/moby/mbuildkit'],
        labels: [],
        annotations: [],
        "sep-labels": '\n',
        "sep-tags": '\n',
        "sep-annotations": '\n',
        tags: [],
      } as Inputs
    ],
    [
      1,
      new Map<string, string>([
        ['bake-target', 'metadata'],
        ['images', 'moby/buildkit'],
        ['sep-labels', ','],
        ['sep-tags', ','],
        ['sep-annotations', ',']
      ]),
      {
        quiet: false,
        "bake-target": 'metadata',
        flavor: [],
        "github-token": '',
        images: ['moby/buildkit'],
        labels: [],
        annotations: [],
        "sep-labels": ',',
        "sep-tags": ',',
        "sep-annotations": ',',
        tags: [],
      } as Inputs
    ],
    [
      2,
      new Map<string, string>([
        ['images', 'moby/buildkit\n#comment\nghcr.io/moby/mbuildkit'],
      ]),
      {
        quiet: false,
        "bake-target": 'container-metadata-action',
        flavor: [],
        "github-token": '',
        images: ['moby/buildkit', 'ghcr.io/moby/mbuildkit'],
        labels: [],
        annotations: [],
        "sep-labels": '\n',
        "sep-tags": '\n',
        "sep-annotations": '\n',
        tags: [],
      } as Inputs
    ],
  ])(
    '[%d] given %p as inputs, returns %p',
    async (num: number, inputs: Map<string, string>, expected: Inputs) => {
      inputs.forEach((value: string, name: string) => {
        setInput(name, value);
      });
      expect(await getInputs({})).toEqual(expected);
    }
  );
});

function setInput(name: string, value: string): void {
  process.env[getPosixName(name)] = value;
}
