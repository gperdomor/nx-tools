import { getInputs } from './context';
import { interpolate, Meta } from './meta';

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

describe('interpolate', () => {
  const env: NodeJS.ProcessEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...env,
      ENV_1: 'ABC',
      ENV_2: 'DEF',
      ENV_3: 'ghi',
      ENV_4: 'JKL',
      ENV_5: 'MnÑ',
      ENV_6: 'OPQ',
      IS: ' is ',
      TST: ' test',
    };
  });

  afterAll(() => {
    process.env = env; // Restore old environment
  });

  test.each([
    ['$ENV_1/$ENV_2/$ENV_3', 'ABC/DEF/ghi'],
    ['$ENV_1-$ENV_2-$ENV_3', 'ABC-DEF-ghi'],
    ['${ENV_4}/$ENV_5/${ENV_6}', 'JKL/MnÑ/OPQ'],
    ['$ENV_6-${ENV_2}/$ENV_2', 'OPQ-DEF/DEF'],
    ['$ENV_3${ENV_5}/some-text-$ENV_6', 'ghiMnÑ/some-text-OPQ'],
    ['${ENV_1}${ENV_2}${ENV_3}', 'ABCDEFghi'],
    ['this${IS}other${TST}', 'this is other test'],
  ])('given %p, should returns %p', (input: string, expected: string) => {
    expect(interpolate(input)).toEqual(expected);
  });
});
