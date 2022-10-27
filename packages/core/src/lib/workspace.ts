import { ExecutorContext } from '@nrwl/devkit';

export const getProjectRoot = (context: Pick<ExecutorContext, 'workspace' | 'projectName'>) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return context.workspace.projects[context.projectName!]?.root;
};
