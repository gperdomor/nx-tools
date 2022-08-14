import { loadPackage } from './load-package';

describe('loadPackage', () => {
  describe('when package is available', () => {
    it('should import package', async () => {
      const module = await loadPackage('@nrwl/js', 'ctx');

      expect(module).toEqual(await import('@nrwl/js'));
    });

    it('should require package', async () => {
      const module = await loadPackage('@nrwl/js', 'ctx', () => require('@nrwl/js'));

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      expect(module).toEqual(require('@nrwl/js'));
    });

    it('should call process.exit if package not exists', async () => {
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(jest.fn() as never);
      await loadPackage('not-existent-package', 'ctx');
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });
});
