import { Vendor } from '../vendors';

export abstract class CIContext {
  provider: Vendor;
  actor: string;
  eventName: string;
  job: string;
  ref: string;
  runId: number;
  runNumber: number;
  sha: string;
  repo: {
    name?: string;
    description?: string;
    html_url?: string;
    default_branch?: string;
    license?: string;
  };

  constructor(provider: Vendor) {
    this.provider = provider;
    this.repo = {};
  }
}
