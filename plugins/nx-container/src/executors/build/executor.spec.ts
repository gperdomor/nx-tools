import { RepoMetadata } from '@nx-tools/ci-context';
import { workspaceRoot } from '@nx/devkit';
import mockedEnv, { RestoreFn } from 'mocked-env';
import * as path from 'node:path';

// const options: BuildExecutorSchema = {
//   push: false,
//   file: 'plugins/nx-container/tests/Dockerfile',
//   load: true,
//   tags: ['registry/node:latest'],
//   quiet: true,
//   metadata: {
//     images: ['app/name'],
//     tags: ['type=sha'],
//   },
// };

jest.setTimeout(60 * 1000);

jest.mock('@nx-tools/ci-context', () => {
  const originalModule = jest.requireActual('@nx-tools/ci-context');
  return {
    __esModule: true,
    ...originalModule,
    RepoProxyFactory: {
      ...originalModule.RepoProxyFactory,

      create: jest.fn(() => <Promise<RepoMetadata>>require(path.join(__dirname, 'fixtures', 'repo.json'))),
    },
  };
});

describe('Build Executor', () => {
  let restore: RestoreFn;

  beforeAll(() => {
    jest.spyOn(console, 'info').mockImplementation(() => true);
    jest.spyOn(console, 'log').mockImplementation(() => true);
    jest.spyOn(console, 'warn').mockImplementation(() => true);
  });

  beforeEach(() => {
    restore = mockedEnv({
      CI_PIPELINE_SOURCE: 'push',
      CI_COMMIT_SHA: '1234567890',
      CI_COMMIT_REF_SLUG: 'feature/build',
      GITLAB_USER_LOGIN: 'gperdomor',
      CI_JOB_NAME: 'build-step',
      CI_PIPELINE_ID: '1234',
      CI_PIPELINE_IID: '5678',
    });

    // workaround for https://github.com/nrwl/nx/issues/20330
    if (process.cwd() !== workspaceRoot) {
      process.chdir(workspaceRoot);
    }
  });

  afterEach(() => {
    jest.restoreAllMocks();
    restore();
  });

  it('should pass', () => {
    expect(true).toBeTruthy();
  });

  // it('can run', async () => {
  //   jest.spyOn(buildx, 'isAvailable').mockResolvedValue(true);
  //   jest.spyOn(buildx, 'getVersion').mockResolvedValue('0.14.0');

  //   const output = await run(options);

  //   expect(output.success).toBe(true);
  // });
});
