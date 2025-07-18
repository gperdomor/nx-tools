import * as core from '@nx-tools/core';

export async function isAvailable(): Promise<boolean> {
  try {
    const res = await core.exec('docker', undefined, {
      throwOnError: false,
      silent: true,
    });

    if (res.stderr.length > 0 && res.exitCode != 0) {
      return false;
    }

    return res.exitCode == 0;
  } catch {
    return false;
  }
}
