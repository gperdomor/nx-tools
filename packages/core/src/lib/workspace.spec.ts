import { ExecutorContext } from '@nx/devkit';
import { getProjectRoot } from './workspace';

type CTX = Pick<ExecutorContext, 'root' | 'workspace' | 'projectName'>;

const ctx1: CTX = {
  root: 'workspace-folder',
};

const ctx2: CTX = {
  root: 'workspace-folder',
  workspace: {
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
    (projectName: string | undefined, ctx: CTX, expected: string) => {
      expect(getProjectRoot({ ...ctx, projectName: projectName })).toEqual(expected);
    }
  );
});
