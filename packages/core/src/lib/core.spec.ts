import { EOL } from 'os';
import { debug, endGroup, error, getInput, info, startGroup, warning } from './core';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const chalk = require('chalk');

jest.mock('chalk');

chalk.green = jest.fn();
chalk.red = jest.fn();
chalk.yellow = jest.fn();

function assertWriteCalls(calls: string[]): void {
  expect(process.stdout.write).toHaveBeenCalledWith(calls[0]);
}

let originalWriteFunction: (str: string) => boolean;

describe('Core', () => {
  describe('getInput', () => {
    beforeAll(() => {
      process.env.INPUT_REQUIRED_EXIST = 'Value 1';
      process.env.INPUT_V1 = 'Value 1';
      process.env.INPUT_V2 = '101';
      process.env.INPUT_TL = '     TRIM LEFT';
      process.env.INPUT_TR = 'TRIM RIGHT      ';
      process.env.INPUT_TB = '  TRIM BOTH  ';
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
      process.stdout.write = originalWriteFunction as unknown as (str: string) => boolean;
    });

    it('should write to stdout', () => {
      info('value to be written');

      assertWriteCalls([`value to be written${EOL}`]);
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

  describe('Running on Local', () => {
    const env: NodeJS.ProcessEnv = process.env;

    beforeAll(() => {
      jest.resetModules();
      const { RUN_LOCAL, GITLAB_CI, CIRCLECI, GITHUB_ACTIONS, ...rest } = env;
      process.env = { ...rest, RUN_LOCAL: 'true' };

      originalWriteFunction = process.stdout.write;
    });

    beforeEach(() => {
      process.stdout.write = jest.fn();
    });

    afterAll(() => {
      process.stdout.write = originalWriteFunction as unknown as (str: string) => boolean;
      process.env = env; // Restore old environment
    });

    describe('startGroup', () => {
      it('should write to stdout with proper format', () => {
        startGroup('group-name');
        assertWriteCalls([`-->::group-name::${EOL}`]);
      });
    });

    describe('endGroup', () => {
      it('should write to stdout with proper format', () => {
        endGroup();
        assertWriteCalls([`<--::group-name::${EOL}`]);
      });
    });
  });

  describe('Running on GitHub Actions', () => {
    const env: NodeJS.ProcessEnv = process.env;

    beforeAll(() => {
      jest.resetModules();
      const { RUN_LOCAL, GITLAB_CI, CIRCLECI, GITHUB_ACTIONS, ...rest } = env;
      process.env = { ...rest, GITHUB_ACTIONS: 'true' };

      originalWriteFunction = process.stdout.write;
    });

    beforeEach(() => {
      process.stdout.write = jest.fn();
    });

    afterAll(() => {
      process.stdout.write = originalWriteFunction as unknown as (str: string) => boolean;
      process.env = env; // Restore old environment
    });

    describe('startGroup', () => {
      it('should write to stdout with proper format', () => {
        startGroup('group-name');
        assertWriteCalls([`::group::group-name${EOL}`]);
      });
    });

    describe('endGroup', () => {
      it('should write to stdout with proper format', () => {
        endGroup();
        assertWriteCalls([`::endgroup::${EOL}`]);
      });
    });
  });

  describe('Running on GitLab CI', () => {
    const env: NodeJS.ProcessEnv = process.env;

    beforeAll(() => {
      jest.resetModules();
      const { RUN_LOCAL, GITLAB_CI, CIRCLECI, GITHUB_ACTIONS, ...rest } = env;
      process.env = { ...rest, GITLAB_CI: 'true' };

      originalWriteFunction = process.stdout.write;
    });

    beforeEach(() => {
      process.stdout.write = jest.fn();
    });

    afterAll(() => {
      process.stdout.write = originalWriteFunction as unknown as (str: string) => boolean;
      process.env = env; // Restore old environment
    });

    describe('startGroup', () => {
      it('should write to stdout with proper format', () => {
        jest.spyOn(Date, 'now').mockImplementation(() => 1487076708000);
        startGroup('Group Name');
        assertWriteCalls(['\\e[0Ksection_start:1487076708:group-name\\r\\e[0KGroup Name' + EOL]);
      });
    });

    describe('endGroup', () => {
      it('should write to stdout with proper format', () => {
        jest.spyOn(Date, 'now').mockImplementation(() => 1787076708000);
        endGroup();
        assertWriteCalls(['\\e[0Ksection_end:1787076708:group-name\\r\\e[0K' + EOL]);
      });
    });
  });

  describe('Running on CircleCI', () => {
    const env: NodeJS.ProcessEnv = process.env;

    beforeAll(() => {
      jest.resetModules();
      const { RUN_LOCAL, GITLAB_CI, CIRCLECI, GITHUB_ACTIONS, ...rest } = env;
      process.env = { ...rest, CIRCLECI: 'true' };

      originalWriteFunction = process.stdout.write;
    });

    beforeEach(() => {
      process.stdout.write = jest.fn();
    });

    afterAll(() => {
      process.stdout.write = originalWriteFunction as unknown as (str: string) => boolean;
      process.env = env; // Restore old environment
    });

    describe('startGroup', () => {
      it('should write to stdout with proper format', () => {
        jest.spyOn(Date, 'now').mockImplementation(() => 1487076708000);
        startGroup('Group Name');
        assertWriteCalls([`-->::Group Name::${EOL}`]);
      });
    });

    describe('endGroup', () => {
      it('should write to stdout with proper format', () => {
        jest.spyOn(Date, 'now').mockImplementation(() => 1787076708000);
        endGroup();
        assertWriteCalls([`<--::Group Name::${EOL}`]);
      });
    });
  });
});
