import mockedEnv, { RestoreFn } from 'mocked-env';
import { getBooleanInput, getInput } from './get-input';

describe('getInput', () => {
  let restore: RestoreFn;

  beforeAll(() => {
    restore = mockedEnv({
      INPUT_REQUIRED_EXIST: 'Value 1',
      INPUT_V1: 'Value 1',
      INPUT_V2: '101',
      INPUT_TL: '     TRIM LEFT',
      INPUT_TR: 'TRIM RIGHT      ',
      INPUT_TB: '  TRIM BOTH  ',
      INPUT_CACHE_FROM: 'cache-from-value',
      INPUT_BUILD_ARGS: 'MY_ARG=val1,val2,val3\nARG=val',
    });
  });

  afterAll(() => {
    restore();
  });

  describe('When env variable is defined', () => {
    describe('and no fallback value is provided', () => {
      test.each([
        ['REQUIRED_EXIST', 'Value 1'],
        ['V1', 'Value 1'],
        ['V2', '101'],
        ['TL', 'TRIM LEFT'],
        ['TR', 'TRIM RIGHT'],
        ['TB', 'TRIM BOTH'],
        ['TB', 'TRIM BOTH'],
        ['cache from', 'cache-from-value'],
        ['cache-from', 'cache-from-value'],
        ['cache_from', 'cache-from-value'],
        ['Cache_From', 'cache-from-value'],
        ['CACHE-FROM', 'cache-from-value'],
        ['build args', 'MY_ARG=val1,val2,val3\nARG=val'],
        ['build-args', 'MY_ARG=val1,val2,val3\nARG=val'],
        ['build_args', 'MY_ARG=val1,val2,val3\nARG=val'],
        ['Build_Args', 'MY_ARG=val1,val2,val3\nARG=val'],
        ['BUILD-ARGS', 'MY_ARG=val1,val2,val3\nARG=val'],
      ])('given an existing env variable named INPUT_%s, should return: %s', (name: string, expected: string) => {
        expect(getInput(name)).toEqual(expected);
        expect(getInput(name, { required: true })).toEqual(expected);
      });
    });

    describe('and fallback value is provided', () => {
      test.each([
        ['REQUIRED_EXIST', 'fallbalck-1', 'Value 1'],
        ['V1', 'fallbalck-2', 'Value 1'],
        ['V2', 'fallbalck-3', '101'],
        ['TL', 'fallbalck-4', 'TRIM LEFT'],
        ['TR', 'fallbalck-5', 'TRIM RIGHT'],
        ['TB', 'fallbalck-6', 'TRIM BOTH'],
      ])(
        'given an existing env variable named INPUT_%s, fallback: %s, the env value takes priority and should return: %s',
        (name: string, fallback: string, expected: string) => {
          expect(getInput(name, { fallback })).toEqual(expected);
          expect(getInput(name, { fallback, required: true })).toEqual(expected);
        },
      );
    });

    describe('when returned value should not be trimed', () => {
      test.each([
        ['V1', 'Value 1'],
        ['V2', '101'],
        ['TL', '     TRIM LEFT'],
        ['TR', 'TRIM RIGHT      '],
        ['TB', '  TRIM BOTH  '],
      ])('given an existing env variable named INPUT_%s, should return: %s', (name: string, expected: string) => {
        expect(getInput(name, { trimWhitespace: false })).toEqual(expected);
        expect(getInput(name, { trimWhitespace: false, required: true })).toEqual(expected);
      });
    });
  });

  describe('When env variable not exists', () => {
    describe('and no fallback value is provided', () => {
      test.each([['__A'], ['__B'], ['__C']])(
        'given a not existing env variable named INPUT_%s, should return an empty string',
        (name: string) => {
          expect(getInput(name)).toEqual('');
        },
      );

      test.each([['__A'], ['__B'], ['__C']])(
        'given a not existing env variable named INPUT_%s, and required is true, should throw an error',
        (name: string) => {
          function getInputValue() {
            getInput(name, { required: true });
          }

          expect(getInputValue).toThrowError(new Error(`Input required and not supplied: ${name}`));
        },
      );
    });

    describe('and fallback value is provided', () => {
      test.each([
        ['__O', 'fallbalck-1'],
        ['__P', 'fallbalck-2'],
        ['__Q', 'fallbalck-3'],
      ])(
        'given a not existing env variable named INPUT_%s, fallback: %s, should return the fallback value',
        (name: string, fallback: string) => {
          expect(getInput(name, { fallback })).toEqual(fallback);
          expect(getInput(name, { required: true, fallback })).toEqual(fallback);
        },
      );
    });
  });
});

describe('getBooleanInput', () => {
  let restore: RestoreFn;

  beforeAll(() => {
    restore = mockedEnv({
      INPUT_T1: 'true',
      INPUT_T2: 'True',
      INPUT_T3: 'TRUE',
      INPUT_T4: '  TRUE  ',
      INPUT_TX: 'invalid',
      INPUT_F1: 'false',
      INPUT_F2: 'False',
      INPUT_F3: 'FALSE',
      INPUT_F4: '  FALSE  ',
      INPUT_FX: 'invalid',
      INPUT_META_ENABLED: 'true',
    });
  });

  afterAll(() => {
    restore();
  });

  describe('When env variable is defined', () => {
    describe('and no fallback value is provided', () => {
      test.each([
        ['T1', true],
        ['T2', true],
        ['T3', true],
        ['T4', true],
        ['F1', false],
        ['F2', false],
        ['F3', false],
        ['F4', false],
        ['META_ENABLED', true],
        ['meta-enabled', true],
        ['meta enabled', true],
        ['META ENABLED', true],
      ])('given an existing env variable named INPUT_%s, should return: %s', (name: string, expected: boolean) => {
        expect(getBooleanInput(name)).toEqual(expected);
        expect(getBooleanInput(name, { required: true })).toEqual(expected);
      });
    });

    describe('and fallback value is provided', () => {
      test.each([
        ['T1', 'fallback-1', true],
        ['T2', 'fallback-2', true],
        ['T3', 'fallback-3', true],
        ['T4', 'fallback-3', true],
        ['F1', 'fallback-4', false],
        ['F2', 'fallback-5', false],
        ['F3', 'fallback-6', false],
        ['F4', 'fallback-6', false],
      ])(
        'given an existing env variable named INPUT_%s, fallback: %s, the env value takes priority and should return: %s',
        (name: string, fallback: string, expected: boolean) => {
          expect(getBooleanInput(name, { fallback })).toEqual(expected);
          expect(getBooleanInput(name, { fallback, required: true })).toEqual(expected);
        },
      );
    });

    describe('and value is not boolean', () => {
      test.each([['TX'], ['FX']])(
        'given an existing env variable named INPUT_%s, fallback: %s, the env value takes priority and should return: %s',
        (name: string) => {
          function getBooleanValue() {
            getBooleanInput(name);
          }

          expect(getBooleanValue).toThrowError(TypeError);
        },
      );
    });
  });

  describe('When env variable not exists', () => {
    describe('and no fallback value is provided', () => {
      test.each([['__A'], ['__B'], ['__C']])(
        'given a not existing env variable named INPUT_%s, should throw an error',
        (name: string) => {
          function getBooleanValue() {
            getBooleanInput(name);
          }

          expect(getBooleanValue).toThrowError(TypeError);
        },
      );
    });

    describe('and fallback value is provided', () => {
      test.each([
        ['__O', 'true', true],
        ['__P', 'FALSE', false],
        ['__Q', '    True', true],
      ])(
        'given a not existing env variable named INPUT_%s, fallback: %s, should return: %s',
        (name: string, fallback: string, expected) => {
          expect(getBooleanInput(name, { fallback })).toEqual(expected);
        },
      );

      test.each([
        ['__O', 'asdff'],
        ['__P', 'invalid'],
      ])(
        'given a not existing env variable named INPUT_%s, fallback: %s, should throw an error',
        (name: string, fallback: string) => {
          function getBooleanValue() {
            getBooleanInput(name, { fallback });
          }

          expect(getBooleanValue).toThrowError(TypeError);
        },
      );
    });
  });
});
