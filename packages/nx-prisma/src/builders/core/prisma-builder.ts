import { BuilderOutput } from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import { PrismaBuilderOptions, PrismaCommands, runCommands } from './run-commands';

export const createPrismaBuilder = <T extends PrismaBuilderOptions>(
  commands: PrismaCommands<T>
) => (options: T): Observable<BuilderOutput> => {
  return new Observable((observer) => {
    if (!options.schema) {
      observer.next({
        success: false,
        error: 'ERROR: Bad builder config for @nx-tools/nx-prisma - "schema" option is required',
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
            error: `ERROR: Something went wrong in @nx-tools/nx-prisma`,
          });
          observer.complete();
        },
      });
    }
  });
};
