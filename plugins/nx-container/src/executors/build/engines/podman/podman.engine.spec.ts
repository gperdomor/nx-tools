import fs from 'node:fs';
import path from 'node:path';
import * as context from '../../context';
import { setInput } from '../../context.spec';
import { Podman } from './podman.engine';

jest.setTimeout(10000);

jest.mock('../../context', () => {
  const originalModule = jest.requireActual('../../context');
  return {
    __esModule: true,
    ...originalModule,
    defaultContext: jest.fn(() => 'https://github.com/docker/build-push-action.git#refs/heads/test-jest'),
    tmpDir: jest.fn(() => {
      const tmpDir = path.join('/tmp/.docker-build-push-jest').split(path.sep).join(path.posix.sep);
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      return tmpDir;
    }),
    tmpNameSync: jest.fn(() =>
      path.join('/tmp/.docker-build-push-jest', '.tmpname-jest').split(path.sep).join(path.posix.sep)
    ),
  };
});

describe('Podman Engine', () => {
  let adapter: Podman;

  beforeEach(() => {
    adapter = new Podman();
  });

  beforeAll(() => {
    jest.spyOn(console, 'info').mockImplementation(() => true);
    jest.spyOn(console, 'log').mockImplementation(() => true);
    jest.spyOn(console, 'warn').mockImplementation(() => true);
  });

  describe('getArgs', () => {
    beforeEach(() => {
      process.env = Object.keys(process.env).reduce<NodeJS.ProcessEnv>((object, key) => {
        if (!key.startsWith('INPUT_')) {
          object[key] = process.env[key];
        }
        return object;
      }, {});
    });

    // prettier-ignore
    test.each([
    [
      0,
      '0.4.1',
      new Map<string, string>([
        ['context', '.'],
        ['load', 'false'],
        ['no-cache', 'false'],
        ['push', 'false'],
        ['pull', 'false'],
      ]),
      [
        'build',
        '--iidfile', '/tmp/.docker-build-push-jest/iidfile',
        '.'
      ]
    ],
    [
      1,
      '3.1.0',
      new Map<string, string>([
        ['build-args', 'MY_ARG=val1,val2,val3\nARG=val'],
        ['load', 'false'],
        ['no-cache', 'false'],
        ['push', 'false'],
        ['pull', 'false'],
      ]),
      [
        'build',
        '--build-arg', 'MY_ARG=val1,val2,val3',
        '--build-arg', 'ARG=val',
        '--iidfile', '/tmp/.docker-build-push-jest/iidfile',
        'https://github.com/docker/build-push-action.git#refs/heads/test-jest'
      ]
    ],
    [
      2,
      '3.1.0',
      new Map<string, string>([
        ['tags', 'name/app:7.4, name/app:latest'],
        ['load', 'false'],
        ['no-cache', 'false'],
        ['push', 'false'],
        ['pull', 'false'],
      ]),
      [
        'build',
        '--iidfile', '/tmp/.docker-build-push-jest/iidfile',
        '--tag', 'name/app:7.4',
        '--tag', 'name/app:latest',
        'https://github.com/docker/build-push-action.git#refs/heads/test-jest'
      ]
    ],
    [
      3,
      '3.1.0',
      new Map<string, string>([
        ['context', '.'],
        ['labels', 'org.opencontainers.image.title=buildkit\norg.opencontainers.image.description=concurrent, cache-efficient, and Dockerfile-agnostic builder toolkit'],
        ['outputs', 'type=local,dest=./release-out'],
        ['load', 'false'],
        ['no-cache', 'false'],
        ['push', 'false'],
        ['pull', 'false'],
      ]),
      [
        'build',
        '--label', 'org.opencontainers.image.title=buildkit',
        '--label', 'org.opencontainers.image.description=concurrent, cache-efficient, and Dockerfile-agnostic builder toolkit',
        '--output', 'type=local,dest=./release-out',
        '.'
      ]
    ],
    [
      4,
      '0.4.1',
      new Map<string, string>([
        ['context', '.'],
        ['platforms', 'linux/amd64,linux/arm64'],
        ['load', 'false'],
        ['no-cache', 'false'],
        ['push', 'false'],
        ['pull', 'false'],
      ]),
      [
        'build',
        '--platform', 'linux/amd64,linux/arm64',
        '.'
      ]
    ],
    [
      5,
      '0.4.1',
      new Map<string, string>([
        ['context', '.'],
        ['load', 'false'],
        ['no-cache', 'false'],
        ['push', 'false'],
        ['pull', 'false'],
      ]),
      [
        'build',
        '--iidfile', '/tmp/.docker-build-push-jest/iidfile',
        '.'
      ]
    ],
    [
      6,
      '3.1.0',
      new Map<string, string>([
        ['context', '.'],
        ['secrets', 'GIT_AUTH_TOKEN=abcdefghijklmno=0123456789'],
        ['load', 'false'],
        ['no-cache', 'false'],
        ['push', 'false'],
        ['pull', 'false'],
      ]),
      [
        'build',
        '--iidfile', '/tmp/.docker-build-push-jest/iidfile',
        '--secret', 'id=GIT_AUTH_TOKEN,src=/tmp/.docker-build-push-jest/.tmpname-jest',
        '.'
      ]
    ],
    [
      7,
      '3.1.0',
      new Map<string, string>([
        ['github-token', 'abcdefghijklmno0123456789'],
        ['outputs', '.'],
        ['load', 'false'],
        ['no-cache', 'false'],
        ['push', 'false'],
        ['pull', 'false'],
      ]),
      [
        'build',
        '--output', '.',
        '--secret', 'id=GIT_AUTH_TOKEN,src=/tmp/.docker-build-push-jest/.tmpname-jest',
        'https://github.com/docker/build-push-action.git#refs/heads/test-jest'
      ]
    ],
    [
      8,
      '3.1.0',
      new Map<string, string>([
        ['context', 'https://github.com/docker/build-push-action.git#refs/heads/master'],
        ['tag', 'localhost:5000/name/app:latest'],
        ['platforms', 'linux/amd64,linux/arm64'],
        ['secrets', 'GIT_AUTH_TOKEN=abcdefghijklmno=0123456789'],
        ['file', './test/Dockerfile'],
        ['builder', 'builder-git-context-2'],
        ['load', 'false'],
        ['no-cache', 'false'],
        ['push', 'true'],
        ['pull', 'false'],
      ]),
      [
        'build',
        '--file', './test/Dockerfile',
        '--iidfile', '/tmp/.docker-build-push-jest/iidfile',
        '--platform', 'linux/amd64,linux/arm64',
        '--secret', 'id=GIT_AUTH_TOKEN,src=/tmp/.docker-build-push-jest/.tmpname-jest',
        // '--builder', 'builder-git-context-2',
        // '--push',
        'https://github.com/docker/build-push-action.git#refs/heads/master'
      ]
    ],
    [
      9,
      '3.1.0',
      new Map<string, string>([
        ['context', 'https://github.com/docker/build-push-action.git#refs/heads/master'],
        ['tag', 'localhost:5000/name/app:latest'],
        ['platforms', 'linux/amd64,linux/arm64'],
        ['secrets', `GIT_AUTH_TOKEN=abcdefghi,jklmno=0123456789
"MYSECRET=aaaaaaaa
bbbbbbb
ccccccccc"
FOO=bar
"EMPTYLINE=aaaa

bbbb
ccc"`],
        ['file', './test/Dockerfile'],
        ['builder', 'builder-git-context-2'],
        ['load', 'false'],
        ['no-cache', 'false'],
        ['push', 'true'],
        ['pull', 'false'],
      ]),
      [
        'build',
        '--file', './test/Dockerfile',
        '--iidfile', '/tmp/.docker-build-push-jest/iidfile',
        '--platform', 'linux/amd64,linux/arm64',
        '--secret', 'id=GIT_AUTH_TOKEN,src=/tmp/.docker-build-push-jest/.tmpname-jest',
        '--secret', 'id=MYSECRET,src=/tmp/.docker-build-push-jest/.tmpname-jest',
        '--secret', 'id=FOO,src=/tmp/.docker-build-push-jest/.tmpname-jest',
        '--secret', 'id=EMPTYLINE,src=/tmp/.docker-build-push-jest/.tmpname-jest',
        // '--builder', 'builder-git-context-2',
        // '--push',
        'https://github.com/docker/build-push-action.git#refs/heads/master'
      ]
    ],
    [
      10,
      '3.1.0',
      new Map<string, string>([
        ['context', 'https://github.com/docker/build-push-action.git#refs/heads/master'],
        ['tag', 'localhost:5000/name/app:latest'],
        ['platforms', 'linux/amd64,linux/arm64'],
        ['secrets', `GIT_AUTH_TOKEN=abcdefghi,jklmno=0123456789
MYSECRET=aaaaaaaa
bbbbbbb
ccccccccc
FOO=bar
EMPTYLINE=aaaa

bbbb
ccc`],
        ['file', './test/Dockerfile'],
        ['builder', 'builder-git-context-2'],
        ['load', 'false'],
        ['no-cache', 'false'],
        ['push', 'true'],
        ['pull', 'false'],
      ]),
      [
        'build',
        '--file', './test/Dockerfile',
        '--iidfile', '/tmp/.docker-build-push-jest/iidfile',
        '--platform', 'linux/amd64,linux/arm64',
        '--secret', 'id=GIT_AUTH_TOKEN,src=/tmp/.docker-build-push-jest/.tmpname-jest',
        '--secret', 'id=MYSECRET,src=/tmp/.docker-build-push-jest/.tmpname-jest',
        '--secret', 'id=FOO,src=/tmp/.docker-build-push-jest/.tmpname-jest',
        '--secret', 'id=EMPTYLINE,src=/tmp/.docker-build-push-jest/.tmpname-jest',
        // '--builder', 'builder-git-context-2',
        // '--push',
        'https://github.com/docker/build-push-action.git#refs/heads/master'
      ]
    ],
    [
      11,
      '3.1.0',
      new Map<string, string>([
        ['context', 'https://github.com/docker/build-push-action.git#refs/heads/master'],
        ['tag', 'localhost:5000/name/app:latest'],
        ['secret-files', `MY_SECRET=${path.join(__dirname, '..', '..', 'fixtures', 'secret.txt').split(path.sep).join(path.posix.sep)}`],
        ['file', './test/Dockerfile'],
        ['builder', 'builder-git-context-2'],
        ['network', 'host'],
        ['load', 'false'],
        ['no-cache', 'false'],
        ['push', 'true'],
        ['pull', 'false'],
      ]),
      [
        'build',
        '--file', './test/Dockerfile',
        '--iidfile', '/tmp/.docker-build-push-jest/iidfile',
        '--secret', 'id=MY_SECRET,src=/tmp/.docker-build-push-jest/.tmpname-jest',
        // '--builder', 'builder-git-context-2',
        '--network', 'host',
        // '--push',
        'https://github.com/docker/build-push-action.git#refs/heads/master'
      ]
    ],
    [
      12,
      '3.1.0',
      new Map<string, string>([
        ['context', '.'],
        ['labels', 'org.opencontainers.image.title=filter_results_top_n\norg.opencontainers.image.description=Reference implementation of operation "filter results (top-n)"'],
        ['outputs', 'type=local,dest=./release-out'],
        ['load', 'false'],
        ['no-cache', 'false'],
        ['push', 'false'],
        ['pull', 'false'],
      ]),
      [
        'build',
        '--label', 'org.opencontainers.image.title=filter_results_top_n',
        '--label', 'org.opencontainers.image.description=Reference implementation of operation "filter results (top-n)"',
        '--output', 'type=local,dest=./release-out',
        '.'
      ]
    ],
    [
      13,
      '0.6.0',
      new Map<string, string>([
        ['context', '.'],
        ['tag', 'localhost:5000/name/app:latest'],
        ['file', './test/Dockerfile'],
        ['add-hosts', 'docker:10.180.0.1,foo:10.0.0.1'],
        ['network', 'host'],
        ['load', 'false'],
        ['no-cache', 'false'],
        ['push', 'true'],
        ['pull', 'false'],
      ]),
      [
        'build',
        '--add-host', 'docker:10.180.0.1',
        '--add-host', 'foo:10.0.0.1',
        '--file', './test/Dockerfile',
        '--iidfile', '/tmp/.docker-build-push-jest/iidfile',
        // '--metadata-file', '/tmp/.docker-build-push-jest/metadata-file',
        '--network', 'host',
        // '--push',
        '.'
      ]
    ],
    [
      14,
      '0.7.0',
      new Map<string, string>([
        ['context', '.'],
        ['file', './test/Dockerfile'],
        ['add-hosts', 'docker:10.180.0.1\nfoo:10.0.0.1'],
        ['cgroup-parent', 'foo'],
        ['shm-size', '2g'],
        ['ulimit', `nofile=1024:1024
nproc=3`],
        ['load', 'false'],
        ['no-cache', 'false'],
        ['push', 'false'],
        ['pull', 'false'],
      ]),
      [
        'build',
        '--add-host', 'docker:10.180.0.1',
        '--add-host', 'foo:10.0.0.1',
        '--cgroup-parent', 'foo',
        '--file', './test/Dockerfile',
        '--iidfile', '/tmp/.docker-build-push-jest/iidfile',
        '--shm-size', '2g',
        '--ulimit', 'nofile=1024:1024',
        '--ulimit', 'nproc=3',
        // '--metadata-file', '/tmp/.docker-build-push-jest/metadata-file',
        '.'
      ]
    ],
    [
      15,
      '0.7.0',
      new Map<string, string>([
        ['context', '{{defaultContext}}:docker'],
        ['load', 'false'],
        ['no-cache', 'false'],
        ['push', 'false'],
        ['pull', 'false'],
      ]),
      [
        'build',
        '--iidfile', '/tmp/.docker-build-push-jest/iidfile',
        // '--metadata-file', '/tmp/.docker-build-push-jest/metadata-file',
        'https://github.com/docker/build-push-action.git#refs/heads/test-jest:docker'
      ]
    ],
    [
      16,
      '0.8.2',
      new Map<string, string>([
        ['github-token', 'abcdefghijklmno0123456789'],
        ['context', '{{defaultContext}}:subdir'],
        ['load', 'false'],
        ['no-cache', 'false'],
        ['push', 'false'],
        ['pull', 'false'],
      ]),
      [
        'build',
        '--iidfile', '/tmp/.docker-build-push-jest/iidfile',
        '--secret', 'id=GIT_AUTH_TOKEN,src=/tmp/.docker-build-push-jest/.tmpname-jest',
        // '--metadata-file', '/tmp/.docker-build-push-jest/metadata-file',
        'https://github.com/docker/build-push-action.git#refs/heads/test-jest:subdir'
      ]
    ]
  ])(
    '[%d] given %p with %p as inputs, returns %p',
    async (num: number, podmanVersion: string, inputs: Map<string, string>, expected: Array<string>) => {
      jest.spyOn(adapter, "getPodmanVersion").mockReturnValue(podmanVersion)

      inputs.forEach((value: string, name: string) => {
        setInput(name, value);
      });
      const defContext = context.defaultContext();
      const inp = await context.getInputs(defContext, {});
      const res = await adapter.getArgs(inp, defContext);
      expect(res).toEqual(expected);
    }
  );
  });
});
