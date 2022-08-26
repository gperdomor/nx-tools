import { ExecutorContext } from '@nrwl/devkit';
import * as core from '@nx-tools/core';
import * as handlebars from 'handlebars';
import { Inputs } from '../../context';
import { EngineAdapter } from '../engine-adapter';
import * as podman from './podman';

const GROUP_PREFIX = 'Nx Container - Engine: Podman';

export class Podman extends EngineAdapter {
  private podmanVersion: string;

  getPodmanVersion() {
    return this.podmanVersion;
  }

  getCommand(args: string[]): { command: string; args: string[] } {
    return {
      command: 'podman',
      args,
    };
  }

  async initialize(inputs: Inputs, ctx?: ExecutorContext): Promise<void> {
    if (!(await podman.isAvailable())) {
      throw new Error(
        `Podman is required. See https://github.com/gperdomor/nx-tools to set up nx-container executor with podman.`
      );
    }

    core.startGroup(`Podman info`, GROUP_PREFIX);
    await core.exec('podman', ['version'], {
      failOnStdErr: false,
    });
    await core.exec('podman', ['info'], {
      failOnStdErr: false,
    });

    this.podmanVersion = await podman.getVersion();

    core.startGroup(`Podman version`);
    await core.exec('podman', ['version'], {
      failOnStdErr: false,
    });
  }

  async finalize(inputs: Inputs, ctx?: ExecutorContext): Promise<void> {
    if (inputs.push) {
      await core.asyncForEach(inputs.tags, async (tag) => {
        const cmd = this.getCommand(['push', tag]);
        await core
          .getExecOutput(cmd.command, cmd.args, {
            ignoreReturnCode: true,
          })
          .then((res) => {
            if (res.stderr.length > 0 && res.exitCode != 0) {
              throw new Error(`podman failed with: ${res.stderr.match(/(.*)\s*$/)?.[0]?.trim() ?? 'unknown error'}`);
            }
          });
      });
    }
  }

  async getImageID(): Promise<string> {
    return podman.getImageID();
  }

  async getMetadata(): Promise<string> {
    return podman.getMetadata();
  }

  async getDigest(metadata: string): Promise<string> {
    return podman.getDigest(metadata);
  }

  async getArgs(inputs: Inputs, defaultContext: string): Promise<string[]> {
    const context = handlebars.compile(inputs.context)({ defaultContext });
    // prettier-ignore
    return [
        ...await this.getBuildArgs(inputs, defaultContext, context, this.getPodmanVersion()),
        ...await this.getCommonArgs(inputs, this.getPodmanVersion()),
        context
      ];
  }

  private async getBuildArgs(
    inputs: Inputs,
    defaultContext: string,
    context: string,
    podmanVersion: string
  ): Promise<Array<string>> {
    const args: Array<string> = ['build'];
    await core.asyncForEach(inputs.addHosts, async (addHost) => {
      args.push('--add-host', addHost);
    });
    // if (inputs.allow.length > 0) {
    //   args.push('--allow', inputs.allow.join(','));
    // }
    await core.asyncForEach(inputs.buildArgs, async (buildArg) => {
      args.push('--build-arg', buildArg);
    });
    if (podman.satisfies(podmanVersion, '>=4.2.0')) {
      await core.asyncForEach(inputs.buildContexts, async (buildContext) => {
        args.push('--build-context', buildContext);
      });
    }
    await core.asyncForEach(inputs.cacheFrom, async (cacheFrom) => {
      args.push('--cache-from', cacheFrom);
    });
    await core.asyncForEach(inputs.cacheTo, async (cacheTo) => {
      args.push('--cache-to', cacheTo);
    });
    if (inputs.cgroupParent) {
      args.push('--cgroup-parent', inputs.cgroupParent);
    }
    if (inputs.file) {
      args.push('--file', inputs.file);
    }
    if (
      !podman.isLocalOrTarExporter(inputs.outputs) &&
      (inputs.platforms.length == 0 || podman.satisfies(podmanVersion, '>=3.1.0'))
    ) {
      args.push('--iidfile', await podman.getImageIDFile());
    }
    await core.asyncForEach(inputs.labels, async (label) => {
      args.push('--label', label);
    });
    // await core.asyncForEach(inputs.noCacheFilters, async (noCacheFilter) => {
    //   args.push('--no-cache-filter', noCacheFilter);
    // });
    await core.asyncForEach(inputs.outputs, async (output) => {
      args.push('--output', output);
    });
    if (inputs.platforms.length > 0) {
      args.push('--platform', inputs.platforms.join(','));
    }
    await core.asyncForEach(inputs.secrets, async (secret) => {
      try {
        args.push('--secret', await podman.getSecretString(secret));
      } catch (err) {
        core.warning(err.message);
      }
    });
    await core.asyncForEach(inputs.secretFiles, async (secretFile) => {
      try {
        args.push('--secret', await podman.getSecretFile(secretFile));
      } catch (err) {
        core.warning(err.message);
      }
    });
    if (inputs.githubToken && !podman.hasGitAuthToken(inputs.secrets) && context.startsWith(defaultContext)) {
      args.push('--secret', await podman.getSecretString(`GIT_AUTH_TOKEN=${inputs.githubToken}`));
    }
    if (inputs.shmSize) {
      args.push('--shm-size', inputs.shmSize);
    }
    await core.asyncForEach(inputs.ssh, async (ssh) => {
      args.push('--ssh', ssh);
    });
    await core.asyncForEach(inputs.tags, async (tag) => {
      args.push('--tag', tag);
    });
    if (inputs.target) {
      args.push('--target', inputs.target);
    }
    await core.asyncForEach(inputs.ulimit, async (ulimit) => {
      args.push('--ulimit', ulimit);
    });
    return args;
  }

  private async getCommonArgs(inputs: Inputs, podmanVersion: string): Promise<Array<string>> {
    const args: Array<string> = [];
    // if (inputs.builder) {
    //   args.push('--builder', inputs.builder);
    // }
    if (inputs.load) {
      args.push('--load');
    }
    // if (buildx.satisfies(podmanVersion, '>=0.6.0')) {
    //   args.push('--metadata-file', await buildx.getMetadataFile());
    // }
    if (inputs.network) {
      args.push('--network', inputs.network);
    }
    if (inputs.noCache) {
      args.push('--no-cache');
    }
    if (inputs.pull) {
      args.push('--pull');
    }
    // if (inputs.push) {
    //   args.push('--push');
    // }
    return args;
  }
}
