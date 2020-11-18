import { getRunnerProvider } from './ci';
import { PROVIDER } from './enums';

describe('CI', () => {
  let env: NodeJS.ProcessEnv;

  describe('getProvider', () => {
    describe('When is GitLabCI', () => {
      beforeEach(() => {
        env = process.env;
        process.env.GITLAB_CI = 'true';
      });

      afterEach(() => {
        process.env = env;
        process.env.GITLAB_CI = undefined;
      });

      it('Should return gitlab', () => {
        expect(getRunnerProvider()).toEqual(PROVIDER.gitlab);
      });
    });

    describe('When is GitHub Actions', () => {
      beforeEach(() => {
        env = process.env;
        process.env.GITHUB_ACTIONS = 'true';
      });

      afterEach(() => {
        process.env = env;
        process.env.GITHUB_ACTIONS = undefined;
      });

      it('Should return github', () => {
        expect(getRunnerProvider()).toEqual(PROVIDER.github);
      });
    });

    describe('When is local', () => {
      beforeEach(() => {
        env = process.env;
        process.env.RUN_LOCAL = 'true';
      });

      afterEach(() => {
        process.env = env;
        process.env.RUN_LOCAL = undefined;
      });

      it('Should return local', () => {
        expect(getRunnerProvider()).toEqual(PROVIDER.local);
      });
    });
  });
});
