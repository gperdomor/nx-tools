import { getInput } from './core';

describe('core', () => {
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
        expect(getInput('REQUIRED_EXIST', { required: true })).toEqual('Value 1');
      });

      it('should thrown error if not exists', () => {
        expect(() => getInput('REQUIRED_NOT_EXIST', { required: true })).toThrow(
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
});
