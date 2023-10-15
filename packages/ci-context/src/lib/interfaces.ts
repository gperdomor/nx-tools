import { components as OctoOpenApiTypes } from '@octokit/openapi-types';

export type RepoMetadata = Pick<
  OctoOpenApiTypes['schemas']['repository'],
  'default_branch' | 'description' | 'html_url' | 'license' | 'name'
>;

export interface Payload {
  base_ref: string;
  number: number;
  pull_request: {
    head: {
      sha: string;
    };
    base: {
      ref: string;
    };
  };
  repository: {
    default_branch?: string;
    private?: boolean;
  };
}

export interface RunnerContext {
  name: string;
  actor: string;
  eventName: string;
  job: string;
  payload: Partial<Payload>;
  ref: string;
  runId: number;
  runNumber: number;
  repoUrl: string;
  sha: string;
}
