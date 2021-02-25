import { getRunnerProvider } from './ci';
import { RunnerProvider } from './runner-provider.enum';

describe('CI', () => {
  let env: NodeJS.ProcessEnv;

  beforeEach(() => {
    env = process.env;
    process.env = {};
  });

  afterEach(() => {
    process.env = env;
  });

  describe('getRunnerProvider', () => {
    describe('When is GitLabCI', () => {
      beforeEach(() => {
        process.env.GITLAB_CI = 'true';
      });

      it('Should return GitLab context', () => {
        expect(getRunnerProvider()).toEqual(RunnerProvider.GITLAB);
      });
    });

    describe('When is GitHub Actions', () => {
      beforeEach(() => {
        process.env.GITHUB_ACTIONS = 'true';
      });

      it('Should return GitHub context', () => {
        expect(getRunnerProvider()).toEqual(RunnerProvider.GITHUB_ACTIONS);
      });
    });

    describe('When is Circle CI', () => {
      beforeEach(() => {
        process.env.CIRCLECI = 'true';
      });

      it('Should return Circle context', () => {
        expect(getRunnerProvider()).toEqual(RunnerProvider.CIRCLE);
      });
    });

    describe('When is local', () => {
      beforeEach(() => {
        process.env.PATH = 'true';
      });

      it('Should return local context', () => {
        expect(getRunnerProvider()).toEqual(RunnerProvider.LOCAL_MACHINE);
      });
    });

    describe('When is unknown', () => {
      it('Should throw error', () => {
        expect(getRunnerProvider()).toBeUndefined();
      });
    });
  });
});
