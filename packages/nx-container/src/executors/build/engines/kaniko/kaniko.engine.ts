import { ExecutorContext } from '@nrwl/devkit';
import * as core from '@nx-tools/core';
import * as handlebars from 'handlebars';
import { readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { Inputs } from '../../context';
import { EngineAdapter } from '../engine-adapter';
import * as kaniko from './kaniko';

const GROUP_PREFIX = 'Nx Container - Engine: Kaniko';

export class Kaniko extends EngineAdapter {
  originalDirs: string[] = [];

  getCommand(args: string[]): { command: string; args: string[] } {
    return {
      command: '/kaniko/executor',
      args,
    };
  }

  async initialize(inputs: Inputs, ctx?: ExecutorContext): Promise<void> {
    if (!(await kaniko.isAvailable())) {
      throw new Error(
        `Kaniko is required. See https://github.com/gperdomor/nx-tools to set up nx-container executor with kaniko.`
      );
    }

    core.startGroup(`Kaniko info`, GROUP_PREFIX);
    const cmd = kaniko.getCommand(['version']);
    await core.exec(cmd.command, cmd.args, {
      failOnStdErr: false,
    });

    this.originalDirs = await readdir('/kaniko');
  }

  async finalize(inputs: Inputs, ctx?: ExecutorContext): Promise<void> {
    const dir = await readdir('/kaniko');
    const toDelete = dir.filter((file) => !this.originalDirs.includes(file));

    await core.asyncForEach(toDelete, async (fileOrDir) => {
      await rm(join('/kaniko', fileOrDir), { force: true, recursive: true });
    });
  }

  async getImageID(): Promise<string> {
    return kaniko.getImageID();
  }

  async getMetadata(): Promise<string> {
    return kaniko.getMetadata();
  }

  async getDigest(metadata: string): Promise<string> {
    return kaniko.getDigest(metadata);
  }

  async getArgs(inputs: Inputs, defaultContext: string): Promise<string[]> {
    const context = handlebars.compile(inputs.context)({ defaultContext });
    // prettier-ignore
    return [
        ...await this.getBuildArgs(inputs/*, defaultContex, context, this.getBuildxVersion()*/),
        ...await this.getCommonArgs(inputs/*, this.getBuildxVersion()*/),
        `--context=${context}`
      ];
  }

  private async getBuildArgs(
    inputs: Inputs
    /*defaultContext: string,
    context: string,
    buildxVersion: string*/
  ): Promise<Array<string>> {
    const args: Array<string> = [];
    // await core.asyncForEach(inputs.addHosts, async (addHost) => {
    //   args.push('--add-host', addHost);
    // });
    // if (inputs.allow.length > 0) {
    //   args.push('--allow', inputs.allow.join(','));
    // }
    await core.asyncForEach(inputs.buildArgs, async (buildArg) => {
      args.push('--build-arg', buildArg);
    });
    // if (buildx.satisfies(buildxVersion, '>=0.8.0')) {
    //   await core.asyncForEach(inputs.buildContexts, async (buildContext) => {
    //     args.push('--build-context', buildContext);
    //   });
    // }
    await core.asyncForEach(inputs.cacheFrom, async (cacheFrom) => {
      args.push('--cache-repo', cacheFrom);
    });
    // await core.asyncForEach(inputs.cacheTo, async (cacheTo) => {
    //   args.push('--cache-to', cacheTo);
    // });
    // if (inputs.cgroupParent) {
    //   args.push('--cgroup-parent', inputs.cgroupParent);
    // }
    if (inputs.file) {
      args.push('--dockerfile', inputs.file);
    }
    // if (
    //   !buildx.isLocalOrTarExporter(inputs.outputs) &&
    //   (inputs.platforms.length == 0 || buildx.satisfies(buildxVersion, '>=0.4.2'))
    // ) {
    //   args.push('--iidfile', await buildx.getImageIDFile());
    // }
    await core.asyncForEach(inputs.labels, async (label) => {
      args.push('--label', label);
    });
    // await core.asyncForEach(inputs.noCacheFilters, async (noCacheFilter) => {
    //   args.push('--no-cache-filter', noCacheFilter);
    // });
    // await core.asyncForEach(inputs.outputs, async (output) => {
    //   args.push('--output', output);
    // });
    if (inputs.platforms.length > 0) {
      args.push('--customPlatform', inputs.platforms.join(','));
    }
    // await core.asyncForEach(inputs.secrets, async (secret) => {
    //   try {
    //     args.push('--secret', await buildx.getSecretString(secret));
    //   } catch (err) {
    //     core.warning(err.message);
    //   }
    // });
    // await core.asyncForEach(inputs.secretFiles, async (secretFile) => {
    //   try {
    //     args.push('--secret', await buildx.getSecretFile(secretFile));
    //   } catch (err) {
    //     core.warning(err.message);
    //   }
    // });
    // if (inputs.githubToken && !buildx.hasGitAuthToken(inputs.secrets) && context.startsWith(defaultContext)) {
    //   args.push('--secret', await buildx.getSecretString(`GIT_AUTH_TOKEN=${inputs.githubToken}`));
    // }
    // if (inputs.shmSize) {
    //   args.push('--shm-size', inputs.shmSize);
    // }
    // await core.asyncForEach(inputs.ssh, async (ssh) => {
    //   args.push('--ssh', ssh);
    // });
    await core.asyncForEach(inputs.tags, async (tag) => {
      args.push('--destination', tag);
    });
    if (inputs.target) {
      args.push('--target', inputs.target);
    }
    // await core.asyncForEach(inputs.ulimit, async (ulimit) => {
    //   args.push('--ulimit', ulimit);
    // });
    return args;
  }

  private async getCommonArgs(inputs: Inputs /*, buildxVersion: string*/): Promise<Array<string>> {
    const args: Array<string> = [];
    // if (inputs.builder) {
    //   args.push('--builder', inputs.builder);
    // }
    // if (inputs.load) {
    //   args.push('--load');
    // }
    // if (buildx.satisfies(buildxVersion, '>=0.6.0')) {
    //   args.push('--metadata-file', await buildx.getMetadataFile());
    // }
    // if (inputs.network) {
    //   args.push('--network', inputs.network);
    // }
    if (!inputs.noCache) {
      args.push('--cache=true');
    }
    // if (inputs.pull) {
    //   args.push('--pull');
    // }
    if (!inputs.push) {
      args.push('--no-push');
    }
    args.push('--use-new-run');
    return args;
  }
}
