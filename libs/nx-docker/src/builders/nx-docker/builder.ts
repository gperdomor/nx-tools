import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import { NxDockerBuilderSchema } from './schema';
import { createProcess, loadEnvVars } from './utils';

export function runBuilder(
  options: NxDockerBuilderSchema,
  context: BuilderContext
): Observable<BuilderOutput> {
  loadEnvVars(options.envFile);

  return Observable.create(async (observer) => {
    if (!options.repository) {
      observer.next({
        success: false,
        error:
          'ERROR: Bad builder config for @gperdomor/nx-docker - "repository" option is required',
      });
      observer.complete();
      return;
    }

    try {
      const workDir = '/code';

      const command = [`docker container run --rm -v ${context.workspaceRoot}:${workDir}`];

      if (options.socket) {
        command.push(`-v ${options.socket}:/var/run/docker.sock`);
      }

      Object.keys(options).forEach((key) => {
        if (options[key]) {
          if (key === 'path' || key === 'dockerfile') {
            command.push(`-e INPUT_${key.toUpperCase()}=${workDir}/${options[key]}`);
          } else {
            command.push(`-e INPUT_${key.toUpperCase()}=${options[key]}`);
          }
        }
      });

      if (options.tag_with_ref) {
        command.push(`-e GITHUB_REF=${process.env.GITHUB_REF}`);
      }

      if (options.tag_with_sha) {
        command.push(`-e GITHUB_SHA=${process.env.GITHUB_SHA}`);
      }

      if (process.env.DOCKER_BUILDKIT) {
        command.push(`-e DOCKER_BUILDKIT=${process.env.DOCKER_BUILDKIT}`);
      }

      command.push(`docker/github-actions:v1.1.0 build-push`);

      const success = await createProcess(command.join(' '), undefined, true, undefined);

      observer.next({ success });
      observer.complete();
    } catch (e) {
      observer.error(`ERROR: Something went wrong in @gperdomor/nx-docker - ${e.message}`);
    }
  });
}

export default createBuilder(runBuilder);
