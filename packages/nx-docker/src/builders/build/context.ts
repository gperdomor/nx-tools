import * as core from '@nx-tools/core';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as semver from 'semver';
import * as tmp from 'tmp';
import * as buildx from './buildx';
import { DockerBuilderInputsSchema } from './schema';

let _defaultContext, _tmpDir: string;

export interface Inputs {
  context: string;
  file: string;
  buildArgs: string[];
  labels: string[];
  tags: string[];
  pull: boolean;
  target: string;
  allow: string[];
  noCache: boolean;
  builder: string;
  platforms: string[];
  load: boolean;
  push: boolean;
  outputs: string[];
  cacheFrom: string[];
  cacheTo: string[];
  secrets: string[];
  githubToken: string;
  ssh: string[];
}

export const defaultContext = (): string => {
  if (!_defaultContext) {
    _defaultContext = '.';
  }
  return _defaultContext;
};

export const tmpDir = (): string => {
  if (!_tmpDir) {
    _tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'docker-build-push-')).split(path.sep).join(path.posix.sep);
  }
  return _tmpDir;
};

export function tmpNameSync(options?: tmp.TmpNameOptions): string {
  return tmp.tmpNameSync(options);
}

const parseBoolean = (value?: boolean): 'true' | 'false' | undefined =>
  value === undefined ? undefined : value ? 'true' : 'false';

export const getInputs = async (defaultContext: string, options: DockerBuilderInputsSchema): Promise<Inputs> => {
  return {
    context: core.getInput('context', options.context) || defaultContext,
    file: core.getInput('file', options.file) || 'Dockerfile',
    buildArgs: await getInputList('build-args', options.buildArgs, true),
    labels: await getInputList('labels', options.labels, true),
    tags: await getInputList('tags', options.tags),
    pull: /true/i.test(core.getInput('pull', parseBoolean(options.pull))),
    target: core.getInput('target', options.target),
    allow: await getInputList('allow', options.allow),
    noCache: /true/i.test(core.getInput('no-cache', parseBoolean(options.noCache))),
    builder: core.getInput('builder', options.builder),
    platforms: await getInputList('platforms', options.platforms),
    load: /true/i.test(core.getInput('load', parseBoolean(options.load))),
    push: /true/i.test(core.getInput('push', parseBoolean(options.push))),
    outputs: await getInputList('outputs', options.outputs, true),
    cacheFrom: await getInputList('cache-from', options.cacheFrom, true),
    cacheTo: await getInputList('cache-to', options.cacheTo, true),
    secrets: await getInputList('secrets', options.secrets, true),
    githubToken: core.getInput('github-token', options.githubToken),
    ssh: await getInputList('ssh', options.ssh),
  };
};

export const getArgs = async (
  inputs: Inputs,
  defaultContext: string,
  buildxVersion: string,
): Promise<Array<string>> => {
  const args: Array<string> = ['buildx'];
  // eslint-disable-next-line prefer-spread
  args.push.apply(args, await getBuildArgs(inputs, defaultContext, buildxVersion));
  // eslint-disable-next-line prefer-spread
  args.push.apply(args, await getCommonArgs(inputs));
  args.push(inputs.context);
  return args;
};

const getBuildArgs = async (inputs: Inputs, defaultContext: string, buildxVersion: string): Promise<Array<string>> => {
  const args: Array<string> = ['build'];
  await asyncForEach(inputs.buildArgs, async (buildArg) => {
    args.push('--build-arg', buildArg);
  });
  await asyncForEach(inputs.labels, async (label) => {
    args.push('--label', label);
  });
  await asyncForEach(inputs.tags, async (tag) => {
    args.push('--tag', tag);
  });
  if (inputs.target) {
    args.push('--target', inputs.target);
  }
  if (inputs.allow.length > 0) {
    args.push('--allow', inputs.allow.join(','));
  }
  if (inputs.platforms.length > 0) {
    args.push('--platform', inputs.platforms.join(','));
  }
  await asyncForEach(inputs.outputs, async (output) => {
    args.push('--output', output);
  });
  if (
    !buildx.isLocalOrTarExporter(inputs.outputs) &&
    (inputs.platforms.length == 0 || semver.satisfies(buildxVersion, '>=0.4.2'))
  ) {
    args.push('--iidfile', await buildx.getImageIDFile());
  }
  await asyncForEach(inputs.cacheFrom, async (cacheFrom) => {
    args.push('--cache-from', cacheFrom);
  });
  await asyncForEach(inputs.cacheTo, async (cacheTo) => {
    args.push('--cache-to', cacheTo);
  });
  await asyncForEach(inputs.secrets, async (secret) => {
    args.push('--secret', await buildx.getSecret(secret));
  });
  if (inputs.githubToken && !buildx.hasGitAuthToken(inputs.secrets) && inputs.context == defaultContext) {
    args.push('--secret', await buildx.getSecret(`GIT_AUTH_TOKEN=${inputs.githubToken}`));
  }
  await asyncForEach(inputs.ssh, async (ssh) => {
    args.push('--ssh', ssh);
  });
  if (inputs.file) {
    args.push('--file', inputs.file);
  }
  return args;
};

const getCommonArgs = async (inputs: Inputs): Promise<Array<string>> => {
  const args: Array<string> = [];
  if (inputs.noCache) {
    args.push('--no-cache');
  }
  if (inputs.builder) {
    args.push('--builder', inputs.builder);
  }
  if (inputs.pull) {
    args.push('--pull');
  }
  if (inputs.load) {
    args.push('--load');
  }
  if (inputs.push) {
    args.push('--push');
  }
  return args;
};

export const getInputList = async (name: string, fallback?: string[], ignoreComma?: boolean): Promise<string[]> => {
  const items = core.getInput(name);

  if (items == '') {
    return fallback ?? [];
  }

  return items
    .split(/\r?\n/)
    .filter((x) => x)
    .reduce<string[]>(
      (acc, line) => acc.concat(!ignoreComma ? line.split(',').filter((x) => x) : line).map((pat) => pat.trim()),
      [],
    );
};

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};
