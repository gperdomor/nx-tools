import { ExecutorContext, names } from '@nrwl/devkit';
import * as core from '@nx-tools/core';
import * as handlebars from 'handlebars';
import { randomBytes } from 'node:crypto';
import { Inputs } from '../../context';
import { EngineAdapter } from '../engine-adapter';
import * as buildx from './buildx';
import * as docker from './docker';

const GROUP_PREFIX = 'Nx Container - Engine: Docker';

export class Docker extends EngineAdapter {
  private standalone: boolean;
  private createdBuilder = false;
  private buildxVersion: string;

  getBuildxVersion() {
    return this.buildxVersion;
  }

  getCommand(args: string[]): { command: string; args: string[] } {
    return buildx.getCommand(args, this.standalone);
  }

  async initialize(inputs: Inputs, ctx?: ExecutorContext) {
    // standalone if docker cli not available
    this.standalone = !(await docker.isAvailable());

    core.startGroup(`Docker info`, GROUP_PREFIX);
    if (this.standalone) {
      core.info(`Docker info skipped in standalone mode`);
    } else {
      await core.exec('docker', ['version'], {
        failOnStdErr: false,
      });
      await core.exec('docker', ['info'], {
        failOnStdErr: false,
      });
    }

    if (!(await buildx.isAvailable(this.standalone))) {
      throw new Error(
        `Docker buildx is required. See https://github.com/gperdomor/nx-tools to set up nx-container executor with buildx.`
      );
    }

    this.buildxVersion = await buildx.getVersion();

    core.startGroup(`Buildx version`);
    const versionCmd = buildx.getCommand(['version'], this.standalone);
    await core.exec(versionCmd.command, versionCmd.args, {
      failOnStdErr: false,
    });

    this.createdBuilder = core.getBooleanInput('create-builder', {
      prefix: names(ctx?.projectName || '').constantName,
      fallback: 'false',
    });

    if (this.createdBuilder) {
      inputs.builder = inputs.builder || `${ctx.projectName}-${randomBytes(24).toString('hex').substring(0, 6)}`;

      core.info(`Creating builder ${inputs.builder}`);

      const command = buildx.getCommand(['create', `--name=${inputs.builder}`], this.standalone);
      await core
        .getExecOutput(command.command, command.args, {
          ignoreReturnCode: true,
        })
        .then((res) => {
          if (res.stderr.length > 0 && res.exitCode != 0) {
            throw new Error(`buildx failed with: ${res.stderr.match(/(.*)\s*$/)![0].trim()}`);
          }
        });
    }
  }

  async finalize(inputs: Inputs, ctx?: ExecutorContext): Promise<void> {
    // startGroup(`Running post build steps`, GROUP_PREFIX);
    if (this.createdBuilder) {
      core.info(`Removing builder ${this.createdBuilder}`);
      const command = buildx.getCommand(['rm', inputs.builder], this.standalone);
      await core.getExecOutput(command.command, command.args, {
        ignoreReturnCode: true,
      });
    }
  }

  async getImageID(): Promise<string> {
    return buildx.getImageID();
  }

  async getMetadata(): Promise<string> {
    return buildx.getMetadata();
  }

  async getDigest(metadata: string): Promise<string> {
    return buildx.getDigest(metadata);
  }

  async getArgs(inputs: Inputs, defaultContext: string): Promise<string[]> {
    const context = handlebars.compile(inputs.context)({ defaultContext });
    // prettier-ignore
    return [
        ...await this.getBuildArgs(inputs, defaultContext, context, this.getBuildxVersion()),
        ...await this.getCommonArgs(inputs, this.getBuildxVersion()),
        context
      ];
  }

  private async getBuildArgs(
    inputs: Inputs,
    defaultContext: string,
    context: string,
    buildxVersion: string
  ): Promise<Array<string>> {
    const args: Array<string> = ['build'];
    await core.asyncForEach(inputs.addHosts, async (addHost) => {
      args.push('--add-host', addHost);
    });
    if (inputs.allow.length > 0) {
      args.push('--allow', inputs.allow.join(','));
    }
    await core.asyncForEach(inputs.buildArgs, async (buildArg) => {
      args.push('--build-arg', buildArg);
    });
    if (buildx.satisfies(buildxVersion, '>=0.8.0')) {
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
      !buildx.isLocalOrTarExporter(inputs.outputs) &&
      (inputs.platforms.length == 0 || buildx.satisfies(buildxVersion, '>=0.4.2'))
    ) {
      args.push('--iidfile', await buildx.getImageIDFile());
    }
    await core.asyncForEach(inputs.labels, async (label) => {
      args.push('--label', label);
    });
    await core.asyncForEach(inputs.noCacheFilters, async (noCacheFilter) => {
      args.push('--no-cache-filter', noCacheFilter);
    });
    await core.asyncForEach(inputs.outputs, async (output) => {
      args.push('--output', output);
    });
    if (inputs.platforms.length > 0) {
      args.push('--platform', inputs.platforms.join(','));
    }
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
    if (inputs.githubToken && !buildx.hasGitAuthToken(inputs.secrets) && context.startsWith(defaultContext)) {
      args.push('--secret', await buildx.getSecretString(`GIT_AUTH_TOKEN=${inputs.githubToken}`));
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

  private async getCommonArgs(inputs: Inputs, buildxVersion: string): Promise<Array<string>> {
    const args: Array<string> = [];
    if (inputs.builder) {
      args.push('--builder', inputs.builder);
    }
    if (inputs.load) {
      args.push('--load');
    }
    if (buildx.satisfies(buildxVersion, '>=0.6.0')) {
      args.push('--metadata-file', await buildx.getMetadataFile());
    }
    if (inputs.network) {
      args.push('--network', inputs.network);
    }
    if (inputs.noCache) {
      args.push('--no-cache');
    }
    if (inputs.pull) {
      args.push('--pull');
    }
    if (inputs.push) {
      args.push('--push');
    }
    return args;
  }
}
