import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { Observable } from 'rxjs';

import { runCommands, PrismaCommands, PrismaBuilderOptions } from './run-commands';

export const createPrismaBuilder = <T extends PrismaBuilderOptions>(
  commands: PrismaCommands<T>
) => (options: T): Observable<BuilderOutput> => {
  return new Observable((observer) => {
    if (!options.schema) {
      observer.next({
        success: false,
        error: 'ERROR: Bad builder config for @gperdomor/nx-prisma - "schema" option is required',
      });
      observer.complete();
    } else {
      runCommands(commands, options).subscribe({
        complete: () => {
          observer.next({ success: true });
          observer.complete();
        },
        error: () => {
          observer.next({
            success: false,
            error: `ERROR: Something went wrong in @gperdomor/nx-prisma`,
          });
          observer.complete();
        },
      });
    }
  });
};
