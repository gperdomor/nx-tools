export abstract class Context {
  eventName: string;
  sha: string;
  ref: string;
  // workflow: string;
  action: string;
  actor: string;
  job: string;
  runNumber: number;
  runId: number;
}
