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

  constructor(provider: Vendor) {
    this.provider = provider;
  }
}
