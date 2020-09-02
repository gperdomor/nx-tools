import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { createProcess } from '@nx-tools/core';
import { Observable } from 'rxjs';
import { PrismaSeedSchema } from './schema';

export const runBuilder = (
  options: PrismaSeedSchema,
  { logger }: BuilderContext
): Observable<BuilderOutput> => {
  return new Observable((observer) => {
    createProcess({ command: `ts-node --project ${options.tsConfig} ${options.script}`, cwd: './' })
      .then(() => {
        logger.info('Seeding complete!');
        observer.next({ success: true });
        observer.complete();
      })
      .catch((error) => {
        logger.error('Seeing failed...');
        observer.next({ error, success: false });
        observer.complete();
      });
  });
};

export default createBuilder(runBuilder);
