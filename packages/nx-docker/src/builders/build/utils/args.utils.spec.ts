import { BuildOptions, Git, Login } from '../interfaces';
import { getBuildArgs, getLoginArgs } from './args.utils';

describe('Arguments Helpers', () => {
  describe('getLoginArgs', () => {
    describe('when registry exists', () => {
      it('should include registry in result', async () => {
        const login: Login = {
          username: 'demo',
          password: 'secret',
        };
        const expected = ['--username', 'demo', '--password', 'secret', 'registry.gitlab.com'];

        expect(expected).toEqual(getLoginArgs(login, 'registry.gitlab.com'));
      });
    });

    describe('otherwise', () => {
      it('should not include registry in result', async () => {
        const login: Login = {
          username: 'demo',
          password: 'secret',
        };
        const expected = ['--username', 'demo', '--password', 'secret'];

        expect(expected).toEqual(getLoginArgs(login));
      });
    });
  });

  describe('getBuildArgs', () => {
    const git: Git = {
      reference: { type: 1, name: 'feature/test' },
      sha: '1234567890',
      repository: 'https://github.com/gperdomor/nx-docker',
    };

    let buildOptions: BuildOptions;

    beforeEach(() => {
      buildOptions = {
        path: '.',
        dockerfile: 'apps/example-app/Dockerfile',
        addGitLabels: false,
        target: undefined,
        alwaysPull: false,
        cacheFroms: [],
        buildArgs: [],
        labels: [],
      };
    });

    describe('tags option', () => {
      it('should include tags if tags exists', () => {
        const tags = ['master', 'latest'];
        const expected = [
          '--progress',
          'plain',
          '-t',
          'master',
          '-t',
          'latest',
          '--file',
          'apps/example-app/Dockerfile',
          '.',
        ];

        expect(getBuildArgs(buildOptions, git, tags)).toEqual(expected);
      });
    });

    describe('labels option', () => {
      it('should include labels if labels exists', () => {
        buildOptions.labels = ['l1', 'l2'];
        const expected = [
          '--progress',
          'plain',
          '--label',
          'l1',
          '--label',
          'l2',
          '--file',
          'apps/example-app/Dockerfile',
          '.',
        ];

        expect(getBuildArgs(buildOptions, git, [])).toEqual(expected);
      });
    });

    describe('dockerfile option', () => {
      it('should include dockerfile if exists', () => {
        const expected = ['--progress', 'plain', '--file', 'apps/example-app/Dockerfile', '.'];

        expect(getBuildArgs(buildOptions, git, [])).toEqual(expected);
      });

      it('should not include dockerfile if not exists', () => {
        buildOptions.dockerfile = undefined;
        const expected = ['--progress', 'plain', '.'];

        expect(getBuildArgs(buildOptions, git, [])).toEqual(expected);
      });
    });

    describe('target option', () => {
      it('should include --target if target exists', () => {
        buildOptions.target = 'development';
        const expected = [
          '--progress',
          'plain',
          '--file',
          'apps/example-app/Dockerfile',
          '--target',
          'development',
          '.',
        ];

        expect(getBuildArgs(buildOptions, git, [])).toEqual(expected);
      });
    });

    describe('alwaysPull option', () => {
      it('should include --pull if alwaysPull=true', () => {
        buildOptions.alwaysPull = true;
        const expected = ['--progress', 'plain', '--file', 'apps/example-app/Dockerfile', '--pull', '.'];

        expect(getBuildArgs(buildOptions, git, [])).toEqual(expected);
      });
    });

    describe('cacheFrom option', () => {
      it('should include --cache-from if cacheFrom exists', () => {
        buildOptions.cacheFroms = ['cache1', 'cache2'];
        const expected = [
          '--progress',
          'plain',
          '--file',
          'apps/example-app/Dockerfile',
          '--cache-from',
          'cache1',
          '--cache-from',
          'cache2',
          '.',
        ];

        expect(getBuildArgs(buildOptions, git, [])).toEqual(expected);
      });
    });

    describe('buildArg option', () => {
      it('should include --build-arg if buildArg exists', () => {
        buildOptions.buildArgs = ['arg1', 'arg2'];
        const expected = [
          '--progress',
          'plain',
          '--file',
          'apps/example-app/Dockerfile',
          '--build-arg',
          'arg1',
          '--build-arg',
          'arg2',
          '.',
        ];

        expect(getBuildArgs(buildOptions, git, [])).toEqual(expected);
      });
    });
  });
});
