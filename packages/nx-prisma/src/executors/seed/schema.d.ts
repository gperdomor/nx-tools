export interface SeedExecutorSchema {
  /**
   * The path to the seeding script
   */
  script: string;
  /**
   * TypeScript config to use for seeding
   */
  tsConfig?: string;
}
