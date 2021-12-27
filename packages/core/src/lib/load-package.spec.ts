import { loadPackage } from './load-package';

describe('loadPackage', () => {
  describe('when package is available', () => {
    it('should return package', () => {
      expect(loadPackage('@nrwl/js', 'ctx')).toEqual(
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('@nrwl/js')
      );
    });
  });
});
