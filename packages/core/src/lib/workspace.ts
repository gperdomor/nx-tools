import { ExecutorContext } from '@nrwl/devkit';
import { join } from 'node:path';

export const getProjectRoot = (context: Pick<ExecutorContext, 'root' | 'workspace' | 'projectName'>) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return join(context.root, context.workspace.projects[context.projectName || ''].root);
};
