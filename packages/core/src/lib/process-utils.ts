import { exec } from 'child_process';

export const TEN_MEGABYTES = 1024 * 10000;

interface CreateProcessOptions {
  command: string;
  color?: boolean;
  readyWhen?: string;
  cwd?: string;
  silent?: boolean;
}

export const createProcess = async ({ command, color, readyWhen, cwd, silent }: CreateProcessOptions) => {
  return new Promise<boolean>((res, reject) => {
    const childProcess = exec(command, {
      maxBuffer: TEN_MEGABYTES,
      env: { ...process.env, FORCE_COLOR: `${color}` },
      cwd,
    });

    /**
     * Ensure the child process is killed when the parent exits
     */
    process.on('exit', () => childProcess.kill());
    childProcess.stdout.on('data', (data) => {
      if (!silent) process.stdout.write(data);
      if (readyWhen && data.toString().indexOf(readyWhen) > -1) {
        res(true);
      }
    });

    childProcess.stderr.on('data', (err) => {
      if (!silent) process.stderr.write(err);
      if (readyWhen && err.toString().indexOf(readyWhen) > -1) {
        reject(reject);
      }
    });

    childProcess.on('close', (code) => {
      if (!readyWhen) {
        if (code === 0) res(true);
        else reject(new Error(`${code}`));
      }
    });
  });
};
