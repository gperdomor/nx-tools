import * as core from '@nx-tools/core';
import fs from 'node:fs';
import path from 'node:path';
import * as context from '../../context';

export async function getImageIDFile(): Promise<string> {
  return path.join(context.tmpDir(), 'iidfile').split(path.sep).join(path.posix.sep);
}

export async function getImageID(): Promise<string | undefined> {
  const iidFile = await getImageIDFile();
  if (!fs.existsSync(iidFile)) {
    return undefined;
  }
  return fs.readFileSync(iidFile, { encoding: 'utf-8' }).trim();
}

export async function getMetadataFile(): Promise<string> {
  return path.join(context.tmpDir(), 'metadata-file').split(path.sep).join(path.posix.sep);
}

export async function getMetadata(): Promise<string | undefined> {
  const metadataFile = await getMetadataFile();
  if (!fs.existsSync(metadataFile)) {
    return undefined;
  }
  const content = fs.readFileSync(metadataFile, { encoding: 'utf-8' }).trim();
  if (content === 'null') {
    return undefined;
  }
  return content;
}

export async function getDigest(metadata: string | undefined): Promise<string | undefined> {
  if (metadata === undefined) {
    return undefined;
  }
  const metadataJSON = JSON.parse(metadata);
  if (metadataJSON['containerimage.digest']) {
    return metadataJSON['containerimage.digest'];
  }
  return undefined;
}

export async function isAvailable(): Promise<boolean> {
  try {
    const cmd = getCommand(['version']);
    const res = await core.exec(cmd.command, cmd.args, {
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

export function getCommand(args: Array<string>) {
  return {
    command: '/kaniko/executor',
    args,
  };
}
