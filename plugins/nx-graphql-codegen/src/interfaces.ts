export interface CodeGenBase {
  /**
   * Specifies the path to the desired graphql code generator config file to be processed instead of the default path. Both absolute and relative paths are supported.
   */
  config?: string;

  /**
   * If true, the executor will not log any output to the console. Defaults to false.
   */
  silent?: boolean;

  /**
   * If true, the executor will log additional information to the console. Defaults to false.
   */
  verbose?: boolean;

  /**
   * If true, the executor will log debug information to the console. Defaults to false.
   */
  debug?: boolean;

  /**
   * If true, the executor will only log errors to the console. Defaults to false.
   */
  errorsOnly?: boolean;
}
