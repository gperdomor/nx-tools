import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import { createProcess, loadEnvVars } from '@nx-tools/core';
import { Observable } from 'rxjs';
import { getCommitRef, getCommitSha } from '../utils';
import { NxDockerBuilderSchema } from './schema';

export function runBuilder(
  options: NxDockerBuilderSchema & JsonObject,
  context: BuilderContext,
): Observable<BuilderOutput> {
  return new Observable((observer) => {
    if (!options.repository) {
      observer.next({
        success: false,
        error: 'ERROR: Bad builder config for @nx-tools/nx-docker - "repository" option is required',
      });
      observer.complete();
    } else {
      try {
        loadEnvVars();

        const workDir = '/code';

        const command = [`docker container run --rm -v ${context.workspaceRoot}:${workDir}`];

        if (options.socket) {
          command.push(`-v ${options.socket}:/var/run/docker.sock`);
        }

        Object.keys(options)
          .filter((key) => !['socket', 'build_args'].includes(key))
          .forEach((key) => {
            if (options[key]) {
              if (key === 'path' || key === 'dockerfile') {
                command.push(`-e INPUT_${key.toUpperCase()}=${workDir}/${options[key]}`);
              } else if (key === 'repository') {
                const repository = options[key].startsWith('$') ? options[key] : options[key].toLowerCase();
                command.push(`-e INPUT_${key.toUpperCase()}=${repository}`);
              } else {
                command.push(`-e INPUT_${key.toUpperCase()}=${options[key]}`);
              }
            }
          });

        if (options.build_args && options.build_args !== '') {
          command.push(`-e INPUT_BUILD_ARGS=${options.build_args},BUILDKIT_INLINE_CACHE=1`);
        } else {
          command.push(`-e INPUT_BUILD_ARGS=BUILDKIT_INLINE_CACHE=1`);
        }

        if (options.tag_with_ref) {
          command.push(`-e GITHUB_REF=${getCommitRef()}`);
        }

        if (options.tag_with_sha) {
          command.push(`-e GITHUB_SHA=${getCommitSha()}`);
        }

        command.push(`-e DOCKER_BUILDKIT=1`);

        command.push(`docker/github-actions:v1.1.0 build-push`);

        createProcess({ command: command.join(' '), silent: false, color: true })
          .then((success) => {
            observer.next({ success });
          })
          .catch((error) => {
            observer.next({
              error: `ERROR: Something went wrong in @nx-tools/nx-docker - ${error.message}`,
              success: false,
            });
          })
          .finally(() => {
            observer.complete();
          });
      } catch (error) {
        observer.next({
          error: `ERROR: Something went wrong in @nx-tools/nx-docker - ${error.message}`,
          success: false,
        });
        observer.complete();
      }
    }
  });
}

export default createBuilder(runBuilder);
