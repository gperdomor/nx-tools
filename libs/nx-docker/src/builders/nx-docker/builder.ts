import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import { Observable } from 'rxjs';
import { NxDockerBuilderSchema } from './schema';
import { createProcess, getCommitRef, getCommitSha } from './utils';

try {
  require('dotenv').config();
  // eslint-disable-next-line no-empty
} catch (e) {}

export function runBuilder(
  options: NxDockerBuilderSchema & JsonObject,
  context: BuilderContext
): Observable<BuilderOutput> {
  return new Observable((observer) => {
    if (!options.repository) {
      observer.next({
        success: false,
        error:
          'ERROR: Bad builder config for @gperdomor/nx-docker - "repository" option is required',
      });
      observer.complete();
    } else {
      try {
        const workDir = '/code';

        const command = [`docker container run --rm -v ${context.workspaceRoot}:${workDir}`];

        if (options.socket) {
          command.push(`-v ${options.socket}:/var/run/docker.sock`);
        }

        Object.keys(options)
          .filter((key) => !['socket', 'build_args', 'tag_with_ref', 'tag_with_sha'].includes(key))
          .forEach((key) => {
            if (options[key]) {
              if (key === 'path' || key === 'dockerfile') {
                command.push(`-e INPUT_${key.toUpperCase()}=${workDir}/${options[key]}`);
              } else if (key === 'repository') {
                const repository = options[key].startsWith('$')
                  ? options[key]
                  : options[key].toLowerCase();
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

        createProcess(command.join(' '), undefined, true, undefined).then((success) => {
          observer.next({ success });
          observer.complete();
        });
      } catch (e) {
        observer.error(`ERROR: Something went wrong in @gperdomor/nx-docker - ${e.message}`);
      }
    }
  });
}

export default createBuilder(runBuilder);
