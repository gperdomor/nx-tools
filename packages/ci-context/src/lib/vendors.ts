export interface VendorConf {
  name: string;
  constant: string; // Enum Key
  env: string | string[] | Record<string, string>;
}

export enum Vendor {
  CIRCLE = 'CircleCI',
  GITHUB_ACTIONS = 'GitHub Actions',
  GITLAB = 'GitLab CI',
  LOCAL_MACHINE = 'Local Machine',
}

export const vendors: VendorConf[] = [
  {
    name: 'CircleCI',
    constant: 'CIRCLE',
    env: 'CIRCLECI',
  },
  {
    name: 'GitHub Actions',
    constant: 'GITHUB_ACTIONS',
    env: 'GITHUB_ACTIONS',
  },
  {
    name: 'GitLab CI',
    constant: 'GITLAB',
    env: 'GITLAB_CI',
  },
  {
    name: 'Local Machine',
    constant: 'LOCAL_MACHINE',
    env: 'PATH',
  },
];
