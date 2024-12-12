import { logger } from '@nx-tools/core';
import { mockConsole } from '../test-utils.spec';
import { Flavor, Transform } from './flavor';

describe('transform', () => {
  beforeAll(() => {
    mockConsole();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  // prettier-ignore
  test.each([
    [
      [
        `randomstr`,
        `latest=auto`
      ],
      {} as Flavor,
      true
    ],
    [
      [
        `unknwown=foo`
      ],
      {} as Flavor,
      true
    ],
    [
      [
        `latest`,
      ],
      {} as Flavor,
      true
    ],
    [
      [
        `latest=true`
      ],
      {
        latest: "true",
        prefix: "",
        prefixLatest: false,
        suffix: "",
        suffixLatest: false,
      } as Flavor,
      false
    ],
    [
      [
        `latest=false`
      ],
      {
        latest: "false",
        prefix: "",
        prefixLatest: false,
        suffix: "",
        suffixLatest: false,
      } as Flavor,
      false
    ],
    [
      [
        `latest=auto`
      ],
      {
        latest: "auto",
        prefix: "",
        prefixLatest: false,
        suffix: "",
        suffixLatest: false,
      } as Flavor,
      false
    ],
    [
      [
        `latest=foo`
      ],
      {} as Flavor,
      true
    ],
    [
      [
        `prefix=sha-`
      ],
      {
        latest: "auto",
        prefix: "sha-",
        prefixLatest: false,
        suffix: "",
        suffixLatest: false,
      } as Flavor,
      false
    ],
    [
      [
        `suffix=-alpine`
      ],
      {
        latest: "auto",
        prefix: "",
        prefixLatest: false,
        suffix: "-alpine",
        suffixLatest: false,
      } as Flavor,
      false
    ],
    [
      [
        `latest=false`,
        `prefix=dev-`,
        `suffix=-alpine`
      ],
      {
        latest: "false",
        prefix: "dev-",
        prefixLatest: false,
        suffix: "-alpine",
        suffixLatest: false,
      } as Flavor,
      false
    ],
    [
      [
        `prefix=dev-,onlatest=true`,
      ],
      {
        latest: "auto",
        prefix: "dev-",
        prefixLatest: true,
        suffix: "",
        suffixLatest: false,
      } as Flavor,
      false
    ],
    [
      [
        `suffix=-alpine,onlatest=true`,
      ],
      {
        latest: "auto",
        prefix: "",
        prefixLatest: false,
        suffix: "-alpine",
        suffixLatest: true,
      } as Flavor,
      false
    ],
    [
      [
        `prefix=dev-,onlatest=true`,
        `suffix=-alpine,onlatest=true`,
      ],
      {
        latest: "auto",
        prefix: "dev-",
        prefixLatest: true,
        suffix: "-alpine",
        suffixLatest: true,
      } as Flavor,
      false
    ],
    [
      [
        `prefix= `,
      ],
      {
        latest: "auto",
        prefix: "",
        prefixLatest: false,
        suffix: "",
        suffixLatest: false,
      } as Flavor,
      false
    ]
  ])('given %p attributes', async (inputs: string[], expected: Flavor, invalid: boolean) => {
    try {
      const flavor = Transform(inputs, logger);
      expect(flavor).toEqual(expected);
    } catch (err) {
      if (!invalid) {
        console.error(err);
      }
      expect(true).toBe(invalid);
    }
  });
});
