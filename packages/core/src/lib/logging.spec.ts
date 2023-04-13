import * as chalk from 'chalk';
import { logger } from './logging';

describe('Logging', () => {
  beforeEach(() => {
    jest.spyOn(console, 'debug').mockImplementation(() => true);
    jest.spyOn(console, 'error').mockImplementation(() => true);
    jest.spyOn(console, 'info').mockImplementation(() => true);
    jest.spyOn(console, 'log').mockImplementation(() => true);
    jest.spyOn(console, 'warn').mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debug should call console debug method', () => {
    logger.debug('this is a debug message');
    expect(console.debug).toHaveBeenCalledWith('this is a debug message');
  });

  it('error should call console error method', () => {
    logger.error('this is a error message');
    expect(console.error).toHaveBeenNthCalledWith(1, chalk.bold(chalk.red('this is a error message')));

    const error = new Error('this is a error message');
    logger.error(error);
    expect(console.error).toHaveBeenNthCalledWith(2, chalk.bold(chalk.red(error.stack)));
  });

  it('fatal should call console error method', () => {
    logger.fatal('this is a fatal message');
    expect(console.error).toHaveBeenNthCalledWith(1, 'this is a fatal message');
  });

  it('info should call console info method', () => {
    logger.info('this is a info message');
    expect(console.info).toHaveBeenCalledWith('this is a info message');
  });

  it('log should call console log method', () => {
    logger.log('this is a log message');
    expect(console.log).toHaveBeenCalledWith('this is a log message');
  });

  it('warn should call console warn method', () => {
    logger.warn('this is a warning message');
    expect(console.warn).toHaveBeenCalledWith(chalk.bold(chalk.yellow('this is a warning message')));
  });

  it('startGroup should call devkit info warn method', () => {
    logger.startGroup('PREFIX', 'this is a group message');
    expect(console.info).toHaveBeenCalledWith(
      `\n${chalk.cyan('>')} ${chalk.inverse(chalk.bold(chalk.cyan(` PREFIX `)))} ${chalk.bold(
        'this is a group message'
      )}\n`
    );
  });
});
