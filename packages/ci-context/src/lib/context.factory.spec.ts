import { ContextProxyFactory } from './context.factory';
import { CircleContext } from './contexts/circle.context';
import { CIContext } from './contexts/context';
import { GitHubContext } from './contexts/github.context';
import { GitLabContext } from './contexts/gitlab.context';
import { LocalContext } from './contexts/local.context';

describe('RunnerContextProxyFactory', () => {
  let context: CIContext;
  const env: NodeJS.ProcessEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    const { RUN_LOCAL, GITLAB_CI, CIRCLECI, GITHUB_ACTIONS, ...rest } = env;
    process.env = { ...rest };
  });

  afterAll(() => {
    process.env = env; // Restore old environment
  });

  describe('When is running on Circle CI', () => {
    beforeEach(() => {
      process.env.CIRCLECI = 'true';
      context = ContextProxyFactory.create();
    });

    it('Should return a instance of CircleContext', () => {
      expect(context).toBeInstanceOf(CircleContext);
    });
  });

  describe('When is running on GitHub Actions', () => {
    beforeEach(() => {
      process.env.GITHUB_ACTIONS = 'true';
      context = ContextProxyFactory.create();
    });

    it('Should return a instance of GitHubContext', () => {
      expect(context).toBeInstanceOf(GitHubContext);
    });
  });

  describe('When is running on GitLabCI', () => {
    beforeEach(() => {
      process.env.GITLAB_CI = 'true';
      context = ContextProxyFactory.create();
    });

    it('Should return a instance of GitlabContext', () => {
      expect(context).toBeInstanceOf(GitLabContext);
    });
  });

  describe('When is running on Local', () => {
    beforeEach(() => {
      process.env.PATH = 'true';
      context = ContextProxyFactory.create();
    });

    it('Should return a instance of LocalContext', () => {
      expect(context).toBeInstanceOf(LocalContext);
    });
  });
});
