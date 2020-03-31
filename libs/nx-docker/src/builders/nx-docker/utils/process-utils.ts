import { exec } from 'child_process';

import { TEN_MEGABYTES } from '@nrwl/workspace/src/core/file-utils';

export const createProcess = (
  command: string,
  readyWhen: string,
  color: boolean,
  cwd: string
): Promise<boolean> => {
  return new Promise(res => {
    const childProcess = exec(command, {
      maxBuffer: TEN_MEGABYTES,
      env: { ...process.env, FORCE_COLOR: `${color}` },
      cwd
    });

    /**
     * Ensure the child process is killed when the parent exits
     */
    process.on('exit', () => childProcess.kill());
    childProcess.stdout.on('data', data => {
      process.stdout.write(data);
      if (readyWhen && data.toString().indexOf(readyWhen) > -1) {
        res(true);
      }
    });

    childProcess.stderr.on('data', err => {
      process.stderr.write(err);
      if (readyWhen && err.toString().indexOf(readyWhen) > -1) {
        res(true);
      }
    });

    childProcess.on('close', code => {
      if (!readyWhen) {
        res(code === 0);
      }
    });
  });
};
