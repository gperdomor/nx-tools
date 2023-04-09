import { logger } from '@nrwl/devkit';
import { bold } from 'colorette';
import mockedEnv, { RestoreFn } from 'mocked-env';
import * as logging from './logging';

describe('Logging', () => {
  beforeEach(() => {
    jest.spyOn(logger, 'debug');
    jest.spyOn(logger, 'error');
    jest.spyOn(logger, 'warn');
    jest.spyOn(logger, 'log');
    jest.spyOn(logger, 'info');
    jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debug should call devkit logger debug method', () => {
    logging.debug('this is a debug message');
    expect(logger.debug).toHaveBeenCalledWith('this is a debug message');
  });

  it('error should call devkit logger error method', () => {
    logging.error('this is a error message');
    expect(logger.error).toHaveBeenNthCalledWith(1, 'this is a error message');

    const error = new Error('this is a error message');
    logging.error(error);
    expect(logger.error).toHaveBeenNthCalledWith(2, error.toString());
  });

  it('warning should call devkit logger warn method', () => {
    logging.warning('this is a warning message');
    expect(logger.warn).toHaveBeenNthCalledWith(1, 'this is a warning message');

    const error = new Error('this is a warning message');
    logging.warning(error);
    expect(logger.warn).toHaveBeenNthCalledWith(2, error.toString());
  });

  it('notice should call devkit logger log method', () => {
    logging.notice('this is a notice message');
    expect(logger.log).toHaveBeenNthCalledWith(1, 'this is a notice message');

    const error = new Error('this is a notice message');
    logging.notice(error);
    expect(logger.log).toHaveBeenNthCalledWith(2, error.toString());
  });

  it('info should call devkit info warn method', () => {
    logging.info('this is a info message');
    expect(logger.info).toHaveBeenCalledWith('this is a info message');
  });

  it('startGroup should call devkit info warn method', () => {
    jest.spyOn(console, 'info');

    logging.startGroup('this is a group message');
    expect(console.info).toHaveBeenNthCalledWith(
      1,
      `\n${logging.GROUP_PREFIX('')} ${bold('this is a group message')}\n`
    );

    logging.startGroup('this is a group message', 'PREFIX');
    expect(console.info).toHaveBeenNthCalledWith(
      2,
      `\n${logging.GROUP_PREFIX('PREFIX')} ${bold('this is a group message')}\n`
    );
  });

  describe('isDebug', () => {
    let restore: RestoreFn;

    afterEach(() => {
      restore && restore();
    });

    test.each([
      [true, 'true'],
      [true, '1'],
      [false, 'false'],
      [false, '0'],
    ])('should return  %s for RUNNER_DEBUG= %s', (expected: boolean, value: string) => {
      restore = mockedEnv({
        RUNNER_DEBUG: value,
      });

      expect(logging.isDebug()).toEqual(expected);
    });
  });
});
