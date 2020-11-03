import csvparse from 'csv-parse/lib/sync';
import * as fs from 'fs';
import * as path from 'path';
import * as semver from 'semver';
import * as context from './context';
import * as exec from './exec';

export const getImageIDFile = async (): Promise<string> => {
  return path.join(context.tmpDir(), 'iidfile').split(path.sep).join(path.posix.sep);
};

export async function getImageID(): Promise<string | undefined> {
  const iidFile = await getImageIDFile();
  if (!fs.existsSync(iidFile)) {
    return undefined;
  }
  return fs.readFileSync(iidFile, { encoding: 'utf-8' });
}

export const getSecret = async (kvp: string): Promise<string> => {
  const delimiterIndex = kvp.indexOf('=');
  const key = kvp.substring(0, delimiterIndex);
  const value = kvp.substring(delimiterIndex + 1);
  const secretFile = context.tmpNameSync({
    tmpdir: context.tmpDir(),
  });
  await fs.writeFileSync(secretFile, value);
  return `id=${key},src=${secretFile}`;
};

export const isLocalOrTarExporter = (outputs: string[]): boolean => {
  for (const output of csvparse(outputs.join(`\n`), {
    delimiter: ',',
    trim: true,
    columns: false,
    relax_column_count: true,
  })) {
    // Local if no type is defined
    // https://github.com/docker/buildx/blob/d2bf42f8b4784d83fde17acb3ed84703ddc2156b/build/output.go#L29-L43
    if (output.length == 1 && !output[0].startsWith('type=')) {
      return true;
    }
    for (const [key, value] of output.map((chunk) => chunk.split('=').map((item) => item.trim()))) {
      if (key == 'type' && (value == 'local' || value == 'tar')) {
        return true;
      }
    }
  }
  return false;
};

export function hasGitAuthToken(secrets: string[]): boolean {
  for (const secret of secrets) {
    if (secret.startsWith('GIT_AUTH_TOKEN=')) {
      return true;
    }
  }
  return false;
}

export const isAvailable = async (): Promise<boolean> => {
  return await exec.exec(`docker`, ['buildx'], true).then((res) => {
    if (res.stderr != '' && !res.success) {
      return false;
    }
    return res.success;
  });
};

export const getVersion = async (): Promise<string> => {
  return await exec.exec(`docker`, ['buildx', 'version'], true).then((res) => {
    if (res.stderr != '' && !res.success) {
      throw new Error(res.stderr);
    }
    return parseVersion(res.stdout);
  });
};

export const parseVersion = async (stdout: string): Promise<string> => {
  const matches = /\sv?([0-9.]+)/.exec(stdout);
  if (!matches) {
    throw new Error(`Cannot parse Buildx version`);
  }
  return semver.clean(matches[1]);
};
