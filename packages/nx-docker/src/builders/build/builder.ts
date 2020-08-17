import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { runBuild, runLogin, runPush } from './helpers/commands.helper';
import { Login } from './interfaces';
import { BuildBuilderSchema } from './schema';
import { getBuildOptions, getGitOptions, getLoginOptions } from './utils/options.utils';
import { getTags } from './utils/tag.utils';

try {
  require('dotenv').config();
  // eslint-disable-next-line no-empty
} catch (e) {}

export function run(options: BuildBuilderSchema & JsonObject, context: BuilderContext): Observable<BuilderOutput> {
  return from(context.getProjectMetadata(context?.target?.project)).pipe(
    map((metadata: any) => {
      const login: Login = getLoginOptions(options);

      if (login.username && login.password) {
        runLogin(context, login, options.registry);
      }

      const git = getGitOptions();

      const buildOpts = getBuildOptions(options, metadata.root);

      const tags = getTags(options, git);

      runBuild(context, buildOpts, git, tags);

      if (options.push) {
        runPush(context, tags);
      }

      return { success: true };
    }),
    catchError((err) => {
      const error = `ERROR: Something went wrong in @gperdomor/nx-docker:build - ${err.message}`;
      context.logger.error(error);
      return of({ success: false });
    }),
  );
}

export default createBuilder(run);
