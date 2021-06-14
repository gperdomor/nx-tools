import * as core from '@nx-tools/core';
import { Inputs as MetaInputs } from '@nx-tools/docker-meta';
import csvparse from 'csv-parse/lib/sync';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as semver from 'semver';
import * as tmp from 'tmp';
import * as buildx from './buildx';
import { BuildExecutorSchema } from './schema';

let _defaultContext, _tmpDir: string;

export interface Inputs {
  allow: string[];
  buildArgs: string[];
  builder: string;
  cacheFrom: string[];
  cacheTo: string[];
  context: string;
  file: string;
  githubToken: string;
  labels: string[];
  load: boolean;
  network: string;
  noCache: boolean;
  outputs: string[];
  platforms: string[];
  pull: boolean;
  push: boolean;
  secretFiles: string[];
  secrets: string[];
  ssh: string[];
  tags: string[];
  target: string;
  meta: {
    enabled: boolean;
  } & Partial<MetaInputs>;
}

export function defaultContext(): string {
  if (!_defaultContext) {
    _defaultContext = '.';
  }
  return _defaultContext;
}

export function tmpDir(): string {
  if (!_tmpDir) {
    _tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'docker-build-push-')).split(path.sep).join(path.posix.sep);
  }
  return _tmpDir;
}

export function tmpNameSync(options?: tmp.TmpNameOptions): string {
  return tmp.tmpNameSync(options);
}

export async function getInputs(defaultContext: string, options: BuildExecutorSchema): Promise<Inputs> {
  return {
    allow: await getInputList('allow', options.allow),
    buildArgs: await getInputList('build-args', options.buildArgs, true),
    builder: core.getInput('builder', { fallback: options.builder }),
    cacheFrom: await getInputList('cache-from', options.cacheFrom, true),
    cacheTo: await getInputList('cache-to', options.cacheTo, true),
    context: core.getInput('context', { fallback: options.context || defaultContext }),
    file: core.getInput('file', { fallback: options.file }),
    githubToken: core.getInput('github-token', { fallback: options.githubToken }),
    labels: await getInputList('labels', options.labels, true),
    load: core.getBooleanInput('load', { fallback: `${options.load || false}` }),
    network: core.getInput('network', { fallback: options.network }),
    noCache: core.getBooleanInput('no-cache', { fallback: `${options.noCache || false}` }),
    outputs: await getInputList('outputs', options.outputs, true),
    platforms: await getInputList('platforms', options.platforms),
    pull: core.getBooleanInput('pull', { fallback: `${options.pull || false}` }),
    push: core.getBooleanInput('push', { fallback: `${options.push || false}` }),
    secretFiles: await getInputList('secret-files', options.secretFiles, true),
    secrets: await getInputList('secrets', options.secrets, true),
    ssh: await getInputList('ssh', options.ssh),
    tags: await getInputList('tags', options.tags),
    target: core.getInput('target', { fallback: options.target }),
    meta: {
      enabled: core.getBooleanInput('meta-enabled', { fallback: `${options.meta?.enabled || true}` }),
    },
  };
}

export async function getArgs(inputs: Inputs, defaultContext: string, buildxVersion: string): Promise<Array<string>> {
  const args: Array<string> = ['buildx'];
  // eslint-disable-next-line prefer-spread
  args.push.apply(args, await getBuildArgs(inputs, defaultContext, buildxVersion));
  // eslint-disable-next-line prefer-spread
  args.push.apply(args, await getCommonArgs(inputs));
  args.push(inputs.context);
  return args;
}

async function getBuildArgs(inputs: Inputs, defaultContext: string, buildxVersion: string): Promise<Array<string>> {
  const args: Array<string> = ['build'];
  await core.asyncForEach(inputs.buildArgs, async (buildArg) => {
    args.push('--build-arg', buildArg);
  });
  await core.asyncForEach(inputs.labels, async (label) => {
    args.push('--label', label);
  });
  await core.asyncForEach(inputs.tags, async (tag) => {
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
  await core.asyncForEach(inputs.outputs, async (output) => {
    args.push('--output', output);
  });
  if (
    !buildx.isLocalOrTarExporter(inputs.outputs) &&
    (inputs.platforms.length == 0 || semver.satisfies(buildxVersion, '>=0.4.2'))
  ) {
    args.push('--iidfile', await buildx.getImageIDFile());
  }
  await core.asyncForEach(inputs.cacheFrom, async (cacheFrom) => {
    args.push('--cache-from', cacheFrom);
  });
  await core.asyncForEach(inputs.cacheTo, async (cacheTo) => {
    args.push('--cache-to', cacheTo);
  });
  await core.asyncForEach(inputs.secrets, async (secret) => {
    try {
      args.push('--secret', await buildx.getSecretString(secret));
    } catch (err) {
      core.warning(err.message);
    }
  });
  await core.asyncForEach(inputs.secretFiles, async (secretFile) => {
    try {
      args.push('--secret', await buildx.getSecretFile(secretFile));
    } catch (err) {
      core.warning(err.message);
    }
  });
  if (inputs.githubToken && !buildx.hasGitAuthToken(inputs.secrets) && inputs.context == defaultContext) {
    args.push('--secret', await buildx.getSecretString(`GIT_AUTH_TOKEN=${inputs.githubToken}`));
  }
  await core.asyncForEach(inputs.ssh, async (ssh) => {
    args.push('--ssh', ssh);
  });
  if (inputs.file) {
    args.push('--file', inputs.file);
  }
  return args;
}

async function getCommonArgs(inputs: Inputs): Promise<Array<string>> {
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
  if (inputs.network) {
    args.push('--network', inputs.network);
  }
  if (inputs.push) {
    args.push('--push');
  }
  return args;
}

export async function getInputList(name: string, fallback?: string[], ignoreComma?: boolean): Promise<string[]> {
  const res: Array<string> = [];

  const items = core.getInput(name);
  if (items == '') {
    return fallback ?? res;
  }

  for (const output of (await csvparse(items, {
    columns: false,
    relax: true,
    relaxColumnCount: true,
    skipLinesWithEmptyValues: true,
  })) as Array<string[]>) {
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
