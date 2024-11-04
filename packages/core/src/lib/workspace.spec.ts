import { ExecutorContext } from '@nx/devkit';
import { getProjectRoot } from './workspace';

const ctx1: ExecutorContext = {
  root: 'workspace-folder',
  cwd: process.cwd(),
  isVerbose: false,
};

const ctx2: ExecutorContext = {
  root: 'workspace-folder',
  cwd: process.cwd(),
  isVerbose: false,
  projectsConfigurations: {
    version: 2,
    projects: { foo: { root: 'apps/foo' }, bar: { root: 'apps/bar' } },
  },
};

describe('Workspace', () => {
  test.each([
    ['foo', ctx1, 'workspace-folder'],
    ['foo', ctx2, 'workspace-folder/apps/foo'],
    ['bar', ctx2, 'workspace-folder/apps/bar'],
    [undefined, ctx2, 'workspace-folder'],
  ])(
    'given test data and projectName=%p, should return "%p"',
    (projectName: string | undefined, ctx: ExecutorContext, expected: string) => {
      expect(getProjectRoot({ ...ctx, projectName: projectName })).toEqual(expected);
    }
  );
});
