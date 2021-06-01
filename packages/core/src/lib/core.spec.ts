import { asyncForEach, getBooleanInput, getInput, interpolate } from './core';

describe('Core', () => {
  const ENV: NodeJS.ProcessEnv = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...ENV }; // Make a copy
  });

  afterEach(() => {
    process.env = ENV; // Restore old environment
  });

  describe('getInput', () => {
    beforeAll(() => {
      process.env.INPUT_REQUIRED_EXIST = 'Value 1';
      process.env.INPUT_V1 = 'Value 1';
      process.env.INPUT_V2 = '101';
      process.env.INPUT_TL = '     TRIM LEFT';
      process.env.INPUT_TR = 'TRIM RIGHT      ';
      process.env.INPUT_TB = '  TRIM BOTH  ';
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
    beforeAll(() => {
      process.env.INPUT_T1 = 'true';
      process.env.INPUT_T2 = 'True';
      process.env.INPUT_T3 = 'TRUE';
      process.env.INPUT_T4 = '  TRUE  ';
      process.env.INPUT_TX = 'invalid';
      process.env.INPUT_F1 = 'false';
      process.env.INPUT_F2 = 'False';
      process.env.INPUT_F3 = 'FALSE';
      process.env.INPUT_F4 = '  FALSE  ';
      process.env.INPUT_FX = 'invalid';
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

  describe('asyncForEach', () => {
    it('executes async tasks sequentially', async () => {
      const testValues = [1, 2, 3, 4, 5];
      const results: number[] = [];

      await asyncForEach(testValues, async (value) => {
        results.push(value);
      });

      expect(results).toEqual(testValues);
    });
  });

  describe('interpolate', () => {
    beforeAll(() => {
      process.env.T1 = 'v1';
      process.env.T2 = 'v2';
    });

    test.each([
      [
        'docker build --tag nx-docker/node:$T1 --tag nx-docker/node:$T2',
        'docker build --tag nx-docker/node:v1 --tag nx-docker/node:v2',
      ],
      [
        'docker build --tag nx-docker/node:$T1 --tag nx-docker/node:$T3',
        'docker build --tag nx-docker/node:v1 --tag nx-docker/node:$T3',
      ],
      [
        'docker build --tag nx-docker/node:$T1$T2 --tag nx-docker/node:$T2$T1',
        'docker build --tag nx-docker/node:v1v2 --tag nx-docker/node:v2v1',
      ],
      [
        'docker build --tag nx-docker/node:$T1$T3 --tag nx-docker/node:$T3$T1',
        'docker build --tag nx-docker/node:v1$T3 --tag nx-docker/node:$T3v1',
      ],
    ])('given command %s, should return %s', (command: string, expected: string) => {
      expect(interpolate(command)).toEqual(expected);
    });
  });
});
