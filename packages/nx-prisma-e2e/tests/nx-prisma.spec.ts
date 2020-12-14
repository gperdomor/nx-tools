// import { checkFilesExist, ensureNxProject, readJson, runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';

describe('nx-prisma e2e', () => {
  it('should pass', () => {
    expect(true).toBeTruthy();
  });

  // it('should create nx-prisma', async (done) => {
  //   const plugin = uniq('nx-prisma');
  //   ensureNxProject('@nx-tools/nx-prisma', 'dist/packages/nx-prisma');
  //   await runNxCommandAsync(`generate @nx-tools/nx-prisma:nx-prisma ${plugin}`);

  //   const result = await runNxCommandAsync(`build ${plugin}`);
  //   expect(result.stdout).toContain('Executor ran');

  //   done();
  // });

  // describe('--directory', () => {
  //   it('should create src in the specified directory', async (done) => {
  //     const plugin = uniq('nx-prisma');
  //     ensureNxProject('@nx-tools/nx-prisma', 'dist/packages/nx-prisma');
  //     await runNxCommandAsync(`generate @nx-tools/nx-prisma:nx-prisma ${plugin} --directory subdir`);
  //     expect(() => checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)).not.toThrow();
  //     done();
  //   });
  // });

  // describe('--tags', () => {
  //   it('should add tags to nx.json', async (done) => {
  //     const plugin = uniq('nx-prisma');
  //     ensureNxProject('@nx-tools/nx-prisma', 'dist/packages/nx-prisma');
  //     await runNxCommandAsync(`generate @nx-tools/nx-prisma:nx-prisma ${plugin} --tags e2etag,e2ePackage`);
  //     const nxJson = readJson('nx.json');
  //     expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
  //     done();
  //   });
  // });
});
