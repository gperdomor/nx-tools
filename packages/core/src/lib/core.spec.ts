import { EOL } from 'os';
import { debug, endGroup, error, getInput, info, isDebug, startGroup, warning } from './core';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const chalk = require('chalk');

jest.mock('chalk');

chalk.green = jest.fn();
chalk.red = jest.fn();
chalk.yellow = jest.fn();

function assertWriteCalls(calls: string[]): void {
  expect(process.stdout.write).toHaveBeenCalledWith(calls[0]);

  // expect(process.stdout.write).toHaveBeenCalledTimes(calls.length);

  // for (let i = 0; i < calls.length; i++) {
  //   expect(process.stdout.write).toHaveBeenNthCalledWith(i + 1, calls[i]);
  // }
}

let originalWriteFunction: (str: string) => boolean;

describe('Core', () => {
  describe('getInput', () => {
    let env: NodeJS.ProcessEnv;

    beforeAll(() => {
      env = process.env;
      process.env = {
        ...env,
        INPUT_REQUIRED_EXIST: 'Value 1',
        INPUT_V1: 'Value 1',
        INPUT_V2: '101',
        INPUT_TL: '     TRIM LEFT',
        INPUT_TR: 'TRIM RIGHT      ',
        INPUT_TB: '  TRIM BOTH  ',
      };
    });

    afterAll(() => {
      process.env = env;
    });

    describe('When Input is required', () => {
      it('should return the input if exists', () => {
        expect(getInput('REQUIRED_EXIST', undefined, { required: true })).toEqual('Value 1');
        expect(getInput('REQUIRED_EXIST__', 'fb', { required: true })).toEqual('fb');
      });

      it('env variables take priority', () => {
        expect(getInput('REQUIRED_EXIST', 'fallback', { required: true })).toEqual('Value 1');
        expect(getInput('REQUIRED_EXIST___', '   fallback', { required: true })).toEqual('fallback');
      });

      it('should thrown error if not exists', () => {
        expect(() => getInput('REQUIRED_NOT_EXIST', undefined, { required: true })).toThrow(
          /Input required and not supplied: REQUIRED_NOT_EXIST/,
        );
      });
    });

    it('should return the a trimmed string', () => {
      expect(getInput('TL')).toEqual('TRIM LEFT');
      expect(getInput('TR')).toEqual('TRIM RIGHT');
      expect(getInput('TB')).toEqual('TRIM BOTH');

      expect(getInput('V1')).toEqual('Value 1');
      expect(getInput('V2')).toEqual('101');
    });

    it('should return empty string if not exist', () => {
      expect(getInput('INPUT_ASDFGHJK')).toEqual('');
    });
  });

  describe('info', () => {
    beforeAll(() => {
      originalWriteFunction = process.stdout.write;
    });

    beforeEach(() => {
      process.stdout.write = jest.fn();
    });

    afterAll(() => {
      process.stdout.write = (originalWriteFunction as unknown) as (str: string) => boolean;
    });

    it('should write to stdout', () => {
      info('value to be written');

      assertWriteCalls([`value to be written${EOL}`]);
    });
  });

  describe('Running on Local', () => {
    beforeAll(() => {
      originalWriteFunction = process.stdout.write;
      process.env.RUN_LOCAL = 'true';
    });

    beforeEach(() => {
      process.stdout.write = jest.fn();
    });

    afterAll(() => {
      process.stdout.write = (originalWriteFunction as unknown) as (str: string) => boolean;
      delete process.env.GITLAB_CI;
      delete process.env.GITHUB_ACTIONS;
      delete process.env.RUN_LOCAL;
    });

    describe('startGroup', () => {
      it('should write to stdout with proper format', () => {
        startGroup('group-name');
        assertWriteCalls([`::group::group-name${EOL}`]);
      });
    });

    describe('endGroup', () => {
      it('should write to stdout with proper format', () => {
        endGroup('group-name');
        assertWriteCalls([`::endgroup::${EOL}`]);
      });
    });
  });

  describe('Running on GitHub Actions', () => {
    beforeAll(() => {
      originalWriteFunction = process.stdout.write;
      process.env.GITHUB_ACTIONS = 'true';
    });

    beforeEach(() => {
      process.stdout.write = jest.fn();
    });

    afterAll(() => {
      process.stdout.write = (originalWriteFunction as unknown) as (str: string) => boolean;
      delete process.env.GITLAB_CI;
      delete process.env.GITHUB_ACTIONS;
      delete process.env.RUN_LOCAL;
    });

    describe('startGroup', () => {
      it('should write to stdout with proper format', () => {
        startGroup('group-name');
        assertWriteCalls([`::group::group-name${EOL}`]);
      });
    });

    describe('endGroup', () => {
      it('should write to stdout with proper format', () => {
        endGroup('group-name');
        assertWriteCalls([`::endgroup::${EOL}`]);
      });
    });
  });

  describe('Running on GitLab CI', () => {
    beforeAll(() => {
      originalWriteFunction = process.stdout.write;
      process.env.GITLAB_CI = 'true';
    });

    beforeEach(() => {
      process.stdout.write = jest.fn();
    });

    afterAll(() => {
      process.stdout.write = (originalWriteFunction as unknown) as (str: string) => boolean;
      delete process.env.GITLAB_CI;
      delete process.env.GITHUB_ACTIONS;
      delete process.env.RUN_LOCAL;
    });

    describe('startGroup', () => {
      it('should write to stdout with proper format', () => {
        startGroup('group-name');
        assertWriteCalls(['section_start:`date +%s`:group-name\re[0K' + EOL]);
      });
    });

    describe('endGroup', () => {
      it('should write to stdout with proper format', () => {
        endGroup('group-name');
        assertWriteCalls(['section_end:`date +%s`:group-name\re[0K' + EOL]);
      });
    });

    describe('isDebug', () => {
      it('should return true if RUNNER_DEBUG is 1', () => {
        process.env.RUNNER_DEBUG = '1';
        expect(isDebug()).toBeTruthy();
      });

      it('should return false in other cases', () => {
        delete process.env.RUNNER_DEBUG;
        expect(isDebug()).toBeFalsy();
      });
    });

    describe('loggers', () => {
      it('debug', () => {
        debug('this is a debug message');
        expect(chalk.green).toBeCalledWith('::debug::this is a debug message');
      });

      it('warning', () => {
        warning('this is a warning message');
        expect(chalk.yellow).toBeCalledWith('::warning::this is a warning message');
      });

      it('error', () => {
        error('this is a error message');
        expect(chalk.red).toBeCalledWith('::error::this is a error message');
      });
    });
  });
});
