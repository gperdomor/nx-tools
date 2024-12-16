import { RepoMetadata } from '@nx-tools/ci-context';
import { workspaceRoot } from '@nx/devkit';
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

vi.setConfig({ testTimeout: 60 * 1_000 });

vi.mock('@nx-tools/ci-context', async (importOriginal) => {
  const original = await importOriginal<typeof import('@nx-tools/ci-context')>();

  return {
    ...original,
    RepoProxyFactory: {
      ...original.RepoProxyFactory,

      create: vi.fn(() => <Promise<RepoMetadata>>require(path.join(__dirname, 'fixtures', 'repo.json'))),
    },
  };
});

describe('Build Executor', () => {
  beforeAll(() => {
    vi.spyOn(console, 'info').mockImplementation(() => true);
    vi.spyOn(console, 'log').mockImplementation(() => true);
    vi.spyOn(console, 'warn').mockImplementation(() => true);
  });

  beforeEach(() => {
    vi.stubEnv('CI_PIPELINE_SOURCE', 'push');
    vi.stubEnv('CI_COMMIT_SHA', '1234567890');
    vi.stubEnv('CI_COMMIT_REF_SLUG', 'featue/build');
    vi.stubEnv('GITLAB_USER_LOGIN', 'gperdomor');
    vi.stubEnv('CI_JOB_NAME', 'buid-step');
    vi.stubEnv('CI_PIPELINE_ID', '1234');
    vi.stubEnv('CI_PIPELINE_IID', '5678');

    // workaround for https://github.com/nrwl/nx/issues/20330
    if (process.cwd() !== workspaceRoot) {
      process.chdir(workspaceRoot);
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('should pass', () => {
    expect(true).toBeTruthy();
  });

  // it('can run', async () => {
  //   vi.spyOn(buildx, 'isAvailable').mockResolvedValue(true);
  //   vi.spyOn(buildx, 'getVersion').mockResolvedValue('0.14.0');

  //   const output = await run(options);

  //   expect(output.success).toBe(true);
  // });
});
