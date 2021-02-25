import { RunnerContext } from './contexts/context';
import { GitHubContext } from './contexts/github.context';
import { GitLabContext } from './contexts/gitlab.context';
import { LocalContext } from './contexts/local.context';
import { RunnerContextProxyFactory } from './runner-context.factory';

describe('RunnerContextProxyFactory', () => {
  let context: RunnerContext;
  let env: NodeJS.ProcessEnv;

  beforeEach(() => {
    env = process.env;
    process.env = {};
  });

  afterEach(() => {
    process.env = env;
  });

  describe('When is running on GitLabCI', () => {
    beforeEach(() => {
      process.env.GITLAB_CI = 'true';
      context = RunnerContextProxyFactory.create();
    });

    it('Should return a instance of GitlabContext', () => {
      expect(context).toBeInstanceOf(GitLabContext);
    });
  });

  describe('When is running on GitHub Actions', () => {
    beforeEach(() => {
      process.env.GITHUB_ACTIONS = 'true';
      context = RunnerContextProxyFactory.create();
    });

    it('Should return a instance of GitHubContext', () => {
      expect(context).toBeInstanceOf(GitHubContext);
    });
  });

  describe('When is running on Local', () => {
    beforeEach(() => {
      process.env.PATH = 'true';
      context = RunnerContextProxyFactory.create();
    });

    it('Should return a instance of LocalContext', () => {
      expect(context).toBeInstanceOf(LocalContext);
    });
  });
});
