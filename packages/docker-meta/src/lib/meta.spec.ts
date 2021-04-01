import { getInputs } from './context';
import { Meta } from './meta';

describe('Meta', () => {
  const env: NodeJS.ProcessEnv = process.env;
  const ctx: any = {
    sha: '123abc123abc123abc',
    repo: {
      name: 'nx-tools',
      html_url: 'https://github.com/gperdomor/nx-tools',
      default_branch: 'main',
    },
  };
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env };
  });

  afterAll(() => {
    process.env = env; // Restore old environment
  });

  describe('Meta', () => {
    it('constructor', () => {
      const meta = new Meta(
        getInputs({
          images: ['app/name'],
          tags: ['type=sha', 'type=schedule', 'type=ref,event=branch', 'type=ref,event=tag', 'type=ref,event=pr'],
        }),
        ctx,
      );
      expect(meta).toBeDefined();
    });
  });
});
