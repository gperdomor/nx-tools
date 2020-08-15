import { BuilderContext } from '@angular-devkit/architect';
import { execSync } from 'child_process';
import { BuildOptions, Git, Login } from '../interfaces';
import { getBuildArgs, getLoginArgs } from '../utils/args.utils';

const runDockerCommand = (
  context: BuilderContext,
  command: 'build' | 'login' | 'push',
  params: string[],
  options: { cwd?: string } = {},
) => {
  // Take the parameters or set defaults
  const cmd = 'docker';
  const cwd = options.cwd || process.cwd();

  // Create the command to execute
  const execute = `${cmd} ${command} ${params.join(' ')}`;

  try {
    context.logger.info(`Executing command: ${execute}`);
    execSync(execute, {
      cwd,
      env: {
        DOCKER_BUILDKIT: 1,
      },
      stdio: [0, 1, 2],
    });
  } catch (e) {
    context.logger.error(`Failed to execute command: ${execute}`, e);
    throw e;
  }
};

export const runBuild = (context: BuilderContext, buildOpts: BuildOptions, git: Git, tags: string[]) => {
  context.logger.info(`Building image [${tags.join(', ')}]`);

  const args = getBuildArgs(buildOpts, git, tags);

  return runDockerCommand(context, 'build', args);
};

export const runLogin = (context: BuilderContext, login: Login, registry: string) => {
  context.logger.info(`Logging in to registry ${registry}`);

  const args = getLoginArgs(login, registry);

  return runDockerCommand(context, 'login', args);
};

export const runPush = (context: BuilderContext, tags: string[]) => {
  context.logger.info(`Pushing image [${tags.join(', ')}]`);

  for (const tag of tags) {
    const args = [tag];

    runDockerCommand(context, 'push', args);
  }
};
