import { getInputs } from './context';

describe('Context', () => {
  const env: NodeJS.ProcessEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env };
  });

  afterAll(() => {
    process.env = env; // Restore old environment
  });

  describe('getInputs', () => {
    it('Should return default values', () => {
      const inputs = getInputs({});
      expect(inputs).toMatchObject({ images: [], tags: [], flavor: [], labels: [], sepTags: '\n', sepLabels: '\n' });
    });

    it('Should handle env variables', () => {
      process.env.INPUT_IMAGES = `
        env/image1
        env/image2
      `;

      process.env.INPUT_TAGS = `
        type=schedule
        type=ref,event=branch
        type=ref,event=pr
      `;

      const inputs = getInputs({});

      expect(inputs).toMatchObject({
        images: ['env/image1', 'env/image2'],
        tags: ['type=schedule', 'type=ref,event=branch', 'type=ref,event=pr'],
        flavor: [],
        labels: [],
        sepTags: '\n',
        sepLabels: '\n',
      });
    });

    it('Should handle fallback variables', () => {
      process.env.INPUT_IMAGES = `
        env/image1
        env/image2
      `;

      const inputs = getInputs({ tags: ['type=schedule'], labels: ['l1', 'l2'] });

      expect(inputs).toMatchObject({
        images: ['env/image1', 'env/image2'],
        tags: ['type=schedule'],
        flavor: [],
        labels: ['l1', 'l2'],
        sepTags: '\n',
        sepLabels: '\n',
      });
    });
  });
});
