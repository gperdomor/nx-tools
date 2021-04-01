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

export enum MetaMode {
  prepend = 'prepend',
  append = 'append',
}

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
  secretFiles: string[];
  githubToken: string;
  ssh: string[];
  meta: {
    enabled: boolean;
    mode: MetaMode;
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

const parseMetaMode = (value?: string): MetaMode | undefined => {
  switch (value) {
    case 'prepend':
      return MetaMode.prepend;
    case 'append':
      return MetaMode.append;
    default:
      return undefined;
  }
};

export async function getInputs(defaultContext: string, options: BuildExecutorSchema): Promise<Inputs> {
  return {
    context: core.getInput('context', options.context) || defaultContext,
    file: core.getInput('file', options.file),
    buildArgs: await getInputList('build-args', options.buildArgs, true),
    labels: await getInputList('labels', options.labels, true),
    tags: await getInputList('tags', options.tags),
    pull: /true/i.test(core.getInput('pull', core.parseBoolean(options.pull))),
    target: core.getInput('target', options.target),
    allow: await getInputList('allow', options.allow),
    noCache: /true/i.test(core.getInput('no-cache', core.parseBoolean(options.noCache))),
    builder: core.getInput('builder', options.builder),
    platforms: await getInputList('platforms', options.platforms),
    load: /true/i.test(core.getInput('load', core.parseBoolean(options.load))),
    push: /true/i.test(core.getInput('push', core.parseBoolean(options.push))),
    outputs: await getInputList('outputs', options.outputs, true),
    cacheFrom: await getInputList('cache-from', options.cacheFrom, true),
    cacheTo: await getInputList('cache-to', options.cacheTo, true),
    secrets: await getInputList('secrets', options.secrets, true),
    secretFiles: await getInputList('secret-files', options.secretFiles, true),
    githubToken: core.getInput('github-token', options.githubToken),
    ssh: await getInputList('ssh', options.ssh),
    meta: {
      enabled: /true/i.test(core.getInput('meta-enabled', core.parseBoolean(options.meta?.enabled))),
      mode: parseMetaMode(core.getInput('meta-mode', options.meta?.mode)) || MetaMode.prepend,
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
