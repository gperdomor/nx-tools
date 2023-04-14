import * as chalk from 'chalk';
import * as os from 'node:os';
import { logger } from './logging';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ci = require('ci-info');

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

  describe('startGroup', () => {
    it('should use github action syntaxt in Github Actions', () => {
      jest.replaceProperty(ci, 'GITHUB_ACTIONS', true);
      logger.startGroup('this is a group message');
      expect(console.info).toHaveBeenCalledWith(`::group::this is a group message${os.EOL}`);
    });

    it('should use fallback systaxt', () => {
      jest.replaceProperty(ci, 'GITHUB_ACTIONS', false);

      logger.startGroup('this is a group message');
      expect(console.info).toHaveBeenCalledWith(
        `\n${chalk.cyan('>')} ${chalk.inverse(chalk.bold(chalk.cyan(` this is a group message `)))}\n`
      );
    });
  });

  describe('endGroup', () => {
    it('should use github action syntaxt in Github Actions', () => {
      jest.replaceProperty(ci, 'GITHUB_ACTIONS', true);
      logger.endGroup('this is a group message');
      expect(console.info).toHaveBeenCalledWith(`::endgroup::${os.EOL}`);
    });

    it('should use fallback systaxt', () => {
      jest.replaceProperty(ci, 'GITHUB_ACTIONS', false);

      logger.endGroup('this is a group message');
      expect(console.info).not.toHaveBeenCalled();
    });
  });

  describe('group wraps an async call in a group', () => {
    it('Github Actions', async () => {
      jest.replaceProperty(ci, 'GITHUB_ACTIONS', true);

      const result = await logger.group('mygroup', async () => {
        console.info('in my group\n');
        return true;
      });

      expect(result).toBe(true);
      assertWriteCalls([`::group::mygroup${os.EOL}`, 'in my group\n', `::endgroup::${os.EOL}`]);
    });
  });
});

function assertWriteCalls(calls: string[]): void {
  expect(console.info).toHaveBeenCalledTimes(calls.length);

  for (let i = 0; i < calls.length; i++) {
    expect(console.info).toHaveBeenNthCalledWith(i + 1, calls[i]);
  }
}
