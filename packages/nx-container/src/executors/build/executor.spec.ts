import { RepoMetadata } from '@nx-tools/ci-context';
import mockedEnv, { RestoreFn } from 'mocked-env';
import * as path from 'node:path';
import { run } from './executor';
import { DockerBuildSchema } from './schema';

const options: DockerBuildSchema = {
  push: false,
  file: 'packages/nx-container/tests/Dockerfile',
  load: true,
  tags: ['registry/node:latest'],
  metadata: {
    images: ['app/name'],
    tags: ['type=sha'],
  },
};

jest.setTimeout(60 * 1000);

jest.mock('@nx-tools/ci-context', () => {
  const originalModule = jest.requireActual('@nx-tools/ci-context');
  return {
    __esModule: true,
    ...originalModule,
    RepoProxyFactory: {
      ...originalModule.RepoProxyFactory,
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      create: jest.fn(() => <Promise<RepoMetadata>>require(path.join(__dirname, 'fixtures', 'repo.json'))),
    },
  };
});

describe('Build Executor', () => {
  let restore: RestoreFn;

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
  });

  afterEach(() => {
    jest.restoreAllMocks();
    restore();
  });

  it('can run', async () => {
    const output = await run(options);
    expect(output.success).toBe(true);
  });
});
