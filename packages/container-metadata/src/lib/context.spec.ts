import { ContextProxyFactory, RunnerContext } from '@nx-tools/ci-context';
import { getPosixName } from '@nx-tools/core';
import * as dotenv from 'dotenv';
import mockedEnv, { RestoreFn } from 'mocked-env';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { Git } from 'packages/ci-context/src/lib/utils/git';
import { Github } from 'packages/ci-context/src/lib/utils/github';
import { Inputs, getContext, getInputs } from './context';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getInputs', () => {
  beforeEach(() => {
    process.env = Object.keys(process.env).reduce((object, key) => {
      if (!key.startsWith('INPUT_')) {
        object[key] = process.env[key];
      }
      return object;
    }, {} as NodeJS.ProcessEnv);
  });

  // prettier-ignore
  test.each([
    [
      0,
      new Map<string, string>([
        ['images', 'moby/buildkit\nghcr.io/moby/mbuildkit'],
      ]),
      {
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

describe('getContext', () => {
  let restore: RestoreFn;

  beforeEach(() => {
    jest.resetModules();
    restore = mockedEnv(
      {
        ...process.env,
        ...dotenv.parse(
          fs.readFileSync(path.join(__dirname, '..', '..', '__tests__', 'fixtures/event_create_branch.env'))
        ),
      },
      { restore: true }
    );
  });

  afterEach(() => {
    restore();
  });

  it('workflow', async () => {
    jest.spyOn(ContextProxyFactory, 'create').mockImplementation((): Promise<RunnerContext> => {
      return Github.context();
    });

    const context = await getContext();
    expect(context.ref).toEqual('refs/heads/dev');
    expect(context.sha).toEqual('5f3331d7f7044c18ca9f12c77d961c4d7cf3276a');
  });

  it('git', async () => {
    jest.spyOn(Git, 'ref').mockResolvedValue('refs/heads/git-test');
    jest.spyOn(Git, 'fullCommit').mockResolvedValue('git-test-sha');

    jest.spyOn(ContextProxyFactory, 'create').mockImplementation((): Promise<RunnerContext> => {
      return Git.context();
    });

    const context = await getContext();
    expect(context.ref).toEqual('refs/heads/git-test');
    expect(context.sha).toEqual('git-test-sha');
  });
});

function setInput(name: string, value: string): void {
  process.env[getPosixName(name)] = value;
}
