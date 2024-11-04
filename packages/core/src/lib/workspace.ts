import { ExecutorContext } from '@nx/devkit';
import { join } from 'node:path';

export const getProjectRoot = (context: ExecutorContext) => {
  return join(context.root, context.projectsConfigurations?.projects?.[context.projectName || '']?.root || '');
};
