import { getProjectRoot } from './workspace';

describe('Workspace', () => {
  const sampleData = {
    workspace: { version: 2, projects: { foo: { root: 'apps/foo' }, bar: { root: 'apps/bar' } } },
  };

  test.each([
    ['foo', 'apps/foo'],
    ['bar', 'apps/bar'],
  ])('given test data and projectName=%p, should return "%p"', (projectName: string, expected: string) => {
    const context = {
      ...sampleData,
      projectName,
    };
    expect(getProjectRoot(context)).toEqual(expected);
  });
});
