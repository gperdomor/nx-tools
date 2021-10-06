import { RepoMetadata, RepoProxyFactory } from '@nx-tools/ci-context';
import mockedEnv, { RestoreFn } from 'mocked-env';
import * as path from 'path';
import executor from './executor';
import { DockerBuildSchema } from './schema';

const options: DockerBuildSchema = {
  push: false,
  file: 'packages/nx-docker/tests/Dockerfile',
  load: true,
  tags: ['nx-docker/node:latest'],
  metadata: {
    images: ['app/name'],
    tags: ['type=sha'],
  },
};

jest.setTimeout(60 * 1000);

jest.spyOn(RepoProxyFactory, 'create').mockImplementation((): Promise<RepoMetadata> => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return <Promise<RepoMetadata>>require(path.join(__dirname, 'fixtures', 'repo.json'));
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
    restore();
  });

  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
