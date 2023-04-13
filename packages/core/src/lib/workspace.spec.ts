import { getProjectRoot } from './workspace';

const ctx1 = {
  root: 'workspace-folder',
};

const ctx2 = {
  root: 'workspace-folder',
  workspace: { projects: { foo: { root: 'apps/foo' }, bar: { root: 'apps/bar' } } },
};

describe('Workspace', () => {
  test.each([
    ['foo', ctx1, 'workspace-folder'],
    ['foo', ctx2, 'workspace-folder/apps/foo'],
    ['bar', ctx2, 'workspace-folder/apps/bar'],
    [undefined, ctx2, 'workspace-folder'],
  ])(
    'given test data and projectName=%p, should return "%p"',
    (projectName: string | undefined, ctx: any, expected: string) => {
      expect(getProjectRoot({ ...ctx, projectName: projectName })).toEqual(expected);
    }
  );
});
