export interface SeedExecutorSchema {
  /**
   * The path to the seeding script
   */
  script: string;
  /**
   * TypeScript config to use for seeding
   */
  tsConfig?: string;
  /**
   * Tool to use for executing the seeding script. Currently `ts-node` and `tsx` are supported
   */
  executeWith?: 'ts-node' | 'tsx';
}
