import mockedEnv, { RestoreFn } from 'mocked-env';
import { interpolate } from './interpolate';

describe('String interpolation', () => {
  let restore: RestoreFn;

  beforeAll(() => {
    restore = mockedEnv({
      TAG1: 'main',
      TAG2: '1.0.0',
      SUFFIX: '-beta.1',
    });
  });

  afterAll(() => {
    restore();
  });

  test.each([
    [
      'docker build --tag nx-docker/node:$TAG1 --tag nx-docker/node:$TAG2',
      'docker build --tag nx-docker/node:main --tag nx-docker/node:1.0.0',
    ],
    [
      'docker build --tag nx-docker/node:$TAG1 --tag nx-docker/node:$T3',
      'docker build --tag nx-docker/node:main --tag nx-docker/node:$T3',
    ],
    [
      'docker build --tag nx-docker/node:$TAG1 --tag nx-docker/node:$TAG2$SUFFIX',
      'docker build --tag nx-docker/node:main --tag nx-docker/node:1.0.0-beta.1',
    ],
  ])('given command "%s", should return "%s"', (command: string, expected: string) => {
    expect(interpolate(command)).toEqual(expected);
  });
});
