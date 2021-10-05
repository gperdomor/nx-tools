import { logger } from '@nrwl/devkit';
import * as logging from './logging';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const chalk = require('chalk');

describe('Logging', () => {
  beforeEach(() => {
    jest.spyOn(logger, 'debug');
    jest.spyOn(logger, 'error');
    jest.spyOn(logger, 'warn');
    jest.spyOn(logger, 'log');
    jest.spyOn(logger, 'info');
    process.stdout.write = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
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
      `\n${logging.GROUP_PREFIX('')} ${chalk.bold('this is a group message')}\n`,
    );

    logging.startGroup('this is a group message', 'PREFIX');
    expect(console.info).toHaveBeenNthCalledWith(
      2,
      `\n${logging.GROUP_PREFIX('PREFIX')} ${chalk.bold('this is a group message')}\n`,
    );
  });
});
