import { getInputList } from './context';

describe('context', () => {
  let env: NodeJS.ProcessEnv;

  beforeEach(() => {
    env = process.env;
    process.env = {
      ...env,
      INPUT_BUILD_ARGS: 'arg1=value1\narg2=value2\narg3=value3',
    };
  });

  afterEach(() => {
    process.env = env;
  });

  describe('getInputList', () => {
    it('should take value from env vars', async () => {
      const res = await getInputList('build-args', undefined, true);
      expect(res).toEqual(['arg1=value1', 'arg2=value2', 'arg3=value3']);
    });

    it('should take env as priority', async () => {
      const res = await getInputList('build-args', ['arg4=value4'], true);
      expect(res).toEqual(['arg1=value1', 'arg2=value2', 'arg3=value3']);
    });

    it('should return fallback if input env is not defined', async () => {
      const res = await getInputList('build-argsssssss', ['arg4=value4', 'arg5=value5'], true);
      expect(res).toEqual(['arg4=value4', 'arg5=value5']);
    });
  });
});
