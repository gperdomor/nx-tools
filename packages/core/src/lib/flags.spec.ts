describe('flags', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('isDebug', () => {
    it('should return true when std-env isDebug is true', async () => {
      vi.doMock('std-env', () => ({
        env: {},
        isDebug: true,
      }));

      const { isDebug } = await import('./flags.js');
      expect(isDebug).toBe(true);
    });

    it('should return true when RUNNER_DEBUG is truthy (via toBoolean)', async () => {
      vi.doMock('std-env', () => ({
        env: { RUNNER_DEBUG: 'true' },
        isDebug: false,
      }));

      const { isDebug } = await import('./flags.js');
      expect(isDebug).toBe(true);
    });

    it('should return false when both std-env isDebug and RUNNER_DEBUG are falsy', async () => {
      vi.doMock('std-env', () => ({
        env: { RUNNER_DEBUG: 'false' },
        isDebug: false,
      }));

      const { isDebug } = await import('./flags.js');
      expect(isDebug).toBe(false);
    });

    it('should return true when std-env isDebug is true even if RUNNER_DEBUG is falsy', async () => {
      vi.doMock('std-env', () => ({
        env: { RUNNER_DEBUG: 'false' },
        isDebug: true,
      }));

      const { isDebug } = await import('./flags.js');
      expect(isDebug).toBe(true);
    });

    it('should return true when std-env isDebug is false but RUNNER_DEBUG is truthy', async () => {
      vi.doMock('std-env', () => ({
        env: { RUNNER_DEBUG: '1' },
        isDebug: false,
      }));

      const { isDebug } = await import('./flags.js');
      expect(isDebug).toBe(true);
    });

    it('should handle undefined RUNNER_DEBUG environment variable', async () => {
      vi.doMock('std-env', () => ({
        env: {},
        isDebug: false,
      }));

      const { isDebug } = await import('./flags.js');
      expect(isDebug).toBe(false);
    });
  });
});
