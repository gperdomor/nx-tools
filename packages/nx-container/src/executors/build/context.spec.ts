import { getPosixName } from '@nx-tools/core';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as context from './context';

const pgp = `-----BEGIN PGP PRIVATE KEY BLOCK-----

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
PejgXO0uIRolYQ3sz2tMGhx1MfBqH64=
=WbwB
-----END PGP PRIVATE KEY BLOCK-----`;

vi.mock('./context', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('./context')>()),
    defaultContext: vi.fn(() => 'https://github.com/docker/build-push-action.git#refs/heads/test-jest'),
    tmpDir: vi.fn(() => {
      const tmpDir = path.join('/tmp/.docker-build-push-jest').split(path.sep).join(path.posix.sep);
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      return tmpDir;
    }),
    tmpNameSync: vi.fn(() =>
      path.join('/tmp/.docker-build-push-jest', '.tmpname-jest').split(path.sep).join(path.posix.sep),
    ),
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
FOO=bar`,
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
ccc"`,
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
FOO=bar`,
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

  it('large multiline values', async () => {
    setInput(
      'secrets',
      `"GPG_KEY=${pgp}"
FOO=bar`,
    );
    const res = await context.getInputList('secrets', '', undefined, true);
    expect(res).toEqual([`GPG_KEY=${pgp}`, 'FOO=bar']);
  });

  it('multiline values escape quotes', async () => {
    setInput(
      'secrets',
      `GIT_AUTH_TOKEN=abcdefgh,ijklmno=0123456789
"MYSECRET=aaaaaaaa
bbbb""bbb
ccccccccc"
FOO=bar`,
    );
    const res = await context.getInputList('secrets', '', undefined, true);
    expect(res).toEqual([
      'GIT_AUTH_TOKEN=abcdefgh,ijklmno=0123456789',
      `MYSECRET=aaaaaaaa
bbbb"bbb
ccccccccc`,
      'FOO=bar',
    ]);
  });
});

export function setInput(name: string, value: string): void {
  process.env[getPosixName(name)] = value;
}
