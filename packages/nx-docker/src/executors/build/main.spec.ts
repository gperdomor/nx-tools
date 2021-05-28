import { MetaMode } from './context';
import executor from './main';
import { BuildExecutorSchema } from './schema';

const options: BuildExecutorSchema = {
  push: false,
  file: 'packages/nx-docker/tests/Dockerfile',
  load: true,
  tags: ['nx-docker/node:latest'],
  meta: {
    enabled: true,
    mode: MetaMode.prepend,
    images: ['app/name'],
    tags: ['type=sha'],
  },
};

jest.setTimeout(60 * 1000);

describe('Build Executor', () => {
  const env: NodeJS.ProcessEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...env,
      CI_PIPELINE_SOURCE: 'push',
      CI_COMMIT_SHA: '1234567890',
      CI_COMMIT_REF_SLUG: 'feature/build',
      GITLAB_USER_LOGIN: 'gperdomor',
      CI_JOB_NAME: 'build-step',
      CI_PIPELINE_ID: '1234',
      CI_PIPELINE_IID: '5678',
    };
  });

  afterEach(() => {
    process.env = env; // Restore old environment
  });

  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
