import { getProjectRoot } from './workspace';

describe('Workspace', () => {
  const sampleData = {
    root: 'workspace-folder',
    workspace: { version: 2, projects: { foo: { root: 'apps/foo' }, bar: { root: 'apps/bar' } } },
  };

  test.each([
    ['foo', 'workspace-folder/apps/foo'],
    ['bar', 'workspace-folder/apps/bar'],
  ])('given test data and projectName=%p, should return "%p"', (projectName: string, expected: string) => {
    const context = {
      ...sampleData,
      projectName,
    };
    expect(getProjectRoot(context)).toEqual(expected);
  });
});
