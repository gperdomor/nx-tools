import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { runBuild, runLogin, runPush } from './helpers/commands.helper';
import { Login, ProjectMetadata } from './interfaces';
import { BuildBuilderSchema } from './schema';
import { loadEnvVars } from './utils/env.utils';
import { getBuildOptions, getGitOptions, getLoginOptions } from './utils/options.utils';
import { getTags } from './utils/tag.utils';

export function runBuilder(options: BuildBuilderSchema, context: BuilderContext): Observable<BuilderOutput> {
  loadEnvVars();

  return from(context.getProjectMetadata(context?.target?.project)).pipe(
    map((metadata) => {
      const login: Login = getLoginOptions(options);

      if (login.username && login.password) {
        runLogin(context, login, options.registry);
      }

      const git = getGitOptions();

      const buildOpts = getBuildOptions(options, (metadata as unknown) as ProjectMetadata);

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

export default createBuilder(runBuilder);
