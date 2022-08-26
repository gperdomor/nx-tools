import { Context } from '@actions/github/lib/context';
import mockedEnv, { RestoreFn } from 'mocked-env';
import { RunnerContext } from '../interfaces';
import * as github from './github';

jest.mock('./github', () => {
  const actualModule = jest.requireActual('./github');
  return {
    __esModule: true,
    ...actualModule,
    context: jest.fn(() => Promise.resolve(new Context())),
  };
});

jest.mock('@actions/github', () => {
  const actualModule = jest.requireActual('@actions/github');
  return {
    __esModule: true,
    ...actualModule,
    context: jest.fn(() => Promise.resolve(new Context())),
    getOctokit: jest.fn(() => ({
      rest: {
        repos: {
          get: jest.fn(() => ({
            data: {
              default_branch: 'main',
              description: 'Nx Tools',
              html_url: 'https://github.com/gperdomor/nx-tools',
              license: 'MIT',
              name: 'nx-tools',
            },
          })),
        },
      },
    })),
  };
});

describe('GitHub Context', () => {
  let restore: RestoreFn;
  let context: RunnerContext;

  beforeEach(() => {
    restore = mockedEnv(
      {
        GITHUB_ACTIONS: 'true',
        GITHUB_EVENT_NAME: 'github-event-name',
        GITHUB_SHA: 'github-sha',
        GITHUB_REF: 'github-ref',
        GITHUB_ACTOR: 'github-actor',
        GITHUB_JOB: 'github-job',
        GITHUB_RUN_NUMBER: '20',
        GITHUB_RUN_ID: '200',
      },
      { clear: true }
    );
  });

  afterEach(() => {
    restore();
  });

  describe('context', () => {
    it('Should be take proper context values', async () => {
      context = await github.context();

      expect(context).toMatchObject({
        actor: 'github-actor',
        eventName: 'github-event-name',
        job: 'github-job',
        ref: 'github-ref',
        runId: 200,
        runNumber: 20,
        sha: 'github-sha',
      });
    });
  });

  describe('repo', () => {
    it('Should throws if not token provided', async () => {
      await expect(github.repo()).rejects.toThrow('Missing github token');
    });

    it('Should be take proper repo values', async () => {
      const repo = await github.repo('FAKE_TOKEN');

      expect(repo).toMatchObject({
        default_branch: 'main',
        description: 'Nx Tools',
        html_url: 'https://github.com/gperdomor/nx-tools',
        license: 'MIT',
        name: 'nx-tools',
      });
    });
  });
});
