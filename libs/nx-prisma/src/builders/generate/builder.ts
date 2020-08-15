import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { Observable } from 'rxjs';

import { createProcess } from '../utils';
import { PrismaGenerateSchema } from './schema';

export const runBuilder = (
  options: PrismaGenerateSchema,
  _context: BuilderContext
): Observable<BuilderOutput> => {
  return new Observable((observer) => {
    if (!options.schema) {
      observer.next({
        success: false,
        error: 'ERROR: Bad builder config for @gperdomor/nx-prisma - "schema" option is required',
      });
      observer.complete();
    } else {
      try {
        const command = [`prisma generate`];

        let silent = false;
        Object.keys(options).forEach((key) => {
          if (key === 'silent') silent = true;
          else if (options[key]) command.push(`--${key}=${options[key]}`);
        });

        createProcess({ command: command.join(' '), silent, color: true }).then((success) => {
          observer.next({ success });
          observer.complete();
        });
      } catch (e) {
        observer.error(`ERROR: Something went wrong in @gperdomor/nx-prisma - ${e.message}`);
      }
    }
  });
};

export default createBuilder(runBuilder);
