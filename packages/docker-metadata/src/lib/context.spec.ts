/* eslint-disable no-useless-escape */
import { getPosixName } from '@nx-tools/core';
import * as fs from 'fs';
import * as path from 'path';
import * as context from './context';

jest.mock('./context', () => {
  const actualModule = jest.requireActual('./context');
  return {
    __esModule: true,
    ...actualModule,
    tmpDir: jest.fn(() => {
      const tmpDir = path.join('/tmp/.docker-metadata-action-jest').split(path.sep).join(path.posix.sep);
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      return tmpDir;
    }),
  };
});

describe('getInputList', () => {
  it('single line correctly', async () => {
    await setInput('foo', 'bar');
    const res = await context.getInputList('foo', '');
    expect(res).toEqual(['bar']);
  });

  it('multiline correctly', async () => {
    setInput('foo', 'bar\nbaz');
    const res = await context.getInputList('foo', '');
    expect(res).toEqual(['bar', 'baz']);
  });

  it('empty lines correctly', async () => {
    setInput('foo', 'bar\n\nbaz');
    const res = await context.getInputList('foo', '');
    expect(res).toEqual(['bar', 'baz']);
  });

  it('comma correctly', async () => {
    setInput('foo', 'bar,baz');
    const res = await context.getInputList('foo', '');
    expect(res).toEqual(['bar', 'baz']);
  });

  it('empty result correctly', async () => {
    setInput('foo', 'bar,baz,');
    const res = await context.getInputList('foo', '');
    expect(res).toEqual(['bar', 'baz']);
  });

  it('different new lines correctly', async () => {
    setInput('foo', 'bar\r\nbaz');
    const res = await context.getInputList('foo', '');
    expect(res).toEqual(['bar', 'baz']);
  });

  it('different new lines and comma correctly', async () => {
    setInput('foo', 'bar\r\nbaz,bat');
    const res = await context.getInputList('foo', '');
    expect(res).toEqual(['bar', 'baz', 'bat']);
  });

  it('multiline and ignoring comma correctly', async () => {
    setInput('cache-from', 'user/app:cache\ntype=local,src=path/to/dir');
    const res = await context.getInputList('cache-from', '', undefined, true);
    expect(res).toEqual(['user/app:cache', 'type=local,src=path/to/dir']);
  });

  it('different new lines and ignoring comma correctly', async () => {
    setInput('cache-from', 'user/app:cache\r\ntype=local,src=path/to/dir');
    const res = await context.getInputList('cache-from', '', undefined, true);
    expect(res).toEqual(['user/app:cache', 'type=local,src=path/to/dir']);
  });

  it('multiline values', async () => {
    setInput(
      'secrets',
      `GIT_AUTH_TOKEN=abcdefgh,ijklmno=0123456789
"MYSECRET=aaaaaaaa
bbbbbbb
ccccccccc"
FOO=bar`
    );
    const res = await context.getInputList('secrets', '', undefined, true);
    expect(res).toEqual([
      'GIT_AUTH_TOKEN=abcdefgh,ijklmno=0123456789',
      `MYSECRET=aaaaaaaa
bbbbbbb
ccccccccc`,
      'FOO=bar',
    ]);
  });

  it('multiline values with empty lines', async () => {
    setInput(
      'secrets',
      `GIT_AUTH_TOKEN=abcdefgh,ijklmno=0123456789
"MYSECRET=aaaaaaaa
bbbbbbb
ccccccccc"
FOO=bar
"EMPTYLINE=aaaa

bbbb
ccc"`
    );
    const res = await context.getInputList('secrets', '', undefined, true);
    expect(res).toEqual([
      'GIT_AUTH_TOKEN=abcdefgh,ijklmno=0123456789',
      `MYSECRET=aaaaaaaa
bbbbbbb
ccccccccc`,
      'FOO=bar',
      `EMPTYLINE=aaaa

bbbb
ccc`,
    ]);
  });

  it('multiline values without quotes', async () => {
    setInput(
      'secrets',
      `GIT_AUTH_TOKEN=abcdefgh,ijklmno=0123456789
MYSECRET=aaaaaaaa
bbbbbbb
ccccccccc
FOO=bar`
    );
    const res = await context.getInputList('secrets', '', undefined, true);
    expect(res).toEqual([
      'GIT_AUTH_TOKEN=abcdefgh,ijklmno=0123456789',
      'MYSECRET=aaaaaaaa',
      'bbbbbbb',
      'ccccccccc',
      'FOO=bar',
    ]);
  });

  it('multiline values escape quotes', async () => {
    setInput(
      'secrets',
      `GIT_AUTH_TOKEN=abcdefgh,ijklmno=0123456789
"MYSECRET=aaaaaaaa
bbbb""bbb
ccccccccc"
FOO=bar`
    );
    const res = await context.getInputList('secrets', '', undefined, true);
    expect(res).toEqual([
      'GIT_AUTH_TOKEN=abcdefgh,ijklmno=0123456789',
      `MYSECRET=aaaaaaaa
bbbb\"bbb
ccccccccc`,
      'FOO=bar',
    ]);
  });
});

function setInput(name: string, value: string): void {
  process.env[getPosixName(name)] = value;
}
