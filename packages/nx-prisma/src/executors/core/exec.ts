import * as aexec from '@nx-tools/core';
import { ExecOptions } from '@nx-tools/core';

export interface ExecResult {
  success: boolean;
  stdout: string;
  stderr: string;
}

export const exec = async (
  command: string,
  args: string[] = [],
  silent?: boolean,
  cwd?: string,
): Promise<ExecResult> => {
  let stdout = '';
  let stderr = '';

  const options: ExecOptions = { cwd: cwd, silent: silent, ignoreReturnCode: true };

  options.listeners = {
    stdout: (data: Buffer) => {
      stdout += data.toString();
    },
    stderr: (data: Buffer) => {
      stderr += data.toString();
    },
  };

  const returnCode: number = await aexec.exec(command, args, options);

  return {
    success: returnCode === 0,
    stdout: stdout.trim(),
    stderr: stderr.trim(),
  };
};
