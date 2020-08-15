export interface BuildOptions {
  path: string;
  dockerfile: string;
  addGitLabels: boolean;
  target: string;
  alwaysPull: boolean;
  cacheFroms: string[];
  buildArgs: string[];
  labels: string[];
}
