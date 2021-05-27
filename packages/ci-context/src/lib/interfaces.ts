import { components as OctoOpenApiTypes } from '@octokit/openapi-types';

export type RepoMetadata = Pick<
  OctoOpenApiTypes['schemas']['repository'],
  'default_branch' | 'description' | 'html_url' | 'license' | 'name'
>;

export interface RunnerContext {
  actor: string;
  eventName: string;
  job: string;
  payload: Record<string, unknown>;
  ref: string;
  runId: number;
  runNumber: number;
  sha: string;
}
