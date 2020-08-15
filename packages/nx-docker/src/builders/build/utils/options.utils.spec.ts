/* eslint-disable @typescript-eslint/camelcase */
import { Login } from '../interfaces/login.interface';
import { BuildBuilderSchema } from '../schema';
import { getBuildOptions, getLoginOptions } from './options.utils';

describe('Options Helpers', () => {
  describe('getLoginOpts', () => {
    describe('when username and password exists', () => {
      it('should return Login', async () => {
        const options: BuildBuilderSchema = {
          repository: 'repo',
          username: 'demo',
          password: 'secret',
        };
        const expected: Login = { username: 'demo', password: 'secret' };

        expect(expected).toEqual(getLoginOptions(options));
      });
    });

    describe('otherwise', () => {
      it('should return undefined if both properties are undefined', async () => {
        const options: BuildBuilderSchema = { repository: 'repo' };
        const expected: Login = { username: undefined, password: undefined };

        expect(expected).toEqual(getLoginOptions(options));
      });

      it('should throw error if username is undefined', async () => {
        const options: BuildBuilderSchema = { repository: 'repo', password: 'pass' };

        try {
          getLoginOptions(options);
        } catch (err) {
          expect(err.message).toEqual('both username and password must be set to login');
        }
      });

      it('should throw error if password is undefined', async () => {
        const options: BuildBuilderSchema = { repository: 'repo', username: 'user' };

        try {
          getLoginOptions(options);
        } catch (err) {
          expect(err.message).toEqual('both username and password must be set to login');
        }
      });
    });
  });

  describe('getBuildOptions', () => {
    it('should parse options', () => {
      const options: BuildBuilderSchema = {
        repository: 'repo',
        path: 'some-path',
        dockerfile: 'path/to/dockerfile',
        add_git_labels: false,
        target: 'demo',
        always_pull: true,
        cache_froms: 'c1,c2,c3',
        build_args: 'b1,b2,b3',
        labels: 'l1,l2,l3',
      };

      expect(getBuildOptions(options, { root: 'path/to/project' })).toEqual({
        path: 'some-path',
        dockerfile: 'path/to/dockerfile',
        addGitLabels: false,
        target: 'demo',
        alwaysPull: true,
        cacheFroms: ['c1', 'c2', 'c3'],
        buildArgs: ['b1', 'b2', 'b3'],
        labels: ['l1', 'l2', 'l3'],
      });
    });

    it('should handle Dockerfile from root if not pass', () => {
      const options: BuildBuilderSchema = {
        repository: 'repo',
        path: 'some-path',
        dockerfile: undefined,
        add_git_labels: true,
        target: undefined,
        always_pull: false,
        cache_froms: undefined,
        build_args: undefined,
        labels: undefined,
      };

      expect(getBuildOptions(options, { root: 'path/to/project' })).toEqual({
        path: 'some-path',
        dockerfile: 'path/to/project/Dockerfile',
        addGitLabels: true,
        target: undefined,
        alwaysPull: false,
        cacheFroms: [],
        buildArgs: [],
        labels: [],
      });
    });
  });

  describe('getLabels', () => {
    it.todo('getLoginOpts');
  });
});
