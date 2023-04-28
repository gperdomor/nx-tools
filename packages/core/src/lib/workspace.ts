import { ExecutorContext } from '@nx/devkit';
import { join } from 'node:path';

export const getProjectRoot = (context: Pick<ExecutorContext, 'root' | 'workspace' | 'projectName'>) => {
  return join(context.root, context.workspace?.projects?.[context.projectName || '']?.root || '');
};
