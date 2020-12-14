import executor from './executor';
import { BuildExecutorSchema } from './schema';

const options: BuildExecutorSchema = {
  push: false,
  file: 'packages/nx-docker/tests/Dockerfile',
  load: true,
  tags: ['nx-docker/node:latest'],
};

jest.setTimeout(60 * 1000);

describe('Build Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
