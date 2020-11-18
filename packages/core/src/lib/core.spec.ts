import { EOL } from 'os';
import { endGroup, getInput, info, startGroup } from './core';

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

  describe('Running on GitHub Actions', () => {
    beforeAll(() => {
      originalWriteFunction = process.stdout.write;
      process.env.GITHUB_ACTIONS = 'true';
      process.env.GITLAB_CI = undefined;
    });

    beforeEach(() => {
      process.stdout.write = jest.fn();
    });

    afterAll(() => {
      process.stdout.write = (originalWriteFunction as unknown) as (str: string) => boolean;
      process.env.GITHUB_ACTIONS = undefined;
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
      process.env.GITHUB_ACTIONS = undefined;
    });

    beforeEach(() => {
      process.stdout.write = jest.fn();
    });

    afterAll(() => {
      process.stdout.write = (originalWriteFunction as unknown) as (str: string) => boolean;
      process.env.GITLAB_CI = undefined;
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
  });
});
