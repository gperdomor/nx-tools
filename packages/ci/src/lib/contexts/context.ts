import { RunnerProvider } from '../runner-provider.enum';

export abstract class RunnerContext {
  provider: RunnerProvider;
  actor: string;
  eventName: string;
  job: string;
  ref: string;
  runId: number;
  runNumber: number;
  sha: string;

  constructor(provider: RunnerProvider) {
    this.provider = provider;
  }
}
