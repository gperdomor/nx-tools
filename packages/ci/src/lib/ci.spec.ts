import { getRunnerProvider } from './ci';
import { RunnerProvider } from './runner-provider.enum';

describe('CI', () => {
  let env: NodeJS.ProcessEnv;
  describe('getRunnerProvider', () => {
    beforeEach(() => {
      env = process.env;
      process.env = {};
    });

    afterEach(() => {
      process.env = env;
    });

    describe('When is GitLabCI', () => {
      beforeEach(() => {
        process.env.GITLAB_CI = 'true';
      });

      it('Should return gitlab', () => {
        expect(getRunnerProvider()).toEqual(RunnerProvider.GitLab);
      });
    });

    describe('When is GitHub Actions', () => {
      beforeEach(() => {
        process.env.GITHUB_ACTIONS = 'true';
      });

      it('Should return github', () => {
        expect(getRunnerProvider()).toEqual(RunnerProvider.GitHub);
      });
    });

    describe('When is local', () => {
      beforeEach(() => {
        process.env.RUN_LOCAL = 'true';
      });

      it('Should return local', () => {
        expect(getRunnerProvider()).toEqual(RunnerProvider.Local);
      });
    });

    describe('When is unknown', () => {
      it('Should throw error', () => {
        const f = () => getRunnerProvider();
        expect(f).toThrowError('Unknown runner provider');
      });
    });
  });
});
