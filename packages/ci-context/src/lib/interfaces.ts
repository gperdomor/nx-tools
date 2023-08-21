import { components as OctoOpenApiTypes } from '@octokit/openapi-types';

export type RepoMetadata = Pick<
  OctoOpenApiTypes['schemas']['repository'],
  'default_branch' | 'description' | 'html_url' | 'license' | 'name'
>;

export interface RunnerContext {
  name: string;
  actor: string;
  eventName: string;
  job: string;
  payload: Record<string, any>;
  ref: string;
  runId: number;
  runNumber: number;
  repoUrl: string;
  sha: string;
}
