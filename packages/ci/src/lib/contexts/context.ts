import { RunnerProvider } from '../runner-provider.enum';

export abstract class RunnerContext {
  provider: RunnerProvider;
  eventName: string;
  sha: string;
  ref: string;
  workflow?: string;
  action: string;
  actor: string;
  job: string;
  runNumber: number;
  runId: number;

  constructor(provider: RunnerProvider) {
    this.provider = provider;
  }
}
