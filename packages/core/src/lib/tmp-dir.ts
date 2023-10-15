import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

export let _tmpDir: string;

export function tmpDir(): string {
  if (!_tmpDir) {
    _tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nx-tools-')).split(path.sep).join(path.posix.sep);
  }
  return _tmpDir;
}
